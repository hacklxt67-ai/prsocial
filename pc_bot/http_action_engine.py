import os
import re
import time
import json
import hashlib
import random
import logging
from typing import Optional, Dict, Any, Tuple, List
from urllib.parse import urlparse
import requests

import sys

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

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("HttpActionEngine")

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
# 2. MOTEUR SILENCIEUX & AUTOMATIQUE (100% INVISIBLE / HEADLESS RÉEL)
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

        logger.warning(f"⚠️ {len(items)} tâche(s) bloquante(s) détectée(s). Déblocage en cours...")
        cancelled = 0
        for it in items:
            t_id = it.get("order_id") or it.get("id")
            if t_id:
                c_st, c_res = self.pr_api.cancel_task(t_id)
                if c_st == 200 and c_res.get("ok"):
                    logger.info(f" [✓] Tâche orpheline #{t_id} ({it.get('platform')}) annulée.")
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
        logger.info("=== DÉMARRAGE DU BOT AUTOMATIQUE PC (100% INVISIBLE / SILENCIEUX) ===")

        # 1. Vérification connexion
        status, me = self.pr_api.get_me()
        if status != 200 or not me.get("user"):
            logger.error(f"Échec authentification PR.Social: {me.get('error', 'Token expiré')}")
            return

        user = me["user"]
        initial_balance = float(user.get("balance", 0))
        logger.info(f"Connecté : @{user.get('username')} | Solde réel actuel : ${initial_balance:.4f}")

        # 2. Nettoyage initial
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
                        logger.info(f"Compte approuvé : [{p.upper()}] @{acc.get('username')}")

        target_platforms = platforms or ["threads", "reddit", "pinterest", "soundcloud", "bluesky", "twitter", "snapchat", "github", "discord", "youtube", "linkedin", "facebook", "instagram", "tiktok", "telegram"]
        active_list = [p for p in target_platforms if p in approved_accounts] if approved_accounts else target_platforms
        logger.info(f"Plateformes actives prêtes : {', '.join([p.upper() for p in active_list])}")

        session_earnings = 0.0
        success_count = 0

        platform_counts: Dict[str, int] = {}

        while not self.stop_requested:
            tasks_found = 0
            # Trier les plateformes : prioritiser celles où le serveur PR.Social indique qu'il y a des tâches
            ordered_platforms = sorted(active_list, key=lambda p: platform_counts.get(p, 1), reverse=True)

            for plat in ordered_platforms:
                if self.stop_requested:
                    break

                acc_id = approved_accounts.get(plat, {}).get("id")
                # Récupérer un lot plus grand (limit=50) pour ne pas manquer les tâches disponibles
                st, data = self.pr_api.get_available_tasks(plat, sort="reward", limit=50)
                if st != 200:
                    continue

                # Mise à jour du radar serveur en temps réel
                if isinstance(data.get("platformCounts"), list):
                    for pc in data["platformCounts"]:
                        if isinstance(pc, dict) and "platform" in pc:
                            platform_counts[pc["platform"].lower()] = int(pc.get("count", 0))

                tasks = data.get("tasks", [])
                # Si aucune tâche avec sort="reward", tenter sort="new" pour attraper les tâches fraîchement publiées
                if not tasks:
                    st_new, data_new = self.pr_api.get_available_tasks(plat, sort="new", limit=50)
                    if st_new == 200:
                        tasks = data_new.get("tasks", [])

                if not tasks:
                    continue

                # Alterner intelligemment les actions (Follow, Like, Comment, etc.)
                tasks = self.interleave_task_actions(tasks)

                consecutive_busy = 0
                for t in tasks:
                    if self.stop_requested:
                        break

                    task_id = t["id"]
                    # Filtre anti-répétition : si déjà tentée ou échouée récemment, on passe
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
                            # Ne pas polluer l'écran de warnings : enregistrement discret pour 2 min
                            self.failed_tasks[task_id] = time.time() - self.COOLDOWN_FAILED_SECONDS + 120
                            consecutive_busy += 1
                            if consecutive_busy >= 3:
                                logger.info(f"Lot [{plat.upper()}] temporairement saturé ({consecutive_busy} tâches complètes). Rotation vers la suite...")
                                break
                        else:
                            self.failed_tasks[task_id] = time.time()
                            logger.warning(f"Impossible de démarrer #{task_id}: {err_msg}")

                        if "active task" in err_msg.lower() or "task_in_progress" in err_msg.lower():
                            logger.info("Déblocage automatique de la tâche bloquante...")
                            self.auto_unblock_active_tasks()
                            time.sleep(1)
                        continue

                    # Réinitialiser le compteur de saturation dès qu'une tâche est acceptée
                    consecutive_busy = 0
                    tasks_found += 1
                    logger.info(f"🚀 Tâche #{task_id} réservée [{plat.upper()} - {action}] (Gain: ${reward:.3f})")

                    target_url = start_res.get("task", {}).get("target_url") or t.get("target_url") or ""
                    if not target_url:
                        u_name = (start_res.get("task", {}).get("target_username") or t.get("target_username") or "").strip().lstrip("@")
                        if u_name:
                            if plat == "threads":
                                target_url = f"https://www.threads.net/@{u_name}"
                            elif plat == "reddit":
                                target_url = f"https://www.reddit.com/user/{u_name}"
                            elif plat in ["twitter", "x"]:
                                target_url = f"https://x.com/{u_name}"
                            elif plat == "instagram":
                                target_url = f"https://www.instagram.com/{u_name}"
                            elif plat == "tiktok":
                                target_url = f"https://www.tiktok.com/@{u_name}"
                            elif plat == "pinterest":
                                target_url = f"https://www.pinterest.com/{u_name}/"
                            elif plat in ["soundcloud", "sound_cloud"]:
                                target_url = f"https://soundcloud.com/{u_name}"
                            elif plat in ["bluesky", "bsky"]:
                                bsky_handle = u_name if "." in u_name else f"{u_name}.bsky.social"
                                target_url = f"https://bsky.app/profile/{bsky_handle}"

                    wait_sec = int(start_res.get("submit_after_sec") or 5)
                    api_check_enabled = start_res.get("api_check_enabled", 0)

                    comment_text = None
                    if "comment" in action.lower():
                        # Récupérer le commentaire assigné ou la liste
                        assigned = start_res.get("completion", {}).get("assigned_comment")
                        if not assigned:
                            assigned = start_res.get("task", {}).get("assigned_comment") or t.get("assigned_comment")
                        if not assigned:
                            c_list = start_res.get("task", {}).get("comment_list") or t.get("comment_list")
                            if isinstance(c_list, str):
                                try:
                                    c_list = json.loads(c_list)
                                except Exception:
                                    c_list = [line.strip() for line in c_list.split("\n") if line.strip()]
                            if isinstance(c_list, list) and c_list:
                                assigned = random.choice(c_list)
                        if not assigned and ("emoji" in (start_res.get("task", {}).get("comment_type") or "").lower() or "emoji" in action.lower()):
                            assigned = random.choice(["🔥", "👏", "🚀", "❤️", "👍", "✨", "💯", "🙌"])
                        if not assigned:
                            assigned = random.choice([
                                "Great content! 👍",
                                "Very interesting, thanks for sharing! ✨",
                                "Top ! 🔥",
                                "Nice post! 👏",
                                "Super travail ! 🚀"
                            ])
                        comment_text = str(assigned).strip()
                        logger.info(f"Texte du commentaire préparé : '{comment_text}'")

                    logger.info(f"Exécution silencieuse de l'action [{action}] vers {target_url}...")
                    # Exécution de l'action réelle en arrière-plan + capture réelle de la page
                    act_ok, act_msg, shot_path = self.browser_bot.execute_task_action(
                        platform=plat,
                        action=action,
                        target_url=target_url,
                        task_id=task_id,
                        comment_text=comment_text
                    )

                    is_validated = False

                    # 1. Vérification API si supportée par PR.Social
                    if api_check_enabled == 1:
                        chk_st, chk_res = self.pr_api.api_check_task(task_id)
                        if chk_st == 200 and chk_res.get("found") is True and chk_res.get("approved") is True:
                            is_validated = True
                            logger.info(f" [✓] Tâche #{task_id} validée instantanément par l'API !")

                    # 2. Soumission de la vraie capture d'écran
                    if not is_validated and os.path.exists(shot_path):
                        logger.info(f"Attente de sécurité ({wait_sec}s) puis envoi de la preuve réelle...")
                        time.sleep(wait_sec)

                        sub_st, sub_res = self.pr_api.submit_screenshot_file(task_id, shot_path)
                        if sub_st == 200 and sub_res.get("ok"):
                            status_val = sub_res.get("completion", {}).get("status", "pending_review")
                            is_validated = True
                            logger.info(f" [✓] Preuve d'écran acceptée par PR.Social (Statut: {status_val})")

                    if is_validated:
                        success_count += 1
                        session_earnings += reward
                        self.failed_tasks[task_id] = time.time() + 86400  # Marquer comme réussie définitivement
                        logger.info(f"🎉 SUCCÈS: Tâche #{task_id} validée ! +${reward:.3f} (Total session: ${session_earnings:.3f})")

                        # Vérification du solde réel en ligne
                        _, fresh_me = self.pr_api.get_me()
                        if fresh_me.get("user"):
                            current_bal = float(fresh_me["user"].get("balance", 0))
                            logger.info(f"💰 Solde réel en ligne sur PR.Social : ${current_bal:.4f}")
                    else:
                        err_detail = sub_res.get("error") if isinstance(sub_res, dict) else f"Status {sub_st}"
                        logger.warning(f"Tâche #{task_id} non validée ({err_detail}). Annulation immédiate...")
                        self.failed_tasks[task_id] = time.time()
                        logger.info(f"[ANTI-RÉPÉTITION] Tâche #{task_id} écartée pendant 15 min.")
                        self.pr_api.cancel_task(task_id)

                    delay = random.uniform(self.delay_min, self.delay_max)
                    logger.info(f"Pause de sécurité: {delay:.1f}s...")
                    time.sleep(delay)

            if tasks_found == 0:
                radar_total = sum(platform_counts.values()) if platform_counts else 0
                active_has_tasks = sum(platform_counts.get(p, 0) for p in active_list)
                if active_has_tasks > 0:
                    logger.info(f"Radar PR.Social : {active_has_tasks} tâche(s) détectée(s) sur vos réseaux. Reprise dans 3s...")
                    pause_sec = 3
                elif radar_total > 0:
                    logger.info(f"Radar global : {radar_total} tâche(s) sur le serveur. Réévaluation rapide dans 5s...")
                    pause_sec = 5
                else:
                    logger.info("Aucune nouvelle tâche disponible actuellement sur le serveur. Veille rapide de 6s...")
                    pause_sec = 6

                for _ in range(pause_sec):
                    if self.stop_requested:
                        break
                    time.sleep(1)

        self.browser_bot.stop_driver()


# ==============================================================================
# 3. POINT D'ENTRÉE AUTONOME & MENU TERMINAL
# ==============================================================================
class ANSI:
    RESET   = "\033[0m"
    BOLD    = "\033[1m"
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
         {ANSI.MAGENTA}{ANSI.BOLD}⚡ L'argent c'est une chiffre⚡{ANSI.RESET}
{ANSI.GRAY}  ─────────────────────────────────────────────────────────────{ANSI.RESET}"""

def main():
    if os.name == 'nt':
        os.system('color')
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

    config_file = r"D:\social_pc_bot\config.json"
    cfg = {}
    if os.path.exists(config_file):
        try:
            with open(config_file, "r", encoding="utf-8") as f:
                cfg = json.load(f)
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
            print(f"  {ANSI.GREEN}{ANSI.BOLD}● CONNECTÉ : @{u.get('username')}{ANSI.RESET}  |  {ANSI.YELLOW}{ANSI.BOLD}💰 Solde : ${bal:.4f}{ANSI.RESET}  |  {ANSI.CYAN}Mode : Silencieux{ANSI.RESET}")
        else:
            print(f"  {ANSI.RED}{ANSI.BOLD}● NON CONNECTÉ (Jeton absent ou expiré){ANSI.RESET}")

        print(f"{ANSI.GRAY}  ─────────────────────────────────────────────────────────────{ANSI.RESET}\n")

        print(f"  {ANSI.WHITE}{ANSI.BOLD}┌── MENU MODE PUR HTTP (SILENCIEUX) ────────────────────────┐{ANSI.RESET}")
        print(f"  {ANSI.WHITE}{ANSI.BOLD}│{ANSI.RESET}                                                            {ANSI.WHITE}{ANSI.BOLD}│{ANSI.RESET}")
        print(f"  {ANSI.WHITE}{ANSI.BOLD}│{ANSI.RESET}   {ANSI.GREEN}{ANSI.BOLD}[ 1 ] 🚀 START{ANSI.RESET}  - Lancer le Bot Silencieux (Tâches Auto)   {ANSI.WHITE}{ANSI.BOLD}│{ANSI.RESET}")
        print(f"  {ANSI.WHITE}{ANSI.BOLD}│{ANSI.RESET}   {ANSI.YELLOW}{ANSI.BOLD}[ 2 ] 🔄 RÉCUPÉRER & RÉESSAYER LES TÂCHES REJETÉES{ANSI.RESET}      {ANSI.WHITE}{ANSI.BOLD}│{ANSI.RESET}")
        print(f"  {ANSI.WHITE}{ANSI.BOLD}│{ANSI.RESET}   {ANSI.CYAN}{ANSI.BOLD}[ 3 ] 🔑 Changer / Valider Token PR.Social{ANSI.RESET}           {ANSI.WHITE}{ANSI.BOLD}│{ANSI.RESET}")
        print(f"  {ANSI.WHITE}{ANSI.BOLD}│{ANSI.RESET}   {ANSI.RED}{ANSI.BOLD}[ 4 ] ❌ EXIT (Quitter){ANSI.RESET}                                {ANSI.WHITE}{ANSI.BOLD}│{ANSI.RESET}")
        print(f"  {ANSI.WHITE}{ANSI.BOLD}│{ANSI.RESET}                                                            {ANSI.WHITE}{ANSI.BOLD}│{ANSI.RESET}")
        print(f"  {ANSI.WHITE}{ANSI.BOLD}└─── Entrez votre choix (1, 2, 3, 4) ───────────────────────┘{ANSI.RESET}\n")

        try:
            choice = input(f"  {ANSI.BOLD}{ANSI.CYAN}Votre sélection [1-4] : {ANSI.RESET}").strip()
        except (KeyboardInterrupt, EOFError):
            break

        if choice == "1":
            if st != 200:
                print(f"\n  {ANSI.RED}Veuillez d'abord configurer un Token valide (Option 3).{ANSI.RESET}")
                time.sleep(2)
                continue

            print(f"\n  {ANSI.GREEN}{ANSI.BOLD}=== DÉMARRAGE DU BOT PUR HTTP SILENCIEUX ==={ANSI.RESET}")
            print(f"  {ANSI.GRAY}Appuyez sur {ANSI.WHITE}{ANSI.BOLD}Ctrl + C{ANSI.RESET}{ANSI.GRAY} pour arrêter et revenir au menu.{ANSI.RESET}\n")
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

        elif choice == "2":
            if st != 200:
                print(f"\n  {ANSI.RED}Veuillez d'abord configurer un Token valide (Option 3).{ANSI.RESET}")
                time.sleep(2)
                continue

            try:
                from pc_bot.pr_api import PrSocialAPI
                from pc_bot.browser_bot import BrowserBot
                from pc_bot.rejected_tasks_manager import RejectedTasksManager

                api_std = PrSocialAPI(token=token, cf_clearance=cf)
                b_bot = BrowserBot(headless=True)
                mgr = RejectedTasksManager(api=api_std, browser_bot=b_bot)

                print(f"\n  {ANSI.YELLOW}{ANSI.BOLD}🔍 Récupération des tâches rejetées en cours...{ANSI.RESET}\n")
                tasks = mgr.fetch_all_rejected_tasks(max_pages=15, log_cb=lambda m, l: print(f"  [{l.upper()}] {m}"))

                if not tasks:
                    print(f"\n  {ANSI.GREEN}{ANSI.BOLD}🎉 Aucune tâche rejetée trouvée sur votre compte.{ANSI.RESET}\n")
                    b_bot.stop_driver()
                    input(f"  Appuyez sur {ANSI.BOLD}Entrée{ANSI.RESET} pour continuer...")
                    continue

                total_rew = sum(t.get("reward", 0.0) for t in tasks)
                print(f"\n  {ANSI.WHITE}{ANSI.BOLD}📊 {len(tasks)} Tâche(s) Rejetée(s) | Total à récupérer : ${total_rew:.4f}{ANSI.RESET}\n")

                for i, t in enumerate(tasks[:8], 1):
                    tid = t["task_id"]
                    plat = t["platform"].upper()
                    act = t["action"].upper()
                    rew = t.get("reward", 0.0)
                    diag = t.get("analysis", {})
                    print(f"  {ANSI.BOLD}{i}. [{plat} - {act}] #{tid}{ANSI.RESET} {ANSI.GREEN}+${rew:.3f}{ANSI.RESET}")
                    print(f"     {ANSI.RED}Erreur :{ANSI.RESET} {diag.get('category')} ({t.get('ai_reason_raw')})")
                    print(f"     {ANSI.YELLOW}Mesure stricte :{ANSI.RESET} {diag.get('strict_measure')}\n")

                print(f"  {ANSI.WHITE}{ANSI.BOLD}Actions :{ANSI.RESET}")
                print(f"  {ANSI.GREEN}[ A ] 🚀 Réessayer TOUTES les tâches rejetées en Mode Strict{ANSI.RESET}")
                print(f"  {ANSI.RED}[ R ] ⬅️  Retour au Menu{ANSI.RESET}\n")

                act_choice = input(f"  {ANSI.BOLD}Votre choix :{ANSI.RESET} ").strip().lower()
                if act_choice == 'a':
                    print(f"\n  {ANSI.YELLOW}{ANSI.BOLD}=== DÉMARRAGE DU RÉESSAI EN LOT STRICT ==={ANSI.RESET}\n")
                    success_cnt = 0
                    expired_cnt = 0
                    slots_cnt = 0
                    try:
                        for idx, t in enumerate(tasks, 1):
                            tid = t["task_id"]
                            print(f"  {ANSI.CYAN}>>> Tâche {idx}/{len(tasks)} : #{tid} [{t['platform'].upper()}]{ANSI.RESET}")
                            ok, res_msg = mgr.retry_single_task(t, log_cb=lambda m, l: print(f"      [{l.upper()}] {m}"))
                            if ok:
                                success_cnt += 1
                                print(f"      {ANSI.GREEN}✅ Validée et resoumise avec succès !{ANSI.RESET}\n")
                                time.sleep(random.uniform(4.0, 7.0))
                            else:
                                if "expirée" in res_msg.lower() or "not_found" in res_msg.lower():
                                    expired_cnt += 1
                                elif "places" in res_msg.lower() or "slots" in res_msg.lower():
                                    slots_cnt += 1
                                print(f"      {ANSI.YELLOW}⚠️ {t.get('status_retry', res_msg)}{ANSI.RESET}\n")
                                time.sleep(0.5)
                    except KeyboardInterrupt:
                        print(f"\n  {ANSI.YELLOW}Arrêt demandé par l'utilisateur.{ANSI.RESET}")

                    print(f"\n  {ANSI.WHITE}{ANSI.BOLD}=== RÉCAPITULATIF DU RÉESSAI EN LOT ==={ANSI.RESET}")
                    print(f"  {ANSI.GREEN}✓ {success_cnt} tâche(s) relancée(s) et validée(s) avec succès !{ANSI.RESET}")
                    print(f"  {ANSI.YELLOW}⏳ {slots_cnt} tâche(s) temporairement occupées par d'autres ouvriers (SLOTS_TAKEN){ANSI.RESET}")
                    print(f"  {ANSI.GRAY}❌ {expired_cnt} campagne(s) déjà terminées ou clôturées par l'annonceur{ANSI.RESET}\n")

                b_bot.stop_driver()
                input(f"\n  Appuyez sur {ANSI.BOLD}Entrée{ANSI.RESET} pour continuer...")

            except Exception as e:
                print(f"\n  {ANSI.RED}Erreur : {e}{ANSI.RESET}")
                input(f"  Appuyez sur {ANSI.BOLD}Entrée{ANSI.RESET} pour continuer...")

        elif choice == "3":
            print(f"\n  {ANSI.CYAN}=== MODIFICATION DU TOKEN PR.SOCIAL ==={ANSI.RESET}\n")
            new_t = input(f"  Collez votre nouveau Token : ").strip()
            if new_t:
                if new_t.startswith("token="):
                    new_t = new_t[6:]
                token = new_t.strip()
                cfg["token"] = token
                try:
                    os.makedirs(os.path.dirname(config_file), exist_ok=True)
                    with open(config_file, "w", encoding="utf-8") as f:
                        json.dump(cfg, f, indent=2)
                except Exception:
                    pass
                client.update_token(token, cf)
                print(f"\n  {ANSI.GREEN}✓ Token mis à jour avec succès !{ANSI.RESET}")
            else:
                print(f"\n  {ANSI.GRAY}Annulé.{ANSI.RESET}")
            time.sleep(1.5)

        elif choice in ["4", "exit", "quit", "q"]:
            break

    os.system('cls' if os.name == 'nt' else 'clear')
    print(LOGO_HTTP)
    print(f"  {ANSI.GREEN}{ANSI.BOLD}Session terminée. À bientôt !{ANSI.RESET}\n")

if __name__ == "__main__":
    main()

