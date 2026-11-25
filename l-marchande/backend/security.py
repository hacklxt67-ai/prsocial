import os
import hmac
import hashlib
import base64
import json
import time
import secrets
from typing import Optional, Dict, Any, Tuple

_WEAK_SECRETS = {
    "production_super_secret_key_change_me!",
    "lmarchande_super_secure_vault_key_2026_x89a!",
    "changeme",
    "secret",
}

def _load_or_create_secret() -> str:
    env_sec = (os.environ.get("L_MARCHANDE_SECRET") or "").strip()
    is_prod = os.environ.get("L_MARCHANDE_ENV", "").strip().lower() == "production"
    if env_sec:
        if env_sec in _WEAK_SECRETS or len(env_sec) < 32:
            raise RuntimeError("L_MARCHANDE_SECRET est trop faible ou prédéfini. Utilisez au moins 32 caractères aléatoires.")
        return env_sec

    if is_prod:
        raise RuntimeError("L_MARCHANDE_SECRET est obligatoire en production (L_MARCHANDE_ENV=production).")

    secret_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".secret_key")
    if os.path.isfile(secret_file):
        val = open(secret_file, encoding="utf-8").read().strip()
        if len(val) >= 32 and val not in _WEAK_SECRETS:
            return val

    generated = secrets.token_hex(32)
    fd = os.open(secret_file, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        f.write(generated)
    try:
        os.chmod(secret_file, 0o600)
    except Exception:
        pass
    return generated

SECRET_KEY = _load_or_create_secret()
TOKEN_EXPIRE_SECONDS = 86400 * 7  # 7 jours

class SecurityHelper:
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash sécurisé PBKDF2-HMAC-SHA256 avec sel aléatoire cryptographique (NIST compliant)."""
        salt = secrets.token_bytes(16)
        iterations = 100_000
        key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, iterations)
        return f"{base64.b64encode(salt).decode('ascii')}${iterations}${base64.b64encode(key).decode('ascii')}"

    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        """Vérification sécurisée en temps constant contre les attaques de timing."""
        try:
            salt_b64, iter_str, key_b64 = hashed_password.split('$')
            salt = base64.b64decode(salt_b64.encode('ascii'))
            iterations = int(iter_str)
            expected_key = base64.b64decode(key_b64.encode('ascii'))
            test_key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, iterations)
            return hmac.compare_digest(expected_key, test_key)
        except Exception:
            return False

    @staticmethod
    def _b64_url_encode(data: bytes) -> str:
        return base64.urlsafe_b64encode(data).decode('ascii').rstrip('=')

    @staticmethod
    def _b64_url_decode(s: str) -> bytes:
        padding = 4 - (len(s) % 4)
        if padding != 4:
            s += '=' * padding
        return base64.urlsafe_b64decode(s.encode('ascii'))

    @classmethod
    def create_jwt(cls, payload: Dict[str, Any], expires_in: int = TOKEN_EXPIRE_SECONDS) -> str:
        """Génère un JSON Web Token (JWT) standard signé HMAC-SHA256 sans dépendance externe."""
        header = {"alg": "HS256", "typ": "JWT"}
        data = payload.copy()
        now = int(time.time())
        data["iat"] = now
        data["exp"] = now + expires_in
        data["iss"] = "l-marchande.io"

        h_json = json.dumps(header, separators=(',', ':')).encode('utf-8')
        p_json = json.dumps(data, separators=(',', ':')).encode('utf-8')

        h_b64 = cls._b64_url_encode(h_json)
        p_b64 = cls._b64_url_encode(p_json)

        signing_input = f"{h_b64}.{p_b64}".encode('utf-8')
        signature = hmac.new(SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
        sig_b64 = cls._b64_url_encode(signature)

        return f"{h_b64}.{p_b64}.{sig_b64}"

    @classmethod
    def verify_jwt(cls, token: str) -> Optional[Dict[str, Any]]:
        """Valide la signature et l'expiration d'un JWT."""
        try:
            parts = token.split('.')
            if len(parts) != 3:
                return None
            h_b64, p_b64, sig_b64 = parts
            signing_input = f"{h_b64}.{p_b64}".encode('utf-8')
            expected_sig = hmac.new(SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
            actual_sig = cls._b64_url_decode(sig_b64)

            if not hmac.compare_digest(expected_sig, actual_sig):
                return None

            payload = json.loads(cls._b64_url_decode(p_b64).decode('utf-8'))
            if "exp" in payload and payload["exp"] < int(time.time()):
                return None  # Expiré

            return payload
        except Exception:
            return None

    @staticmethod
    def generate_referral_code(prefix: str = "LM") -> str:
        """Génère un code de parrainage unique et mémorable."""
        chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
        rand_str = ''.join(secrets.choice(chars) for _ in range(6))
        return f"{prefix}-{rand_str}"
