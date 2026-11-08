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
import re
import unicodedata
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
REVOKED_KEYS_FILE = os.path.join(DATA_DIR, ".revoked_keys.json")

# Clé secrète maître d'administration (utilisée pour signer les clés matérielles 1 user = 1 device)
MASTER_SECRET_SIGNING_KEY = b"PR_SOCIAL_ADMIN_MASTER_SECRET_KEY_2026_BAGIO67"

DEFAULT_SERVER_URL = "http://127.0.0.1:8000"

def _strip_ansi(text: str) -> str:
    return re.sub(r'\x1b\[[0-9;]*m', '', text)

def _display_width(text: str) -> int:
    w = 0
    for ch in text:
        ea = unicodedata.east_asian_width(ch)
        if ea in ('W', 'F') or ord(ch) > 0x1F000:
            w += 2
        else:
            w += 1
    return w

def _pad_box_row(content: str, width: int = 70) -> str:
    rl = _display_width(_strip_ansi(content))
    p = max(0, width - rl)
    return f" │  {content}{' ' * p}│"

LOGO_BOT_HEADER = f"""{CYAN}{BOLD}
  ██████╗ ██████╗       ███████╗ ██████╗  ██████╗██╗ █████╗ ██╗     
  ██╔══██╗██╔══██╗      ██╔════╝██╔═══██╗██╔════╝██║██╔══██╗██║     
  ██████╔╝██████╔╝█████╗███████╗██║   ██║██║     ██║███████║██║     
  ██╔═══╝ ██╔══██╗╚════╝╚════██║██║   ██║██║     ██║██╔══██║██║     
  ██║     ██║  ██║      ███████║╚██████╔╝╚██████╗██║██║  ██║███████╗
  ╚═╝     ╚═╝  ╚═╝      ╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝{RESET}"""

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
        
        base_dir = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else os.getcwd()
        parent_dir = os.path.dirname(base_dir)
        default_candidates = [
            os.path.join(os.getcwd(), "config.json"),
            os.path.join(base_dir, "config.json"),
            os.path.join(parent_dir, "config.json"),
            os.path.join(base_dir, "pc_bot", "config.json"),
            os.path.join(parent_dir, "pc_bot", "config.json"),
            os.path.join(base_dir, "termux_bot", "config.json"),
            os.path.join(parent_dir, "termux_bot", "config.json"),
            os.path.join(DATA_DIR, "config.json"),
            os.path.join(HOME_DIR, "social_bot_data", "config.json"),
            os.path.join(DATA_DIR, "license.json"),
        ]
        seen = set()
        dedup_paths = []
        for p in (config_paths or []) + default_candidates:
            try:
                norm = os.path.normpath(os.path.abspath(p))
                if norm not in seen:
                    seen.add(norm)
                    dedup_paths.append(norm)
            except Exception:
                pass
        self.config_paths = dedup_paths
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

    def clear_saved_key(self):
        """Efface définitivement toute clé enregistrée en local lors d'une révocation ou d'une clé inconnue."""
        extra_targets = [
            r"D:\social_pc_bot\config.json",
            os.path.join(DATA_DIR, "config.json"),
            os.path.join(HOME_DIR, "social_bot_data", "config.json"),
            os.path.join(os.getcwd(), "config.json"),
        ]
        all_paths = list(self.config_paths) + extra_targets
        for p in all_paths:
            try:
                abs_p = os.path.abspath(p)
                if os.path.exists(abs_p):
                    with open(abs_p, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    if "license_key" in data and data["license_key"]:
                        data["license_key"] = ""
                        with open(abs_p, "w", encoding="utf-8") as f:
                            json.dump(data, f, indent=2)
            except Exception:
                pass
        lic_file = os.path.join(DATA_DIR, "license.json")
        if os.path.exists(lic_file):
            try:
                os.remove(lic_file)
            except Exception:
                pass

    def blacklist_key(self, key: str):
        """Mémorise localement une clé révoquée par l'administrateur."""
        key = key.strip().upper()
        if not key:
            return
        os.makedirs(DATA_DIR, exist_ok=True)
        revoked = set()
        if os.path.exists(REVOKED_KEYS_FILE):
            try:
                with open(REVOKED_KEYS_FILE, "r", encoding="utf-8") as f:
                    revoked = set(json.load(f))
            except Exception:
                revoked = set()
        revoked.add(key)
        try:
            with open(REVOKED_KEYS_FILE, "w", encoding="utf-8") as f:
                json.dump(list(revoked), f)
        except Exception:
            pass

    def is_key_blacklisted(self, key: str) -> bool:
        """Vérifie si la clé a été révoquée par l'administrateur."""
        key = key.strip().upper()
        if not key or not os.path.exists(REVOKED_KEYS_FILE):
            return False
        try:
            with open(REVOKED_KEYS_FILE, "r", encoding="utf-8") as f:
                revoked = json.load(f)
                return key in revoked
        except Exception:
            return False

    def verify_key(self, key: str) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Vérification stricte de la licence avec contrôle administrateur 100% en temps réel :
        1. Vérifie si la clé est dans la liste des licences révoquées.
        2. Valide l'intégrité matérielle (HWID) et cryptographique.
        3. Interroge le serveur central : si révoquée ou supprimée par l'admin -> BLOCAGE & EFFACEMENT IMMÉDIAT.
        """
        key = key.strip().upper()
        if not key:
            return False, "Aucune clé de licence fournie.", {}

        # 0. Vérification de la blacklist locale de révocation
        if self.is_key_blacklisted(key):
            self.clear_saved_key()
            return False, "⛔ Cette licence a été révoquée par l'administrateur.", {"status": "REVOKED"}

        # 0.5. Vérification prioritaire et obligatoire dans la base server/licensing.db locale si présente
        possible_db_paths = [
            os.path.join(os.getcwd(), "server", "licensing.db"),
            os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "server", "licensing.db"),
            os.path.join(DATA_DIR, "licensing.db")
        ]
        local_db_found = False
        for db_path in possible_db_paths:
            if os.path.exists(db_path):
                local_db_found = True
                try:
                    import sqlite3
                    conn = sqlite3.connect(db_path)
                    cur = conn.cursor()
                    cur.execute("SELECT status, device_id, expires_at FROM licenses WHERE license_key = ?;", (key,))
                    row = cur.fetchone()
                    conn.close()

                    # Si la base de données existe mais la clé n'y figure pas -> REFUS STRICT & EFFACEMENT
                    if not row:
                        self.clear_saved_key()
                        return False, "Cette licence n'existe pas dans la base de données de l'administrateur.", {"status": "NOT_FOUND"}

                    db_st = row[0]
                    if db_st == "REVOKED":
                        self.clear_saved_key()
                        self.blacklist_key(key)
                        return False, "⛔ Cette licence a été révoquée par l'administrateur.", {"status": "REVOKED"}
                    elif db_st != "ACTIVE":
                        self.clear_saved_key()
                        return False, f"Cette licence n'est pas active (Statut: {db_st}).", {"status": db_st}

                    # Vérification du Device ID en base
                    bound_dev = (row[1] or "").strip().upper()
                    if bound_dev:
                        curr_dev = self.device_id.strip().upper()
                        bound_short = bound_dev.split("-")[1] if "-" in bound_dev else bound_dev[:4]
                        curr_short = curr_dev.split("-")[1] if "-" in curr_dev else curr_dev[:4]
                        if bound_dev != curr_dev and bound_short != curr_short:
                            return False, f"Cette licence est verrouillée sur un autre appareil ({bound_dev}).", {"status": "DEVICE_MISMATCH"}

                    # Vérification de l'expiration
                    exp_str = row[2]
                    if exp_str:
                        exp_dt = datetime.strptime(exp_str, "%Y-%m-%d %H:%M:%S")
                        now = datetime.now()
                        if now > exp_dt:
                            self.clear_saved_key()
                            return False, f"Cette licence a expiré le {exp_str}.", {"status": "EXPIRED"}
                        days_left = max(0, (exp_dt - now).days)
                        return True, "Licence active et vérifiée dans la base de données.", {
                            "status": "ACTIVE",
                            "license_key": key,
                            "device_id": self.device_id,
                            "expires_at": exp_dt.strftime("%d/%m/%Y"),
                            "days_left": days_left
                        }
                    else:
                        return True, "Licence active et vérifiée.", {"status": "ACTIVE", "license_key": key}
                except Exception:
                    pass

        # Si la base de données locale était présente sur la machine, la décision ci-dessus est définitive !
        if local_db_found:
            self.clear_saved_key()
            return False, "Licence introuvable dans la base de données locale.", {"status": "NOT_FOUND"}

        # Vérification préalable de la structure si clé signée PR-KEY-...
        is_hardware_key = key.startswith("PR-KEY-")
        exp_date_obj = None
        if is_hardware_key:
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

                try:
                    exp_date_obj = datetime.strptime(k_exp, "%Y%m%d").replace(hour=23, minute=59, second=59)
                    if datetime.now() > exp_date_obj:
                        return False, f"Cette licence a expiré le {exp_date_obj.strftime('%d/%m/%Y')}.", {
                            "status": "EXPIRED",
                            "expires_at": exp_date_obj.strftime("%Y-%m-%d %H:%M:%S")
                        }
                except Exception:
                    return False, "Format de date d'expiration invalide dans la clé.", {}
            else:
                return False, "Format de clé matérielle invalide.", {}

        # 2. CONTRÔLE SERVEUR EN TEMPS RÉEL (AUTORITÉ SUPRÊME DE L'ADMIN)
        import requests
        server_checked = False
        try:
            r = requests.post(
                f"{self.server_url}/api/v1/license/verify",
                json={"license_key": key, "device_id": self.device_id},
                timeout=3.5
            )
            if r.status_code == 200:
                server_checked = True
                data = r.json()
                is_valid = bool(data.get("is_valid", False))
                msg = data.get("message", "")
                info = data.get("info", {})

                if not is_valid:
                    # L'ADMIN A RÉVOQUÉ OU SUPPRIMÉ LA LICENCE
                    status = info.get("status", "REVOKED")
                    if status in ["REVOKED", "NOT_FOUND", "EXPIRED"]:
                        self.clear_saved_key()
                        self.blacklist_key(key)
                    return False, f"⛔ {msg}", info

                # Licence confirmée active par le serveur
                return True, msg or "Licence vérifiée et active auprès du serveur.", info
        except Exception:
            # Le serveur central est momentanément inaccessible
            server_checked = False

        # 3. CONTRÔLE DU REGISTRE OFFICIEL DE L'ADMINISTRATEUR (EN LIGNE & LOCAL)
        # Permet le contrôle à distance même si le bot tourne sur Termux/smartphone sans serveur local
        ONLINE_REGISTRY_URL = "https://raw.githubusercontent.com/Baggio67/media.sc/main/.lic_registry.json"
        registry_checked = False
        reg_data = None

        # A. Tentative de lecture en direct sur GitHub (en temps réel avec anti-cache)
        try:
            import time
            cache_buster = int(time.time())
            r_reg = requests.get(f"{ONLINE_REGISTRY_URL}?t={cache_buster}", timeout=5.0)
            if r_reg.status_code == 200:
                reg_data = r_reg.json()
                registry_checked = True
        except Exception:
            pass

        # B. Fallback : Lecture du fichier .lic_registry.json local s'il existe (mis à jour par git pull)
        if not registry_checked:
            curr_dir = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else os.getcwd()
            local_reg_candidates = [
                os.path.join(DATA_DIR, ".lic_registry.json"),
                os.path.join(curr_dir, ".lic_registry.json"),
                os.path.join(os.path.dirname(curr_dir), ".lic_registry.json"),
                os.path.join(os.getcwd(), ".lic_registry.json")
            ]
            for cand in local_reg_candidates:
                if os.path.exists(cand):
                    try:
                        with open(cand, "r", encoding="utf-8") as rf:
                            reg_data = json.load(rf)
                            registry_checked = True
                            break
                    except Exception:
                        pass

        if registry_checked and isinstance(reg_data, dict):
            # Déchiffrement du coffre-fort protégé (Zéro fuite de clé sur GitHub)
            vault_str = reg_data.get("vault", "")
            if vault_str:
                try:
                    import base64
                    enc_bytes = base64.b64decode(vault_str.encode("ascii"))
                    keystream = hashlib.sha256(MASTER_SECRET_SIGNING_KEY + b"_REG_CIPHER_2026").digest()
                    dec = bytearray(len(enc_bytes))
                    for i, b in enumerate(enc_bytes):
                        dec[i] = b ^ keystream[i % 32] ^ ((i * 41) & 0xFF)
                    inner = json.loads(dec.decode("utf-8"))
                    active_list = set(inner.get("act", []))
                    revoked_list = set(inner.get("rev", []))
                except Exception:
                    active_list, revoked_list = set(), set()
            else:
                active_list = set(reg_data.get("active_keys", []))
                revoked_list = set(reg_data.get("revoked_keys", []))

            # Empreinte cryptographique à sens unique de la clé testée (SHA-256 + Sel Maître)
            key_hash = hashlib.sha256(MASTER_SECRET_SIGNING_KEY + b"::SALT_KEY::" + key.strip().upper().encode("utf-8")).hexdigest()

            if key_hash in revoked_list or key in revoked_list:
                self.clear_saved_key()
                self.blacklist_key(key)
                return False, "⛔ Cette licence a été révoquée par l'administrateur.", {"status": "REVOKED"}

            if key_hash not in active_list and key not in active_list:
                self.clear_saved_key()
                return False, "⛔ Cette licence n'existe pas ou a été supprimée par l'administrateur.", {"status": "NOT_FOUND"}

            # La clé est explicitement dans la liste ACTIVE du registre officiel
            if is_hardware_key and exp_date_obj:
                days_left = max(0, (exp_date_obj - datetime.now()).days)
                return True, "Licence active et certifiée par le registre officiel de l'administrateur.", {
                    "status": "ACTIVE",
                    "license_key": key,
                    "device_id": self.device_id,
                    "expires_at": exp_date_obj.strftime("%d/%m/%Y"),
                    "days_left": days_left
                }

        # C. AUCUN MODE SECOURS HORS LIGNE NON VÉRIFIÉ
        # Si ni le serveur local ni le registre officiel en ligne n'ont pu être validés,
        # la clé n'est pas acceptée (évite tout contournement sur Termux / smartphones)
        self.clear_saved_key()
        return False, "⛔ Impossible de certifier la licence : Serveur ou registre officiel inaccessible. Connexion Internet requise.", {"status": "SERVER_UNREACHABLE"}

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

        # Écran d'Activation Obligatoire (Design Officiel)
        while True:
            if sys.stdout and hasattr(sys.stdout, 'isatty') and sys.stdout.isatty():
                os.system('cls' if os.name == 'nt' else 'clear')
            else:
                sys.stdout.write('\033[2J\033[H')

            # 1. Logo en haut
            print(LOGO_BOT_HEADER)

            # 2. Cadres officiels
            box_top = f" {CYAN}┌{'─' * 72}┐{RESET}"
            box_bot = f" {CYAN}└{'─' * 72}┘{RESET}"

            print()
            print(box_top)
            print(_pad_box_row(f"{WHITE}Abonnement : {GREEN}{BOLD}8000 ar = 2$ par semaine{RESET}"))
            print(_pad_box_row(""))
            print(_pad_box_row(f"{YELLOW}{BOLD}Paiements acceptés :{RESET}"))
            print(_pad_box_row(f"• {WHITE}Binance ID : {CYAN}{BOLD}826509536{RESET}"))
            print(_pad_box_row(f"• {WHITE}MVola      : {GREEN}{BOLD}0347281599{RESET} {WHITE}(Baggio Michel){RESET}"))
            print(box_bot)

            print()
            print(box_top)
            print(_pad_box_row(f"{WHITE}HWID    : {YELLOW}{BOLD}{self.device_id}{RESET}"))
            print(_pad_box_row(f"{WHITE}STATUT  : {RED}{BOLD}🔴 Non activé{RESET}"))
            print(box_bot)

            print()
            print(f" {GREEN}{BOLD}[1] 🔑 Entrer la clé de licence{RESET}")
            print(f" {RED}{BOLD}[2] ❌ Quitter l'application{RESET}")
            print()

            if saved_key:
                print(f" {RED}⚠️ Clé actuelle invalide ou expirée : {saved_key}{RESET}\n")

            sys.stdout.flush()

            try:
                choice = input(f" {CYAN}▶{RESET} {WHITE}{BOLD}Sélectionner une option [1-2] :{RESET} ").strip()
            except (KeyboardInterrupt, EOFError):
                return False

            if choice == "1":
                print()
                user_key = input(f" {WHITE}{BOLD}🔑 Entrer la clé de licence :{RESET} ").strip().upper()
                if not user_key:
                    print(f" {RED}Clé vide.{RESET}")
                    time.sleep(1.5)
                    continue

                print(f"\n {CYAN}⏳ Vérification de la licence pour l'appareil {self.device_id}...{RESET}")
                ok, msg, info = self.activate_key(user_key)
                if ok:
                    print(f"\n {GREEN}{BOLD}✓ SUCCÈS ! LICENCE ACTIVÉE AVEC SUCCÈS !{RESET}")
                    exp = info.get("expires_at") or "Actif"
                    print(f" {WHITE}Appareil : {GREEN}{self.device_id}{RESET}")
                    print(f" {WHITE}Expire le: {YELLOW}{exp}{RESET}\n")
                    time.sleep(2)
                    return True
                else:
                    print(f"\n {RED}{BOLD}❌ ACTIVATION REFUSÉE :{RESET} {RED}{msg}{RESET}")
                    input(f"\n Appuyez sur {BOLD}Entrée{RESET} pour réessayer...")

            elif choice in ["2", "q", "exit"]:
                return False

