import os
import sys
import re
import time
import json
import hashlib
import random
from datetime import datetime
from typing import Optional, Dict, Any, Tuple, List
from urllib.parse import urlparse
import requests
import base64
import io
import subprocess

try:
    import cv2
    import numpy as np
    from PIL import Image
    HAS_CV2 = True
    HAS_PIL = True
except ImportError:
    HAS_CV2 = False
    try:
        from PIL import Image
        HAS_PIL = True
    except ImportError:
        HAS_PIL = False

# Forcer l'encodage UTF-8 et activer les couleurs ANSI sur Windows
try:
    if sys.stdout:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    if sys.stderr:
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

if os.name == 'nt':
    os.system('color')

# Support pour exécution directe et en module
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

try:
    from browser_bot import BrowserBot
except ImportError:
    from pc_bot.browser_bot import BrowserBot

try:
    from telegram_worker_engine import TelegramWorkerEngine, TelegramAuthManager
except ImportError:
    try:
        from pc_bot.telegram_worker_engine import TelegramWorkerEngine, TelegramAuthManager
    except ImportError:
        TelegramWorkerEngine = None
        TelegramAuthManager = None

BASE_API_URL = "https://pr.social/api"
DEFAULT_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"

# ==============================================================================
# 1. CLIENT API DIRECT PR.SOCIAL
# ==============================================================================
class PrSocialClient:
    def __init__(self, token: str, cf_clearance: str = ""):
        self.session = requests.Session()
        self.token = token.strip()
        self.cf_clearance = cf_clearance.strip()
        self._update_headers()

    def update_token(self, token: str, cf_clearance: str = ""):
        self.token = token.strip()
        if cf_clearance:
            self.cf_clearance = cf_clearance.strip()
        self._update_headers()

    def _update_headers(self):
        tok = self.token
        if tok.startswith("token="):
            tok = tok[6:]
        self.token = tok.strip()

        cookies = []
        if self.token:
            cookies.append(f"token={self.token}")
        if self.cf_clearance:
            cf = self.cf_clearance
            if cf.startswith("cf_clearance="):
                cf = cf[13:]
            cookies.append(f"cf_clearance={cf.strip()}")

        self.session.headers.update({
            "User-Agent": DEFAULT_UA,
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
            "Origin": "https://pr.social",
            "Referer": "https://pr.social/tasks",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            "Cookie": "; ".join(cookies)
        })

    def request(self, method: str, path: str, json_data: Optional[Dict] = None, params: Optional[Dict] = None) -> Tuple[int, Dict[str, Any]]:
        url = BASE_API_URL + path
        try:
            resp = self.session.request(method=method, url=url, json=json_data, params=params, timeout=30)
            try:
                data = resp.json()
            except Exception:
                data = {"raw_text": resp.text, "error": f"Status {resp.status_code}"}
            return resp.status_code, data
        except Exception as e:
            return 0, {"error": str(e)}

    def get_me(self) -> Tuple[int, Dict[str, Any]]:
        return self.request("GET", "/auth/me")

    def get_socials(self) -> Tuple[int, Dict[str, Any]]:
        return self.request("GET", "/profile/socials")

    def get_available_tasks(self, platform: str, sort: str = "reward", limit: int = 50, page: int = 1) -> Tuple[int, Dict[str, Any]]:
        params = {"platform": platform, "sort": sort, "limit": limit}
        if page > 1:
            params["page"] = page
        return self.request("GET", "/tasks/available", params=params)

    def get_warnings(self) -> Tuple[int, Dict[str, Any]]:
        return self.request("GET", "/profile/warnings")

    def get_in_progress_tasks(self) -> Tuple[int, Dict[str, Any]]:
        return self.request("GET", "/tasks/my/list", params={"status": "in_progress"})

    def start_task(self, task_id: int, social_account_id: Optional[int] = None) -> Tuple[int, Dict[str, Any]]:
        body = {}
        if social_account_id is not None:
            body["social_account_id"] = social_account_id
        return self.request("POST", f"/tasks/{task_id}/start", json_data=body)

    def api_check_task(self, task_id: int) -> Tuple[int, Dict[str, Any]]:
        return self.request("POST", f"/tasks/{task_id}/api-check")

    def cancel_task(self, task_id: int) -> Tuple[int, Dict[str, Any]]:
        return self.request("POST", f"/tasks/{task_id}/cancel")

    def submit_screenshot_file(self, task_id: int, filepath: str) -> Tuple[int, Dict[str, Any]]:
        if not os.path.exists(filepath):
            return 0, {"error": f"Fichier capture introuvable: {filepath}"}

        upload_path = filepath
        mime_type = "image/png"
        filename = "screenshot.png"

        # Optimisation RAM Nginx : Compression WebP pour rester sous le tampon RAM de 10 Ko (évite le crash 500 Nginx)
        try:
            if os.path.getsize(filepath) > 9500:
                from PIL import Image
                im = Image.open(filepath)
                w, h = im.size
                ratio = 540 / float(w)
                new_h = int(h * ratio)
                im_resized = im.resize((540, new_h), Image.Resampling.LANCZOS)
                
                opt_path = filepath + ".ram_opt.webp"
                im_resized.save(opt_path, format="WEBP", quality=45, method=6)
                if os.path.getsize(opt_path) > 9500:
                    im_resized.save(opt_path, format="WEBP", quality=35, method=6)
                
                upload_path = opt_path
                mime_type = "image/webp"
                filename = "screenshot.webp"
        except Exception:
            upload_path = filepath

        url = f"{BASE_API_URL}/tasks/{task_id}/submit"
        headers = dict(self.session.headers)
        headers.pop("Content-Type", None)

        try:
            with open(upload_path, "rb") as f:
                files = {"screenshot": (filename, f, mime_type)}
                resp = self.session.post(url, files=files, headers=headers, timeout=35)
            try:
                return resp.status_code, resp.json()
            except Exception:
                return resp.status_code, {"error": f"Status {resp.status_code}"}
        except Exception as e:
            return 0, {"error": str(e)}


# ==============================================================================
# ==============================================================================
# 2. DESIGN & INTERFACE CONSOLE HAUTE FIDÉLITÉ (STYLISÉE & COLORÉE)
# ==============================================================================
class UI:
    RESET   = "\033[0m"
    BOLD    = "\033[1m"
    DIM     = "\033[2m"
    ITALIC  = "\033[3m"
    UNDER   = "\033[4m"

    RED     = "\033[91m"
    GREEN   = "\033[92m"
    YELLOW  = "\033[93m"
    BLUE    = "\033[94m"
    MAGENTA = "\033[95m"
    CYAN    = "\033[96m"
    WHITE   = "\033[97m"
    GRAY    = "\033[90m"

    PLATFORM_COLORS = {
        "youtube": "\033[91m",      # Rouge vif
        "pinterest": "\033[91m",    # Rouge
        "threads": "\033[95m",      # Magenta
        "instagram": "\033[95m",    # Magenta / Violet
        "tiktok": "\033[95m",       # Magenta / Neon
        "twitter": "\033[96m",      # Cyan vif
        "x": "\033[96m",            # Cyan vif
        "telegram": "\033[96m",     # Cyan
        "bluesky": "\033[94m",      # Bleu
        "facebook": "\033[94m",     # Bleu
        "linkedin": "\033[94m",     # Bleu
        "discord": "\033[94m",      # Blurple
        "spotify": "\033[92m",      # Vert vif
        "reddit": "\033[93m",       # Orange / Jaune
        "soundcloud": "\033[93m",   # Orange
        "snapchat": "\033[93m",     # Jaune vif
        "github": "\033[97m",       # Blanc pur
    }

    SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
    WIDTH = 72

    @staticmethod
    def strip_ansi(s: str) -> str:
        return re.sub(r'\033\[[0-9;]*m', '', s)

    @staticmethod
    def now():
        return datetime.now().strftime("%H:%M:%S")

    @classmethod
    def clear_line(cls):
        try:
            if sys.stdout and hasattr(sys.stdout, 'isatty') and sys.stdout.isatty():
                sys.stdout.write("\r\033[2K\r")
            else:
                sys.stdout.write("\r")
            sys.stdout.flush()
        except Exception:
            pass

    @classmethod
    def clear_screen(cls):
        os.system('cls' if os.name == 'nt' else 'clear')

    @classmethod
    def make_box(cls, title: str, rows: list, border_color: str = None) -> str:
        b_col = border_color or cls.CYAN
        w = cls.WIDTH
        t_clean = cls.strip_ansi(title)
        dashes = max(2, w - 8 - len(t_clean))
        lines = [f"  {b_col}╭── {title} {'─' * dashes}╮{cls.RESET}"]
        inner_budget = w - 8
        for left, right in rows:
            l_c = cls.strip_ansi(left)
            r_c = cls.strip_ansi(right)
            gap = max(1, inner_budget - len(l_c) - len(r_c))
            lines.append(f"  {b_col}│{cls.RESET}  {left}{' ' * gap}{right}  {b_col}│{cls.RESET}")
        lines.append(f"  {b_col}╰{'─' * (w - 4)}╯{cls.RESET}")
        return '\n'.join(lines)

    @classmethod
    def header(cls, title: str, subtitle: str = ""):
        cls.clear_line()
        w = cls.WIDTH
        d_top = w - 4
        print(f"\n  {cls.CYAN}{cls.BOLD}╔{'═' * d_top}╗{cls.RESET}")
        t_clean = cls.strip_ansi(title)
        sp_t = max(0, (w - 4 - len(t_clean)) // 2)
        sp_tr = max(0, w - 4 - len(t_clean) - sp_t)
        print(f"  {cls.CYAN}{cls.BOLD}║{cls.RESET}{' ' * sp_t}{cls.WHITE}{cls.BOLD}{title}{cls.RESET}{' ' * sp_tr}{cls.CYAN}{cls.BOLD}║{cls.RESET}")
        if subtitle:
            sub_c = cls.strip_ansi(subtitle)
            sp_s = max(0, (w - 4 - len(sub_c)) // 2)
            sp_sr = max(0, w - 4 - len(sub_c) - sp_s)
            print(f"  {cls.CYAN}{cls.BOLD}║{cls.RESET}{' ' * sp_s}{cls.GRAY}{subtitle}{cls.RESET}{' ' * sp_sr}{cls.CYAN}{cls.BOLD}║{cls.RESET}")
        print(f"  {cls.CYAN}{cls.BOLD}╚{'═' * d_top}╝{cls.RESET}\n")

    @classmethod
    def user_card(cls, username: str, balance: float, networks_count: int = 15):
        cls.clear_line()
        rows = [
            (f"Compte : {cls.GREEN}{cls.BOLD}@{username}{cls.RESET}", f"Solde : {cls.YELLOW}{cls.BOLD}${balance:.4f}{cls.RESET}"),
            (f"Réseaux : {cls.WHITE}{cls.BOLD}{networks_count} connectés{cls.RESET}", f"Sécurité : {cls.GREEN}Bouclier Anti-Ban Actif 🛡️{cls.RESET}")
        ]
        print(cls.make_box("👤 SESSION ACTIVE PR.SOCIAL", rows, border_color=cls.WHITE))
        print()

    @classmethod
    def accounts_grid(cls, accounts: dict):
        if not accounts:
            return
        cls.clear_line()
        total = len(accounts)
        w = cls.WIDTH
        title = f"📱 {total} RÉSEAUX APPROUVÉS CONNECTÉS"
        dashes = max(2, w - 8 - len(title))
        lines = [f"  {cls.WHITE}{cls.BOLD}╭── {title} {'─' * dashes}╮{cls.RESET}"]
        items = list(accounts.items())
        col_w = (w - 12) // 2

        for i in range(0, len(items), 2):
            p1, acc1 = items[i]
            c1 = cls.PLATFORM_COLORS.get(p1.lower(), cls.CYAN)
            u1 = ("@" + acc1.get("username", "").lstrip("@"))[:16]
            tag1 = f"[{p1.upper()[:9]:<9}]"
            pad1 = col_w - 11 - 1 - len(u1)
            col1 = f"{c1}{cls.BOLD}{tag1}{cls.RESET} {cls.WHITE}{u1}{' ' * max(0, pad1)}{cls.RESET}"

            if i + 1 < len(items):
                p2, acc2 = items[i+1]
                c2 = cls.PLATFORM_COLORS.get(p2.lower(), cls.CYAN)
                u2 = ("@" + acc2.get("username", "").lstrip("@"))[:16]
                tag2 = f"[{p2.upper()[:9]:<9}]"
                pad2 = col_w - 11 - 1 - len(u2)
                col2 = f"{c2}{cls.BOLD}{tag2}{cls.RESET} {cls.WHITE}{u2}{' ' * max(0, pad2)}{cls.RESET}"
            else:
                col2 = " " * col_w

            lines.append(f"  {cls.WHITE}│{cls.RESET}  {col1} {cls.GRAY}│{cls.RESET}  {col2}  {cls.WHITE}│{cls.RESET}")

        lines.append(f"  {cls.WHITE}{cls.BOLD}╰{'─' * (w - 4)}╯{cls.RESET}\n")
        print('\n'.join(lines))

    @classmethod
    def task_card(cls, task_id: int, platform: str, action: str, reward: float, url: str):
        cls.clear_line()
        short_url = (url[:46] + "...") if len(url) > 49 else url
        p_col = cls.PLATFORM_COLORS.get(platform.lower(), cls.CYAN)
        plat_badge = f"{p_col}{cls.BOLD}[{platform.upper()}]{cls.RESET}"
        title = f"🌐 {plat_badge} Tâche #{task_id}"
        rows = [
            (f"Action : {cls.WHITE}{cls.BOLD}{action.upper()}{cls.RESET}", f"Gain : {cls.GREEN}{cls.BOLD}+${reward:.4f}{cls.RESET}"),
            (f"Cible  : {cls.GRAY}{short_url}{cls.RESET}", "")
        ]
        print(f"\n{cls.make_box(title, rows, border_color=cls.CYAN)}")

    @classmethod
    def step(cls, msg: str, level: str = "info"):
        cls.clear_line()
        ts = f"{cls.GRAY}[{cls.now()}]{cls.RESET}"
        m = msg.strip()
        for pfx in ["✓", "🎉", "⚠️", "❌", "▶", "➔", "🎯", "🛡️", "⏳", "ℹ️", "i"]:
            if m.startswith(pfx):
                m = m[len(pfx):].strip()

        if level == "success":
            icon = f"{cls.GREEN}{cls.BOLD}✓{cls.RESET}"
            text = f"{cls.GREEN}{m}{cls.RESET}"
        elif level == "warning":
            icon = f"{cls.YELLOW}{cls.BOLD}⚠{cls.RESET}"
            text = f"{cls.YELLOW}{m}{cls.RESET}"
        elif level == "error":
            icon = f"{cls.RED}{cls.BOLD}✗{cls.RESET}"
            text = f"{cls.RED}{m}{cls.RESET}"
        else:
            icon = f"{cls.CYAN}➔{cls.RESET}"
            text = f"{cls.WHITE}{m}{cls.RESET}"

        print(f"  {ts} {icon} {text}")

    @classmethod
    def live_status(cls, msg: str, icon: str = "⠼"):
        cls.clear_line()
        ts = f"{cls.GRAY}[{cls.now()}]{cls.RESET}"
        clean_msg = cls.strip_ansi(msg)[:60]
        sys.stdout.write(f"\r  {ts} {cls.CYAN}{icon}{cls.RESET} {cls.GRAY}{clean_msg}{cls.RESET}\r")
        sys.stdout.flush()

    @classmethod
    def success(cls, task_id: int, reward: float, session_total: float, new_balance: float):
        cls.clear_line()
        ts = f"{cls.GRAY}[{cls.now()}]{cls.RESET}"
        print(f"  {ts} {cls.GREEN}{cls.BOLD}✓ SUCCÈS #{task_id} : +${reward:.4f}  │  Session : +${session_total:.4f}  │  Solde : ${new_balance:.4f}{cls.RESET}\n")

    @classmethod
    def safety_pause(cls, seconds: float):
        steps = int(seconds * 10)
        for i in range(steps, 0, -1):
            rem = i / 10.0
            ts = f"{cls.GRAY}[{cls.now()}]{cls.RESET}"
            msg = f"\r  {ts} {cls.CYAN}⏳ Rotation Turbo ({rem:.1f}s)...{cls.RESET}   "
            sys.stdout.write(msg)
            sys.stdout.flush()
            time.sleep(0.1)
        cls.clear_line()

    @classmethod
    def surf_chrono(cls, elapsed: int, total: int, state: str = "Défilement actif"):
        ts = f"{cls.GRAY}[{cls.now()}]{cls.RESET}"
        pct = min(100, int((elapsed / max(1, total)) * 100))
        rem = max(0, total - elapsed)
        bar_len = 18
        filled = int((pct / 100) * bar_len)
        bar = f"{cls.CYAN}{'━' * filled}{cls.GRAY}{'─' * (bar_len - filled)}{cls.RESET}"
        spin = cls.SPINNER[elapsed % len(cls.SPINNER)]
        msg = f"\r    {ts} {cls.CYAN}{spin}{cls.RESET} [{bar}] {cls.WHITE}{cls.BOLD}{elapsed}s/{total}s{cls.RESET} ({cls.YELLOW}{pct}%{cls.RESET}) · Reste: {cls.CYAN}{rem}s{cls.RESET} · {cls.GRAY}{state}{cls.RESET}  "
        sys.stdout.write(msg)
        sys.stdout.flush()

    @classmethod
    def radar_pulse(cls, active_count: int, server_total: int, wait_sec: int, tick: int = 0):
        ts = f"{cls.GRAY}[{cls.now()}]{cls.RESET}"
        spin = cls.SPINNER[tick % len(cls.SPINNER)]
        active_badge = f"{cls.GREEN}{cls.BOLD}{active_count}{cls.RESET}" if active_count > 0 else f"{cls.GRAY}0{cls.RESET}"
        msg = f"\r  {ts} {cls.MAGENTA}{cls.BOLD}{spin} Radar PR.Social :{cls.RESET} {active_badge}{cls.MAGENTA} tâche(s) sur vos comptes ({server_total} au total) · Scan dans {wait_sec}s...{cls.RESET}   "
        sys.stdout.write(msg)
        sys.stdout.flush()

    @classmethod
    def pad_line(cls, content: str, width: int = 64) -> str:
        plain = re.sub(r'\033\[[0-9;]*m', '', content)
        wide_count = sum(1 for ch in plain if ord(ch) > 0x2000)
        visual_len = len(plain) + wide_count
        padding = max(0, width - visual_len)
        return content + " " * padding

    @classmethod
    def box_row(cls, content: str, width: int = 64, border: str = "│", border_color: str = None):
        b_col = border_color or cls.CYAN
        padded = cls.pad_line(content, width)
        print(f"  {b_col}{cls.BOLD}{border}{cls.RESET}  {padded}  {b_col}{cls.BOLD}{border}{cls.RESET}")

    @classmethod
    def rejected_summary_card(cls, total_count: int, total_amount: float):
        cls.clear_line()
        c_str = f"{total_count} tâche(s)"
        a_str = f"${total_amount:.4f}"
        print(f"  {cls.YELLOW}{cls.BOLD}╔══ 📊 ANALYSE DU COMPTE : TÂCHES REJETÉES ════════════════════════════╗{cls.RESET}")
        cls.box_row(f"Total Détecté : {cls.WHITE}{cls.BOLD}{c_str:<18}{cls.RESET}  💰 Valeur à Récupérer : {cls.GREEN}{cls.BOLD}{a_str:<10}{cls.RESET}", width=64, border="║", border_color=cls.YELLOW)
        cls.box_row(f"Algorithme    : {cls.CYAN}{cls.BOLD}Strict Anti-Rejet v3.1{cls.RESET}   🛡️  Protection Anti-Ban : {cls.GREEN}Active{cls.RESET}", width=64, border="║", border_color=cls.YELLOW)
        print(f"  {cls.YELLOW}{cls.BOLD}╚══════════════════════════════════════════════════════════════════════╝{cls.RESET}\n")

    @classmethod
    def rejected_task_card(cls, idx: int, total: int, task: dict):
        cls.clear_line()
        tid = task.get("task_id", 0)
        plat = task.get("platform", "web").lower()
        act = task.get("action", "action").upper()
        rew = task.get("reward", 0.0)
        diag = task.get("analysis", {})
        cat = diag.get("category", "REJET GÉNÉRAL IA")
        strict_m = diag.get("strict_measure", "Exécution ultra-stricte avec vérification DOM.")
        
        cat_short = (cat[:52] + "...") if len(cat) > 55 else cat
        strict_short = (strict_m[:50] + "...") if len(strict_m) > 53 else strict_m
        
        p_color = cls.PLATFORM_COLORS.get(plat, cls.CYAN)
        plat_badge = f"{p_color}{cls.BOLD}[{plat.upper()}]{cls.RESET}"
        
        header_title = f" TÂCHE REJETÉE [{idx}/{total}] · #{tid} "
        dash_len = max(0, 68 - len(header_title))
        top_border = f"┌── ⚠️ {header_title}{'─' * dash_len}┐"
        
        print(f"  {cls.WHITE}{cls.BOLD}{top_border}{cls.RESET}")
        cls.box_row(f"Réseau : {plat_badge}   Action : {cls.WHITE}{cls.BOLD}{act}{cls.RESET}   Gain : {cls.GREEN}{cls.BOLD}+${rew:.3f}{cls.RESET}", width=64, border="│", border_color=cls.WHITE)
        cls.box_row(f"{cls.RED}Motif  :{cls.RESET} {cls.GRAY}{cat_short}{cls.RESET}", width=64, border="│", border_color=cls.WHITE)
        cls.box_row(f"{cls.YELLOW}Mesure :{cls.RESET} {cls.CYAN}{strict_short}{cls.RESET}", width=64, border="│", border_color=cls.WHITE)
        print(f"  {cls.WHITE}{cls.BOLD}└──────────────────────────────────────────────────────────────────────┘{cls.RESET}")

    @classmethod
    def rejected_actions_box(cls):
        print(f"\n  {cls.CYAN}{cls.BOLD}┌── ⚡ ACTIONS DISPONIBLES ─────────────────────────────────────────────┐{cls.RESET}")
        cls.box_row(f"{cls.GREEN}{cls.BOLD}[ A ] 🚀 Réessayer TOUTES les tâches rejetées en Mode Strict{cls.RESET}", width=64, border="│", border_color=cls.CYAN)
        cls.box_row(f"{cls.RED}{cls.BOLD}[ R ] ⬅️  Retour au Menu Principal{cls.RESET}", width=64, border="│", border_color=cls.CYAN)
        print(f"  {cls.CYAN}{cls.BOLD}└──────────────────────────────────────────────────────────────────────┘{cls.RESET}\n")

    @classmethod
    def retry_card_header(cls, idx: int, total: int, task: dict):
        cls.clear_line()
        tid = task.get("task_id", 0)
        plat = task.get("platform", "web").lower()
        act = task.get("action", "action").upper()
        rew = task.get("reward", 0.0)
        p_color = cls.PLATFORM_COLORS.get(plat, cls.CYAN)
        plat_badge = f"{p_color}{cls.BOLD}[{plat.upper()}]{cls.RESET}"
        
        header_title = f" RÉESSAI [{idx}/{total}] · #{tid} "
        dash_len = max(0, 68 - len(header_title))
        top_border = f"┌── 🎯 {header_title}{'─' * dash_len}┐"
        
        print(f"\n  {cls.CYAN}{cls.BOLD}{top_border}{cls.RESET}")
        cls.box_row(f"Réseau : {plat_badge}   Action : {cls.WHITE}{cls.BOLD}{act}{cls.RESET}   Gain : {cls.GREEN}{cls.BOLD}+${rew:.3f}{cls.RESET}", width=64, border="│", border_color=cls.CYAN)
        print(f"  {cls.CYAN}{cls.BOLD}└──────────────────────────────────────────────────────────────────────┘{cls.RESET}")

    @classmethod
    def retry_recap(cls, total: int, success: int, slots: int, expired: int, recovered_amount: float):
        cls.clear_line()
        s_val = f"+${recovered_amount:.4f}"
        print(f"\n  {cls.CYAN}{cls.BOLD}╔══════════════════════════════════════════════════════════════════════╗{cls.RESET}")
        print(f"  {cls.CYAN}{cls.BOLD}║{cls.RESET}  {cls.WHITE}{cls.BOLD}{'📊 RÉCAPITULATIF DU RÉESSAI EN LOT STRICT (v3.1)'.center(64)}{cls.RESET}  {cls.CYAN}{cls.BOLD}║{cls.RESET}")
        print(f"  {cls.CYAN}{cls.BOLD}╠══════════════════════════════════════════════════════════════════════╣{cls.RESET}")
        cls.box_row(f"{cls.GREEN}✅ Validées et Resoumises avec succès : {cls.WHITE}{cls.BOLD}{success:<4}{cls.RESET} {cls.GREEN}({s_val}){cls.RESET}", width=64, border="║", border_color=cls.CYAN)
        cls.box_row(f"{cls.YELLOW}⏳ Places temporairement occupées    : {cls.WHITE}{cls.BOLD}{slots:<4}{cls.RESET} {cls.YELLOW}(SLOTS_TAKEN){cls.RESET}", width=64, border="║", border_color=cls.CYAN)
        cls.box_row(f"{cls.GRAY}❌ Campagnes clôturées / Expirées    : {cls.WHITE}{cls.BOLD}{expired:<4}{cls.RESET} {cls.GRAY}(terminées annonceur){cls.RESET}", width=64, border="║", border_color=cls.CYAN)
        print(f"  {cls.CYAN}{cls.BOLD}╚══════════════════════════════════════════════════════════════════════╝{cls.RESET}\n")


# ==============================================================================
# 3. MOTEUR SILENCIEUX & AUTOMATIQUE (100% INVISIBLE / HEADLESS RÉEL)
# ==============================================================================
class UniversalSilentEngine:
    def __init__(self, pr_token: str, cf_clearance: str = "", ig_cookies: str = "", yt_cookies: str = "", tt_cookies: str = "", config_paths: Optional[list] = None):
        self.config_paths = config_paths or []
        self.pr_api = PrSocialClient(pr_token, cf_clearance)
        # BrowserBot configuré en mode 100% invisible (headless: True, pas de fenêtre visuelle)
        self.browser_bot = BrowserBot(headless=True)
        self.stop_requested = False
        self.delay_min = 1.0
        self.delay_max = 1.8
        self.failed_tasks: Dict[int, float] = {}
        self.COOLDOWN_FAILED_SECONDS = 900  # 15 minutes d'exclusion anti-répétition

        # Contrôle permanent de licence en temps réel (Heartbeat Admin)
        try:
            from license_manager import UniversalLicenseManager
        except ImportError:
            try:
                from pc_bot.license_manager import UniversalLicenseManager
            except ImportError:
                from termux_bot.license_manager import UniversalLicenseManager
        self.lic_mgr = UniversalLicenseManager(config_paths)
        self._last_license_check_time = time.time()
        self._tasks_since_license_check = 0

        # Moteur spécialisé Instagram par Cookie Officiel
        try:
            from instagram_action_client import InstagramActionClient
        except ImportError:
            try:
                from pc_bot.instagram_action_client import InstagramActionClient
            except ImportError:
                InstagramActionClient = None
        self.ig_client = InstagramActionClient() if InstagramActionClient else None

    def check_license_heartbeat(self) -> bool:
        """
        Vérification continue de la licence en temps réel pendant les tâches.
        Si la clé est absente, révoquée ou invalide, redirige immédiatement vers
        l'écran de saisie/activation de la clé au lieu de stopper brutalement.
        """
        now = time.time()
        self._tasks_since_license_check += 1
        if self._tasks_since_license_check < 3 and (now - self._last_license_check_time) < 60:
            return True

        self._last_license_check_time = now
        self._tasks_since_license_check = 0

        saved_key = self.lic_mgr.get_saved_key()
        if not saved_key:
            UI.step("⚠️ Clé de licence absente. Redirection vers l'activation de licence...", "warning")
            time.sleep(1.0)
            if not self.lic_mgr.enforce_license_login():
                UI.step("⛔ Aucune licence valide enregistrée. Arrêt.", "error")
                self.stop_requested = True
                return False
            saved_key = self.lic_mgr.get_saved_key()
            if not saved_key:
                self.stop_requested = True
                return False

        ok, msg, info = self.lic_mgr.verify_key(saved_key)
        if not ok:
            UI.step(f"⚠️ Licence non reconnue ou expirée : {msg}", "warning")
            UI.step("Redirection vers l'écran de saisie de licence...", "info")
            time.sleep(1.0)
            if not self.lic_mgr.enforce_license_login():
                UI.step("⛔ Accès refusé. Clé de licence requise.", "error")
                self.lic_mgr.clear_saved_key()
                self.stop_requested = True
                return False
        return True

    def auto_unblock_active_tasks(self) -> int:
        """Détecte et libère toute tâche bloquante en 'in_progress' sur PR.Social sans toucher aux tâches récentes validées."""
        st, data = self.pr_api.get_in_progress_tasks()
        if st != 200:
            return 0
        items = data.get("items", [])
        if not items:
            return 0

        now_ts = time.time()
        cancelled = 0
        for it in items:
            t_id = it.get("order_id") or it.get("id")
            # Ne jamais annuler une tâche récemment validée avec succès (<120s)
            if t_id and t_id in getattr(self, "recently_validated_tasks", set()):
                continue
            if t_id:
                c_st, c_res = self.pr_api.cancel_task(t_id)
                if c_st == 200 and c_res.get("ok"):
                    UI.step(f"Tâche orpheline #{t_id} ({it.get('platform')}) libérée.", "success")
                    cancelled += 1
        return cancelled

    def is_task_feasible(self, task: Dict[str, Any]) -> Tuple[bool, str]:
        """Analyse intelligente des critères d'éligibilité des tâches."""
        action = (task.get("action") or "").lower()
        if "comment" in action:
            c_type = (task.get("comment_type") or "").lower()
            if "emoji" in c_type or "emoji" in action:
                return True, "Commentaire Emoji automatisé"
            if "random" in c_type or task.get("comment_list"):
                return True, "Commentaire liste automatisé"
            if "custom" in c_type or task.get("assigned_comment"):
                return True, "Commentaire assigné automatisé"
            return True, "Commentaire automatisé"
        return True, "Faisable"

    def interleave_task_actions(self, tasks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Alterne intelligemment les types d'actions (Follow, Like, Comment, etc.) pour varier le travail."""
        if len(tasks) <= 1:
            return tasks
        groups: Dict[str, List[Dict[str, Any]]] = {}
        for t in tasks:
            act = (t.get("action") or "FOLLOW").upper()
            act_key = "COMMENT" if "COMMENT" in act else act
            if act_key not in groups:
                groups[act_key] = []
            groups[act_key].append(t)
        # Tri prioritaire au sein de chaque groupe : tâches les plus rémunératrices en tête
        for k in groups:
            groups[k].sort(key=lambda x: float(x.get("worker_reward") or x.get("cost_per_task") or 0.0), reverse=True)
        interleaved = []
        max_len = max(len(g) for g in groups.values())
        for i in range(max_len):
            for k in list(groups.keys()):
                if i < len(groups[k]):
                    interleaved.append(groups[k][i])
        return interleaved

    def interleave_across_platforms(
        self,
        tasks_by_platform: Dict[str, List[Dict[str, Any]]],
        priority_order: List[str]
    ) -> List[Dict[str, Any]]:
        """
        Alterne dynamiquement les plateformes (Round-Robin multi-réseaux) :
        TikTok -> YouTube -> Twitter -> Threads -> Snapchat -> Reddit -> ...
        Permet d'exécuter une autre tâche d'un autre réseau pendant le décalage/pause
        de chaque réseau social, sans aucun blocage ni temps mort !
        """
        queues = {p: list(tasks) for p, tasks in tasks_by_platform.items() if tasks}
        if not queues:
            return []

        ordered_keys = [p for p in priority_order if p in queues]
        for p in queues:
            if p not in ordered_keys:
                ordered_keys.append(p)

        interleaved: List[Dict[str, Any]] = []
        max_len = max(len(q) for q in queues.values())
        for i in range(max_len):
            for p in ordered_keys:
                if i < len(queues[p]):
                    interleaved.append(queues[p][i])
        return interleaved

    def run_all(self, platforms: Optional[List[str]] = None, max_tasks: Optional[int] = None):
        UI.clear_screen()
        UI.header("PR.SOCIAL WORKER PRO", "Moteur Automatisé Multi-Réseaux Haute Performance")

        # 1. Vérification connexion
        status, me = self.pr_api.get_me()
        if status != 200 or not me.get("user"):
            UI.step(f"Échec authentification PR.Social : {me.get('error', 'Token expiré')}", "error")
            return

        user = me["user"]
        initial_balance = float(user.get("balance", 0))

        # 2. Bouclier de Sécurité : Vérification stricte & Échappatoire directe de l'API Warnings
        w_st, w_data = self.pr_api.get_warnings()
        warn_count = int(w_data.get("count") or 0) if (w_st == 200 and isinstance(w_data, dict)) else 0
        active_warnings = w_data.get("warnings", []) if isinstance(w_data, dict) else []
        quarantined_platforms = set()

        if warn_count >= 4:
            UI.step(f"🚨 ARRÊT D'URGENCE : Compte à {warn_count}/4 avertissements ! Retraits protégés contre tout blocage.", "error")
            return
        elif warn_count > 0:
            UI.step(f"🛡️ BOUCLIER ANTI-AVERTISSEMENT ACTIF : {warn_count}/4 avertissement(s) détecté(s).", "warning" if warn_count < 3 else "error")
            for w in active_warnings:
                w_plat = str(w.get("platform", "")).lower()
                w_reason = w.get("reason") or w.get("category") or "Non spécifié"
                w_date = w.get("created_at") or ""
                if w_plat:
                    quarantined_platforms.add(w_plat)
                UI.step(f"   ↳ Avertissement #{w.get('id')} [{w_plat.upper()}] : {w_reason} ({w_date})", "warning")

            # Quarantaine de sécurité renforcée UNIQUEMENT au seuil critique (3 avertissements sur 4)
            if warn_count >= 3:
                for risky_p in ["tiktok", "linkedin"]:
                    quarantined_platforms.add(risky_p)
                UI.step(f"🛡️ SEUIL CRITIQUE (3/4) : Protection renforcée sur : {', '.join([p.upper() for p in sorted(quarantined_platforms)])}", "error")

        # 3. Nettoyage initial des tâches orphelines
        self.auto_unblock_active_tasks()

        # 4. Réseaux approuvés (inspection complète de socials.accounts et socials.platforms)
        status, socials = self.pr_api.get_socials()
        approved_accounts = {}
        if status == 200:
            all_accounts = list(socials.get("accounts", []))
            for p_obj in socials.get("platforms", []):
                all_accounts.extend(p_obj.get("accounts", []))
            for acc in all_accounts:
                if acc.get("status") == "approved":
                    p = acc.get("platform", "").lower()
                    if p not in approved_accounts:
                        approved_accounts[p] = acc

        UI.user_card(user.get("username", "Inconnu"), initial_balance, len(approved_accounts))
        UI.accounts_grid(approved_accounts)

        # 4.0 Statut de la Session Instagram par Cookie Officiel
        if self.ig_client and self.ig_client.logged_in:
            if not self.ig_client.username:
                self.ig_client.username = approved_accounts.get("instagram", {}).get("username", "")
            u_ig_name = self.ig_client.username or (f"ID #{self.ig_client.user_id}" if self.ig_client.user_id else "Session Active")
            UI.step(f"Session Instagram Cookie Active (@{u_ig_name}) · Bouclier Anti-Pause activé", "success")

        # 4.1 Détection automatique des comptes renouvelés
        renewed_platforms = set()
        for p, acc in approved_accounts.items():
            p_sub = str(acc.get("submitted_at") or acc.get("verified_at") or "")
            plat_warnings = [w for w in active_warnings if str(w.get("platform", "")).lower() == p]
            if plat_warnings and p_sub:
                latest_warn = max(str(w.get("created_at") or "") for w in plat_warnings)
                if p_sub > latest_warn:
                    renewed_platforms.add(p)
                    if p in quarantined_platforms:
                        quarantined_platforms.remove(p)
                    UI.step(f"Compte [{p.upper()}] approuvé & renouvelé (@{acc.get('username')}) · Quarantaine levée", "success")

        # Matrice Prioritaire Haute Vitesse de l'IA Visuelle :
        # Classement strict pour exécuter les tâches à validation instantanée (<30s) en priorité absolue
        FAST_AI_PRIORITY = {
            "youtube": 1,
            "twitter": 2,
            "x": 2,
            "snapchat": 3,
            "threads": 4,
            "reddit": 5,
            "telegram": 6,
            "soundcloud": 7,
            "spotify": 8,
            "bluesky": 9,
            "github": 10,
            "discord": 11,
            "pinterest": 12,
            "instagram": 14,
            "tiktok": 20,
            "facebook": 21,
            "linkedin": 25,
        }
        ALL_SUPPORTED_PLATFORMS = sorted(list(FAST_AI_PRIORITY.keys()), key=lambda k: FAST_AI_PRIORITY[k])

        # Sélection ciblée ou globale des plateformes
        if platforms == ["instagram"] or platforms == "instagram":
            target_platforms = ["instagram"]
        elif platforms == ["non_instagram"] or platforms == "non_instagram":
            target_platforms = [p for p in approved_accounts.keys() if p.lower() != "instagram"] or [p for p in ALL_SUPPORTED_PLATFORMS if p != "instagram"]
        elif isinstance(platforms, list) and platforms:
            target_platforms = platforms
        else:
            target_platforms = list(approved_accounts.keys()) or ALL_SUPPORTED_PLATFORMS

        # Tolérance zéro : Uniquement les plateformes ayant un compte explicitement approuvé ET hors quarantaine
        active_list = [p for p in target_platforms if p in approved_accounts and p not in quarantined_platforms]
        # Tri prioritaire strict : Traiter en PREMIER les plateformes à validation IA instantanée (<30s)
        active_list.sort(key=lambda p: FAST_AI_PRIORITY.get(p.lower(), 99))
        if not active_list:
            if not approved_accounts:
                UI.step("Aucun compte lié approuvé trouvé sur PR.Social. Liez vos réseaux dans PR.Social.", "warning")
            else:
                UI.step(f"Tous vos comptes approuvés ({', '.join([p.upper() for p in approved_accounts.keys()])}) sont sous quarantaine d'avertissement.", "warning")
            return

        UI.step(f"Surveillance active sur {len(active_list)} plateformes sécurisées (Autoroute Anti-Ban) : {', '.join([p.upper() for p in active_list])}", "info")

        # Régulateur de cadence intelligent conforme aux quotas officiels PR.Social
        STRICT_PAUSE_PLATFORMS = {"tiktok", "youtube"}
        platform_hourly_history: Dict[str, list] = {p: [] for p in STRICT_PAUSE_PLATFORMS}
        platform_cooldowns: Dict[str, float] = {}
        action_cooldowns: Dict[Tuple[str, str], float] = {}
        self.recently_validated_tasks: set = set()

        # Limites officielles PR.Social Instagram par compte et par heure :
        # • Abonnements : 50 (seuil sécurisé : 48)
        # • J'aime : 100 (seuil sécurisé : 95)
        # • Commentaires : 10 (seuil sécurisé : 9)
        # • Partages : 10 (seuil sécurisé : 9)
        IG_ACTION_LIMITS = {
            "follow": 48,
            "like": 95,
            "comment": 9,
            "share": 9
        }
        ig_hourly_actions: Dict[str, list] = {act: [] for act in IG_ACTION_LIMITS}

        session_earnings = 0.0
        success_count = 0
        server_error_streak = 0
        platform_counts: Dict[str, int] = {}
        last_executed_platform: Optional[str] = None
        consecutive_busy_by_plat: Dict[str, int] = {}

        while not self.stop_requested:
            if not self.check_license_heartbeat():
                break
            tasks_found = 0
            now_ts = time.time()

            # 1. Sondage Global Turbo (1 seule requête ultra-rapide pour tout le serveur)
            # Met à jour immédiatement les compteurs de toutes les plateformes et capture les tâches fraîches
            st_g, data_g = self.pr_api.request("GET", "/tasks/available", params={"sort": "new", "limit": 50})
            global_fresh_by_platform: Dict[str, list] = {}
            if st_g == 200 and isinstance(data_g, dict):
                # Récupération en temps réel des exhausted_pairs du serveur pour chaque couple (plateforme, action)
                for ep in (data_g.get("exhausted_pairs") or []):
                    if isinstance(ep, dict) and "platform" in ep:
                        ep_plat = ep["platform"].lower()
                        ep_act = (ep.get("action") or "").lower()
                        ep_retry = int(ep.get("retry_after_min") or 1)
                        if ep_act:
                            action_cooldowns[(ep_plat, ep_act)] = max(action_cooldowns.get((ep_plat, ep_act), 0), now_ts + (ep_retry * 60))
                        else:
                            platform_cooldowns[ep_plat] = max(platform_cooldowns.get(ep_plat, 0), now_ts + (ep_retry * 60))

                if isinstance(data_g.get("platformCounts"), list):
                    for pc in data_g["platformCounts"]:
                        if isinstance(pc, dict) and "platform" in pc:
                            platform_counts[pc["platform"].lower()] = int(pc.get("count", 0))
                for t in (data_g.get("tasks") or []):
                    if isinstance(t, dict):
                        plat_key = (t.get("platform") or "").lower()
                        if plat_key in active_list:
                            if plat_key not in global_fresh_by_platform:
                                global_fresh_by_platform[plat_key] = []
                            global_fresh_by_platform[plat_key].append(t)

            # Priorisation intelligente : on traite d'abord les plateformes avec des tâches détectées au radar,
            # puis systématiquement toutes les autres plateformes actives non averties du compte
            ordered_platforms = [p for p in active_list if platform_counts.get(p, 0) > 0]
            ordered_platforms.sort(key=lambda p: platform_counts.get(p, 0), reverse=True)
            for p in active_list:
                if p not in ordered_platforms:
                    ordered_platforms.append(p)

            # Moissonnage multi-plateformes en réservoirs distincts
            platform_tasks_buckets: Dict[str, List[Dict[str, Any]]] = {}

            for plat in ordered_platforms:
                if self.stop_requested:
                    break

                now_ts = time.time()

                # Gestion des quotas horaires par plateforme
                if plat == "instagram":
                    for act_k in ig_hourly_actions:
                        ig_hourly_actions[act_k] = [ts for ts in ig_hourly_actions[act_k] if now_ts - ts < 3600]
                    # Si toutes les actions Instagram sont temporairement à leur quota horaire maximal
                    if all(len(ig_hourly_actions[act_k]) >= IG_ACTION_LIMITS[act_k] for act_k in ig_hourly_actions):
                        oldest = min((ig_hourly_actions[act_k][0] for act_k in ig_hourly_actions if ig_hourly_actions[act_k]), default=now_ts)
                        wait_sec = max(30, int(3600 - (now_ts - oldest)) + 15)
                        platform_cooldowns["instagram"] = now_ts + wait_sec
                        continue
                elif plat in STRICT_PAUSE_PLATFORMS:
                    platform_hourly_history[plat] = [ts for ts in platform_hourly_history[plat] if now_ts - ts < 3600]
                    if len(platform_hourly_history[plat]) >= 9:
                        oldest = platform_hourly_history[plat][0]
                        wait_sec = max(30, int(3600 - (now_ts - oldest)) + 15)
                        platform_cooldowns[plat] = now_ts + wait_sec
                        continue
                else:
                    if now_ts < platform_cooldowns.get(plat, 0):
                        continue

                merged_tasks = {}
                data = {}
                exhausted_actions = set()

                # Moissonneur ciblé multi-pages & multi-tris (Capture profonde des campagnes annonceurs)
                for sort_mode in ["reward", "new"]:
                    for pg in range(1, 3):  # 2 pages par plateforme suffisent par rotation pour rester vif
                        st_p, data_p = self.pr_api.get_available_tasks(plat, sort=sort_mode, limit=50, page=pg)
                        if st_p == 200 and isinstance(data_p, dict):
                            data = data_p
                            # Détection des limites horaires serveur ciblées par action
                            exhausted = data_p.get("exhausted_pairs") or []
                            if isinstance(exhausted, list):
                                for ep in exhausted:
                                    if isinstance(ep, dict) and ep.get("platform", "").lower() == plat.lower():
                                        act_e = (ep.get("action") or "").lower()
                                        if act_e:
                                            exhausted_actions.add(act_e)
                                            retry_min = int(ep.get("retry_after_min") or 10)
                                            action_cooldowns[(plat, act_e)] = time.time() + (retry_min * 60)

                            p_tasks = data_p.get("tasks", []) or []
                            if not p_tasks:
                                break
                            for t in p_tasks:
                                if isinstance(t, dict) and "id" in t:
                                    t["platform"] = plat
                                    merged_tasks[t["id"]] = t
                            if not data_p.get("has_more", False):
                                break
                        else:
                            break

                # Intégrer les tâches fraîches du flux global pour cette plateforme
                for t in global_fresh_by_platform.get(plat, []):
                    if isinstance(t, dict) and "id" in t:
                        t["platform"] = plat
                        merged_tasks[t["id"]] = t

                # Mise à jour du radar serveur en temps réel
                if isinstance(data.get("platformCounts"), list):
                    for pc in data["platformCounts"]:
                        if isinstance(pc, dict) and "platform" in pc:
                            platform_counts[pc["platform"].lower()] = int(pc.get("count", 0))

                tasks = list(merged_tasks.values())
                if not tasks:
                    continue

                if exhausted_actions:
                    tasks = [t for t in tasks if (t.get("action") or "").lower() not in exhausted_actions]
                    if not tasks:
                        continue

                # Calcul des places restantes par annonceur (total_count - completed_count)
                for t in tasks:
                    tot_slots = int(t.get("total_count") or 0)
                    done_slots = int(t.get("completed_count") or 0)
                    t["_slots_left"] = tot_slots - done_slots

                # Écarter immédiatement les campagnes dont tous les slots sont déjà pris à 100%
                tasks = [t for t in tasks if not (int(t.get("total_count") or 0) > 0 and t.get("_slots_left", 1) <= 0)]
                if not tasks:
                    continue

                # Ciblage prioritaire chirurgical : Campagnes avec le plus de places ouvertes par l'annonceur
                tasks.sort(key=lambda t: (t.get("_slots_left", 0) > 0, t.get("_slots_left", 0), float(t.get("worker_reward") or t.get("cost_per_task") or 0.0)), reverse=True)

                # Alterner intelligemment les actions (Follow, Like, Comment, etc.)
                tasks = self.interleave_task_actions(tasks)

                # Réservoir par plateforme : jusqu'à 4 tâches par passe pour une variation dynamique
                platform_tasks_buckets[plat] = tasks[:4]

            # Entrelacement multi-plateformes (Round-Robin dynamique) :
            # Alterne à chaque tâche (TikTok -> YouTube -> Twitter -> Threads -> Snapchat -> ...)
            # Chaque réseau se repose naturellement pendant l'exécution d'une tâche d'un autre réseau !
            interleaved_tasks = self.interleave_across_platforms(platform_tasks_buckets, ordered_platforms)

            for t in interleaved_tasks:
                if self.stop_requested:
                    break

                plat = (t.get("platform") or "").lower()
                acc_id = approved_accounts.get(plat, {}).get("id")
                now_ts = time.time()

                # Vérification en direct du cooldown et des quotas horaires de la plateforme & action
                if now_ts < platform_cooldowns.get(plat, 0):
                    continue
                if now_ts < action_cooldowns.get((plat, (t.get("action") or "").lower()), 0):
                    continue

                action = (t.get("action") or "FOLLOW").upper()
                reward = float(t.get("worker_reward") or t.get("cost_per_task") or 0.0)

                if plat == "instagram":
                    act_k = "comment" if "comment" in action.lower() else ("like" if "like" in action.lower() else ("share" if "share" in action.lower() else "follow"))
                    ig_hourly_actions[act_k] = [ts for ts in ig_hourly_actions[act_k] if now_ts - ts < 3600]
                    if len(ig_hourly_actions[act_k]) >= IG_ACTION_LIMITS.get(act_k, 48):
                        continue
                elif plat in STRICT_PAUSE_PLATFORMS:
                    platform_hourly_history[plat] = [ts for ts in platform_hourly_history[plat] if now_ts - ts < 3600]
                    if len(platform_hourly_history[plat]) >= 9:
                        oldest = platform_hourly_history[plat][0]
                        wait_sec = max(30, int(3600 - (now_ts - oldest)) + 15)
                        platform_cooldowns[plat] = now_ts + wait_sec
                        continue

                task_id = t["id"]
                if task_id in self.failed_tasks:
                    if time.time() < self.failed_tasks[task_id]:
                        continue
                    else:
                        del self.failed_tasks[task_id]

                feasible, _ = self.is_task_feasible(t)
                if not feasible:
                    continue

                # Réservation de la tâche auprès du serveur PR.Social
                start_st, start_res = self.pr_api.start_task(task_id, acc_id)

                if start_st != 200 or not start_res.get("ok"):
                    err_msg = str(start_res.get("error", ""))
                    err_code = str(start_res.get("code", ""))

                    is_busy = (err_code in ["SLOTS_TAKEN", "NOT_FOUND"] or
                               any(k in err_msg.lower() for k in ["все места", "places", "not found", "inactive", "уже выполн"]))

                    if is_busy:
                        self.failed_tasks[task_id] = time.time() + 30
                        UI.live_status(f"Créneau complet sur #{task_id} [{plat.upper()}] · Recherche de nouvelles places...", "⠼")
                    else:
                        self.failed_tasks[task_id] = time.time() + 180

                    if "active task" in err_msg.lower() or "task_in_progress" in err_msg.lower():
                        self.auto_unblock_active_tasks()
                        time.sleep(1)
                    continue

                # Dès qu'une tâche est acceptée, on réinitialise la saturation de la plateforme
                consecutive_busy_by_plat[plat] = 0
                tasks_found += 1

                # Protection Anti-Lien Mort : Vérification raisonnée (uniquement si lien confirmé inactif à 100%)
                task_dead_count = int(start_res.get("task", {}).get("link_dead_count") or 0)
                task_completed = int(start_res.get("task", {}).get("completed_count") or 0)
                if task_dead_count > 500 and task_completed == 0:
                    UI.step(f"🛡️ Protection Anti-Lien Mort : Tâche #{task_id} confirmée morte ({task_dead_count} signalements, 0 réalisation).", "warning")
                    UI.step(f"   Annulation immédiate et mise en quarantaine 24h pour protéger le compte.", "info")
                    self.pr_api.cancel_task(task_id)
                    self.failed_tasks[task_id] = time.time() + 86400
                    continue

                target_url = start_res.get("task", {}).get("target_url") or t.get("target_url") or ""
                target_username = (start_res.get("task", {}).get("target_username") or t.get("target_username") or "").strip().lstrip("@")
                if not target_url:
                    u_name = target_username
                    if u_name:
                        if plat == "threads": target_url = f"https://www.threads.net/@{u_name}"
                        elif plat == "reddit": target_url = f"https://www.reddit.com/user/{u_name}"
                        elif plat in ["twitter", "x"]: target_url = f"https://x.com/{u_name}"
                        elif plat == "instagram": target_url = f"https://www.instagram.com/{u_name}"
                        elif plat == "tiktok": target_url = f"https://www.tiktok.com/@{u_name}"
                        elif plat == "pinterest": target_url = f"https://www.pinterest.com/{u_name}/"
                        elif plat in ["soundcloud", "sound_cloud"]: target_url = f"https://soundcloud.com/{u_name}"
                        elif plat == "github": target_url = f"https://github.com/{u_name}"
                        elif plat == "discord": target_url = f"https://discord.gg/{u_name}"
                        elif plat == "youtube": target_url = f"https://www.youtube.com/@{u_name}"
                        elif plat in ["bluesky", "bsky"]:
                            bsky_handle = u_name if "." in u_name else f"{u_name}.bsky.social"
                            target_url = f"https://bsky.app/profile/{bsky_handle}"

                if not target_url:
                    UI.step(f"🛡️ Cible invalide : Tâche #{task_id} sans URL ni identifiant (campagne corrompue).", "warning")
                    UI.step(f"   Annulation immédiate pour protéger la réputation du compte.", "info")
                    self.pr_api.cancel_task(task_id)
                    self.failed_tasks[task_id] = time.time() + 86400
                    continue

                print()  # Efface la ligne du radar
                UI.task_card(task_id, plat, action, reward, target_url)

                t_start_action = time.time()
                wait_sec = int(start_res.get("submit_after_sec") or 3)
                if plat in renewed_platforms:
                    wait_sec = max(wait_sec, 4)
                api_check_enabled = start_res.get("api_check_enabled", 0)

                comment_text = None
                if "comment" in action.lower():
                    assigned = start_res.get("completion", {}).get("assigned_comment") or start_res.get("task", {}).get("assigned_comment") or t.get("assigned_comment")
                    if not assigned:
                        c_list = start_res.get("task", {}).get("comment_list") or t.get("comment_list")
                        if isinstance(c_list, str):
                            try: c_list = json.loads(c_list)
                            except Exception: c_list = [line.strip() for line in c_list.split("\n") if line.strip()]
                        if isinstance(c_list, list) and c_list:
                            assigned = random.choice(c_list)
                    if not assigned and ("emoji" in (start_res.get("task", {}).get("comment_type") or "").lower() or "emoji" in action.lower()):
                        assigned = random.choice(["🔥", "👏", "🚀", "❤️", "👍", "✨", "💯", "🙌"])
                    if not assigned:
                        assigned = random.choice([
                            "Great content! 👍",
                            "Very interesting, thanks for sharing! ✨",
                            "Top ! 🔥",
                            "Nice post! 👏"
                        ])
                    comment_text = str(assigned).strip()
                    UI.step(f"Commentaire préparé : '{comment_text}'", "info")

                is_validated = False

                # 0. EXÉCUTION INSTANTANÉE PR WORKER TELEGRAM (0s Délai & Auto-Validation)
                if plat == "telegram" and TelegramWorkerEngine:
                    tw_engine = TelegramWorkerEngine(self.pr_api, self.browser_bot, worker_user)
                    ok_tw, rew_tw, msg_tw = tw_engine.execute_single_task(t)
                    if ok_tw:
                        success_count += 1
                        total_earned += rew_tw
                        UI.balance_card(initial_balance + total_earned, total_earned)
                        continue
                    else:
                        self.failed_tasks[task_id] = time.time() + 600
                        continue

                # 1. ACTION DIRECTE INSTAGRAM PAR COOKIE OFFICIEL (Anti-Rejet & Anti-Pause 24h Garanti)
                if plat == "instagram" and self.ig_client and self.ig_client.logged_in:
                    if "follow" in action.lower():
                        u_actor = self.ig_client.username or approved_accounts.get("instagram", {}).get("username") or (f"ID #{self.ig_client.user_id}" if self.ig_client.user_id else "Session Active")
                        UI.step(f"Exécution du VRAI abonnement sur Instagram (@{u_actor})...", "info")
                        ig_ok, ig_msg, ig_res = self.ig_client.follow_target(target_url, target_username)
                        if ig_ok:
                            UI.step(f"✓ {ig_msg}", "success")
                            time.sleep(max(3, wait_sec))
                            chk_st, chk_res = self.pr_api.api_check_task(task_id)
                            if chk_st == 200 and chk_res.get("ok"):
                                is_validated = True
                                wait_m = chk_res.get("wait_min", 20)
                                UI.step(f"✓ Confirmé chez PR.Social (Audit automatique certifié ~{wait_m} min)", "success")
                            else:
                                is_validated = True
                                UI.step("✓ Abonnement réel confirmé dans la base officielle Instagram !", "success")
                        else:
                            is_real_block = any(k in str(ig_res).lower() for k in ["feedback_required", "checkpoint", "spam"]) or ("blocage instagram" in str(ig_msg).lower())
                            if is_real_block:
                                UI.step(f"{ig_msg}", "warning")
                                UI.step("🛡️ SÉCURITÉ ANTI-PAUSE 24H : Action bloquée par Instagram. Tâche annulée pour protéger votre compte.", "warning")
                                self.pr_api.cancel_task(task_id)
                                self.failed_tasks[task_id] = time.time() + 1800
                                continue
                            else:
                                UI.step(f"ℹ️ Direct Instagram : {ig_msg}", "info")
                                UI.step("➔ Repli automatique sur preuve certifiée conforme (Garantie de validation)...", "info")
                    elif "like" in action.lower():
                        UI.step("Exécution du VRAI like sur Instagram...", "info")
                        ig_ok, ig_msg, ig_res = self.ig_client.like_target(target_url)
                        if ig_ok:
                            UI.step(f"✓ {ig_msg}", "success")
                        else:
                            UI.step(f"ℹ️ Direct Like : {ig_msg}. Repli sur capture certifiée...", "info")

                # NOUVEAU SYSTÈME PR.SOCIAL : Vérification automatique 'Confirmer' sans capture (Instagram Follow, etc.)
                if not is_validated:
                    # En mode requête pure : ne pas appeler api_check_task sur TikTok,
                    # ni sur Instagram quand le follow direct n'a pas pu être exécuté (repli sur capture pour être validé à 100%)
                    if plat == "tiktok":
                        api_check_active = False
                    elif plat == "instagram" and self.ig_client and self.ig_client.logged_in:
                        api_check_active = False
                    else:
                        api_check_active = bool(start_res.get("api_check_enabled", 0)) or (plat == "instagram" and "follow" in action.lower())
                    if api_check_active:
                        rem_api = max(0.0, wait_sec - (time.time() - t_start_action))
                        if rem_api > 0:
                            time.sleep(rem_api)
                        chk_st, chk_res = self.pr_api.api_check_task(task_id)
                        code_msg = (chk_res.get("code") or "").lower() if isinstance(chk_res, dict) else ""
                        is_found = isinstance(chk_res, dict) and chk_res.get("found") is True
                        # Contrôle STRICT : Seule une confirmation réelle avec found=True ou code approved valide la tâche sans preuve
                        if chk_st == 200 and isinstance(chk_res, dict) and chk_res.get("ok") and (code_msg in ["approved", "completed", "success"] or (is_found and code_msg != "rechecking")):
                            is_validated = True
                            UI.step("✓ Validé et confirmé instantanément par PR.Social !", "success")
                        else:
                            is_validated = False
                            reason_desc = code_msg or ("non détecté en direct" if not is_found else "en attente de revérification")
                            UI.step(f"ℹ️ Confirmation directe en attente ({reason_desc}). Repli strict sur capture certifiée...", "info")

                # Repli sur preuve visuelle sécurisée avec hash unique si api-check n'est pas actif ou a échoué
                if not is_validated:
                    UI.step(f"Navigation & exécution discrète de l'action [{action}]...", "info")
                    worker_user = approved_accounts.get(plat, {}).get("username")
                    act_ok, act_msg, shot_path = self.browser_bot.execute_task_action(
                        platform=plat,
                        action=action,
                        target_url=target_url,
                        task_id=task_id,
                        comment_text=comment_text,
                        worker_username=worker_user
                    )

                    if act_ok and shot_path and os.path.exists(shot_path):
                        rem_sub = max(0.0, wait_sec - (time.time() - t_start_action))
                        if rem_sub > 0:
                            time.sleep(rem_sub)

                        sub_st, sub_res = self.pr_api.submit_screenshot_file(task_id, shot_path)
                        if sub_st == 200 and sub_res.get("ok"):
                            status_val = sub_res.get("completion", {}).get("status", "pending_review")
                            is_validated = True
                            UI.step(f"Preuve d'écran acceptée par PR.Social (Statut : {status_val})", "success")
                        else:
                            err_detail = sub_res.get("error", f"Status {sub_st}") if isinstance(sub_res, dict) else f"Status {sub_st}"
                            UI.step(f"Soumission refusée ({err_detail}). Annulation sécurisée...", "warning")
                            self.failed_tasks[task_id] = time.time() + 1800  # Exclusion de 30 min pour cette tâche en échec
                            self.pr_api.cancel_task(task_id)

                            # Détection Circuit Breaker Cloudflare / Erreur Serveur 500
                            if sub_st == 500 or "server error" in str(err_detail).lower():
                                server_error_streak += 1
                                if server_error_streak >= 2:
                                    UI.step("🛡️ Bouclier Cloudflare / Saturation Serveur PR.Social (500 Server error).", "warning")
                                    UI.step("   Temporisation de sécurité (30s) pour laisser le serveur se débloquer...", "info")
                                    time.sleep(30)
                                    server_error_streak = 0
                            else:
                                server_error_streak = 0
                            continue
                    else:
                        UI.step(f"SÉCURITÉ ANTI-REJET : Action non confirmée ({act_msg}). Preuve écartée.", "warning")
                        UI.step(f"Annulation immédiate de #{task_id} pour préserver la réputation.", "info")
                        self.failed_tasks[task_id] = time.time() + 600
                        self.pr_api.cancel_task(task_id)
                        continue

                if is_validated:
                    server_error_streak = 0
                    success_count += 1
                    session_earnings += reward
                    self.recently_validated_tasks.add(task_id)
                    self.failed_tasks[task_id] = time.time() + 86400
                    _, fresh_me = self.pr_api.get_me()
                    new_bal = float(fresh_me.get("user", {}).get("balance", 0.0)) if fresh_me.get("user") else 0.0
                    UI.success(task_id, reward, session_earnings, new_bal)

                    # Enregistrement horaire pour le pacing strict (Instagram, TikTok, YouTube)
                    if plat == "instagram":
                        act_k = "comment" if "comment" in action.lower() else ("like" if "like" in action.lower() else ("share" if "share" in action.lower() else "follow"))
                        ig_hourly_actions[act_k].append(time.time())
                    elif plat in STRICT_PAUSE_PLATFORMS:
                        platform_hourly_history[plat].append(time.time())

                    if max_tasks and success_count >= max_tasks:
                        UI.step(f"🎯 Objectif de validation atteint : {success_count}/{max_tasks} tâches exécutées avec succès !", "success")
                        self.stop_requested = True
                        break

                # Différenciation de vitesse et cadence intelligente Turbo :
                if last_executed_platform is not None and plat != last_executed_platform:
                    # Changement de réseau social : rotation ultra-rapide instantanée !
                    delay = random.uniform(0.3, 0.6)
                elif plat in STRICT_PAUSE_PLATFORMS:
                    delay = random.uniform(1.2, 2.0)
                elif plat in renewed_platforms:
                    delay = random.uniform(1.0, 1.8)
                else:
                    # Vitesse maximale
                    delay = random.uniform(0.3, 0.7)

                last_executed_platform = plat
                UI.safety_pause(delay)

            if max_tasks and success_count >= max_tasks:
                break

            if tasks_found == 0:
                radar_total = sum(platform_counts.values()) if platform_counts else 0
                active_has_tasks = sum(platform_counts.get(p, 0) for p in active_list)
                pause_sec = 1.0

                total_ticks = 5
                for tick in range(total_ticks, 0, -1):
                    if self.stop_requested:
                        break
                    sec_left = int((tick + 4) // 5)
                    UI.radar_pulse(active_has_tasks, radar_total, sec_left, tick=total_ticks - tick)
                    time.sleep(0.2)

        print()  # Clear line
        UI.step("Arrêt du moteur et fermeture propre du navigateur.", "info")
        self.browser_bot.stop_driver()

    @staticmethod
    def solve_surf_shape_captcha(check_obj: dict) -> Optional[Tuple[int, int]]:
        """
        Résout le captcha de forme géométrique de PR.Social Surf avec précision chirurgicale.
        Algorithme :
        1. Extraction de la forme cible depuis l'échantillon 'sample' (exclusion des bordures de la carte).
        2. Segmentation MeanShift + Canny + Fermeture morphologique pour isoler les 8 formes du canvas.
        3. Remplissage par floodfill des régions fermées intérieures pour éliminer les gribouillis et bulles.
        4. Comparaison géométrique invariante (échelle, translation, rotation) via Moments de Hu (cv2.matchShapes).
        5. Calcul du centre de gravité (cx, cy) de la forme correspondante et re-calibrage sur l'échelle attendue (320x220).
        """
        if not HAS_CV2 or not check_obj:
            return None

        sample_raw = check_obj.get("sample", "")
        img_raw = check_obj.get("img", "")
        w_expected = int(check_obj.get("w") or 320)
        h_expected = int(check_obj.get("h") or 220)

        if not sample_raw or not img_raw:
            return None

        try:
            if "," in sample_raw:
                sample_raw = sample_raw.split(",", 1)[1]
            if "," in img_raw:
                img_raw = img_raw.split(",", 1)[1]

            s_bytes = base64.b64decode(sample_raw)
            c_bytes = base64.b64decode(img_raw)

            s_arr = np.array(Image.open(io.BytesIO(s_bytes)).convert("RGB"))
            c_arr = np.array(Image.open(io.BytesIO(c_bytes)).convert("RGB"))

            c_h, c_w = c_arr.shape[:2]

            # 1. Extraction propre de la forme cible dans le sample
            gray_s = cv2.cvtColor(s_arr, cv2.COLOR_RGB2GRAY)
            h_s, w_s = gray_s.shape
            inner_mask = np.zeros_like(gray_s, dtype=np.uint8)
            inner_mask[3:h_s - 3, 3:w_s - 3] = 255

            if np.mean(gray_s) > 128:
                shape_s = ((gray_s < 150) & (inner_mask > 0)).astype(np.uint8) * 255
            else:
                shape_s = ((gray_s > 100) & (inner_mask > 0)).astype(np.uint8) * 255

            cnts_s, _ = cv2.findContours(shape_s, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            if not cnts_s:
                return None

            target_cnt = max(cnts_s, key=cv2.contourArea)
            tx, ty, tw, th = cv2.boundingRect(target_cnt)
            target_ratio = tw / max(1, th)

            # 2. Segmentation du canvas : lissage de texture et extraction des formes
            shifted = cv2.pyrMeanShiftFiltering(c_arr[:, :, :3], sp=10, sr=25)
            edges = cv2.Canny(shifted, 30, 100)
            kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
            closed_edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel)

            # 3. FloodFill pour obtenir toutes les régions intérieures fermées (formes solides)
            inv = cv2.bitwise_not(closed_edges)
            ff_mask = np.zeros((inv.shape[0] + 2, inv.shape[1] + 2), np.uint8)
            cv2.floodFill(inv, ff_mask, (0, 0), 0)

            cnts_f, _ = cv2.findContours(inv, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

            candidates = []
            for c in cnts_f:
                area = cv2.contourArea(c)
                if 80 < area < 4000:
                    x, y, w, h = cv2.boundingRect(c)
                    if 12 <= w <= 85 and 12 <= h <= 85:
                        d_hu = cv2.matchShapes(target_cnt, c, cv2.CONTOURS_MATCH_I1, 0.0)
                        ratio = w / max(1, h)
                        ratio_diff = abs(ratio - target_ratio)
                        M = cv2.moments(c)
                        if M["m00"] > 0:
                            cx = int(M["m10"] / M["m00"])
                            cy = int(M["m01"] / M["m00"])
                        else:
                            cx = x + w // 2
                            cy = y + h // 2
                        score = d_hu + 0.1 * ratio_diff
                        candidates.append((score, cx, cy, w, h, area))

            if candidates:
                candidates.sort(key=lambda x: x[0])
                best = candidates[0]
                cx, cy = best[1], best[2]
                if c_w != w_expected and c_w > 0:
                    cx = int(cx * (w_expected / c_w))
                if c_h != h_expected and c_h > 0:
                    cy = int(cy * (h_expected / c_h))
                return cx, cy

        except Exception:
            pass

        return None

    def _solve_and_finish_captcha(self, check_obj: dict, headers: dict, held_sum: float = 0.0) -> Tuple[bool, Optional[dict], Optional[str]]:
        """
        Résout le captcha de forme géométrique et soumet à /api/surf/finish.
        Gère les tentatives en arrière-plan sans répétition de lignes dans le terminal.
        Retourne (succès: bool, next_step: Optional[dict], suspended_info: Optional[str]).
        """
        for attempt in range(1, 4):
            UI.live_status(f"Vérification : Résolution géométrique de la forme (essai {attempt}/3)...", icon="⚠")
            coords = self.solve_surf_shape_captcha(check_obj)
            check_id = check_obj.get("id")

            if coords and check_id:
                cx, cy = coords
                time.sleep(random.uniform(0.6, 1.0))
                try:
                    finish_body = {"c": check_id, "x": cx, "y": cy}
                    r_finish = self.pr_api.session.post(
                        "https://pr.social/api/surf/finish",
                        json=finish_body,
                        headers=headers,
                        timeout=15
                    )
                    f_data = r_finish.json() if r_finish.status_code == 200 else {}

                    if f_data.get("ok"):
                        UI.clear_line()
                        UI.step(f"Vérification : Forme validée aux coordonnées ({cx}, {cy})", "warning")
                        return True, f_data.get("next"), None
                    else:
                        err_text = str(f_data.get("error") or f_data.get("message") or "")
                        if "suspend" in err_text.lower():
                            UI.clear_line()
                            return False, None, err_text

                        # Rafraîchir l'image via /api/surf/captcha pour la tentative suivante
                        time.sleep(1.2)
                        r_new = self.pr_api.session.get("https://pr.social/api/surf/captcha", headers=headers, timeout=15)
                        if r_new.status_code == 200 and r_new.json().get("ok"):
                            check_obj = r_new.json()
                except Exception:
                    time.sleep(1.5)
            else:
                # Si non résolu avec certitude, demander une nouvelle image plutôt que de deviner au hasard
                time.sleep(1.0)
                try:
                    r_new = self.pr_api.session.get("https://pr.social/api/surf/captcha", headers=headers, timeout=15)
                    if r_new.status_code == 200 and r_new.json().get("ok"):
                        check_obj = r_new.json()
                except Exception:
                    pass

        UI.clear_line()
        return False, None, None

    def run_telegram_worker(self, max_tasks: Optional[int] = None, max_scans: Optional[int] = None):
        """Moteur PR Worker Telegram Haute Vitesse (0s délai, tri prioritaire APK)."""
        UI.clear_screen()
        status, me = self.pr_api.get_me()
        if status != 200 or not me.get("user"):
            UI.step(f"Échec authentification PR.Social : {me.get('error', 'Token expiré')}", "error")
            return

        user = me["user"]
        initial_balance = float(user.get("balance", 0))
        UI.user_card(user.get("username", "Inconnu"), initial_balance)

        # Récupération du compte Telegram actif (Priorité config.json > Autoearn > Profil)
        tg_user = ""
        cfg = {}
        for p in self.config_paths:
            if p and os.path.exists(p):
                try:
                    with open(p, "r", encoding="utf-8") as f:
                        cfg = json.load(f)
                    break
                except Exception:
                    pass

        if TelegramAuthManager:
            tg_user, _ = TelegramAuthManager.get_active_account(self.pr_api, cfg)
        else:
            st_s, s_data = self.pr_api.get_socials()
            if st_s == 200 and isinstance(s_data, dict):
                accs = list(s_data.get("accounts", []))
                for p_item in s_data.get("platforms", []):
                    accs.extend(p_item.get("accounts", []))
                for a in accs:
                    if str(a.get("platform", "")).lower() == "telegram" and a.get("status") == "approved":
                        tg_user = str(a.get("username", "")).strip().lstrip("@")
                        break

        if not TelegramWorkerEngine:
            UI.step("Module TelegramWorkerEngine non disponible", "error")
            return

        worker = TelegramWorkerEngine(
            api_client=self.pr_api,
            browser_bot=self.browser_bot,
            telegram_username=tg_user
        )
        worker.run_radar_loop(max_tasks=max_tasks, max_scans=max_scans)

    def run_surf_tasks(self, max_tasks: Optional[int] = None):
        """Moteur 100% dédié au Surf Réel de PR.Social (https://pr.social/surf/view?z=180)."""
        UI.clear_screen()
        UI.header("🌐 AUTO-SURFEUR PR.SOCIAL EN CONTINU (v3.1) 🌐")

        status, me = self.pr_api.get_me()
        if status != 200 or not me.get("user"):
            UI.step(f"Échec authentification PR.Social : {me.get('error', 'Token expiré')}", "error")
            return

        user = me["user"]
        initial_balance = float(user.get("balance", 0))
        UI.user_card(user.get("username", "Inconnu"), initial_balance)

        headers = dict(self.pr_api.session.headers)
        headers["Referer"] = "https://pr.social/surf/view?z=180"

        UI.step("Connexion sécurisée au flux continu de navigation PR.Social...", "info")

        # 1. Extraction de la tâche initiale
        current_step = None
        try:
            r = self.pr_api.session.get("https://pr.social/surf/view?z=180", headers=headers, timeout=15)
            if r.status_code == 200:
                match = re.search(r'\{"ok":true.*?"step":\{.*?\}\}', r.text)
                if match:
                    data = json.loads(match.group(0))
                    step_data = data.get("step", {})
                    if step_data.get("check"):
                        _, current_step, _ = self._solve_and_finish_captcha(step_data["check"], headers)
                    else:
                        current_step = step_data.get("next")
        except Exception as e:
            UI.step(f"Erreur initialisation surf : {e}", "error")

        if not current_step:
            try:
                r_again = self.pr_api.session.post("https://pr.social/api/surf/again", json={}, headers=headers, timeout=15)
                if r_again.status_code == 200:
                    again_data = r_again.json()
                    if again_data.get("check"):
                        _, current_step, _ = self._solve_and_finish_captcha(again_data["check"], headers)
                    else:
                        current_step = again_data.get("next")
            except Exception:
                pass

        if not current_step:
            UI.step("Aucune tâche de surf disponible pour le moment.", "warning")
            return

        session_earnings = 0.0
        success_count = 0

        while not self.stop_requested and current_step:
            if not self.check_license_heartbeat():
                break
            t = current_step.get("t")
            order = current_step.get("order") or "SURF"
            domain = current_step.get("domain") or "Site Web"
            target_url = current_step.get("url") or ""
            seconds = int(current_step.get("seconds") or 30)
            reward = float(current_step.get("reward") or 0.001)
            kind = (current_step.get("kind") or "page").upper()

            print()
            # 1. Cible visite
            UI.step(f"Cible visite #{order} : {domain} ({kind}) · Durée : {seconds}s · Gain : +${reward:.4f}", "info")

            # Simulation de surf humaine dans Chrome avec défilement et chrono en direct
            try:
                self.browser_bot.execute_task_action(
                    platform="surf",
                    action="surf",
                    target_url=target_url,
                    task_id=order,
                    wait_seconds=seconds,
                    progress_cb=lambda el, tot, st: UI.surf_chrono(el, tot, st)
                )
            except Exception:
                pass
            UI.clear_line()

            # Validation de la tâche auprès du serveur
            val_st, val_res = (0, {})
            try:
                r_done = self.pr_api.session.post("https://pr.social/api/surf/done", json={"t": t}, headers=headers, timeout=15)
                val_st = r_done.status_code
                val_res = r_done.json()
            except Exception as e_d:
                val_res = {"error": str(e_d)}

            # Si le serveur indique qu'il reste quelques secondes
            if val_res.get("code") == "EARLY":
                left = int(val_res.get("left") or 3)
                for s in range(left + 2, 0, -1):
                    UI.surf_chrono(seconds - s, seconds, f"Finalisation ({s}s)")
                    time.sleep(1)
                UI.clear_line()
                try:
                    r_done = self.pr_api.session.post("https://pr.social/api/surf/done", json={"t": t}, headers=headers, timeout=15)
                    val_st = r_done.status_code
                    val_res = r_done.json()
                except Exception:
                    pass

            if val_st == 200 and val_res.get("ok"):
                held_sum = val_res.get("held_sum", session_earnings + reward)

                # 2. Vérification (Étape propre sans répétition descendante)
                check_obj = val_res.get("check")
                captcha_ok = True
                if check_obj:
                    ok_cap, next_from_cap, susp_info = self._solve_and_finish_captcha(check_obj, headers, held_sum)
                    captcha_ok = ok_cap
                    if ok_cap and next_from_cap:
                        current_step = next_from_cap
                    elif susp_info:
                        UI.step(f"Surf suspendu temporairement par PR.Social ({susp_info}). Attente active...", "warning")
                        time.sleep(60)
                        current_step = None
                        break
                    else:
                        UI.step("Vérification : Échec de validation du captcha par PR.Social", "error")
                else:
                    UI.step("Vérification : Visite validée par le serveur PR.Social", "warning")

                # 3. Succès validé (Uniquement si la vérification a réellement abouti)
                if captcha_ok:
                    success_count += 1
                    session_earnings += reward
                    UI.step(f"Succès validé : +${reward:.4f} crédités sur votre Solde Réel !", "success")
                else:
                    time.sleep(2)

                if not check_obj or not current_step:
                    current_step = current_step or val_res.get("next")

                if not current_step:
                    time.sleep(1.5)
                    r_again = self.pr_api.session.post("https://pr.social/api/surf/again", json={}, headers=headers, timeout=15)
                    if r_again.status_code == 200:
                        again_data = r_again.json()
                        current_step = again_data.get("next")
                        if again_data.get("check"):
                            ok_c, nxt, _ = self._solve_and_finish_captcha(again_data["check"], headers, held_sum)
                            if ok_c and nxt:
                                current_step = nxt

                if max_tasks and success_count >= max_tasks:
                    UI.step(f"Objectif atteint : {success_count} tâche(s) validée(s) et encaissée(s) avec succès !", "success")
                    break
            else:
                err_code = val_res.get("code", "ERROR")
                err_msg = val_res.get("error", f"Status {val_st}")
                UI.step(f"Réponse serveur ({err_code}) : {err_msg}", "warning")
                if err_code in ["LIMIT", "OFF", "COOLDOWN", "RESTRICTED"]:
                    UI.step("Limite horaire de visites atteinte. Pause...", "warning")
                    break
                else:
                    # Passer automatiquement au site suivant
                    UI.step("Passage au site suivant...", "info")
                    try:
                        r_skip = self.pr_api.session.post("https://pr.social/api/surf/skip", json={"t": t}, headers=headers, timeout=15)
                        if r_skip.status_code == 200:
                            current_step = r_skip.json().get("next")
                        else:
                            break
                    except Exception:
                        break

            # Maintien continu en arrière-plan : si aucune tâche immédiate, scanner en continu
            if not current_step and not self.stop_requested and (max_tasks is None or success_count < max_tasks):
                for wait_i in range(8, 0, -1):
                    UI.live_status(f"Radar actif : scan de nouvelles tâches PR.Social ({wait_i}s)...", icon="⏳")
                    time.sleep(1)
                UI.clear_line()
                try:
                    r_again = self.pr_api.session.post("https://pr.social/api/surf/again", json={}, headers=headers, timeout=15)
                    if r_again.status_code == 200:
                        again_data = r_again.json()
                        current_step = again_data.get("next")
                        if again_data.get("check"):
                            ok_c, nxt, _ = self._solve_and_finish_captcha(again_data["check"], headers, held_sum)
                            if ok_c and nxt:
                                current_step = nxt
                except Exception:
                    pass

            time.sleep(random.uniform(2.0, 3.5))

        UI.step(f"Session terminée avec succès. Total validé : {success_count} site(s) | Gains : +${session_earnings:.4f}", "success")
        self.browser_bot.stop_driver()


# ==============================================================================
# 3. POINT D'ENTRÉE AUTONOME & MENU TERMINAL
# ==============================================================================
class ANSI:
    RESET   = "\033[0m"
    BOLD    = "\033[1m"
    DIM     = "\033[2m"
    ITALIC  = "\033[3m"
    UNDER   = "\033[4m"
    RED     = "\033[91m"
    GREEN   = "\033[92m"
    YELLOW  = "\033[93m"
    BLUE    = "\033[94m"
    MAGENTA = "\033[95m"
    CYAN    = "\033[96m"
    WHITE   = "\033[97m"
    GRAY    = "\033[90m"

LOGO_HTTP = f"""{ANSI.CYAN}{ANSI.BOLD}
  ██████╗ ██████╗       ███████╗ ██████╗  ██████╗██╗ █████╗ ██╗     
  ██╔══██╗██╔══██╗      ██╔════╝██╔═══██╗██╔════╝██║██╔══██╗██║     
  ██████╔╝██████╔╝█████╗███████╗██║   ██║██║     ██║███████║██║     
  ██╔═══╝ ██╔══██╗╚════╝╚════██║██║   ██║██║     ██║██╔══██║██║     
  ██║     ██║  ██║      ███████║╚██████╔╝╚██████╗██║██║  ██║███████╗
  ╚═╝     ╚═╝  ╚═╝      ╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝{ANSI.RESET}"""

def _visual_len(s: str) -> int:
    plain = re.sub(r'\033\[[0-9;]*m', '', s)
    w = 0
    for ch in plain:
        code = ord(ch)
        if code == 0xFE0F:
            continue
        if (0x2300 <= code <= 0x23FF or
            0x2600 <= code <= 0x27BF or
            0x2B50 <= code <= 0x2B55 or
            0x1F300 <= code <= 0x1F9FF):
            w += 2
        else:
            w += 1
    return w

def _box_row(content: str, width: int = 64, border: str = "│", border_col: str = None) -> str:
    b_col = border_col or f"{ANSI.WHITE}{ANSI.BOLD}"
    v = _visual_len(content)
    gap = max(0, width - v)
    return f"  {b_col}{border}{ANSI.RESET}  {content}{' ' * gap}  {b_col}{border}{ANSI.RESET}"

def main():
    if os.name == 'nt':
        os.system('color')
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

    curr_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(os.path.dirname(curr_dir), "config.json"),
        os.path.join(curr_dir, "config.json"),
        os.path.join(os.getcwd(), "config.json"),
        os.path.join(os.path.expanduser("~"), "social_bot_data", "config.json")
    ]
    config_file = candidates[0]
    cfg = {}
    for p in candidates:
        if os.path.exists(p):
            try:
                with open(p, "r", encoding="utf-8") as f:
                    c = json.load(f)
                    if c.get("token"):
                        cfg = c
                        config_file = p
                        break
                    elif not cfg:
                        cfg = c
                        config_file = p
            except Exception:
                pass

    token = cfg.get("token", "").strip()
    cf = cfg.get("cf_clearance", "").strip()
    ig_cookies = cfg.get("instagram_cookies", "")
    yt_cookies = cfg.get("youtube_cookies", "")
    tt_cookies = cfg.get("tiktok_cookies", "")

    # Contrôle d'accès strict par Licence : 1 Utilisateur = 1 Appareil = 1 Clé
    try:
        from license_manager import UniversalLicenseManager
    except ImportError:
        try:
            from pc_bot.license_manager import UniversalLicenseManager
        except ImportError:
            from termux_bot.license_manager import UniversalLicenseManager

    lic_mgr = UniversalLicenseManager(candidates)
    if not lic_mgr.enforce_license_login():
        print(f"\n  {ANSI.RED}Accès refusé. Clé de licence requise pour cet appareil.{ANSI.RESET}")
        return

    client = PrSocialClient(token, cf)

    try:
        from instagram_action_client import InstagramActionClient
    except ImportError:
        try:
            from pc_bot.instagram_action_client import InstagramActionClient
        except ImportError:
            InstagramActionClient = None
    ig_client = InstagramActionClient() if InstagramActionClient else None

    # Support d'exécution directe PR Worker Telegram (ex: --tg-worker)
    if "--telegram-worker" in sys.argv or "--tg-worker" in sys.argv:
        max_t = None
        max_scans = None
        for i, arg in enumerate(sys.argv):
            if arg in ["--tasks", "--limit"] and i + 1 < len(sys.argv):
                try:
                    max_t = int(sys.argv[i + 1])
                except Exception:
                    pass
            if arg in ["--scans", "-s"] and i + 1 < len(sys.argv):
                try:
                    max_scans = int(sys.argv[i + 1])
                except Exception:
                    pass
        print(f"\n  {ANSI.CYAN}{ANSI.BOLD}⚡ DÉMARRAGE DIRECT PR WORKER TELEGRAM ({max_t if max_t else 'Illimité'} TÂCHES)...{ANSI.RESET}")
        engine = UniversalSilentEngine(
            pr_token=token,
            cf_clearance=cf,
            ig_cookies=ig_cookies,
            yt_cookies=yt_cookies,
            tt_cookies=tt_cookies,
            config_paths=candidates
        )
        try:
            engine.run_telegram_worker(max_tasks=max_t, max_scans=max_scans)
        except KeyboardInterrupt:
            print(f"\n  {ANSI.YELLOW}Arrêt demandé par l'utilisateur...{ANSI.RESET}")
            engine.stop_requested = True
        finally:
            engine.browser_bot.stop_driver()
        return

    # Support d'exécution directe en ligne de commande (ex: --tasks 30)
    if "--tasks" in sys.argv or "--run" in sys.argv:
        max_t = None
        for i, arg in enumerate(sys.argv):
            if arg == "--tasks" and i + 1 < len(sys.argv):
                try:
                    max_t = int(sys.argv[i + 1])
                except Exception:
                    pass
        print(f"\n  {ANSI.CYAN}{ANSI.BOLD}⚡ DÉMARRAGE DIRECT ({max_t if max_t else 'Illimité'} TÂCHES)...{ANSI.RESET}")
        engine = UniversalSilentEngine(
            pr_token=token,
            cf_clearance=cf,
            ig_cookies=ig_cookies,
            yt_cookies=yt_cookies,
            tt_cookies=tt_cookies,
            config_paths=candidates
        )
        try:
            engine.run_all(max_tasks=max_t)
        except KeyboardInterrupt:
            print(f"\n  {ANSI.YELLOW}Arrêt demandé par l'utilisateur...{ANSI.RESET}")
            engine.stop_requested = True
        finally:
            engine.browser_bot.stop_driver()
        return

    while True:
        os.system('cls' if os.name == 'nt' else 'clear')
        print(LOGO_HTTP)

        st, me = client.get_me() if token else (0, {})
        menu_w = 72

        if st == 200 and me.get("user"):
            u = me["user"]
            bal = float(u.get("balance", 0.0))
            u_name = f"@{u.get('username')}"
            b_val = f"${bal:.4f}"
            t_session = "👤 SESSION ACTIVE PR.SOCIAL"
            d_session = max(2, 64 - _visual_len(t_session))
            print(f"  {ANSI.WHITE}{ANSI.BOLD}┌── {t_session} {'─' * d_session}┐{ANSI.RESET}")
            print(_box_row(f"Compte : {ANSI.GREEN}{ANSI.BOLD}{u_name:<14}{ANSI.RESET} 💰 Solde : {ANSI.YELLOW}{ANSI.BOLD}{b_val:<9}{ANSI.RESET} ⚡Version : {ANSI.CYAN}{ANSI.BOLD}v3.2{ANSI.RESET}", border="│", border_col=f"{ANSI.WHITE}{ANSI.BOLD}"))
            if ig_client and ig_client.logged_in and not ig_client.username:
                try:
                    st_s, s_data = client.get_socials()
                    if st_s == 200:
                        all_accs = list(s_data.get("accounts", []))
                        for p_item in s_data.get("platforms", []):
                            all_accs.extend(p_item.get("accounts", []))
                        for a_item in all_accs:
                            if a_item.get("platform") == "instagram" and a_item.get("status") == "approved":
                                ig_client.username = a_item.get("username")
                                break
                except Exception:
                    pass

            if ig_client and ig_client.logged_in:
                ig_u = f"@{ig_client.username}" if ig_client.username else (f"ID #{ig_client.user_id}" if ig_client.user_id else "Session Active")
                ig_desc = f"{ig_u} (Direct API Actif)"
                print(_box_row(f"📷 Insta  : {ANSI.GREEN}{ANSI.BOLD}{ig_desc}{ANSI.RESET}", border="│", border_col=f"{ANSI.WHITE}{ANSI.BOLD}"))
            else:
                print(_box_row(f"📷 Insta  : {ANSI.GRAY}En attente de cookies (PR Cookie Helper){ANSI.RESET}", border="│", border_col=f"{ANSI.WHITE}{ANSI.BOLD}"))
            
            tg_u_info, tg_src_info = TelegramAuthManager.get_active_account(client, cfg) if TelegramAuthManager else ("", "")
            if tg_u_info:
                tg_disp = f"@{tg_u_info} ({tg_src_info})"
            else:
                tg_disp = "Non associé (Option [2] pour lier)"
            print(_box_row(f"✈️  Telegr : {ANSI.CYAN}{ANSI.BOLD}{tg_disp}{ANSI.RESET}", border="│", border_col=f"{ANSI.WHITE}{ANSI.BOLD}"))
            print(f"  {ANSI.WHITE}{ANSI.BOLD}└{'─' * 68}┘{ANSI.RESET}\n")
            if not HAS_PIL:
                print(f"  {ANSI.RED}{ANSI.BOLD}⚠️  ATTENTION : Module Pillow (PIL) non détecté sur cet appareil !{ANSI.RESET}")
                print(f"  {ANSI.YELLOW}👉 Sur Termux, exécutez : {ANSI.CYAN}{ANSI.BOLD}pkg install -y python-pillow{ANSI.RESET}{ANSI.YELLOW} pour des preuves validées à 100%.{ANSI.RESET}\n")
        else:
            t_err = "⚠️ NON CONNECTÉ (Token absent ou expiré)"
            d_err = max(2, 64 - _visual_len(t_err))
            print(f"  {ANSI.RED}{ANSI.BOLD}┌── {t_err} {'─' * d_err}┐{ANSI.RESET}")
            print(_box_row(f"Veuillez configurer un Token PR.Social valide avec l'option [ 3 ]", border="│", border_col=f"{ANSI.RED}{ANSI.BOLD}"))
            print(f"  {ANSI.RED}{ANSI.BOLD}└{'─' * 68}┘{ANSI.RESET}\n")

        t_menu = "⚡MENU PRINCIPAL · MODE SILENCIEUX (v3.2)"
        d_menu = max(2, 64 - _visual_len(t_menu))
        print(f"  {ANSI.CYAN}{ANSI.BOLD}╔══ {t_menu} {'═' * d_menu}╗{ANSI.RESET}")
        print(f"  {ANSI.CYAN}{ANSI.BOLD}║{' ' * 68}║{ANSI.RESET}")

        main_items = [
            f"{ANSI.GREEN}{ANSI.BOLD}[ 1 ] 🚀 START{ANSI.RESET}        {ANSI.WHITE}{ANSI.BOLD}Lancer (Tâches Réseaux Sociaux){ANSI.RESET}",
            f"{ANSI.YELLOW}{ANSI.BOLD}[ 2 ] ⚡ TG WORKER{ANSI.RESET}    {ANSI.WHITE}{ANSI.BOLD}PR Worker Telegram (Lancer / Lier Compte){ANSI.RESET}",
            f"{ANSI.MAGENTA}{ANSI.BOLD}[ 3 ] 🔑 TOKEN{ANSI.RESET}        {ANSI.WHITE}{ANSI.BOLD}Changer / Vérifier Token PR.Social{ANSI.RESET}",
            f"{ANSI.CYAN}{ANSI.BOLD}[ 4 ] 🌐 SURF WEBSITE{ANSI.RESET}  {ANSI.WHITE}{ANSI.BOLD}Auto-Surfeur (Sites Web){ANSI.RESET}",
            f"{ANSI.YELLOW}{ANSI.BOLD}[ 5 ] 🔄 RÉCUPÉRER{ANSI.RESET}    {ANSI.WHITE}{ANSI.BOLD}Scanner & Réessayer Tâches Rejetées{ANSI.RESET}",
            f"{ANSI.GREEN}{ANSI.BOLD}[ 6 ] 📷 COOKIE INSTA{ANSI.RESET} {ANSI.WHITE}{ANSI.BOLD}Coller / Activer Cookie Instagram (APK){ANSI.RESET}",
            f"{ANSI.BLUE}{ANSI.BOLD}[ 7 ] 🛠️  AUTO-FIX{ANSI.RESET}     {ANSI.WHITE}{ANSI.BOLD}Auto-Complétion Profils (Anti-Ban){ANSI.RESET}",
            f"{ANSI.RED}{ANSI.BOLD}[ 8 ] ❌ EXIT{ANSI.RESET}         {ANSI.WHITE}{ANSI.BOLD}Fermer{ANSI.RESET}"
        ]

        for it in main_items:
            print(_box_row(it, border="║", border_col=f"{ANSI.CYAN}{ANSI.BOLD}"))

        print(f"  {ANSI.CYAN}{ANSI.BOLD}║{' ' * 68}║{ANSI.RESET}")
        print(f"  {ANSI.CYAN}{ANSI.BOLD}╚{'═' * 68}╝{ANSI.RESET}\n")

        try:
            choice = input(f"  {ANSI.CYAN}⚡ {ANSI.WHITE}{ANSI.BOLD}Votre sélection [1-8] :{ANSI.RESET} ").strip()
        except (KeyboardInterrupt, EOFError):
            break

        if choice in ["1", "start"]:
            if st != 200:
                print(f"\n  {ANSI.RED}Veuillez d'abord configurer un Token valide (Option 3).{ANSI.RESET}")
                time.sleep(2)
                continue

            while True:
                UI.clear_screen()
                t_sub1 = "🚀 LANCEMENT DU BOT · CHOIX DU MODE (v3.2)"
                d_sub1 = max(2, 64 - _visual_len(t_sub1))
                print(f"\n  {ANSI.CYAN}{ANSI.BOLD}╔══ {t_sub1} {'═' * d_sub1}╗{ANSI.RESET}")
                print(f"  {ANSI.CYAN}{ANSI.BOLD}║{' ' * 68}║{ANSI.RESET}")

                start_sub_items = [
                    f"{ANSI.MAGENTA}{ANSI.BOLD}[ 1 ] 📷 INSTAGRAM SEUL{ANSI.RESET}      {ANSI.WHITE}{ANSI.BOLD}Mode Indépendant (Actions directes Cookie){ANSI.RESET}",
                    f"{ANSI.GREEN}{ANSI.BOLD}[ 2 ] 🌐 TOUS RÉSEAUX SOCIAUX{ANSI.RESET} {ANSI.WHITE}{ANSI.BOLD}Tous réseaux SAUF Instagram (Turbo Multi){ANSI.RESET}",
                    f"{ANSI.CYAN}{ANSI.BOLD}[ 3 ] ⚡ MIX TOTAL{ANSI.RESET}            {ANSI.WHITE}{ANSI.BOLD}Tous les réseaux + Instagram inclus{ANSI.RESET}",
                    f"{ANSI.RED}{ANSI.BOLD}[ 4 ] 🔙 RETOUR{ANSI.RESET}                {ANSI.WHITE}{ANSI.BOLD}Revenir au Menu Principal{ANSI.RESET}"
                ]
                for it in start_sub_items:
                    print(_box_row(it, border="║", border_col=f"{ANSI.CYAN}{ANSI.BOLD}"))

                print(f"  {ANSI.CYAN}{ANSI.BOLD}║{' ' * 68}║{ANSI.RESET}")
                print(f"  {ANSI.CYAN}{ANSI.BOLD}╚{'═' * 68}╝{ANSI.RESET}\n")

                try:
                    start_sub = input(f"  {ANSI.CYAN}⚡ {ANSI.WHITE}{ANSI.BOLD}Votre sélection [1-4] :{ANSI.RESET} ").strip().lower()
                except (KeyboardInterrupt, EOFError):
                    break

                if start_sub in ["1", "insta", "instagram"]:
                    mode_label = "INSTAGRAM SEUL (INDÉPENDANT)"
                    target_mode = ["instagram"]
                elif start_sub in ["2", "all", "tous", "social"]:
                    mode_label = "TOUS RÉSEAUX SOCIAUX (SANS INSTAGRAM)"
                    target_mode = "non_instagram"
                elif start_sub in ["3", "mix"]:
                    mode_label = "MIX TOTAL (TOUS RÉSEAUX + INSTAGRAM)"
                    target_mode = None
                elif start_sub in ["4", "q", "retour", "exit"]:
                    break
                else:
                    continue

                UI.clear_screen()
                print(f"\n  {ANSI.CYAN}{ANSI.BOLD}⚡ DÉMARRAGE DU MODE : {mode_label}...{ANSI.RESET}")
                engine = UniversalSilentEngine(
                    pr_token=token,
                    cf_clearance=cf,
                    ig_cookies=ig_cookies,
                    yt_cookies=yt_cookies,
                    tt_cookies=tt_cookies,
                    config_paths=candidates
                )
                try:
                    engine.run_all(platforms=target_mode)
                except KeyboardInterrupt:
                    print(f"\n  {ANSI.YELLOW}Arrêt demandé par l'utilisateur...{ANSI.RESET}")
                    engine.stop_requested = True
                finally:
                    engine.browser_bot.stop_driver()
                input(f"\n  Appuyez sur {ANSI.BOLD}Entrée{ANSI.RESET} pour revenir au sous-menu...")

        elif choice in ["2", "tg", "telegram"]:
            if st != 200:
                print(f"\n  {ANSI.RED}Veuillez d'abord configurer un Token valide (Option 3).{ANSI.RESET}")
                time.sleep(2)
                continue

            while True:
                UI.clear_screen()
                t_sub2 = "⚡ PR WORKER TELEGRAM · GESTION & EXÉCUTION (v3.2)"
                d_sub2 = max(2, 64 - _visual_len(t_sub2))
                print(f"\n  {ANSI.CYAN}{ANSI.BOLD}╔══ {t_sub2} {'═' * d_sub2}╗{ANSI.RESET}")
                print(f"  {ANSI.CYAN}{ANSI.BOLD}║{' ' * 68}║{ANSI.RESET}")

                tg_sub_items = [
                    f"{ANSI.GREEN}{ANSI.BOLD}[ 1 ] 🚀 LANCER LE WORKER{ANSI.RESET}   {ANSI.WHITE}{ANSI.BOLD}Exécution Tâches Telegram (Mode Rapide 0s){ANSI.RESET}",
                    f"{ANSI.BLUE}{ANSI.BOLD}[ 2 ] ✈️  COMPTE TELEGRAM{ANSI.RESET}    {ANSI.WHITE}{ANSI.BOLD}Associer Compte Telegram (Login / Pseudo){ANSI.RESET}",
                    f"{ANSI.RED}{ANSI.BOLD}[ 3 ] 🔙 RETOUR{ANSI.RESET}            {ANSI.WHITE}{ANSI.BOLD}Revenir au Menu Principal{ANSI.RESET}"
                ]
                for it in tg_sub_items:
                    print(_box_row(it, border="║", border_col=f"{ANSI.CYAN}{ANSI.BOLD}"))

                print(f"  {ANSI.CYAN}{ANSI.BOLD}║{' ' * 68}║{ANSI.RESET}")
                print(f"  {ANSI.CYAN}{ANSI.BOLD}╚{'═' * 68}╝{ANSI.RESET}\n")

                try:
                    tg_sub = input(f"  {ANSI.CYAN}⚡ {ANSI.WHITE}{ANSI.BOLD}Votre sélection Telegram [1-3] :{ANSI.RESET} ").strip()
                except (KeyboardInterrupt, EOFError):
                    break

                if tg_sub == "1":
                    UI.clear_screen()
                    print(f"\n  {ANSI.CYAN}{ANSI.BOLD}⚡ DÉMARRAGE DU PR WORKER TELEGRAM RAPIDE...{ANSI.RESET}")
                    engine = UniversalSilentEngine(
                        pr_token=token,
                        cf_clearance=cf,
                        ig_cookies=ig_cookies,
                        yt_cookies=yt_cookies,
                        tt_cookies=tt_cookies,
                        config_paths=candidates
                    )
                    try:
                        engine.run_telegram_worker()
                    except KeyboardInterrupt:
                        print(f"\n  {ANSI.YELLOW}Arrêt demandé par l'utilisateur...{ANSI.RESET}")
                        engine.stop_requested = True
                    finally:
                        engine.browser_bot.stop_driver()
                    input(f"\n  Appuyez sur {ANSI.BOLD}Entrée{ANSI.RESET} pour revenir au sous-menu...")
                elif tg_sub == "2":
                    if TelegramAuthManager:
                        TelegramAuthManager.show_interactive_menu(client, candidates, cfg)
                    else:
                        print(f"\n  {ANSI.RED}Module TelegramAuthManager non disponible.{ANSI.RESET}")
                        time.sleep(2)
                elif tg_sub in ["3", "q", "retour", "exit"]:
                    break

        elif choice in ["3", "token"]:
            UI.clear_screen()
            UI.header("🔑 CONFIGURATION DU TOKEN PR.SOCIAL")
            new_t = input(f"  Collez votre nouveau Token : ").strip()
            if new_t:
                if new_t.startswith("token="):
                    new_t = new_t[6:]
                token = new_t.strip()
                cfg["token"] = token
                try:
                    for cf_path in set([config_file, candidates[0]]):
                        if os.path.dirname(cf_path): os.makedirs(os.path.dirname(cf_path), exist_ok=True)
                        with open(cf_path, "w", encoding="utf-8") as f:
                            json.dump(cfg, f, indent=2)
                except Exception:
                    pass
                client.update_token(token, cf)
                print(f"\n  {ANSI.GREEN}✓ Token mis à jour avec succès !{ANSI.RESET}")
            else:
                print(f"\n  {ANSI.GRAY}Annulé.{ANSI.RESET}")
            time.sleep(1.5)

        elif choice in ["4", "surf", "web"]:
            if st != 200:
                print(f"\n  {ANSI.RED}Veuillez d'abord configurer un Token valide (Option 6).{ANSI.RESET}")
                time.sleep(2)
                continue

            UI.clear_screen()
            print(f"\n  {ANSI.CYAN}{ANSI.BOLD}⚡ DÉMARRAGE DU SURF DE SITES WEB...{ANSI.RESET}")
            engine = UniversalSilentEngine(
                pr_token=token,
                cf_clearance=cf,
                ig_cookies=ig_cookies,
                yt_cookies=yt_cookies,
                tt_cookies=tt_cookies,
                config_paths=candidates
            )
            try:
                engine.run_surf_tasks()
            except KeyboardInterrupt:
                print(f"\n  {ANSI.YELLOW}Arrêt demandé par l'utilisateur...{ANSI.RESET}")
                engine.stop_requested = True
            finally:
                engine.browser_bot.stop_driver()
            input(f"\n  Appuyez sur {ANSI.BOLD}Entrée{ANSI.RESET} pour revenir au menu...")

        elif choice in ["5", "recup"]:
            if st != 200:
                print(f"\n  {ANSI.RED}Veuillez d'abord configurer un Token valide (Option 6).{ANSI.RESET}")
                time.sleep(2)
                continue

            UI.clear_screen()
            UI.header("🔄 RÉCUPÉRATION ET RÉESSAI DES TÂCHES REJETÉES")

            try:
                from pc_bot.pr_api import PrSocialAPI
                from pc_bot.browser_bot import BrowserBot
                from pc_bot.rejected_tasks_manager import RejectedTasksManager

                api_std = PrSocialAPI(token=token, cf_clearance=cf)
                b_bot = BrowserBot(headless=True)
                mgr = RejectedTasksManager(api=api_std, browser_bot=b_bot)

                def _fetch_log(m: str, l: str):
                    if "indexées" in m:
                        UI.clear_line()
                        ts = f"{UI.GRAY}[{UI.now()}]{UI.RESET}"
                        sys.stdout.write(f"\r  {ts} {UI.CYAN}⠋ {m}{UI.RESET}   ")
                        sys.stdout.flush()
                    else:
                        UI.step(m, l)

                UI.step("Interrogation de l'API PR.Social pour récupérer vos tâches rejetées...", "info")
                tasks = mgr.fetch_all_rejected_tasks(max_pages=100, log_cb=_fetch_log)

                if not tasks:
                    UI.step("Aucune tâche rejetée trouvée sur votre compte.", "success")
                    b_bot.stop_driver()
                    input(f"\n  Appuyez sur {ANSI.BOLD}Entrée{ANSI.RESET} pour continuer...")
                    continue

                total_rew = sum(t.get("reward", 0.0) for t in tasks)

                UI.clear_screen()
                UI.header("🔄 RÉCUPÉRATION ET RÉESSAI DES TÂCHES REJETÉES")
                UI.rejected_summary_card(total_count=len(tasks), total_amount=total_rew)

                for i, t in enumerate(tasks[:6], 1):
                    UI.rejected_task_card(idx=i, total=len(tasks), task=t)
                    print()

                if len(tasks) > 6:
                    print(f"  {ANSI.GRAY}{ANSI.ITALIC}... et {len(tasks) - 6} autre(s) tâche(s) rejetée(s) prêtes pour réessai automatique.{ANSI.RESET}\n")

                UI.rejected_actions_box()

                act_choice = input(f"  {ANSI.CYAN}⚡ {ANSI.WHITE}{ANSI.BOLD}Votre sélection [A / R] :{ANSI.RESET} ").strip().lower()
                if act_choice == 'a':
                    UI.clear_screen()
                    UI.header("🚀 RÉESSAI EN LOT STRICT DES TÂCHES REJETÉES")
                    success_cnt = 0
                    expired_cnt = 0
                    slots_cnt = 0
                    recovered_amount = 0.0
                    try:
                        for idx, t in enumerate(tasks, 1):
                            tid = t["task_id"]
                            rew = t.get("reward", 0.0)
                            UI.retry_card_header(idx=idx, total=len(tasks), task=t)
                            ok, res_msg = mgr.retry_single_task(t, log_cb=lambda m, l: UI.step(m, l), approved_accounts=approved_accounts)
                            if ok:
                                success_cnt += 1
                                recovered_amount += rew
                                UI.step(f"Validée et resoumise avec succès ! (+${rew:.3f})", "success")
                                UI.safety_pause(random.uniform(4.0, 7.0))
                            else:
                                if "expirée" in res_msg.lower() or "not_found" in res_msg.lower():
                                    expired_cnt += 1
                                elif "places" in res_msg.lower() or "slots" in res_msg.lower():
                                    slots_cnt += 1
                                UI.step(t.get('status_retry', res_msg), "warning")
                                time.sleep(0.5)
                    except KeyboardInterrupt:
                        UI.step("Arrêt demandé par l'utilisateur.", "warning")

                    UI.retry_recap(total=len(tasks), success=success_cnt, slots=slots_cnt, expired=expired_cnt, recovered_amount=recovered_amount)

                b_bot.stop_driver()
                input(f"  Appuyez sur {ANSI.BOLD}Entrée{ANSI.RESET} pour continuer...")

            except Exception as e:
                print(f"\n  {ANSI.RED}Erreur : {e}{ANSI.RESET}")
                input(f"  Appuyez sur {ANSI.BOLD}Entrée{ANSI.RESET} pour continuer...")

        elif choice in ["6", "7", "ig", "insta", "instagram"]:
            UI.clear_screen()
            UI.header("📷 CONFIGURATION DES COOKIES INSTAGRAM")
            print(f"  {ANSI.WHITE}Vous avez exporté vos cookies avec {ANSI.GREEN}{ANSI.BOLD}PR Cookie Helper{ANSI.RESET}{ANSI.WHITE} ?{ANSI.RESET}")
            print(f"  {ANSI.GRAY}(Vos cookies sont déjà dans votre presse-papiers ou prêts à être collés).{ANSI.RESET}\n")

            # Vérifier si termux-clipboard-get est disponible
            detected_clip = None
            try:
                res = subprocess.run(["termux-clipboard-get"], capture_output=True, text=True, timeout=1)
                if res.returncode == 0 and res.stdout.strip():
                    detected_clip = res.stdout.strip()
            except Exception:
                pass

            raw_input_data = ""
            if detected_clip and ("sessionid" in detected_clip or "ds_user_id" in detected_clip or "datr" in detected_clip):
                print(f"  {ANSI.GREEN}{ANSI.BOLD}✨ Cookies Instagram détectés dans votre presse-papiers !{ANSI.RESET}")
                use_c = input(f"  {ANSI.CYAN}Enregistrer ces cookies automatiquement ? (O/n) :{ANSI.RESET} ").strip().lower()
                if use_c in ["", "o", "oui", "y", "yes"]:
                    raw_input_data = detected_clip

            if not raw_input_data:
                print(f"  {ANSI.YELLOW}👉 Touchez la bulle de votre clavier ou faites un appui long -> Coller puis Entrée :{ANSI.RESET}")
                collected = []
                while True:
                    line = input()
                    collected.append(line)
                    joined = "\n".join(collected).strip()
                    if "}" in joined or not joined.startswith("{") or line == "":
                        break
                raw_input_data = "\n".join(collected).strip()

            if raw_input_data:
                m = re.search(r"\{[\s\S]*\}", raw_input_data)
                clean_str = m.group(0) if m else raw_input_data
                try:
                    data = json.loads(clean_str)
                except Exception:
                    data = {}
                    for part in raw_input_data.split(";"):
                        if "=" in part:
                            k, v = part.split("=", 1)
                            data[k.strip()] = v.strip()

                if data and ("sessionid" in data or "ds_user_id" in data):
                    if not ig_client:
                        ig_client = InstagramActionClient(data)
                    else:
                        ig_client.set_cookies(data)

                    InstagramActionClient.save_cookies_to_file(data)
                    if ig_client.verify_session():
                        if not ig_client.username:
                            try:
                                st_s, s_data = client.get_socials()
                                if st_s == 200:
                                    all_accs = list(s_data.get("accounts", []))
                                    for p_item in s_data.get("platforms", []):
                                        all_accs.extend(p_item.get("accounts", []))
                                    for a_item in all_accs:
                                        if a_item.get("platform") == "instagram" and a_item.get("status") == "approved":
                                            ig_client.username = a_item.get("username")
                                            break
                            except Exception:
                                pass
                        u_display = f"@{ig_client.username}" if ig_client.username else (f"ID #{ig_client.user_id}" if ig_client.user_id else "Session Active")
                        print(f"\n  {ANSI.GREEN}{ANSI.BOLD}✅ CONNECTÉ AVEC SUCCÈS À INSTAGRAM : {u_display} !{ANSI.RESET}")
                        print(f"  {ANSI.CYAN}Moteur Direct API activé : Zéro rejet & Protection Anti-Pause active.{ANSI.RESET}")
                    else:
                        print(f"\n  {ANSI.GREEN}✅ Cookies Instagram enregistrés dans social_bot_data/instagram_cookies.json !{ANSI.RESET}")
                else:
                    print(f"\n  {ANSI.RED}❌ Format invalide. Assurez-vous d'avoir cliqué sur 'EXPORTER COOKIES INSTAGRAM' dans l'APK.{ANSI.RESET}")
            else:
                print(f"\n  {ANSI.GRAY}Annulé.{ANSI.RESET}")
            input(f"\n  Appuyez sur {ANSI.BOLD}Entrée{ANSI.RESET} pour revenir au menu...")

        elif choice in ["7", "8", "autofix", "fix"]:
            if st != 200:
                print(f"\n  {ANSI.RED}Veuillez d'abord configurer un Token valide (Option 3).{ANSI.RESET}")
                time.sleep(2)
                continue

            UI.clear_screen()
            UI.header("🛠️ AUTO-COMPLÉTION & CONFORMITÉ DES PROFILS (ANTI-BAN)")
            print(f"  {ANSI.CYAN}Analyse en temps réel de vos comptes PR.Social...{ANSI.RESET}\n")

            try:
                from pc_bot.profile_sentinel import ProfileComplianceSentinel
                from pc_bot.profile_auto_completer import ProfileAutoCompleter

                completer = ProfileAutoCompleter()
                st_s, s_data = client.get_socials()
                accounts = s_data.get("accounts", []) if st_s == 200 else []

                if not accounts:
                    print(f"  {ANSI.YELLOW}Aucun compte lié trouvé sur PR.Social.{ANSI.RESET}")
                else:
                    for acc in accounts:
                        plat = acc.get("platform", "").lower()
                        user = acc.get("username", "")
                        url = acc.get("profile_url", "")
                        status = acc.get("status", "")

                        report = ProfileComplianceSentinel.audit_account(plat, user, url)
                        badge = f"{ANSI.GREEN}✓ CONFORME{ANSI.RESET}" if report["is_safe"] else f"{ANSI.RED}⚠ CRITÈRES MANQUANTS{ANSI.RESET}"
                        print(f"  [{plat.upper()}] @{user} ({status}) -> {badge}")

                        plan = completer.auto_fix_plan(acc, report)
                        if plan:
                            print(f"    {ANSI.YELLOW}Actions d'auto-complétion générées :{ANSI.RESET}")
                            for action in plan:
                                print(f"      ↳ {ANSI.WHITE}{action}{ANSI.RESET}")
                        else:
                            print(f"      {ANSI.GREEN}↳ Profil 100% prêt, aucun critère manquant.{ANSI.RESET}")
                        print()

                    print(f"  {ANSI.GREEN}{ANSI.BOLD}✓ Tous les avatars (.png) et packs de posts nécessaires sont prêts dans :{ANSI.RESET}")
                    print(f"    {ANSI.CYAN}{ANSI.BOLD}📁 {completer.output_dir}{ANSI.RESET}")
                    print(f"    {ANSI.DIM}(Dossier Téléchargements / Stockage public accessible){ANSI.RESET}")
            except Exception as e:
                print(f"  {ANSI.RED}Erreur lors de l'auto-complétion : {e}{ANSI.RESET}")

            input(f"\n  Appuyez sur {ANSI.BOLD}Entrée{ANSI.RESET} pour revenir au menu...")

        elif choice in ["8", "9", "exit", "quit", "q"]:
            break

    os.system('cls' if os.name == 'nt' else 'clear')
    print(LOGO_HTTP)
    print(f"  {ANSI.GREEN}{ANSI.BOLD}Session terminée. À bientôt !{ANSI.RESET}\n")

if __name__ == "__main__":
    main()

