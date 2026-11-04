#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
   PR.SOCIAL UNIVERSAL LICENSE MANAGER • PC WINDOWS & ANDROID TERMUX
   Contrôle d'accès strict : 1 Utilisateur = 1 Appareil = 1 Clé de Licence
================================================================================
"""

import os
import sys
import json
import uuid

try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass
import socket
import hashlib
import hmac
import time
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Tuple

# Couleurs ANSI
RESET = "\033[0m"
BOLD = "\033[1m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
RED = "\033[91m"
WHITE = "\033[97m"
MAGENTA = "\033[95m"
DIM = "\033[2m"

HOME_DIR = os.path.expanduser("~")
DATA_DIR = os.path.join(HOME_DIR, "social_bot_data")
DEVICE_ID_FILE = os.path.join(DATA_DIR, ".device_id")

# Clé secrète maître d'administration (utilisée pour signer les clés matérielles 1 user = 1 device)
MASTER_SECRET_SIGNING_KEY = b"PR_SOCIAL_ADMIN_MASTER_SECRET_KEY_2026_BAGIO67"

DEFAULT_SERVER_URL = "http://127.0.0.1:8000"

def get_universal_device_id() -> str:
    """
    Génère et persiste un identifiant matériel unique et stable (HWID)
    pour l'appareil (PC Windows, Linux, Mac ou smartphone Android Termux).
    """
    os.makedirs(DATA_DIR, exist_ok=True)
    if os.path.exists(DEVICE_ID_FILE):
        try:
            with open(DEVICE_ID_FILE, "r", encoding="utf-8") as f:
                did = f.read().strip()
                if did and (did.startswith("PC-") or did.startswith("TMX-") or did.startswith("DEV-")):
                    return did
        except Exception:
            pass

    import platform
    parts = []
    try:
        parts.append(platform.node())
        parts.append(platform.machine())
        parts.append(platform.system())
    except Exception:
        pass
    try:
        parts.append(str(uuid.getnode()))  # Adresse MAC
    except Exception:
        pass
    try:
        uname = os.environ.get("COMPUTERNAME") or os.environ.get("HOSTNAME") or os.environ.get("USER") or os.environ.get("USERNAME") or "node"
        parts.append(uname)
    except Exception:
        pass

    raw_seed = "_".join(parts)
    h = hashlib.sha256(raw_seed.encode("utf-8")).hexdigest().upper()
    prefix = "PC" if sys.platform == "win32" else "TMX"
    device_id = f"{prefix}-{h[:4]}-{h[4:8]}-{h[8:12]}"

    try:
        with open(DEVICE_ID_FILE, "w", encoding="utf-8") as f:
            f.write(device_id)
    except Exception:
        pass

    return device_id

class UniversalLicenseManager:
    def __init__(self, config_paths: Optional[list] = None):
        self.device_id = get_universal_device_id()
        self.dev_short = self.device_id.split("-")[1] if "-" in self.device_id else self.device_id[:4]
        self.config_paths = config_paths or [
            os.path.join(os.getcwd(), "config.json"),
            os.path.join(DATA_DIR, "config.json"),
            os.path.join(HOME_DIR, "social_bot_data", "config.json")
        ]
        self.server_url = self._detect_server_url()

    def _detect_server_url(self) -> str:
        for p in self.config_paths:
            if os.path.exists(p):
                try:
                    with open(p, "r", encoding="utf-8") as f:
                        d = json.load(f)
                        url = d.get("license_server_url", "").strip()
                        if url:
                            return url.rstrip("/")
                except Exception:
                    pass
        return DEFAULT_SERVER_URL

    def get_saved_key(self) -> str:
        for p in self.config_paths:
            if os.path.exists(p):
                try:
                    with open(p, "r", encoding="utf-8") as f:
                        d = json.load(f)
                        k = d.get("license_key", "").strip()
                        if k:
                            return k
                except Exception:
                    pass
        return ""

    def save_license_key(self, key: str):
        key = key.strip().upper()
        for p in self.config_paths:
            try:
                abs_p = os.path.abspath(p)
                d = os.path.dirname(abs_p)
                if d:
                    os.makedirs(d, exist_ok=True)
                data = {}
                if os.path.exists(abs_p):
                    try:
                        with open(abs_p, "r", encoding="utf-8") as f:
                            data = json.load(f)
                    except Exception:
                        data = {}
                data["license_key"] = key
                with open(abs_p, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2)
            except Exception:
                continue

    def verify_key(self, key: str) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Vérification stricte de la licence :
        1. Vérifie si c'est une clé signée cryptographiquement verrouillée sur cet appareil (HWID).
        2. Sinon, interroge le serveur d'administration si disponible.
        """
        key = key.strip().upper()
        if not key:
            return False, "Aucune clé de licence fournie.", {}

        # MODE 1 : Clé Cryptographique Verrouillée Matériellement (1 Appareil = 1 Clé)
        # Format : PR-KEY-<DEV_SHORT>-<YYYYMMDD>-<SIGNATURE>
        if key.startswith("PR-KEY-"):
            parts = key.split("-")
            if len(parts) >= 5:
                k_dev = parts[2]
                k_exp = parts[3]
                k_sig = parts[4]

                # 1. Vérification stricte du Device ID
                if k_dev != self.dev_short:
                    return False, f"Cette licence est verrouillée sur un autre appareil ({k_dev} != {self.dev_short}). Règle : 1 Utilisateur = 1 Appareil = 1 Clé.", {
                        "status": "DEVICE_MISMATCH",
                        "expected_device": self.dev_short,
                        "key_device": k_dev
                    }

                # 2. Vérification de la signature HMAC de l'Admin
                payload = f"{k_dev}:{k_exp}".encode("utf-8")
                expected_sig = hmac.new(MASTER_SECRET_SIGNING_KEY, payload, hashlib.sha256).hexdigest()[:8].upper()
                if not hmac.compare_digest(k_sig, expected_sig):
                    return False, "Clé de licence invalide ou signature falsifiée.", {"status": "INVALID_SIGNATURE"}

                # 3. Vérification de la date d'expiration
                try:
                    exp_date = datetime.strptime(k_exp, "%Y%m%d")
                    # Expire à 23h59:59 du jour indiqué
                    exp_date = exp_date.replace(hour=23, minute=59, second=59)
                    now = datetime.now()
                    if now > exp_date:
                        return False, f"Cette licence a expiré le {exp_date.strftime('%d/%m/%Y')}. Contactez l'administrateur pour la renouveler.", {
                            "status": "EXPIRED",
                            "expires_at": exp_date.strftime("%Y-%m-%d %H:%M:%S")
                        }

                    days_left = max(0, (exp_date - now).days)
                    return True, "Licence matérielle vérifiée et active.", {
                        "status": "ACTIVE",
                        "license_key": key,
                        "device_id": self.device_id,
                        "expires_at": exp_date.strftime("%d/%m/%Y"),
                        "days_left": days_left
                    }
                except Exception:
                    return False, "Format de date d'expiration invalide dans la clé.", {}

        # MODE 2 : Clé Serveur de Base de Données (PR-XXXX-XXXX-XXXX)
        import requests
        try:
            r = requests.post(
                f"{self.server_url}/api/v1/license/verify",
                json={"license_key": key, "device_id": self.device_id},
                timeout=4
            )
            if r.status_code == 200:
                data = r.json()
                if data.get("is_valid") or data.get("ok"):
                    return True, data.get("message", "Licence active"), data.get("info", {})
                else:
                    return False, data.get("message", "Licence non valide"), data.get("info", {})
        except Exception:
            pass

        return False, "Clé de licence non reconnue ou serveur inaccessible. Veuillez contacter l'administrateur.", {}

    def activate_key(self, key: str, contact: str = "") -> Tuple[bool, str, Dict[str, Any]]:
        """
        Active et enregistre la clé pour cet appareil.
        """
        key = key.strip().upper()
        # Mode 1 : Clé Cryptographique Standalone
        if key.startswith("PR-KEY-"):
            ok, msg, info = self.verify_key(key)
            if ok:
                self.save_license_key(key)
            return ok, msg, info

        # Mode 2 : Clé Serveur
        import requests
        try:
            r = requests.post(
                f"{self.server_url}/api/v1/license/activate",
                json={
                    "license_key": key,
                    "device_id": self.device_id,
                    "device_info": f"{sys.platform} - {socket.gethostname()}",
                    "contact": contact
                },
                timeout=6
            )
            if r.status_code == 200:
                data = r.json()
                if data.get("ok"):
                    self.save_license_key(key)
                    return True, data.get("message", "Clé activée avec succès !"), data.get("info", {})
                else:
                    return False, data.get("message", "Échec d'activation"), {}
        except Exception as e:
            return False, f"Impossible de joindre le serveur d'activation : {e}", {}

        return False, "Clé de licence invalide.", {}

    def enforce_license_login(self) -> bool:
        """
        Point d'entrée obligatoire :
        Vérifie la licence avant tout accès au bot.
        Si la licence est manquante ou invalide, affiche l'écran de Login / Activation.
        """
        saved_key = self.get_saved_key()
        if saved_key:
            ok, msg, info = self.verify_key(saved_key)
            if ok:
                exp = info.get("expires_at", "Illimité")
                days = info.get("days_left", "")
                days_txt = f"({days} jours restants)" if days != "" else ""
                print(f"  {GREEN}{BOLD}✓ LICENCE VÉRIFIÉE{RESET} : {WHITE}Appareil {BOLD}{self.device_id}{RESET} · Expire : {YELLOW}{exp} {days_txt}{RESET}")
                time.sleep(0.8)
                return True

        # Écran d'Activation Obligatoire
        while True:
            if sys.stdout and hasattr(sys.stdout, 'isatty') and sys.stdout.isatty(): os.system('cls' if os.name == 'nt' else 'clear')
            else: sys.stdout.write('\033[2J\033[H')
            print(f"""
  {CYAN}{BOLD}╔══════════════════════════════════════════════════════════════════════╗{RESET}
  {CYAN}{BOLD}║{RESET}             {MAGENTA}{BOLD}🛡️ PR.SOCIAL BOT PRO · CONTRÔLE D'ACCÈS LICENCE{RESET}           {CYAN}{BOLD}║{RESET}
  {CYAN}{BOLD}╠══════════════════════════════════════════════════════════════════════╣{RESET}
  {CYAN}{BOLD}║{RESET}  {WHITE}{BOLD}RÈGLE STRICTE : 1 Utilisateur = 1 Appareil (HWID) = 1 Clé Unique{RESET}     {CYAN}{BOLD}║{RESET}
  {CYAN}{BOLD}║{RESET}                                                                      {CYAN}{BOLD}║{RESET}
  {CYAN}{BOLD}║{RESET}  📱 {YELLOW}{BOLD}VOTRE IDENTIFIANT APPAREIL (HWID) :{RESET}                               {CYAN}{BOLD}║{RESET}
  {CYAN}{BOLD}║{RESET}     👉 {GREEN}{BOLD}{self.device_id:<40}{RESET}               {CYAN}{BOLD}║{RESET}
  {CYAN}{BOLD}║{RESET}                                                                      {CYAN}{BOLD}║{RESET}
  {CYAN}{BOLD}║{RESET}  ℹ️ {WHITE}Ce bot est privé et protégé.{RESET}                                      {CYAN}{BOLD}║{RESET}
  {CYAN}{BOLD}║{RESET}     {WHITE}Seul l'Administrateur peut vous fournir une clé de licence.{RESET}       {CYAN}{BOLD}║{RESET}
  {CYAN}{BOLD}║{RESET}     {DIM}Transmettez votre Identifiant Appareil ci-dessus à l'administrateur.{RESET}{CYAN}{BOLD}║{RESET}
  {CYAN}{BOLD}╚══════════════════════════════════════════════════════════════════════╝{RESET}
""")

            if saved_key:
                print(f"  {RED}⚠️ Clé actuelle invalide ou expirée : {saved_key}{RESET}\n")

            print(f"  {GREEN}{BOLD}[ 1 ] 🔑 Entrer / Activer ma Clé de Licence{RESET}")
            print(f"  {RED}{BOLD}[ 2 ] ❌ Quitter{RESET}\n")
            sys.stdout.flush()

            try:
                choice = input(f"  {CYAN}⚡ {WHITE}{BOLD}Votre choix [1-2] :{RESET} ").strip()
            except (KeyboardInterrupt, EOFError):
                return False

            if choice == "1":
                print()
                user_key = input(f"  {WHITE}{BOLD}Collez votre Clé de Licence (fournie par l'Admin) :{RESET} ").strip().upper()
                if not user_key:
                    print(f"  {RED}Clé vide.{RESET}")
                    time.sleep(1.5)
                    continue

                print(f"\n  {CYAN}Vérification de la licence pour l'appareil {self.device_id}...{RESET}")
                ok, msg, info = self.activate_key(user_key)
                if ok:
                    print(f"\n  {GREEN}{BOLD}✓ SUCCÈS ! LICENCE ACTIVÉE AVEC SUCCÈS !{RESET}")
                    exp = info.get("expires_at") or "Actif"
                    print(f"  {WHITE}Appareil lié : {GREEN}{self.device_id}{RESET}")
                    print(f"  {WHITE}Date de fin  : {YELLOW}{exp}{RESET}\n")
                    time.sleep(2)
                    return True
                else:
                    print(f"\n  {RED}{BOLD}❌ ACTIVATION REFUSÉE :{RESET} {RED}{msg}{RESET}")
                    input(f"\n  Appuyez sur {BOLD}Entrée{RESET} pour réessayer...")

            elif choice in ["2", "q", "exit"]:
                return False

