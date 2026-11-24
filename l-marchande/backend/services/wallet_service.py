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

        # Vérifier si l'utilisateur a un parrain
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
