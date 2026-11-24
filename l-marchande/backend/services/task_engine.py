import time
from typing import List, Dict, Any, Optional
from database import query_one, query_all, execute_commit

class TaskDistributionEngine:
    TASK_CLAIM_TIMEOUT_MINUTES = 25  # Délai maximal accordé pour réaliser la tâche

    @classmethod
    def get_available_tasks(cls, worker_id: int, platform: Optional[str] = None, sort: str = "reward", limit: int = 50, page: int = 1) -> Dict[str, Any]:
        """Distribution intelligente des tâches éligibles pour un travailleur."""
        offset = (page - 1) * limit
        params = [worker_id, worker_id]

        platform_filter = ""
        if platform and platform.lower() not in ["all", "tous"]:
            platform_filter = "AND c.platform = ?"
            params.append(platform.lower())

        order_clause = "ORDER BY c.reward_per_action DESC"
        if sort == "newest":
            order_clause = "ORDER BY c.id DESC"

        query = f"""
            SELECT c.*, 
                   (c.target_quantity - c.completed_quantity) as remaining_slots
            FROM campaigns c
            WHERE c.status = 'active'
              AND c.remaining_budget >= c.reward_per_action
              AND c.completed_quantity < c.target_quantity
              AND c.advertiser_id != ? -- Ne pas faire ses propres tâches
              AND c.id NOT IN (
                  SELECT campaign_id FROM task_executions 
                  WHERE worker_id = ? AND status IN ('claimed', 'submitted', 'verified')
              )
              {platform_filter}
            {order_clause}
            LIMIT ? OFFSET ?
        """
        params.extend([limit, offset])

        tasks = query_all(query, tuple(params))
        total_row = query_one("""
            SELECT COUNT(*) as cnt FROM campaigns c 
            WHERE c.status = 'active' AND c.remaining_budget >= c.reward_per_action
        """)
        total_count = total_row["cnt"] if total_row else 0

        return {
            "tasks": tasks,
            "total": total_count,
            "page": page,
            "limit": limit
        }

    @classmethod
    def claim_task(cls, campaign_id: int, worker_id: int, social_account_id: Optional[int] = None, ip_address: str = "127.0.0.1") -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        """Verrouille et réserve une tâche pour un travailleur avec détection anti-doublon."""
        campaign = query_one("SELECT * FROM campaigns WHERE id = ? AND status = 'active'", (campaign_id,))
        if not campaign:
            return False, "Cette tâche n'est plus active ou est terminée.", None

        if campaign["remaining_budget"] < campaign["reward_per_action"]:
            return False, "Le budget alloué à cette tâche est épuisé.", None

        if campaign["advertiser_id"] == worker_id:
            return False, "Vous ne pouvez pas exécuter votre propre campagne.", None

        # Vérifier si l'utilisateur a déjà une exécution en cours
        existing = query_one("""
            SELECT id, status FROM task_executions 
            WHERE campaign_id = ? AND worker_id = ?
        """, (campaign_id, worker_id))

        if existing:
            if existing["status"] == "claimed":
                return True, "Tâche déjà en cours d'exécution.", existing
            elif existing["status"] == "verified":
                return False, "Vous avez déjà accompli et validé cette tâche.", None

        # Création de l'exécution
        exec_id = execute_commit("""
            INSERT INTO task_executions (campaign_id, worker_id, social_account_id, status, reward_amount, ip_address)
            VALUES (?, ?, ?, 'claimed', ?, ?)
        """, (campaign_id, worker_id, social_account_id, campaign["reward_per_action"], ip_address))

        execution = query_one("""
            SELECT te.*, c.title, c.target_url, c.platform, c.action_type, c.description
            FROM task_executions te
            JOIN campaigns c ON te.campaign_id = c.id
            WHERE te.id = ?
        """, (exec_id,))

        return True, "Tâche réservée avec succès. Vous disposez de 25 minutes pour la valider.", execution

    @classmethod
    def cancel_task(cls, task_execution_id: int, worker_id: int) -> Tuple[bool, str]:
        """Abandonne une tâche réservée."""
        execution = query_one("SELECT * FROM task_executions WHERE id = ? AND worker_id = ?", (task_execution_id, worker_id))
        if not execution:
            return False, "Tâche introuvable."
        if execution["status"] != "claimed":
            return False, "Seule une tâche en cours peut être annulée."

        execute_commit("UPDATE task_executions SET status = 'abandoned' WHERE id = ?", (task_execution_id,))
        return True, "Tâche abandonnée avec succès."
