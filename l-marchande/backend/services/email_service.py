import os
import re
import secrets
import smtplib
from email.message import EmailMessage
from datetime import datetime, timedelta, timezone
from typing import Tuple, Optional, Dict, Any
from database import query_one, execute_commit
from security import SecurityHelper

OUTBOX_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "outbox"))
os.makedirs(OUTBOX_DIR, exist_ok=True)
OUTBOX_FILE = os.path.join(OUTBOX_DIR, "latest_emails.log")

EMAIL_RE = re.compile(r"^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$")

def is_valid_email(email: str) -> bool:
    return bool(EMAIL_RE.match((email or "").strip()))

def _now_utc() -> datetime:
    return datetime.now(timezone.utc)

def _parse_iso(ts: Optional[str]) -> Optional[datetime]:
    if not ts:
        return None
    try:
        dt = datetime.fromisoformat(str(ts).replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        return None

def send_mail(to_email: str, subject: str, body_text: str) -> bool:
    smtp_host = os.environ.get("SMTP_HOST", "").strip()
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER", "").strip()
    smtp_pass = os.environ.get("SMTP_PASS", "").strip()
    smtp_from = os.environ.get("SMTP_FROM", smtp_user or "noreply@pr.social")

    # Always write to local outbox log for auditability & local testing
    ts = _now_utc().strftime("%Y-%m-%d %H:%M:%S UTC")
    entry = f"\n[{ts}] TO: {to_email} | SUBJECT: {subject}\n{body_text}\n" + ("-" * 60) + "\n"
    with open(OUTBOX_FILE, "a", encoding="utf-8") as f:
        f.write(entry)
    print(f"[MAIL] -> {to_email} | {subject}")

    if not smtp_host:
        return True

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = smtp_from
    msg["To"] = to_email
    msg.set_content(body_text)

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
            server.starttls()
            if smtp_user and smtp_pass:
                server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"[MAIL][WARN] SMTP delivery failed ({e}), logged to outbox.")
        return False

def issue_verification_email(user_id: int, email: str, base_url: str = "http://127.0.0.1:8000", enforce_cooldown: bool = True) -> Tuple[bool, str, Optional[str]]:
    user = query_one("SELECT id, email, email_verified, email_verify_sent_at FROM users WHERE id = ?", (user_id,))
    if not user:
        return False, "Utilisateur introuvable.", None
    if user.get("email_verified"):
        return False, "Cette adresse e-mail est déjà vérifiée.", None

    if enforce_cooldown and user.get("email_verify_sent_at"):
        last_sent = _parse_iso(user["email_verify_sent_at"])
        if last_sent and (_now_utc() - last_sent).total_seconds() < 60:
            wait = int(60 - (_now_utc() - last_sent).total_seconds())
            return False, f"Veuillez patienter {wait}s avant de demander un nouvel e-mail.", None

    token = secrets.token_urlsafe(32)
    expires_at = (_now_utc() + timedelta(hours=24)).isoformat()
    sent_at = _now_utc().isoformat()

    execute_commit("""
        UPDATE users
        SET email_verify_token = ?, email_verify_expires_at = ?, email_verify_sent_at = ?
        WHERE id = ?
    """, (token, expires_at, sent_at, user_id))

    verify_link = f"{base_url.rstrip('/')}/verify-email?token={token}"
    body = (
        f"Bonjour,\n\n"
        f"Veuillez vérifier votre adresse e-mail en cliquant sur ce lien (valide 24h) :\n"
        f"{verify_link}\n\n"
        f"Si vous n'êtes pas à l'origine de cette demande, ignorez ce message."
    )
    send_mail(email, "Vérification de votre adresse e-mail", body)
    return True, "E-mail de vérification envoyé.", token

def verify_email_token(token: str) -> Tuple[bool, str]:
    tok = (token or "").strip()
    if not tok or len(tok) < 16:
        return False, "Token de vérification manquant ou invalide."

    user = query_one("SELECT id, email, email_verified, email_verify_expires_at FROM users WHERE email_verify_token = ?", (tok,))
    if not user:
        return False, "Lien de vérification invalide ou déjà utilisé."

    exp = _parse_iso(user.get("email_verify_expires_at"))
    if not exp or _now_utc() > exp:
        return False, "Ce lien de vérification a expiré. Veuillez en demander un nouveau."

    execute_commit("""
        UPDATE users
        SET email_verified = 1, email_verify_token = NULL, email_verify_expires_at = NULL
        WHERE id = ?
    """, (user["id"],))
    return True, f"Votre adresse e-mail ({user['email']}) a été vérifiée avec succès !"

def initiate_email_change(user_id: int, new_email: str, password: str) -> Tuple[bool, Dict[str, Any]]:
    new_email = (new_email or "").strip().lower()
    if not is_valid_email(new_email):
        return False, {"ok": False, "error": "Format d'adresse e-mail invalide."}

    user = query_one("SELECT * FROM users WHERE id = ?", (user_id,))
    if not user:
        return False, {"ok": False, "error": "Utilisateur introuvable."}

    if not SecurityHelper.verify_password(password or "", user["hashed_password"]):
        return False, {"ok": False, "error": "Mot de passe actuel incorrect."}

    if new_email == user["email"].lower():
        return False, {"ok": False, "error": "La nouvelle adresse e-mail doit être différente de l'actuelle."}

    dup = query_one("SELECT id FROM users WHERE LOWER(email) = ? AND id != ?", (new_email, user_id))
    if dup:
        return False, {"ok": False, "error": "Cette adresse e-mail est déjà utilisée par un autre compte."}

    if user.get("email_verified"):
        otp = str(secrets.randbelow(900000) + 100000)
        exp = (_now_utc() + timedelta(minutes=15)).isoformat()
        execute_commit("""
            UPDATE users SET pending_email = ?, email_change_code = ?, email_change_expires_at = ?
            WHERE id = ?
        """, (new_email, otp, exp, user_id))
        send_mail(new_email, "Code de confirmation de changement d'e-mail", f"Votre code de confirmation : {otp} (valide 15 minutes).")
        return True, {"ok": True, "needs_code": True, "message": "Un code à 6 chiffres a été envoyé à votre nouvelle adresse."}

    # If email was not verified yet, update directly and send verification link
    execute_commit("UPDATE users SET email = ?, email_verified = 0, email_verify_token = NULL WHERE id = ?", (new_email, user_id))
    issue_verification_email(user_id, new_email, enforce_cooldown=False)
    return True, {"ok": True, "needs_code": False, "message": "E-mail mis à jour. Veuillez vérifier votre nouvelle boîte."}

def confirm_email_change(user_id: int, code: str) -> Tuple[bool, str]:
    c = (code or "").strip()
    if not c or len(c) != 6 or not c.isdigit():
        return False, "Code à 6 chiffres invalide."

    user = query_one("SELECT id, pending_email, email_change_code, email_change_expires_at FROM users WHERE id = ?", (user_id,))
    if not user or not user.get("pending_email") or not user.get("email_change_code"):
        return False, "Aucune demande de changement d'e-mail en cours."

    exp = _parse_iso(user.get("email_change_expires_at"))
    if not exp or _now_utc() > exp:
        return False, "Le code de confirmation a expiré."

    if not secrets.compare_digest(c, str(user["email_change_code"])):
        return False, "Code de confirmation incorrect."

    new_email = user["pending_email"]
    dup = query_one("SELECT id FROM users WHERE LOWER(email) = ? AND id != ?", (new_email.lower(), user_id))
    if dup:
        return False, "Cette adresse e-mail vient d'être utilisée par un autre compte."

    execute_commit("""
        UPDATE users
        SET email = ?, email_verified = 1, pending_email = NULL, email_change_code = NULL, email_change_expires_at = NULL
        WHERE id = ?
    """, (new_email, user_id))
    return True, "Adresse e-mail modifiée et vérifiée avec succès !"

def issue_password_reset(email: str, base_url: str = "http://127.0.0.1:8000") -> Optional[str]:
    em = (email or "").strip().lower()
    if not is_valid_email(em):
        return None
    user = query_one("SELECT id, email FROM users WHERE LOWER(email) = ?", (em,))
    if not user:
        return None
    token = secrets.token_urlsafe(32)
    exp = (_now_utc() + timedelta(hours=1)).isoformat()
    execute_commit("UPDATE users SET reset_token = ?, reset_expires_at = ? WHERE id = ?", (token, exp, user["id"]))
    link = f"{base_url.rstrip('/')}/reset-password?token={token}"
    send_mail(user["email"], "Réinitialisation de votre mot de passe", f"Cliquez sur ce lien (valide 1h) pour réinitialiser votre mot de passe :\n{link}")
    return token

def consume_password_reset(token: str, new_password: str) -> Tuple[bool, str]:
    tok = (token or "").strip()
    if not tok or len(tok) < 16:
        return False, "Token de réinitialisation invalide."
    if not new_password or len(new_password) < 6:
        return False, "Le nouveau mot de passe doit contenir au moins 6 caractères."
    user = query_one("SELECT id, reset_expires_at FROM users WHERE reset_token = ?", (tok,))
    if not user:
        return False, "Lien de réinitialisation invalide ou déjà utilisé."
    exp = _parse_iso(user.get("reset_expires_at"))
    if not exp or _now_utc() > exp:
        return False, "Lien de réinitialisation expiré."
    hashed = SecurityHelper.hash_password(new_password)
    execute_commit("UPDATE users SET hashed_password = ?, reset_token = NULL, reset_expires_at = NULL WHERE id = ?", (hashed, user["id"]))
    return True, "Mot de passe réinitialisé avec succès !"
