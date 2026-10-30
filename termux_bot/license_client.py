import os
import sys
import json
import uuid
import socket
import hashlib
import requests
from datetime import datetime
from typing import Optional, Dict, Any, Tuple

current_dir = os.path.dirname(os.path.abspath(__file__))
HOME_DIR = os.path.expanduser("~")
DATA_DIR = os.path.join(HOME_DIR, "social_bot_data")
DEVICE_ID_FILE = os.path.join(DATA_DIR, ".device_id")
LICENSE_FILE = os.path.join(DATA_DIR, "license.json")

# URL par défaut du serveur de licence (peut être modifiée dans config.json)
DEFAULT_SERVER_URL = "http://127.0.0.1:8000"

def get_device_id() -> str:
    """Génère et persiste un identifiant matériel unique pour le smartphone Android/Termux."""
    os.makedirs(DATA_DIR, exist_ok=True)
    if os.path.exists(DEVICE_ID_FILE):
        try:
            with open(DEVICE_ID_FILE, "r", encoding="utf-8") as f:
                did = f.read().strip()
                if did:
                    return did
        except Exception:
            pass

    # Création d'un identifiant unique basé sur la machine et un UUID
    try:
        raw_seed = f"{socket.gethostname()}_{os.uname().machine}_{uuid.getnode()}_{os.getpid()}"
    except Exception:
        raw_seed = f"termux_device_{uuid.uuid4().hex}"

    h = hashlib.sha256(raw_seed.encode("utf-8")).hexdigest()[:16]
    device_id = f"termux_{h}"

    try:
        with open(DEVICE_ID_FILE, "w", encoding="utf-8") as f:
            f.write(device_id)
    except Exception:
        pass

    return device_id

class TermuxLicenseClient:
    def __init__(self, server_url: Optional[str] = None):
        self.device_id = get_device_id()
        self.server_url = (server_url or self._load_server_url()).rstrip("/")
        self.cached_key = self._load_cached_key()

    def _load_server_url(self) -> str:
        cfg_paths = [
            os.path.join(DATA_DIR, "config.json"),
            os.path.join(current_dir, "config.json")
        ]
        for p in cfg_paths:
            if os.path.exists(p):
                try:
                    with open(p, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        if data.get("license_server_url"):
                            return data["license_server_url"]
                except Exception:
                    pass
        return DEFAULT_SERVER_URL

    def _load_cached_key(self) -> str:
        if os.path.exists(LICENSE_FILE):
            try:
                with open(LICENSE_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return data.get("license_key", "").strip()
            except Exception:
                pass
        return ""

    def save_license_key(self, key: str):
        self.cached_key = key.strip().upper()
        try:
            os.makedirs(DATA_DIR, exist_ok=True)
            with open(LICENSE_FILE, "w", encoding="utf-8") as f:
                json.dump({"license_key": self.cached_key, "device_id": self.device_id}, f, indent=2)
        except Exception:
            pass

    def check_license(self, key_override: Optional[str] = None) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Interroge le serveur FastAPI pour vérifier si la licence actuelle est valide.
        Retourne (is_valid, message, info)
        """
        key = key_override or self.cached_key
        if not key:
            return False, "Aucune clé de licence configurée sur cet appareil.", {}

        url = f"{self.server_url}/api/v1/license/verify"
        payload = {
            "license_key": key,
            "device_id": self.device_id
        }

        try:
            resp = requests.post(url, json=payload, timeout=8)
            data = resp.json()
            is_valid = bool(data.get("is_valid", False))
            msg = data.get("message", "Réponse serveur")
            info = data.get("info", {})
            return is_valid, msg, info
        except Exception as e:
            return False, f"Impossible de contacter le serveur de licence ({self.server_url}) : {str(e)}", {}

    def activate_license(self, key: str, contact: str = "") -> Tuple[bool, str, Dict[str, Any]]:
        """Active une nouvelle clé sur ce smartphone."""
        key = key.strip().upper()
        url = f"{self.server_url}/api/v1/license/activate"
        
        device_info = "Android Termux"
        try:
            device_info = f"Termux ({os.uname().machine} - {socket.gethostname()})"
        except Exception:
            pass

        payload = {
            "license_key": key,
            "device_id": self.device_id,
            "device_info": device_info,
            "contact": contact
        }

        try:
            resp = requests.post(url, json=payload, timeout=10)
            data = resp.json()
            ok = bool(data.get("ok", False))
            msg = data.get("message", "")
            info = data.get("info", {})
            if ok:
                self.save_license_key(key)
            return ok, msg, info
        except Exception as e:
            return False, f"Erreur de connexion au serveur : {str(e)}", {}

    def get_payment_instructions(self) -> Dict[str, Any]:
        """Récupère les coordonnées officielles MVola et USDT (avec fallback hors-ligne)."""
        url = f"{self.server_url}/api/v1/payment/instructions"
        try:
            resp = requests.get(url, timeout=5)
            if resp.status_code == 200:
                return resp.json()
        except Exception:
            pass
        return {
            "ok": True,
            "price_usd": 2.0,
            "duration_days": 7,
            "mvola": {
                "number": "034 00 000 00",
                "name": "PR.Social Support",
                "rate_mga": "9500",
                "amount_to_pay": "9 500 MGA"
            },
            "usdt": {
                "address": "Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "network": "TRC-20 (Tron)",
                "amount_to_pay": "2.00 USDT"
            },
            "support": "@votre_contact_telegram"
        }

    def submit_payment_proof(self, method: str, ref: str, sender_contact: str, local_amount: str = "") -> Tuple[bool, str]:
        """Envoie la référence de transaction à l'administrateur."""
        url = f"{self.server_url}/api/v1/payment/submit"
        payload = {
            "method": method.upper(),
            "transaction_ref": ref.strip(),
            "sender_contact": sender_contact.strip(),
            "amount_local": local_amount or ("9 500 MGA" if method.upper() == "MVOLA" else "2.00 USDT"),
            "amount_usd": 2.0,
            "notes": f"Envoyé depuis Termux ({self.device_id})"
        }
        try:
            resp = requests.post(url, json=payload, timeout=10)
            data = resp.json()
            if resp.status_code == 200 and data.get("ok"):
                return True, data.get("message", "Preuve enregistrée.")
            return False, data.get("detail", "Échec de l'envoi.")
        except Exception as e:
            return False, f"Erreur lors de l'envoi de la preuve : {str(e)}"
