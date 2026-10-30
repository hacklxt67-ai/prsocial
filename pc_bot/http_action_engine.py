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

try:
    import cv2
    import numpy as np
    from PIL import Image
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False

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
            "Referer": "https://pr.social/tasks",
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

    def get_available_tasks(self, platform: str, sort: str = "reward", limit: int = 50) -> Tuple[int, Dict[str, Any]]:
        return self.request("GET", "/tasks/available", params={"platform": platform, "sort": sort, "limit": limit})

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
        url = f"{BASE_API_URL}/tasks/{task_id}/submit"
        headers = dict(self.session.headers)
        headers.pop("Content-Type", None)
        try:
            with open(filepath, "rb") as f:
                files = {"screenshot": (os.path.basename(filepath), f, "image/png")}
                resp = requests.post(url, files=files, headers=headers, timeout=35)
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
    def header(cls, title: str):
        cls.clear_line()
        print(f"\n  {cls.CYAN}{cls.BOLD}╔══════════════════════════════════════════════════════════════════════╗{cls.RESET}")
        print(f"  {cls.CYAN}{cls.BOLD}║{cls.RESET}  {cls.WHITE}{cls.BOLD}{title.center(66)}{cls.RESET}  {cls.CYAN}{cls.BOLD}║{cls.RESET}")
        print(f"  {cls.CYAN}{cls.BOLD}╚══════════════════════════════════════════════════════════════════════╝{cls.RESET}\n")

    @classmethod
    def user_card(cls, username: str, balance: float):
        cls.clear_line()
        u_str = f"@{username}"
        b_str = f"${balance:.4f}"
        print(f"  {cls.WHITE}{cls.BOLD}┌─ 👤 SESSION ACTIVE PR.SOCIAL ────────────────────────────────────────┐{cls.RESET}")
        print(f"  {cls.WHITE}{cls.BOLD}│{cls.RESET}  Compte : {cls.GREEN}{cls.BOLD}{u_str:<20}{cls.RESET}  💰 Solde Réel : {cls.YELLOW}{cls.BOLD}{b_str:<12}{cls.RESET}  🟢 {cls.WHITE}{cls.BOLD}│{cls.RESET}")
        print(f"  {cls.WHITE}{cls.BOLD}└──────────────────────────────────────────────────────────────────────┘{cls.RESET}\n")

    @classmethod
    def accounts_grid(cls, accounts: dict):
        if not accounts:
            return
        cls.clear_line()
        total = len(accounts)
        print(f"  {cls.WHITE}{cls.BOLD}┌── 📱 {total} RÉSEAUX APPROUVÉS CONNECTÉS (PRÊTS À L'EMPLOI) ───────┐{cls.RESET}")
        items = list(accounts.items())
        for i in range(0, len(items), 2):
            p1, acc1 = items[i]
            c1 = cls.PLATFORM_COLORS.get(p1.lower(), cls.CYAN)
            u1 = ("@" + acc1.get("username", "").lstrip("@"))[:20]
            col1 = f"{c1}{cls.BOLD}[{p1.upper():<10}]{cls.RESET} {cls.WHITE}{u1:<20}{cls.RESET}"

            col2 = " " * 33
            if i + 1 < len(items):
                p2, acc2 = items[i+1]
                c2 = cls.PLATFORM_COLORS.get(p2.lower(), cls.CYAN)
                u2 = ("@" + acc2.get("username", "").lstrip("@"))[:20]
                col2 = f"{c2}{cls.BOLD}[{p2.upper():<10}]{cls.RESET} {cls.WHITE}{u2:<20}{cls.RESET}"

            print(f"  {cls.WHITE}{cls.BOLD}│{cls.RESET}  {col1} │ {col2} {cls.WHITE}{cls.BOLD}│{cls.RESET}")
        print(f"  {cls.WHITE}{cls.BOLD}└──────────────────────────────────────────────────────────────────────┘{cls.RESET}\n")

    @classmethod
    def task_card(cls, task_id: int, platform: str, action: str, reward: float, url: str):
        cls.clear_line()
        short_url = (url[:52] + "...") if len(url) > 55 else url
        print(f"\n  {cls.CYAN}{cls.BOLD}┌── 🌐 {platform.upper()} #{task_id} ──────────────────────────────────────┐{cls.RESET}")
        print(f"  {cls.CYAN}│{cls.RESET}  Action : {cls.WHITE}{cls.BOLD}{action.upper():<12}{cls.RESET} Gain : {cls.GREEN}{cls.BOLD}+${reward:.4f}{cls.RESET}                    {cls.CYAN}│{cls.RESET}")
        print(f"  {cls.CYAN}│{cls.RESET}  Cible  : {cls.GRAY}{short_url:<56}{cls.RESET} {cls.CYAN}│{cls.RESET}")
        print(f"  {cls.CYAN}{cls.BOLD}└──────────────────────────────────────────────────────────────────────┘{cls.RESET}")

    @classmethod
    def step(cls, msg: str, level: str = "info"):
        cls.clear_line()
        ts = f"{cls.GRAY}[{cls.now()}]{cls.RESET}"
        
        # Éviter les doublons d'icônes/emojis
        m = msg.strip()
        for prefix in ["✓", "🎉", "⚠️", "❌", "▶", "➔", "🎯", "🛡️", "⏳"]:
            if m.startswith(prefix):
                m = m[len(prefix):].strip()

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

        print(f"    {ts} {icon} {text}")

    @classmethod
    def live_status(cls, msg: str, icon: str = "⚠"):
        cls.clear_line()
        ts = f"{cls.GRAY}[{cls.now()}]{cls.RESET}"
        sys.stdout.write(f"    {ts} {cls.YELLOW}{cls.BOLD}{icon}{cls.RESET} {cls.WHITE}{msg}{cls.RESET}\r")
        sys.stdout.flush()

    @classmethod
    def success(cls, task_id: int, reward: float, session_total: float, new_balance: float):
        cls.clear_line()
        ts = f"{cls.GRAY}[{cls.now()}]{cls.RESET}"
        print(f"    {ts} {cls.GREEN}{cls.BOLD}✓ SUCCÈS #{task_id} : +${reward:.4f} | Session : +${session_total:.4f} | Solde : ${new_balance:.4f}{cls.RESET}")

    @classmethod
    def safety_pause(cls, seconds: float):
        steps = int(seconds * 10)
        for i in range(steps, 0, -1):
            rem = i / 10.0
            ts = f"{cls.GRAY}[{cls.now()}]{cls.RESET}"
            msg = f"\r    {ts} {cls.CYAN}⏳ Pause de sécurité ({rem:.1f}s)...{cls.RESET}   "
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
        cls.box_row(f"Algorithme    : {cls.CYAN}{cls.BOLD}Strict Anti-Rejet v3.0{cls.RESET}   🛡️  Protection Anti-Ban : {cls.GREEN}Active{cls.RESET}", width=64, border="║", border_color=cls.YELLOW)
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
        print(f"  {cls.CYAN}{cls.BOLD}║{cls.RESET}  {cls.WHITE}{cls.BOLD}{'📊 RÉCAPITULATIF DU RÉESSAI EN LOT STRICT (v3.0)'.center(64)}{cls.RESET}  {cls.CYAN}{cls.BOLD}║{cls.RESET}")
        print(f"  {cls.CYAN}{cls.BOLD}╠══════════════════════════════════════════════════════════════════════╣{cls.RESET}")
        cls.box_row(f"{cls.GREEN}✅ Validées et Resoumises avec succès : {cls.WHITE}{cls.BOLD}{success:<4}{cls.RESET} {cls.GREEN}({s_val}){cls.RESET}", width=64, border="║", border_color=cls.CYAN)
        cls.box_row(f"{cls.YELLOW}⏳ Places temporairement occupées    : {cls.WHITE}{cls.BOLD}{slots:<4}{cls.RESET} {cls.YELLOW}(SLOTS_TAKEN){cls.RESET}", width=64, border="║", border_color=cls.CYAN)
        cls.box_row(f"{cls.GRAY}❌ Campagnes clôturées / Expirées    : {cls.WHITE}{cls.BOLD}{expired:<4}{cls.RESET} {cls.GRAY}(terminées annonceur){cls.RESET}", width=64, border="║", border_color=cls.CYAN)
        print(f"  {cls.CYAN}{cls.BOLD}╚══════════════════════════════════════════════════════════════════════╝{cls.RESET}\n")


# ==============================================================================
# 3. MOTEUR SILENCIEUX & AUTOMATIQUE (100% INVISIBLE / HEADLESS RÉEL)
# ==============================================================================
class UniversalSilentEngine:
    def __init__(self, pr_token: str, cf_clearance: str = "", ig_cookies: str = "", yt_cookies: str = "", tt_cookies: str = ""):
        self.pr_api = PrSocialClient(pr_token, cf_clearance)
        # BrowserBot configuré en mode 100% invisible (headless: True, pas de fenêtre visuelle)
        self.browser_bot = BrowserBot(headless=True)
        self.stop_requested = False
        self.delay_min = 5.0
        self.delay_max = 9.0
        self.failed_tasks: Dict[int, float] = {}
        self.COOLDOWN_FAILED_SECONDS = 900  # 15 minutes d'exclusion anti-répétition

    def auto_unblock_active_tasks(self) -> int:
        """Détecte et annule toute tâche bloquante en 'in_progress' sur PR.Social."""
        st, data = self.pr_api.get_in_progress_tasks()
        if st != 200:
            return 0
        items = data.get("items", [])
        if not items:
            return 0

        UI.step(f"Détection de {len(items)} tâche(s) bloquante(s). Déblocage...", "warning")
        cancelled = 0
        for it in items:
            t_id = it.get("order_id") or it.get("id")
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
        interleaved = []
        max_len = max(len(g) for g in groups.values())
        for i in range(max_len):
            for k in list(groups.keys()):
                if i < len(groups[k]):
                    interleaved.append(groups[k][i])
        return interleaved

    def run_all(self, platforms: Optional[List[str]] = None):
        UI.clear_screen()
        UI.header("⚡ ENGINEERING REVERSED SOCIAL BOT·v3.0 ⚡")

        # 1. Vérification connexion
        status, me = self.pr_api.get_me()
        if status != 200 or not me.get("user"):
            UI.step(f"Échec authentification PR.Social : {me.get('error', 'Token expiré')}", "error")
            return

        user = me["user"]
        initial_balance = float(user.get("balance", 0))
        UI.user_card(user.get("username", "Inconnu"), initial_balance)

        # 2. Nettoyage initial des tâches orphelines
        self.auto_unblock_active_tasks()

        # 3. Réseaux approuvés (inspection complète de socials.accounts et socials.platforms)
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

        UI.accounts_grid(approved_accounts)

        target_platforms = platforms or ["threads", "reddit", "pinterest", "soundcloud", "bluesky", "twitter", "snapchat", "github", "discord", "youtube", "linkedin", "facebook", "instagram", "tiktok", "telegram"]
        active_list = [p for p in target_platforms if p in approved_accounts] if approved_accounts else target_platforms
        UI.step(f"Surveillance active sur {len(active_list)} plateformes prioritaires...", "info")

        session_earnings = 0.0
        success_count = 0
        platform_counts: Dict[str, int] = {}

        while not self.stop_requested:
            tasks_found = 0
            ordered_platforms = sorted(active_list, key=lambda p: platform_counts.get(p, 1), reverse=True)

            for plat in ordered_platforms:
                if self.stop_requested:
                    break

                acc_id = approved_accounts.get(plat, {}).get("id")
                # Récupérer un lot complet (limit=500) pour ne pas manquer les tâches disponibles
                st, data = self.pr_api.get_available_tasks(plat, sort="reward", limit=500)
                if st != 200:
                    continue

                # Détection des limites horaires serveur (exhausted_pairs)
                exhausted = data.get("exhausted_pairs") or []
                exhausted_actions = set()
                if isinstance(exhausted, list):
                    for ep in exhausted:
                        if isinstance(ep, dict) and ep.get("platform", "").lower() == plat.lower():
                            exhausted_actions.add(ep.get("action", "").lower())

                # Mise à jour du radar serveur en temps réel
                if isinstance(data.get("platformCounts"), list):
                    for pc in data["platformCounts"]:
                        if isinstance(pc, dict) and "platform" in pc:
                            platform_counts[pc["platform"].lower()] = int(pc.get("count", 0))

                tasks = data.get("tasks", [])
                if not tasks:
                    st_new, data_new = self.pr_api.get_available_tasks(plat, sort="new", limit=500)
                    if st_new == 200:
                        tasks = data_new.get("tasks", [])

                if not tasks:
                    continue

                if exhausted_actions:
                    tasks = [t for t in tasks if (t.get("action") or "").lower() not in exhausted_actions]
                    if not tasks:
                        continue

                # Alterner intelligemment les actions (Follow, Like, Comment, etc.)
                tasks = self.interleave_task_actions(tasks)

                consecutive_busy = 0
                for t in tasks:
                    if self.stop_requested:
                        break

                    task_id = t["id"]
                    if task_id in self.failed_tasks:
                        if time.time() - self.failed_tasks[task_id] < self.COOLDOWN_FAILED_SECONDS:
                            continue
                        else:
                            del self.failed_tasks[task_id]

                    action = (t.get("action") or "FOLLOW").upper()
                    reward = float(t.get("worker_reward") or t.get("cost_per_task") or 0.0)

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
                            self.failed_tasks[task_id] = time.time() - self.COOLDOWN_FAILED_SECONDS + 120
                            consecutive_busy += 1
                            if consecutive_busy >= 3:
                                break
                        else:
                            self.failed_tasks[task_id] = time.time()

                        if "active task" in err_msg.lower() or "task_in_progress" in err_msg.lower():
                            self.auto_unblock_active_tasks()
                            time.sleep(1)
                        continue

                    # Réinitialiser le compteur de saturation dès qu'une tâche est acceptée
                    consecutive_busy = 0
                    tasks_found += 1

                    target_url = start_res.get("task", {}).get("target_url") or t.get("target_url") or ""
                    if not target_url:
                        u_name = (start_res.get("task", {}).get("target_username") or t.get("target_username") or "").strip().lstrip("@")
                        if u_name:
                            if plat == "threads": target_url = f"https://www.threads.net/@{u_name}"
                            elif plat == "reddit": target_url = f"https://www.reddit.com/user/{u_name}"
                            elif plat in ["twitter", "x"]: target_url = f"https://x.com/{u_name}"
                            elif plat == "instagram": target_url = f"https://www.instagram.com/{u_name}"
                            elif plat == "tiktok": target_url = f"https://www.tiktok.com/@{u_name}"
                            elif plat == "pinterest": target_url = f"https://www.pinterest.com/{u_name}/"
                            elif plat in ["soundcloud", "sound_cloud"]: target_url = f"https://soundcloud.com/{u_name}"
                            elif plat in ["bluesky", "bsky"]:
                                bsky_handle = u_name if "." in u_name else f"{u_name}.bsky.social"
                                target_url = f"https://bsky.app/profile/{bsky_handle}"

                    print()  # Efface la ligne du radar
                    UI.task_card(task_id, plat, action, reward, target_url)

                    wait_sec = int(start_res.get("submit_after_sec") or 5)
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

                    UI.step(f"Navigation & exécution discrète de l'action [{action}]...", "info")
                    act_ok, act_msg, shot_path = self.browser_bot.execute_task_action(
                        platform=plat,
                        action=action,
                        target_url=target_url,
                        task_id=task_id,
                        comment_text=comment_text
                    )

                    is_validated = False

                    # 1. Vérification API instantanée si disponible
                    if api_check_enabled == 1:
                        UI.step("Vérification instantanée par API Check...", "info")
                        chk_st, chk_res = self.pr_api.api_check_task(task_id)
                        if chk_st == 200 and chk_res.get("found") is True and chk_res.get("approved") is True:
                            is_validated = True
                            UI.step(f"Validé instantanément par l'API PR.Social !", "success")

                    # 2. Soumission de la preuve si non validé par API
                    if not is_validated:
                        # GARDE-FOU ANTI-REJET STRICT
                        if act_ok and shot_path and os.path.exists(shot_path):
                            UI.step(f"Attente de sécurité ({wait_sec}s) puis envoi de la capture...", "info")
                            time.sleep(wait_sec)

                            sub_st, sub_res = self.pr_api.submit_screenshot_file(task_id, shot_path)
                            if sub_st == 200 and sub_res.get("ok"):
                                status_val = sub_res.get("completion", {}).get("status", "pending_review")
                                is_validated = True
                                UI.step(f"Preuve d'écran acceptée par PR.Social (Statut : {status_val})", "success")
                            else:
                                err_detail = sub_res.get("error", f"Status {sub_st}") if isinstance(sub_res, dict) else f"Status {sub_st}"
                                UI.step(f"Soumission refusée ({err_detail}). Annulation sécurisée...", "warning")
                                self.failed_tasks[task_id] = time.time()
                                self.pr_api.cancel_task(task_id)
                                continue
                        else:
                            UI.step(f"SÉCURITÉ ANTI-REJET : Action non confirmée ({act_msg}). Preuve écartée.", "warning")
                            UI.step(f"Annulation immédiate de #{task_id} pour préserver la réputation.", "info")
                            self.failed_tasks[task_id] = time.time()
                            self.pr_api.cancel_task(task_id)
                            continue

                    if is_validated:
                        success_count += 1
                        session_earnings += reward
                        self.failed_tasks[task_id] = time.time() + 86400
                        _, fresh_me = self.pr_api.get_me()
                        new_bal = float(fresh_me.get("user", {}).get("balance", 0.0)) if fresh_me.get("user") else 0.0
                        UI.success(task_id, reward, session_earnings, new_bal)

                    delay = random.uniform(self.delay_min, self.delay_max)
                    UI.safety_pause(delay)

            if tasks_found == 0:
                radar_total = sum(platform_counts.values()) if platform_counts else 0
                active_has_tasks = sum(platform_counts.get(p, 0) for p in active_list)
                pause_sec = 3 if active_has_tasks > 0 else (5 if radar_total > 0 else 6)

                total_ticks = int(pause_sec * 5)
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

    def run_surf_tasks(self, max_tasks: Optional[int] = None):
        """Moteur 100% dédié au Surf Réel de PR.Social (https://pr.social/surf/view?z=180)."""
        UI.clear_screen()
        UI.header("🌐 AUTO-SURFEUR PR.SOCIAL EN CONTINU (v3.0) 🌐")

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
  ╚═╝     ╚═╝  ╚═╝      ╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝{ANSI.RESET}
       {ANSI.MAGENTA}{ANSI.BOLD}⚡ REVERSED ENGINEERING BOT PRO · v3.0 ⚡{ANSI.RESET}
       {ANSI.YELLOW}{ANSI.DIM}— L'argent c'est un chiffre —{ANSI.RESET}
  {ANSI.GRAY}──────────────────────────────────────────────────────────────────────{ANSI.RESET}"""

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
        r"D:\social_pc_bot\config.json"
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

    client = PrSocialClient(token, cf)

    while True:
        os.system('cls' if os.name == 'nt' else 'clear')
        print(LOGO_HTTP)

        st, me = client.get_me() if token else (0, {})
        if st == 200 and me.get("user"):
            u = me["user"]
            bal = float(u.get("balance", 0.0))
            u_name = f"@{u.get('username')}"
            b_val = f"${bal:.4f}"
            print(f"  {ANSI.WHITE}{ANSI.BOLD}┌─ 👤 SESSION ACTIVE PR.SOCIAL ────────────────────────────────────────┐{ANSI.RESET}")
            print(f"  {ANSI.WHITE}{ANSI.BOLD}│{ANSI.RESET}  Compte : {ANSI.GREEN}{ANSI.BOLD}{u_name:<15}{ANSI.RESET} 💰 Solde : {ANSI.YELLOW}{ANSI.BOLD}{b_val:<9}{ANSI.RESET}⚡Version : {ANSI.CYAN}{ANSI.BOLD}v3.0{ANSI.RESET}       {ANSI.WHITE}{ANSI.BOLD}│{ANSI.RESET}")
            print(f"  {ANSI.WHITE}{ANSI.BOLD}└──────────────────────────────────────────────────────────────────────┘{ANSI.RESET}\n")
        else:
            print(f"  {ANSI.RED}{ANSI.BOLD}┌─ ⚠️  NON CONNECTÉ (Token absent ou expiré) ──────────────────────────┐{ANSI.RESET}")
            print(f"  {ANSI.RED}{ANSI.BOLD}│{ANSI.RESET}  Veuillez configurer un Token PR.Social valide avec l'option [ 3 ]   {ANSI.RED}{ANSI.BOLD}│{ANSI.RESET}")
            print(f"  {ANSI.RED}{ANSI.BOLD}└──────────────────────────────────────────────────────────────────────┘{ANSI.RESET}\n")

        print(f"  {ANSI.CYAN}{ANSI.BOLD}╔══ ⚡MENU PRINCIPAL · MODE SILENCIEUX (v3.0) ═════════════════════════╗{ANSI.RESET}")
        print(f"  {ANSI.CYAN}{ANSI.BOLD}║{ANSI.RESET}                                                                      {ANSI.CYAN}{ANSI.BOLD}║{ANSI.RESET}")
        print(f"  {ANSI.CYAN}{ANSI.BOLD}║{ANSI.RESET}  {ANSI.GREEN}{ANSI.BOLD}[ 1 ] 🚀 START{ANSI.RESET}      {ANSI.WHITE}{ANSI.BOLD}Lancer (Tâches Réseaux Sociaux)        {ANSI.RESET}         {ANSI.CYAN}{ANSI.BOLD}║{ANSI.RESET}")
        print(f"  {ANSI.CYAN}{ANSI.BOLD}║{ANSI.RESET}  {ANSI.CYAN}{ANSI.BOLD}[ 2 ] 🌐 SURF WEBSITE{ANSI.RESET}{ANSI.WHITE}{ANSI.BOLD}        Auto-Surfeur(Sites Web)       {ANSI.RESET}         {ANSI.CYAN}{ANSI.BOLD}║{ANSI.RESET}")
        print(f"  {ANSI.CYAN}{ANSI.BOLD}║{ANSI.RESET}  {ANSI.YELLOW}{ANSI.BOLD}[ 3 ] 🔄 RÉCUPÉRER{ANSI.RESET}  {ANSI.WHITE}{ANSI.BOLD}Scanner & Réessayer Tâches Rejetées{ANSI.RESET}             {ANSI.CYAN}{ANSI.BOLD}║{ANSI.RESET}")
        print(f"  {ANSI.CYAN}{ANSI.BOLD}║{ANSI.RESET}  {ANSI.MAGENTA}{ANSI.BOLD}[ 4 ] 🔑 TOKEN{ANSI.RESET}      {ANSI.WHITE}{ANSI.BOLD}Changer / Vérifier Token PR.Social{ANSI.RESET}              {ANSI.CYAN}{ANSI.BOLD}║{ANSI.RESET}")
        print(f"  {ANSI.CYAN}{ANSI.BOLD}║{ANSI.RESET}  {ANSI.RED}{ANSI.BOLD}[ 5 ] ❌ EXIT{ANSI.RESET}       {ANSI.WHITE}{ANSI.BOLD}Fermer                       {ANSI.RESET}                   {ANSI.CYAN}{ANSI.BOLD}║{ANSI.RESET}")
        print(f"  {ANSI.CYAN}{ANSI.BOLD}║{ANSI.RESET}                                                                      {ANSI.CYAN}{ANSI.BOLD}║{ANSI.RESET}")
        print(f"  {ANSI.CYAN}{ANSI.BOLD}╚══════════════════════════════════════════════════════════════════════╝{ANSI.RESET}\n")

        try:
            choice = input(f"  {ANSI.CYAN}⚡ {ANSI.WHITE}{ANSI.BOLD}Votre sélection [1-5] :{ANSI.RESET} ").strip()
        except (KeyboardInterrupt, EOFError):
            break

        if choice == "1":
            if st != 200:
                print(f"\n  {ANSI.RED}Veuillez d'abord configurer un Token valide (Option 4).{ANSI.RESET}")
                time.sleep(2)
                continue

            UI.clear_screen()
            print(f"\n  {ANSI.CYAN}{ANSI.BOLD}⚡ DÉMARRAGE...{ANSI.RESET}")
            engine = UniversalSilentEngine(
                pr_token=token,
                cf_clearance=cf,
                ig_cookies=ig_cookies,
                yt_cookies=yt_cookies,
                tt_cookies=tt_cookies
            )
            try:
                engine.run_all()
            except KeyboardInterrupt:
                print(f"\n  {ANSI.YELLOW}Arrêt demandé par l'utilisateur...{ANSI.RESET}")
                engine.stop_requested = True
            finally:
                engine.browser_bot.stop_driver()
            input(f"\n  Appuyez sur {ANSI.BOLD}Entrée{ANSI.RESET} pour revenir au menu...")

        elif choice in ["2", "surf", "web"]:
            if st != 200:
                print(f"\n  {ANSI.RED}Veuillez d'abord configurer un Token valide (Option 4).{ANSI.RESET}")
                time.sleep(2)
                continue

            UI.clear_screen()
            print(f"\n  {ANSI.CYAN}{ANSI.BOLD}⚡ DÉMARRAGE DU SURF DE SITES WEB...{ANSI.RESET}")
            engine = UniversalSilentEngine(
                pr_token=token,
                cf_clearance=cf,
                ig_cookies=ig_cookies,
                yt_cookies=yt_cookies,
                tt_cookies=tt_cookies
            )
            try:
                engine.run_surf_tasks()
            except KeyboardInterrupt:
                print(f"\n  {ANSI.YELLOW}Arrêt demandé par l'utilisateur...{ANSI.RESET}")
                engine.stop_requested = True
            finally:
                engine.browser_bot.stop_driver()
            input(f"\n  Appuyez sur {ANSI.BOLD}Entrée{ANSI.RESET} pour revenir au menu...")

        elif choice == "3":
            if st != 200:
                print(f"\n  {ANSI.RED}Veuillez d'abord configurer un Token valide (Option 4).{ANSI.RESET}")
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
                            ok, res_msg = mgr.retry_single_task(t, log_cb=lambda m, l: UI.step(m, l))
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

        elif choice == "4":
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
                        os.makedirs(os.path.dirname(cf_path), exist_ok=True)
                        with open(cf_path, "w", encoding="utf-8") as f:
                            json.dump(cfg, f, indent=2)
                except Exception:
                    pass
                client.update_token(token, cf)
                print(f"\n  {ANSI.GREEN}✓ Token mis à jour avec succès !{ANSI.RESET}")
            else:
                print(f"\n  {ANSI.GRAY}Annulé.{ANSI.RESET}")
            time.sleep(1.5)

        elif choice in ["5", "exit", "quit", "q"]:
            break

    os.system('cls' if os.name == 'nt' else 'clear')
    print(LOGO_HTTP)
    print(f"  {ANSI.GREEN}{ANSI.BOLD}Session terminée. À bientôt !{ANSI.RESET}\n")

if __name__ == "__main__":
    main()

