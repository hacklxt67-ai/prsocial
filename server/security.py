import os
import time
import json
import base64
import hmac
import hashlib
import secrets
from typing import Optional, Dict, Any, Tuple

SECRET_KEY_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "secret.key")

def get_secret_key() -> bytes:
    if os.path.exists(SECRET_KEY_PATH):
        with open(SECRET_KEY_PATH, "rb") as f:
            key = f.read().strip()
            if key:
                return key
    new_key = secrets.token_bytes(32)
    with open(SECRET_KEY_PATH, "wb") as f:
        f.write(new_key)
    return new_key

SECRET_KEY = get_secret_key()

def hash_password(password: str) -> str:
    """Hash sécurisé PBKDF2 avec sel cryptographique de 16 octets."""
    salt = secrets.token_bytes(16)
    kdf = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
    return f"{salt.hex()}${kdf.hex()}"

def verify_password(password: str, stored_hash: str) -> bool:
    """Vérification en temps constant du mot de passe."""
    try:
        parts = stored_hash.split("$")
        if len(parts) != 2:
            return False
        salt = bytes.fromhex(parts[0])
        expected_kdf = bytes.fromhex(parts[1])
        calculated_kdf = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
        return hmac.compare_digest(expected_kdf, calculated_kdf)
    except Exception:
        return False

def create_admin_token(username: str, expires_in_seconds: int = 86400 * 7) -> str:
    """Génère un token de session admin sécurisé signé en HMAC-SHA256 (format base64url)."""
    payload = {
        "user": username,
        "exp": int(time.time()) + expires_in_seconds,
        "nonce": secrets.token_hex(8)
    }
    payload_json = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    payload_b64 = base64.urlsafe_b64encode(payload_json).decode('utf-8').rstrip('=')
    
    signature = hmac.new(SECRET_KEY, payload_b64.encode('utf-8'), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).decode('utf-8').rstrip('=')
    
    return f"{payload_b64}.{sig_b64}"

def verify_admin_token(token: str) -> Optional[str]:
    """Vérifie la signature et la validité temporelle du token admin."""
    try:
        parts = token.strip().split(".")
        if len(parts) != 2:
            return None
        payload_b64, sig_b64 = parts[0], parts[1]
        
        # Vérification de signature
        expected_sig = hmac.new(SECRET_KEY, payload_b64.encode('utf-8'), hashlib.sha256).digest()
        actual_sig = base64.urlsafe_b64decode(sig_b64 + "==")
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
            
        payload_json = base64.urlsafe_b64decode(payload_b64 + "==").decode('utf-8')
        payload = json.loads(payload_json)
        
        if payload.get("exp", 0) < time.time():
            return None # Expiré
            
        return payload.get("user")
    except Exception:
        return None

def generate_license_key() -> str:
    """Génère une clé de licence unique au format PR-XXXX-XXXX-XXXX."""
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" # Exclut les caractères ambigus O/0/I/1
    p1 = "".join(secrets.choice(chars) for _ in range(4))
    p2 = "".join(secrets.choice(chars) for _ in range(4))
    p3 = "".join(secrets.choice(chars) for _ in range(4))
    return f"PR-{p1}-{p2}-{p3}"
