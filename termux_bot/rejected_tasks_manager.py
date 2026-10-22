#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
PR.SOCIAL TERMUX - GESTIONNAIRE DE RÉCUPÉRATION DES TÂCHES REJETÉES
================================================================================
Ce module permet aux utilisateurs de Termux de :
1. Détecter et lister toutes les tâches rejetées avec les motifs exacts d'échec.
2. Écarter automatiquement les tâches non récupérables (ex: comptes non liés).
3. Relancer les tâches éligibles avec un moteur d'exécution strict :
   - Vérification pré-clic (déjà abonné / déjà liké) pour éviter les désabonnements
   - Nettoyage des popups et modales
   - Délais humains de stabilisation
   - Capture HD certifiée avec hash cryptographique et perceptuel unique
   - Soumission sécurisée avec anti-ban strict
================================================================================
"""

import os
import sys
import time
import random
import logging
from typing import Dict, Any, List, Optional, Tuple

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

try:
    from pr_api import PrSocialAPI
    from browser_termux import BrowserTermux, ensure_unique_screenshot
except ImportError:
    from termux_bot.pr_api import PrSocialAPI
    from termux_bot.browser_termux import BrowserTermux, ensure_unique_screenshot

# ANSI Colors
GREEN = "\033[92m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BLUE = "\033[94m"
MAGENTA = "\033[95m"
WHITE = "\033[97m"
RED = "\033[91m"
BOLD = "\033[1m"
DIM = "\033[2m"
RESET = "\033[0m"

logger = logging.getLogger("TermuxRejectedTasks")


def explain_rejection_reason(ai_reason: str, raw_err: str = "") -> Tuple[str, str, bool]:
    """
    Analyse la raison du rejet et indique si la tâche est récupérable.
    Retourne (Diagnostic en français, Recommandation, Est_Récupérable)
    """
    text = (ai_reason or raw_err or "").lower()

    if "screenshot has already been submitted" in text or "duplicate" in text or "уже использ" in text:
        return (
            "Capture d'écran déjà utilisée (Hash dupliqué)",
            "Récupérable immédiatement : une capture fraîche avec un hash pixel unique sera générée.",
            True
        )
    elif "action not completed" in text or "не выполнено" in text or "not following" in text:
        return (
            "Action non validée lors du contrôle",
            "Récupérable : nouvelle exécution avec vérification pré-clic et scroll centré.",
            True
        )
    elif "wrong account" in text or "другой аккаунт" in text or "différent" in text:
        return (
            "Mauvais compte social utilisé",
            "Attention : vérifiez que le compte actif dans le navigateur est bien celui lié sur PR.Social.",
            True
        )
    elif "private profile" in text or "privé" in text or "закрыт" in text:
        return (
            "Profil privé ou inaccessible",
            "Difficilement récupérable sans rendre le profil public.",
            False
        )
    elif "deleted" in text or "supprimé" in text or "not found" in text or "404" in text:
        return (
            "Publication ou profil introuvable (Supprimé)",
            "Non récupérable : la cible n'existe plus.",
            False
        )
    else:
        diag = ai_reason if ai_reason else (raw_err if raw_err else "Raison non spécifiée par PR.Social")
        return (diag, "Tentative de réessai avec exécution stricte possible.", True)


class TermuxRejectedTasksManager:
    def __init__(self, api: PrSocialAPI, browser: BrowserTermux):
        self.api = api
        self.browser = browser
        self.cached_tasks: List[Dict[str, Any]] = []

    def fetch_rejected_tasks(self, max_pages: int = 5) -> List[Dict[str, Any]]:
        """Récupère la liste complète des tâches rejetées."""
        print(f"\n{CYAN}🔍 Récupération des tâches rejetées auprès de PR.Social...{RESET}")
        results = []
        seen_ids = set()

        for page in range(1, max_pages + 1):
            st, data = self.api.get_rejected_tasks(page=page, limit=50)
            if st != 200:
                break
            items = data.get("items", [])
            if not items:
                break

            for it in items:
                task_id = it.get("order_id") or it.get("id") or it.get("task_id")
                if not task_id or task_id in seen_ids:
                    continue
                seen_ids.add(task_id)

                plat = (it.get("platform") or "unknown").lower()
                action = (it.get("action") or "FOLLOW").upper()
                reward = float(it.get("worker_reward") or it.get("cost_per_task") or it.get("paid") or 0.0)
                ai_reason = it.get("ai_reason") or it.get("rejection_reason") or it.get("reason") or ""

                diag, reco, recoverable = explain_rejection_reason(ai_reason)

                results.append({
                    "id": task_id,
                    "platform": plat,
                    "action": action,
                    "reward": reward,
                    "target_url": it.get("target_url") or "",
                    "target_username": it.get("target_username") or "",
                    "ai_reason_raw": ai_reason,
                    "diagnosis": diag,
                    "recommendation": reco,
                    "recoverable": recoverable,
                    "status_retry": "En attente"
                })

        self.cached_tasks = results
        return results

    def retry_single_task(self, task_info: Dict[str, Any], approved_accounts: Dict[str, Any]) -> Tuple[bool, str]:
        """
        Exécute la récupération d'une tâche rejetée de manière ultra stricte :
        - Vérifie l'éligibilité du compte
        - Nettoie les popups
        - Évite le double-clic (ne pas unfollow)
        - Génère une capture unique certifiée
        - Soumet la preuve
        """
        task_id = task_info["id"]
        plat = task_info["platform"]
        action = task_info["action"]

        print(f"\n{BLUE}▶{RESET} Tâche Rejetée {BOLD}#{task_id}{RESET} [{CYAN}{plat.upper()}{RESET} - {YELLOW}{action}{RESET}]")
        print(f"  📌 Motif rejet initial : {RED}{task_info['diagnosis']}{RESET}")

        if approved_accounts and plat not in approved_accounts:
            msg = f"Compte {plat.upper()} non lié ou non approuvé"
            print(f"  {YELLOW}⚠️ {msg}. Tâche ignorée.{RESET}")
            task_info["status_retry"] = msg
            return False, msg

        acc_id = approved_accounts.get(plat, {}).get("id") if approved_accounts else None

        # 1. Redémarrage de la tâche
        print(f"  🔄 Réactivation de la tâche #{task_id} sur PR.Social...")
        start_st, start_res = self.api.start_task(task_id, social_account_id=acc_id)

        if start_st == 429 or start_res.get("code") == "COOLDOWN":
            wait_cd = int(start_res.get("wait_sec") or 3)
            print(f"  ⏳ Cooldown PR.Social ({wait_cd}s)...")
            time.sleep(wait_cd + 1)
            start_st, start_res = self.api.start_task(task_id, social_account_id=acc_id)

        if start_st != 200 or not start_res.get("ok"):
            err_raw = str(start_res.get("error", "Erreur redémarrage"))
            code = start_res.get("code", "")
            if code == "SLOTS_TAKEN" or "все места" in err_raw:
                fr_msg = "Places occupées par d'autres utilisateurs"
            elif code == "NOT_FOUND" or "not found" in err_raw.lower():
                fr_msg = "Campagne clôturée ou expirée"
            elif "already claimed" in err_raw.lower() or "уже выполн" in err_raw.lower():
                fr_msg = "Tâche verrouillée par PR.Social"
            else:
                fr_msg = err_raw
            print(f"  {RED}✖ Impossible de relancer : {fr_msg}{RESET}")
            task_info["status_retry"] = fr_msg
            return False, fr_msg

        # Résolution de l'URL cible
        target_url = (
            start_res.get("task", {}).get("target_url")
            or task_info.get("target_url")
            or ""
        )
        if not target_url:
            u_name = (
                start_res.get("task", {}).get("target_username")
                or task_info.get("target_username")
                or ""
            ).strip().lstrip("@")
            if u_name:
                if plat == "threads": target_url = f"https://www.threads.net/@{u_name}"
                elif plat == "reddit": target_url = f"https://www.reddit.com/user/{u_name}"
                elif plat in ["twitter", "x"]: target_url = f"https://x.com/{u_name}"
                elif plat == "instagram": target_url = f"https://www.instagram.com/{u_name}"
                elif plat == "tiktok": target_url = f"https://www.tiktok.com/@{u_name}"
                elif plat == "linkedin": target_url = f"https://www.linkedin.com/in/{u_name}"
                elif plat == "snapchat": target_url = f"https://www.snapchat.com/add/{u_name}"
                elif plat == "telegram": target_url = f"https://t.me/{u_name}"
                elif plat == "github": target_url = f"https://github.com/{u_name}"
                elif plat == "facebook": target_url = f"https://www.facebook.com/{u_name}"
                elif plat == "pinterest": target_url = f"https://www.pinterest.com/{u_name}/"
                elif plat in ["soundcloud", "sound_cloud"]: target_url = f"https://soundcloud.com/{u_name}"
                elif plat in ["bluesky", "bsky"]:
                    bsky_handle = u_name if "." in u_name else f"{u_name}.bsky.social"
                    target_url = f"https://bsky.app/profile/{bsky_handle}"

        if not target_url:
            print(f"  {YELLOW}⚠️ URL cible introuvable. Annulation sécurisée...{RESET}")
            self.api.cancel_task(task_id)
            task_info["status_retry"] = "URL introuvable"
            return False, "URL cible introuvable"

        wait_sec = int(start_res.get("submit_after_sec") or 5)
        api_check = start_res.get("api_check_enabled", 0)

        # Préparation du commentaire si nécessaire
        comment_text = None
        if "comment" in action.lower():
            comment_text = (
                start_res.get("completion", {}).get("assigned_comment")
                or start_res.get("task", {}).get("assigned_comment")
                or "Top! 🔥"
            )

        print(f"  🌐 URL : {DIM}{target_url}{RESET}")
        print(f"  🛡️ Exécution stricte en cours...")

        # 2. Exécution dans le navigateur Termux
        ok_act, msg_act, shot_path = self.browser.execute_task_action(
            platform=plat,
            action=action,
            target_url=target_url,
            task_id=task_id,
            comment_text=comment_text
        )

        is_validated = False

        # 3. Vérification API Check si active
        if api_check == 1:
            c_st, c_res = self.api.api_check_task(task_id)
            if c_st == 200 and c_res.get("found") is True and c_res.get("approved") is True:
                is_validated = True
                print(f"  {GREEN}✓ Validé instantanément par API Check !{RESET}")

        # 4. Soumission de la preuve certifiée
        if not is_validated:
            if ok_act and os.path.exists(shot_path):
                print(f"  ⏳ Sécurité ({wait_sec}s) puis soumission de la nouvelle preuve...")
                time.sleep(wait_sec + 1)
                sub_st, sub_res = self.api.submit_screenshot(task_id, shot_path)
                if sub_st == 200 and sub_res.get("ok"):
                    is_validated = True
                    print(f"  {GREEN}✓ Nouvelle preuve certifiée envoyée avec succès !{RESET}")
                else:
                    err_sub = str(sub_res.get("error", "Rejet lors de l'envoi"))
                    print(f"  {YELLOW}⚠️ Échec de soumission: {err_sub}{RESET}")
                    self.api.cancel_task(task_id)
            else:
                print(f"  🛡️ {RED}Action ou capture non certifiée. Annulation préventive anti-ban.{RESET}")
                self.api.cancel_task(task_id)

        if is_validated:
            task_info["status_retry"] = "Succès (Validée)"
            print(f"  {GREEN}{BOLD}🎉 Récupération réussie pour #{task_id} !{RESET}")
            return True, "Validée"
        else:
            task_info["status_retry"] = "Échec récupération"
            return False, "Non validée"
