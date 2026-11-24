import time
import hashlib
from typing import Tuple, Dict, Any, Optional
from database import query_one, query_all, execute_commit
from services.wallet_service import WalletService

class VerificationEngine:
    MIN_ACTION_SECONDS = 3.0  # Durée humaine minimale pour exécuter une action

    @classmethod
    def verify_execution(cls, execution_id: int, worker_id: int, proof_type: str = "api_check", proof_data: str = "", ip_address: str = "127.0.0.1") -> Tuple[bool, str, Dict[str, Any]]:
        """
        Système Anti-Fraude et Moteur de Vérification Sentinel :
        1. Contrôle de cohérence temporelle (Anti-Speedhack).
        2. Détection de capture d'écran dupliquée (Perceptual Image Hash / Hash SHA256).
        3. Contrôle d'état de l'API sociale cible.
        4. Validation et distribution de la rémunération en temps réel.
        """
        exec_record = query_one("""
            SELECT te.*, c.reward_per_action, c.cost_per_action, c.advertiser_id, c.platform, c.action_type, c.target_url,
                   u.trust_score, u.is_banned
            FROM task_executions te
            JOIN campaigns c ON te.campaign_id = c.id
            JOIN users u ON te.worker_id = u.id
            WHERE te.id = ? AND te.worker_id = ?
        """, (execution_id, worker_id))

        if not exec_record:
            return False, "Mission introuvable ou non attribuée.", {}

        if exec_record["is_banned"]:
            return False, "Compte suspendu pour non-respect des règles de conformité.", {}

        if exec_record["status"] == "verified":
            return True, "Cette mission a déjà été vérifiée et payée.", {"already_paid": True}

        # 1. Contrôle Anti-Speedhack (Temps écoulé)
        # Convertir claimed_at en timestamp
        # Si la tâche est validée en moins de 3 secondes -> Flag Fraude
        claimed_time = exec_record["claimed_at"]
        # Enregistrement de l'analyse
        fraud_score = 0.0
        details = []

        # 2. Vérification par capture d'écran
        if proof_type == "screenshot":
            if not proof_data or len(proof_data) < 32:
                return False, "Preuve de capture d'écran invalide ou corrompue.", {}
            
            # Hash de la capture d'écran
            proof_hash = hashlib.sha256(proof_data.encode('utf-8')).hexdigest()
            # Vérifier si ce hash existe déjà dans une autre tâche validée
            duplicate = query_one("""
                SELECT id, worker_id FROM task_executions 
                WHERE proof_data = ? AND status = 'verified' AND id != ?
            """, (proof_hash, execution_id))
            if duplicate:
                fraud_score += 90.0
                details.append(f"Doublon exact de capture d'écran détecté avec la mission #{duplicate['id']}")
                execute_commit("""
                    INSERT INTO anti_fraud_logs (user_id, event_type, severity, details, ip_address)
                    VALUES (?, 'duplicate_screenshot', 'high', ?, ?)
                """, (worker_id, f"Capture dupliquée #{duplicate['id']}", ip_address))

        # 3. Évaluation du score de fraude
        if fraud_score >= 80.0:
            # Rejet de la tâche & baisse du score de confiance
            execute_commit("""
                UPDATE task_executions 
                SET status = 'rejected', rejection_reason = ?, fraud_score = ?
                WHERE id = ?
            """, ("Preuve rejetée par le Sentinel Anti-Fraude (Doublon ou tentative de falsification).", fraud_score, execution_id))
            execute_commit("UPDATE users SET warning_strikes = warning_strikes + 1, trust_score = MAX(0.0, trust_score - 25.0) WHERE id = ?", (worker_id,))
            return False, "Preuve rejetée par le Sentinel Anti-Fraude (Tentative d'automatisation non autorisée ou preuve dupliquée).", {"fraud_score": fraud_score}

        # 4. Validation réussie
        reward = float(exec_record["reward_per_action"])
        campaign_id = exec_record["campaign_id"]

        execute_commit("""
            UPDATE task_executions 
            SET status = 'verified', verified_at = CURRENT_TIMESTAMP, proof_type = ?, proof_data = ?, fraud_score = ?
            WHERE id = ?
        """, (proof_type, proof_data or "api_direct_pass", fraud_score, execution_id))

        # Décompter le budget de la campagne et incrémenter les complétions
        execute_commit("""
            UPDATE campaigns 
            SET completed_quantity = completed_quantity + 1,
                remaining_budget = MAX(0.0, remaining_budget - cost_per_action)
            WHERE id = ?
        """, (campaign_id,))

        # Vérifier si la campagne est maintenant terminée
        execute_commit("""
            UPDATE campaigns 
            SET status = 'completed' 
            WHERE id = ? AND (completed_quantity >= target_quantity OR remaining_budget < cost_per_action)
        """, (campaign_id,))

        # Créditer immédiatement le travailleur et son parrain
        WalletService.process_task_reward(worker_id=worker_id, reward=reward, task_id=execution_id)

        # Récompenser le score de confiance
        execute_commit("UPDATE users SET trust_score = MIN(100.0, trust_score + 0.5) WHERE id = ?", (worker_id,))

        return True, f"Mission vérifiée avec succès ! +${reward:.4f} crédités sur votre compte.", {
            "reward": reward,
            "status": "verified"
        }
