import sqlite3
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any, Tuple
from database import get_connection
from security import generate_license_key, hash_password, verify_password

DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

class LicenseManager:
    @staticmethod
    def create_license(duration_days: int = 7, notes: str = "", client_contact: str = "") -> Dict[str, Any]:
        key = generate_license_key()
        now_str = datetime.now().strftime(DATE_FORMAT)
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO licenses (license_key, duration_days, status, created_at, notes, client_contact)
            VALUES (?, ?, 'UNUSED', ?, ?, ?);
        """, (key, duration_days, now_str, notes, client_contact))
        lic_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return LicenseManager.get_by_id(lic_id)

    @staticmethod
    def get_by_id(license_id: int) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM licenses WHERE id = ?;", (license_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def get_by_key(key: str) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM licenses WHERE license_key = ?;", (key.strip().upper(),))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def verify_license(key: str, device_id: str) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Vérifie la validité d'une licence pour un appareil donné.
        Retourne (is_valid, message, info_dict)
        """
        lic = LicenseManager.get_by_key(key)
        if not lic:
            return False, "Clé de licence introuvable ou invalide.", {}

        status = lic["status"]
        if status == "REVOKED":
            return False, "Cette licence a été révoquée par l'administrateur.", {"status": "REVOKED"}

        if status == "UNUSED":
            return False, "Cette licence n'a pas encore été activée sur cet appareil.", {
                "status": "UNUSED",
                "duration_days": lic["duration_days"]
            }

        # Vérification du Device ID (verrouillage matériel)
        if lic.get("device_id") and lic["device_id"] != device_id:
            return False, "Cette licence est déjà associée à un autre smartphone.", {
                "status": "DEVICE_MISMATCH",
                "bound_device": lic["device_id"][:6] + "..."
            }

        # Vérification d'expiration
        expires_at_str = lic.get("expires_at")
        if not expires_at_str:
            return False, "Date d'expiration non définie.", {}

        expires_at = datetime.strptime(expires_at_str, DATE_FORMAT)
        now = datetime.now()

        if now > expires_at:
            # Marquer comme expirée en base si pas déjà fait
            if status != "EXPIRED":
                conn = get_connection()
                conn.cursor().execute("UPDATE licenses SET status = 'EXPIRED' WHERE id = ?;", (lic["id"],))
                conn.commit()
                conn.close()
            return False, f"Votre licence a expiré le {expires_at_str}. Veuillez la renouveler (2 USD / 7 jours).", {
                "status": "EXPIRED",
                "expires_at": expires_at_str,
                "seconds_left": 0
            }

        seconds_left = int((expires_at - now).total_seconds())
        days_left = seconds_left // 86400
        hours_left = (seconds_left % 86400) // 3600

        # Mettre à jour last_seen du client
        ClientManager.register_or_update(device_id)

        return True, "Licence active et valide.", {
            "status": "ACTIVE",
            "license_key": lic["license_key"],
            "expires_at": expires_at_str,
            "seconds_left": seconds_left,
            "days_left": days_left,
            "hours_left": hours_left,
            "duration_days": lic["duration_days"]
        }

    @staticmethod
    def activate_or_renew(key: str, device_id: str, device_info: str = "", contact: str = "") -> Tuple[bool, str, Dict[str, Any]]:
        """
        Active une nouvelle licence ou renouvelle une licence active (+7 jours).
        Règle : Si la licence est encore active, ajoute 7 jours à partir de la date d'expiration.
        """
        lic = LicenseManager.get_by_key(key)
        if not lic:
            return False, "Clé de licence invalide.", {}

        if lic["status"] == "REVOKED":
            return False, "Licence révoquée.", {}

        # Enregistrer le client
        ClientManager.register_or_update(device_id, device_info, contact)

        now = datetime.now()
        now_str = now.strftime(DATE_FORMAT)
        duration = lic["duration_days"]

        conn = get_connection()
        cursor = conn.cursor()

        # CAS 1 : Licence JAMAIS activée (UNUSED)
        if lic["status"] == "UNUSED":
            expires_at = now + timedelta(days=duration)
            expires_at_str = expires_at.strftime(DATE_FORMAT)

            cursor.execute("""
                UPDATE licenses 
                SET status = 'ACTIVE', activated_at = ?, expires_at = ?, device_id = ?, client_contact = COALESCE(NULLIF(?, ''), client_contact)
                WHERE id = ?;
            """, (now_str, expires_at_str, device_id, contact, lic["id"]))
            conn.commit()
            conn.close()

            return True, f"Licence activée avec succès pour {duration} jours !", {
                "license_key": lic["license_key"],
                "status": "ACTIVE",
                "activated_at": now_str,
                "expires_at": expires_at_str,
                "days_left": duration
            }

        # CAS 2 : Déjà activée sur un AUTRE appareil
        if lic["device_id"] and lic["device_id"] != device_id:
            conn.close()
            return False, "Cette licence est déjà verrouillée sur un autre appareil.", {}

        # CAS 3 : Déjà activée sur ce MÊME appareil -> Renouvellement ou prolongation
        current_exp_str = lic.get("expires_at")
        if current_exp_str:
            current_exp = datetime.strptime(current_exp_str, DATE_FORMAT)
            # Si encore active, on ajoute à partir de la date d'expiration
            if current_exp > now:
                new_expires_at = current_exp + timedelta(days=duration)
            else:
                new_expires_at = now + timedelta(days=duration)
        else:
            new_expires_at = now + timedelta(days=duration)

        new_expires_at_str = new_expires_at.strftime(DATE_FORMAT)

        cursor.execute("""
            UPDATE licenses 
            SET status = 'ACTIVE', expires_at = ?, client_contact = COALESCE(NULLIF(?, ''), client_contact)
            WHERE id = ?;
        """, (new_expires_at_str, contact, lic["id"]))
        conn.commit()
        conn.close()

        return True, f"Licence prolongée avec succès jusqu'au {new_expires_at_str} !", {
            "license_key": lic["license_key"],
            "status": "ACTIVE",
            "expires_at": new_expires_at_str
        }

    @staticmethod
    def list_all() -> List[Dict[str, Any]]:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM licenses ORDER BY id DESC;")
        rows = cursor.fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def revoke(license_id: int):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE licenses SET status = 'REVOKED' WHERE id = ?;", (license_id,))
        conn.commit()
        conn.close()

    @staticmethod
    def extend(license_id: int, extra_days: int = 7) -> Optional[Dict[str, Any]]:
        lic = LicenseManager.get_by_id(license_id)
        if not lic:
            return None
        now = datetime.now()
        current_exp_str = lic.get("expires_at")
        if current_exp_str:
            current_exp = datetime.strptime(current_exp_str, DATE_FORMAT)
            base_date = current_exp if current_exp > now else now
        else:
            base_date = now

        new_exp = base_date + timedelta(days=extra_days)
        new_exp_str = new_exp.strftime(DATE_FORMAT)

        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE licenses SET status = 'ACTIVE', expires_at = ? WHERE id = ?;", (new_exp_str, license_id))
        conn.commit()
        conn.close()
        return LicenseManager.get_by_id(license_id)


class PaymentManager:
    @staticmethod
    def submit_payment(method: str, transaction_ref: str, sender_contact: str, amount_usd: float = 2.0, amount_local: str = "", notes: str = "") -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        conn = get_connection()
        cursor = conn.cursor()
        now_str = datetime.now().strftime(DATE_FORMAT)
        try:
            cursor.execute("""
                INSERT INTO payments (method, amount_usd, amount_local, transaction_ref, sender_contact, status, created_at, notes)
                VALUES (?, ?, ?, ?, ?, 'PENDING', ?, ?);
            """, (method.upper(), amount_usd, amount_local, transaction_ref.strip(), sender_contact.strip(), now_str, notes))
            pid = cursor.lastrowid
            conn.commit()
            conn.close()
            return True, "Preuve de paiement enregistrée en attente de validation administrateur.", PaymentManager.get_by_id(pid)
        except sqlite3.IntegrityError:
            conn.close()
            return False, "Cette référence de transaction a déjà été soumise.", None

    @staticmethod
    def get_by_id(payment_id: int) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM payments WHERE id = ?;", (payment_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def list_all() -> List[Dict[str, Any]]:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT p.*, l.license_key FROM payments p LEFT JOIN licenses l ON p.license_id = l.id ORDER BY p.id DESC;")
        rows = cursor.fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def approve_payment(payment_id: int) -> Tuple[bool, str, Optional[str]]:
        """Approuve le paiement, crée automatiquement une licence 7 jours et l'associe."""
        pay = PaymentManager.get_by_id(payment_id)
        if not pay:
            return False, "Paiement introuvable", None
        if pay["status"] == "APPROVED":
            return False, "Ce paiement est déjà validé", None

        # Créer la licence 7 jours pour le client
        lic = LicenseManager.create_license(
            duration_days=7,
            notes=f"Générée via paiement #{payment_id} ({pay['method']} - Réf: {pay['transaction_ref']})",
            client_contact=pay["sender_contact"]
        )

        now_str = datetime.now().strftime(DATE_FORMAT)
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE payments 
            SET status = 'APPROVED', approved_at = ?, license_id = ?
            WHERE id = ?;
        """, (now_str, lic["id"], payment_id))
        conn.commit()
        conn.close()

        return True, "Paiement approuvé et licence 7 jours générée avec succès !", lic["license_key"]

    @staticmethod
    def reject_payment(payment_id: int, reason: str = "") -> bool:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE payments SET status = 'REJECTED', notes = COALESCE(notes || ' | ', '') || ? WHERE id = ?;", (f"Rejeté: {reason}", payment_id))
        conn.commit()
        conn.close()
        return True


class ClientManager:
    @staticmethod
    def register_or_update(device_id: str, device_info: str = "", contact: str = ""):
        now_str = datetime.now().strftime(DATE_FORMAT)
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM clients WHERE device_id = ?;", (device_id,))
        row = cursor.fetchone()
        if row:
            cursor.execute("""
                UPDATE clients 
                SET last_seen = ?,
                    device_info = COALESCE(NULLIF(?, ''), device_info),
                    contact = COALESCE(NULLIF(?, ''), contact)
                WHERE device_id = ?;
            """, (now_str, device_info, contact, device_id))
        else:
            cursor.execute("""
                INSERT INTO clients (device_id, device_info, contact, first_seen, last_seen)
                VALUES (?, ?, ?, ?, ?);
            """, (device_id, device_info, contact, now_str, now_str))
        conn.commit()
        conn.close()

    @staticmethod
    def list_all() -> List[Dict[str, Any]]:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT c.*, 
                   COUNT(l.id) as total_licenses,
                   MAX(l.expires_at) as latest_expiration
            FROM clients c
            LEFT JOIN licenses l ON c.device_id = l.device_id
            GROUP BY c.id
            ORDER BY c.last_seen DESC;
        """)
        rows = cursor.fetchall()
        conn.close()
        return [dict(r) for r in rows]


class SettingsManager:
    @staticmethod
    def get_all() -> Dict[str, str]:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT key, value FROM settings;")
        rows = cursor.fetchall()
        conn.close()
        return {r["key"]: r["value"] for r in rows}

    @staticmethod
    def update(key: str, value: str):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?);", (key, value))
        conn.commit()
        conn.close()


class AdminManager:
    @staticmethod
    def ensure_default_admin(default_user: str = "admin", default_pass: str = "Admin1234!"):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM admins WHERE username = ?;", (default_user,))
        if not cursor.fetchone():
            now_str = datetime.now().strftime(DATE_FORMAT)
            pwd_hash = hash_password(default_pass)
            cursor.execute("INSERT INTO admins (username, password_hash, created_at) VALUES (?, ?, ?);",
                           (default_user, pwd_hash, now_str))
            conn.commit()
        conn.close()

    @staticmethod
    def authenticate(username: str, password: str) -> bool:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT password_hash FROM admins WHERE username = ?;", (username,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return False
        return verify_password(password, row["password_hash"])
