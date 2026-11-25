import sqlite3
from typing import Optional, Dict, Any, Tuple
from database import get_db_connection, query_one, execute_commit

class WalletService:
    REFERRAL_RATE = 0.10  # 10% de commission parrainage à vie

    @classmethod
    def credit_user(cls, user_id: int, amount: float, tx_type: str, description: str, reference_id: str = "") -> bool:
        """Crédite le solde d'un utilisateur de manière atomique avec inscription au grand livre."""
        conn = get_db_connection()
        try:
            cur = conn.cursor()
            cur.execute("BEGIN IMMEDIATE;")
            cur.execute("SELECT balance FROM users WHERE id = ?", (user_id,))
            row = cur.fetchone()
            if not row:
                conn.rollback()
                return False

            old_balance = float(row["balance"])
            new_balance = round(old_balance + amount, 6)

            cur.execute("UPDATE users SET balance = ? WHERE id = ?", (new_balance, user_id))
            cur.execute("""
                INSERT INTO transactions (user_id, type, amount, balance_after, status, reference_id, description)
                VALUES (?, ?, ?, ?, 'completed', ?, ?)
            """, (user_id, tx_type, amount, new_balance, reference_id, description))

            conn.commit()
            return True
        except Exception as e:
            print(f"[!] ERREUR CREDIT_USER: {e}")
            conn.rollback()
            return False
        finally:
            conn.close()

    @classmethod
    def debit_user(cls, user_id: int, amount: float, tx_type: str, description: str, reference_id: str = "") -> bool:
        """Débite le solde d'un utilisateur sous réserve de fonds suffisants."""
        conn = get_db_connection()
        try:
            cur = conn.cursor()
            cur.execute("BEGIN IMMEDIATE;")
            cur.execute("SELECT balance FROM users WHERE id = ?", (user_id,))
            row = cur.fetchone()
            if not row or float(row["balance"]) < amount:
                conn.rollback()
                return False

            old_balance = float(row["balance"])
            new_balance = round(old_balance - amount, 6)

            cur.execute("UPDATE users SET balance = ? WHERE id = ?", (new_balance, user_id))
            cur.execute("""
                INSERT INTO transactions (user_id, type, amount, balance_after, status, reference_id, description)
                VALUES (?, ?, ?, ?, 'completed', ?, ?)
            """, (user_id, tx_type, -amount, new_balance, reference_id, description))

            conn.commit()
            return True
        except Exception as e:
            print(f"[!] ERREUR DEBIT_USER: {e}")
            conn.rollback()
            return False
        finally:
            conn.close()

    @classmethod
    def process_task_reward(cls, worker_id: int, reward: float, task_id: int) -> bool:
        """Distribue la rémunération au travailleur et calcule la commission du parrain."""
        success = cls.credit_user(
            user_id=worker_id,
            amount=reward,
            tx_type="task_reward",
            description=f"Rémunération Mission #{task_id}",
            reference_id=str(task_id)
        )
        if not success:
            return False

        user = query_one("SELECT referred_by FROM users WHERE id = ?", (worker_id,))
        if user and user["referred_by"]:
            sponsor_id = user["referred_by"]
            commission = round(reward * cls.REFERRAL_RATE, 6)
            if commission > 0.000001:
                cls.credit_user(
                    user_id=sponsor_id,
                    amount=commission,
                    tx_type="referral_commission",
                    description=f"Commission 10% Filleul #{worker_id} (Mission #{task_id})",
                    reference_id=str(task_id)
                )

        return True

    @classmethod
    def create_campaign_atomic(
        cls,
        advertiser_id: int,
        title: str,
        description: str,
        platform: str,
        action_type: str,
        target_url: str,
        reward_per_action: float,
        cost_per_action: float,
        target_quantity: int,
        total_budget: float,
    ) -> Tuple[bool, Optional[int], str]:
        """Crée la campagne, débite l'annonceur et journalise la transaction en une seule transaction atomique."""
        if total_budget <= 0 or target_quantity <= 0 or reward_per_action <= 0:
            return False, None, "Paramètres budgétaires invalides."
        conn = get_db_connection()
        try:
            cur = conn.cursor()
            cur.execute("BEGIN IMMEDIATE;")
            cur.execute("SELECT balance FROM users WHERE id = ?", (advertiser_id,))
            row = cur.fetchone()
            if not row or float(row["balance"]) < total_budget:
                conn.rollback()
                return False, None, f"Solde insuffisant. Budget requis : ${total_budget:.4f}"

            new_balance = round(float(row["balance"]) - total_budget, 6)
            cur.execute("UPDATE users SET balance = ? WHERE id = ?", (new_balance, advertiser_id))
            cur.execute("""
                INSERT INTO campaigns (advertiser_id, title, description, platform, action_type, target_url, reward_per_action, cost_per_action, target_quantity, total_budget, remaining_budget, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
            """, (advertiser_id, title, description, platform, action_type, target_url, reward_per_action, cost_per_action, target_quantity, total_budget, total_budget))
            camp_id = cur.lastrowid

            cur.execute("""
                INSERT INTO transactions (user_id, type, amount, balance_after, status, reference_id, description)
                VALUES (?, 'campaign_funding', ?, ?, 'completed', ?, ?)
            """, (advertiser_id, -total_budget, new_balance, f"camp:{camp_id}", f"Financement Campagne #{camp_id} : {title} ({target_quantity} actions)"))

            conn.commit()
            return True, camp_id, "Campagne créée et déployée avec succès !"
        except Exception as e:
            conn.rollback()
            return False, None, f"Erreur atomique création campagne : {e}"
        finally:
            conn.close()

    @classmethod
    def create_pending_deposit(cls, user_id: int, amount: float, payment_method: str, reference_id: str) -> Optional[int]:
        """Enregistre une intention de dépôt en attente de confirmation prestataire/admin (sans créditer le solde)."""
        if amount <= 0:
            return None
        user = query_one("SELECT balance FROM users WHERE id = ?", (user_id,))
        if not user:
            return None
        return execute_commit("""
            INSERT INTO transactions (user_id, type, amount, balance_after, status, reference_id, description)
            VALUES (?, 'deposit', ?, ?, 'pending', ?, ?)
        """, (user_id, amount, float(user["balance"]), reference_id, f"Dépôt en attente ({payment_method.upper()})"))

    @classmethod
    def approve_pending_deposit(cls, tx_id: int, provider_ref: str = "") -> Tuple[bool, str]:
        """Valide un dépôt en attente et crédite le solde de façon atomique et idempotente."""
        conn = get_db_connection()
        try:
            cur = conn.cursor()
            cur.execute("BEGIN IMMEDIATE;")
            cur.execute("SELECT * FROM transactions WHERE id = ? AND type = 'deposit'", (tx_id,))
            tx = cur.fetchone()
            if not tx:
                conn.rollback()
                return False, "Transaction de dépôt introuvable."
            if tx["status"] != "pending":
                conn.rollback()
                return False, f"Dépôt déjà traité (statut: {tx['status']})."

            cur.execute("SELECT balance FROM users WHERE id = ?", (tx["user_id"],))
            u = cur.fetchone()
            if not u:
                conn.rollback()
                return False, "Utilisateur introuvable."

            new_bal = round(float(u["balance"]) + float(tx["amount"]), 6)
            cur.execute("UPDATE users SET balance = ? WHERE id = ?", (new_bal, tx["user_id"]))
            ref_val = provider_ref or tx["reference_id"]
            cur.execute("UPDATE transactions SET status = 'completed', balance_after = ?, reference_id = ? WHERE id = ?", (new_bal, ref_val, tx_id))
            conn.commit()
            return True, f"Dépôt #{tx_id} confirmé (+${float(tx['amount']):.2f})."
        except Exception as e:
            conn.rollback()
            return False, str(e)
        finally:
            conn.close()

    @classmethod
    def request_withdrawal(cls, user_id: int, amount: float, payment_method: str, account_details: str) -> Tuple[bool, Optional[int], str]:
        """Place les fonds en séquestre (hold_balance) et crée une demande de retrait en attente."""
        if amount <= 0:
            return False, None, "Montant invalide."
        conn = get_db_connection()
        try:
            cur = conn.cursor()
            cur.execute("BEGIN IMMEDIATE;")
            cur.execute("SELECT balance, hold_balance FROM users WHERE id = ?", (user_id,))
            u = cur.fetchone()
            if not u or float(u["balance"]) < amount:
                conn.rollback()
                return False, None, "Solde insuffisant pour ce montant."

            new_bal = round(float(u["balance"]) - amount, 6)
            new_hold = round(float(u["hold_balance"] or 0.0) + amount, 6)
            cur.execute("UPDATE users SET balance = ?, hold_balance = ? WHERE id = ?", (new_bal, new_hold, user_id))
            cur.execute("""
                INSERT INTO transactions (user_id, type, amount, balance_after, status, reference_id, description)
                VALUES (?, 'withdrawal', ?, ?, 'pending', 'PENDING_PAYOUT', ?)
            """, (user_id, -amount, new_bal, f"Demande de Retrait ({payment_method}) -> {account_details}"))
            tx_id = cur.lastrowid
            conn.commit()
            return True, tx_id, "Votre demande de retrait est en attente de validation."
        except Exception as e:
            conn.rollback()
            return False, None, str(e)
        finally:
            conn.close()

    @classmethod
    def resolve_withdrawal(cls, tx_id: int, approve: bool, reason: str = "") -> Tuple[bool, str]:
        """Approuve ou rejette (avec remboursement atomique) une demande de retrait."""
        conn = get_db_connection()
        try:
            cur = conn.cursor()
            cur.execute("BEGIN IMMEDIATE;")
            cur.execute("SELECT * FROM transactions WHERE id = ? AND type = 'withdrawal'", (tx_id,))
            tx = cur.fetchone()
            if not tx or tx["status"] != "pending":
                conn.rollback()
                return False, "Demande de retrait introuvable ou déjà traitée."

            amt = abs(float(tx["amount"]))
            cur.execute("SELECT balance, hold_balance FROM users WHERE id = ?", (tx["user_id"],))
            u = cur.fetchone()
            if not u:
                conn.rollback()
                return False, "Utilisateur introuvable."

            new_hold = max(0.0, round(float(u["hold_balance"] or 0.0) - amt, 6))
            if approve:
                cur.execute("UPDATE users SET hold_balance = ? WHERE id = ?", (new_hold, tx["user_id"]))
                cur.execute("UPDATE transactions SET status = 'completed', reference_id = 'PAID_OUT' WHERE id = ?", (tx_id,))
                msg = f"Retrait #{tx_id} approuvé et payé."
            else:
                new_bal = round(float(u["balance"]) + amt, 6)
                cur.execute("UPDATE users SET balance = ?, hold_balance = ? WHERE id = ?", (new_bal, new_hold, tx["user_id"]))
                cur.execute("UPDATE transactions SET status = 'rejected', balance_after = ?, reference_id = ? WHERE id = ?", (new_bal, reason or "REJECTED", tx_id))
                msg = f"Retrait #{tx_id} rejeté et remboursé."
            conn.commit()
            return True, msg
        except Exception as e:
            conn.rollback()
            return False, str(e)
        finally:
            conn.close()
