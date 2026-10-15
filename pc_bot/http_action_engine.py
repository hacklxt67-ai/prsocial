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

    def get_available_tasks(self, platform: str, limit: int = 50) -> Tuple[int, Dict[str, Any]]:
        return self.request("GET", "/tasks/available", params={"platform": platform, "sort": "reward", "limit": limit})

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

        target_platforms = platforms or ["threads", "reddit", "twitter", "snapchat", "github", "discord", "youtube", "facebook", "instagram", "tiktok", "telegram"]
        active_list = [p for p in target_platforms if p in approved_accounts] if approved_accounts else target_platforms
        logger.info(f"Plateformes actives prêtes : {', '.join([p.upper() for p in active_list])}")

        session_earnings = 0.0
        success_count = 0

        while not self.stop_requested:
            tasks_found = 0
            for plat in active_list:
                if self.stop_requested:
                    break

                acc_id = approved_accounts.get(plat, {}).get("id")
                st, data = self.pr_api.get_available_tasks(plat, limit=15)
                if st != 200:
                    continue

                tasks = data.get("tasks", [])
                if not tasks:
                    continue

                for t in tasks:
                    if self.stop_requested:
                        break

                    task_id = t["id"]
                    action = (t.get("action") or "FOLLOW").upper()
                    reward = float(t.get("worker_reward") or t.get("cost_per_task") or 0.0)

                    feasible, _ = self.is_task_feasible(t)
                    if not feasible:
                        continue

                    tasks_found += 1
                    logger.info(f"Démarrage tâche #{task_id} [{plat.upper()} - {action}] (Gain: ${reward:.3f})")
                    start_st, start_res = self.pr_api.start_task(task_id, acc_id)

                    if start_st != 200 or not start_res.get("ok"):
                        err_msg = str(start_res.get("error", ""))
                        logger.warning(f"Impossible de démarrer #{task_id}: {err_msg}")
                        if "active task" in err_msg.lower() or "task_in_progress" in err_msg.lower():
                            logger.info("Déblocage automatique de la tâche bloquante...")
                            self.auto_unblock_active_tasks()
                            time.sleep(1)
                        continue

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

                    # 2. Soumission de la vraie capture d'écran vérifiée
                    if not is_validated:
                        if act_ok and os.path.exists(shot_path):
                            logger.info(f"Attente de sécurité ({wait_sec}s) puis envoi de la preuve vérifiée...")
                            time.sleep(wait_sec)

                            sub_st, sub_res = self.pr_api.submit_screenshot_file(task_id, shot_path)
                            if sub_st == 200 and sub_res.get("ok"):
                                status_val = sub_res.get("completion", {}).get("status", "pending_review")
                                is_validated = True
                                logger.info(f" [✓] Preuve d'écran acceptée par PR.Social (Statut: {status_val})")
                        else:
                            logger.warning(f"🛡️ SÉCURITÉ ANTI-BAN: Capture non conforme écartée ({act_msg}). Annulation propre de #{task_id}.")
                            self.pr_api.cancel_task(task_id)
                            continue

                    if is_validated:
                        success_count += 1
                        session_earnings += reward
                        logger.info(f"🎉 SUCCÈS: Tâche #{task_id} validée ! +${reward:.3f} (Total session: ${session_earnings:.3f})")

                        # Vérification du solde réel en ligne
                        _, fresh_me = self.pr_api.get_me()
                        if fresh_me.get("user"):
                            current_bal = float(fresh_me["user"].get("balance", 0))
                            logger.info(f"💰 Solde réel en ligne sur PR.Social : ${current_bal:.4f}")
                    elif act_ok:
                        err_detail = sub_res.get("error") if isinstance(sub_res, dict) else f"Status {sub_st}"
                        logger.warning(f"Tâche #{task_id} non validée ({err_detail}). Annulation immédiate...")
                        self.pr_api.cancel_task(task_id)

                    delay = random.uniform(self.delay_min, self.delay_max)
                    logger.info(f"Pause de sécurité: {delay:.1f}s...")
                    time.sleep(delay)

            if tasks_found == 0:
                logger.info("Aucune nouvelle tâche disponible. Pause de 15s...")
                for _ in range(15):
                    if self.stop_requested:
                        break
                    time.sleep(1)

        self.browser_bot.stop_driver()


# ==============================================================================
# 3. POINT D'ENTRÉE AUTONOME
# ==============================================================================
def main():
    config_file = r"D:\social_pc_bot\config.json"
    cfg = {}
    if os.path.exists(config_file):
        try:
            with open(config_file, "r", encoding="utf-8") as f:
                cfg = json.load(f)
        except Exception:
            pass

    token = cfg.get("token", "")
    cf = cfg.get("cf_clearance", "")
    ig_cookies = cfg.get("instagram_cookies", "")
    yt_cookies = cfg.get("youtube_cookies", "")
    tt_cookies = cfg.get("tiktok_cookies", "")

    client_test = PrSocialClient(token, cf)
    st, me = client_test.get_me() if token else (0, {})
    if st != 200:
        print("\n" + "="*60)
        print(" [!] Le jeton PR.Social actuel est absent ou a expiré.")
        print("="*60)
        new_tok = input("Collez votre nouveau jeton PR.Social : ").strip()
        if new_tok:
            token = new_tok
            cfg["token"] = token
            try:
                os.makedirs(os.path.dirname(config_file), exist_ok=True)
                with open(config_file, "w", encoding="utf-8") as f:
                    json.dump(cfg, f, indent=2)
            except Exception:
                pass

    engine = UniversalSilentEngine(
        pr_token=token,
        cf_clearance=cf,
        ig_cookies=ig_cookies,
        yt_cookies=yt_cookies,
        tt_cookies=tt_cookies
    )
    try:
        engine.run_all()
    finally:
        engine.browser_bot.stop_driver()

if __name__ == "__main__":
    main()
