import os
import time
import json
import random
import threading
from typing import List, Callable, Optional, Dict, Any
from .pr_api import PrSocialAPI
from .browser_bot import BrowserBot

class AutomationEngine:
    def __init__(self, api: PrSocialAPI, browser_bot: BrowserBot):
        self.api = api
        self.browser_bot = browser_bot
        self.is_running = False
        self.stop_requested = False
        self.worker_thread: Optional[threading.Thread] = None
        
        # Configuration
        self.selected_platforms = ["threads", "reddit", "pinterest", "soundcloud", "bluesky", "tiktok", "facebook", "instagram", "youtube", "telegram", "twitter", "snapchat", "github", "discord"]
        self.delay_min = 5.0
        self.delay_max = 12.0
        
        # Callbacks for GUI
        self.cb_log: Optional[Callable[[str, str], None]] = None
        self.cb_balance: Optional[Callable[[float], None]] = None
        self.cb_stats: Optional[Callable[[int, int, float], None]] = None
        self.cb_status: Optional[Callable[[bool], None]] = None

        # Session Stats
        self.tasks_success = 0
        self.tasks_failed = 0
        self.earnings_session = 0.0
        self.failed_tasks: Dict[int, float] = {}
        self.COOLDOWN_FAILED_SECONDS = 900

    def log(self, message: str, level: str = "info"):
        if self.cb_log:
            self.cb_log(message, level)

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

    def start(self, platforms: Optional[List[str]] = None):
        if self.is_running:
            return
        if platforms:
            self.selected_platforms = platforms

        self.is_running = True
        self.stop_requested = False
        if self.cb_status:
            self.cb_status(True)

        self.worker_thread = threading.Thread(target=self._run_loop, daemon=True)
        self.worker_thread.start()

    def stop(self):
        if not self.is_running:
            return
        self.log("Arrêt de l'automatisation en cours...", "warning")
        self.stop_requested = True
        self.is_running = False
        if self.cb_status:
            self.cb_status(False)

    def _run_loop(self):
        self.log("=== DÉMARRAGE DU BOT AUTOMATIQUE PR.SOCIAL (PC) ===", "success")

        # 1. Vérification session
        status, me = self.api.get_me()
        if status != 200 or not me.get("user"):
            self.log(f"Échec d'authentification (Status {status}): {me.get('error', 'Token invalide')}", "error")
            self.stop()
            return

        user_info = me["user"]
        balance = float(user_info.get("balance", 0.0))
        self.log(f"Connecté: @{user_info.get('username')} (ID: {user_info.get('id')}) | Solde actuel: ${balance:.3f}", "success")
        if self.cb_balance:
            self.cb_balance(balance)

        # 2. Vérification des comptes sociaux
        status, socials = self.api.get_socials()
        linked_accounts = {}
        if status == 200:
            all_raw = list(socials.get("accounts", []))
            for p_obj in socials.get("platforms", []):
                all_raw.extend(p_obj.get("accounts", []))

            for acc in all_raw:
                p = acc.get("platform", "").lower()
                st = acc.get("status")
                if st == "approved":
                    linked_accounts[p] = acc
                    self.log(f"Compte approuvé: [{p.upper()}] @{acc.get('username')}", "info")
                else:
                    self.log(f"Compte non approuvé [{p.upper()}]: '{st}'", "warning")
        else:
            self.log("Note: Impossible de vérifier les comptes liés (erreur réseau/temporaire). Poursuite avec les plateformes demandées.", "warning")

        # Si des comptes ont été identifiés, on filtre. Sinon on autorise les plateformes sélectionnées
        if linked_accounts:
            active_platforms = [p for p in self.selected_platforms if p in linked_accounts]
        else:
            active_platforms = list(self.selected_platforms)

        if not active_platforms:
            self.log("Aucune plateforme approuvée sélectionnée. Liez vos comptes sur PR.Social.", "error")
            self.stop()
            return

        self.log(f"Plateformes prêtes pour les tâches: {', '.join([p.upper() for p in active_platforms])}", "info")
        platform_cooldowns: Dict[str, float] = {}

        # 3. Boucle principale de traitement
        platform_counts: Dict[str, int] = {}

        # 3. Boucle principale de traitement
        while not self.stop_requested:
            tasks_executed_in_round = 0
            # Trier les plateformes : prioritiser celles où le serveur PR.Social indique qu'il y a des tâches
            ordered_platforms = sorted(active_platforms, key=lambda p: platform_counts.get(p, 1), reverse=True)

            for platform in ordered_platforms:
                if self.stop_requested:
                    break

                # Vérifier si la plateforme est en cooldown
                if platform in platform_cooldowns and time.time() < platform_cooldowns[platform]:
                    rem = int(platform_cooldowns[platform] - time.time())
                    self.log(f"Plateforme [{platform.upper()}] en pause ({rem}s restantes).", "info")
                    continue

                self.log(f"Recherche de tâches disponibles pour [{platform.upper()}]...", "info")
                status, tasks_data = self.api.get_available_tasks(platform=platform, sort="reward", limit=500)
                
                if status != 200:
                    self.log(f"Erreur API ({status}) sur [{platform.upper()}]: {tasks_data.get('error')}", "warning")
                    continue

                # Détection des paires en limite horaire (exhausted_pairs) renvoyées par le serveur PR.Social
                exhausted = tasks_data.get("exhausted_pairs") or []
                exhausted_actions = set()
                if isinstance(exhausted, list):
                    for ep in exhausted:
                        if isinstance(ep, dict) and ep.get("platform", "").lower() == platform.lower():
                            exhausted_actions.add(ep.get("action", "").lower())
                            mins = ep.get("retry_after_min", 30)
                            self.log(f"⚠️ Limite horaire serveur sur [{platform.upper()}/{ep.get('action')}] (~{mins} min restantes).", "warning")

                # Mise à jour du radar serveur en temps réel
                if isinstance(tasks_data.get("platformCounts"), list):
                    for pc in tasks_data["platformCounts"]:
                        if isinstance(pc, dict) and "platform" in pc:
                            platform_counts[pc["platform"].lower()] = int(pc.get("count", 0))

                tasks = tasks_data.get("tasks", [])
                # Si aucune tâche avec sort="reward", tenter sort="new" pour attraper les tâches fraîches
                if not tasks:
                    status_new, data_new = self.api.get_available_tasks(platform=platform, sort="new", limit=500)
                    if status_new == 200:
                        tasks = data_new.get("tasks", [])

                if not tasks:
                    self.log(f"Aucune tâche disponible pour [{platform.upper()}]. Rotation vers la suite...", "info")
                    platform_cooldowns[platform] = time.time() + 15
                    continue

                # Filtrer les actions sous limite horaire
                if exhausted_actions:
                    tasks = [t for t in tasks if t.get("action", "").lower() not in exhausted_actions]
                    if not tasks:
                        self.log(f"Toutes les tâches disponibles sur [{platform.upper()}] sont en limite horaire. Rotation...", "info")
                        platform_cooldowns[platform] = time.time() + 60
                        continue

                # Alterner intelligemment les actions (Follow, Like, Comment, etc.)
                tasks = self.interleave_task_actions(tasks)

                consecutive_busy = 0
                for task in tasks:
                    if self.stop_requested:
                        break

                    task_id = task.get("id")
                    if task_id in self.failed_tasks:
                        if time.time() - self.failed_tasks[task_id] < self.COOLDOWN_FAILED_SECONDS:
                            continue
                        else:
                            del self.failed_tasks[task_id]

                    action = task.get("action", "FOLLOW")
                    reward = float(task.get("worker_reward") or task.get("cost_per_task") or 0.0)
                    acc_info = linked_accounts.get(platform)
                    acc_id = acc_info.get("id") if acc_info else None

                    # Démarrer la tâche sur l'API PR.Social
                    start_st, start_res = self.api.start_task(task_id, social_account_id=acc_id)
                    if start_st != 200 or not start_res.get("ok"):
                        err_msg = str(start_res.get("error", "Erreur inconnue"))
                        err_code = str(start_res.get("code", ""))

                        is_busy = (err_code in ["SLOTS_TAKEN", "NOT_FOUND"] or
                                   any(k in err_msg.lower() for k in ["все места", "places", "not found", "inactive", "уже выполн"]))

                        if is_busy:
                            self.failed_tasks[task_id] = time.time() - self.COOLDOWN_FAILED_SECONDS + 120
                            consecutive_busy += 1
                            if consecutive_busy >= 3:
                                self.log(f"Lot [{platform.upper()}] temporairement saturé ({consecutive_busy} tâches complètes). Rotation vers la suite...", "info")
                                break
                        else:
                            self.failed_tasks[task_id] = time.time()
                            self.log(f"Impossible de démarrer #{task_id}: {err_msg}", "warning")

                        if start_st == 429 or err_code == "HOURLY_LIMIT":
                            self.log(f"Limite horaire atteinte pour [{platform.upper()}]. Pause de 45s activée.", "warning")
                            platform_cooldowns[platform] = time.time() + 45
                            break

                        self.tasks_failed += 1
                        time.sleep(1.0)
                        continue

                    # Tâche réservée avec succès
                    consecutive_busy = 0
                    tasks_executed_in_round += 1
                    self.log(f"🚀 Tâche réservée #{task_id} [{platform.upper()} - {action}] (Gain: ${reward:.3f})...", "info")

                    # Récupérer l'URL cible
                    target_url = start_res.get("task", {}).get("target_url") or task.get("target_url")
                    if not target_url:
                        u_name = (start_res.get("task", {}).get("target_username") or task.get("target_username") or "").strip().lstrip("@")
                        if u_name:
                            if platform == "threads":
                                target_url = f"https://www.threads.net/@{u_name}"
                            elif platform == "reddit":
                                target_url = f"https://www.reddit.com/user/{u_name}"
                            elif platform in ["twitter", "x"]:
                                target_url = f"https://x.com/{u_name}"
                            elif platform == "instagram":
                                target_url = f"https://www.instagram.com/{u_name}"
                            elif platform == "tiktok":
                                target_url = f"https://www.tiktok.com/@{u_name}"
                            elif platform == "pinterest":
                                target_url = f"https://www.pinterest.com/{u_name}/"
                            elif platform in ["soundcloud", "sound_cloud"]:
                                target_url = f"https://soundcloud.com/{u_name}"
                            elif platform in ["bluesky", "bsky"]:
                                bsky_handle = u_name if "." in u_name else f"{u_name}.bsky.social"
                                target_url = f"https://bsky.app/profile/{bsky_handle}"

                    if not target_url:
                        self.log(f"Tâche #{task_id}: Aucune URL cible reçue. Annulation.", "warning")
                        self.api.cancel_task(task_id)
                        self.tasks_failed += 1
                        continue

                    # Préparation du commentaire si nécessaire
                    comment_text = None
                    if "comment" in action.lower():
                        assigned = start_res.get("completion", {}).get("assigned_comment") or start_res.get("task", {}).get("assigned_comment")
                        if not assigned:
                            c_list = start_res.get("task", {}).get("comment_list")
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
                                "Nice post! 👏"
                            ])
                        comment_text = str(assigned).strip()

                    self.log(f"Navigation vers: {target_url}", "info")
                    self.log(f"Exécution automatique de l'action [{action.upper()}] en cours...", "info")
                    success, act_msg, screenshot_path = self.browser_bot.execute_task_action(
                        platform=platform,
                        action=action,
                        target_url=target_url,
                        task_id=task_id,
                        comment_text=comment_text
                    )

                    is_confirmed = False
                    api_check_enabled = start_res.get("api_check_enabled", 0)

                    # 1. Vérification API instantanée si disponible (sans téléversement lourd)
                    if api_check_enabled == 1:
                        self.log("Tentative de validation instantanée par API Check...", "info")
                        api_check_st, api_check_res = self.api.api_check_task(task_id)
                        if api_check_st == 200 and api_check_res.get("found") is True and api_check_res.get("approved") is True:
                            is_confirmed = True
                            self.log(f"✓ Validé instantanément par l'API PR.Social !", "success")

                    # 2. Soumission de la preuve vérifiée si non validé par API
                    if not is_confirmed:
                        # GARDE-FOU ANTI-REJET STRICT : Ne JAMAIS envoyer de capture si l'action a échoué
                        if success and screenshot_path and os.path.exists(screenshot_path):
                            wait_sec = int(start_res.get("submit_after_sec") or 5)
                            if wait_sec > 0:
                                time.sleep(wait_sec)
                            self.log(f"Preuve conforme vérifiée. Envoi pour #{task_id}...", "info")
                            sub_st, sub_res = self.api.submit_screenshot(task_id, screenshot_path)
                            if sub_st == 200 and sub_res.get("ok"):
                                is_confirmed = True
                                self.log(f"✓ Capture acceptée par PR.Social (Statut: {sub_res.get('completion', {}).get('status', 'pending_review')})", "success")
                            else:
                                err_sub = sub_res.get("error", f"Status {sub_st}")
                                self.log(f"Soumission refusée pour #{task_id} ({err_sub}). Annulation de sécurité...", "warning")
                                self.api.cancel_task(task_id)
                                self.failed_tasks[task_id] = time.time()
                                self.tasks_failed += 1
                                continue
                        else:
                            # L'action a échoué dans Chrome (bouton non cliqué, page blanche, etc.)
                            self.log(f"🛡️ SÉCURITÉ ANTI-REJET : Action non confirmée ({act_msg}). Capture écartée.", "warning")
                            self.log(f"🛡️ Annulation sécurisée de #{task_id} pour empêcher tout avertissement ou ban PR.Social.", "info")
                            self.api.cancel_task(task_id)
                            self.failed_tasks[task_id] = time.time()
                            self.tasks_failed += 1
                            continue

                    if is_confirmed:
                        self.tasks_success += 1
                        self.earnings_session += reward
                        self.failed_tasks[task_id] = time.time() + 86400
                        self.log(f"🎉 SUCCÈS: Tâche #{task_id} validée ! +${reward:.3f} crédités.", "success")
                        
                        # Actualiser le solde
                        _, fresh_me = self.api.get_me()
                        if fresh_me.get("user"):
                            fresh_bal = float(fresh_me["user"].get("balance", 0.0))
                            if self.cb_balance:
                                self.cb_balance(fresh_bal)
                    else:
                        self.tasks_failed += 1
                        self.failed_tasks[task_id] = time.time()
                        self.log(f"Tâche #{task_id}: Soumission effectuée (en cours de revue).", "info")

                    if self.cb_stats:
                        self.cb_stats(self.tasks_success, self.tasks_failed, self.earnings_session)

                    # Pause de sécurité entre actions
                    delay = self.delay_min + (self.delay_max - self.delay_min) * 0.5
                    self.log(f"Pause de sécurité: {delay:.1f}s...", "info")
                    time.sleep(delay)

                # Petite temporisation entre les plateformes pour éviter 429
                time.sleep(2.0)

            if tasks_executed_in_round == 0:
                radar_total = sum(platform_counts.values()) if platform_counts else 0
                active_has_tasks = sum(platform_counts.get(p, 0) for p in active_platforms)
                if active_has_tasks > 0:
                    self.log(f"Radar PR.Social : {active_has_tasks} tâche(s) détectée(s) sur vos réseaux. Reprise dans 3s...", "info")
                    pause_sec = 3
                elif radar_total > 0:
                    self.log(f"Radar global : {radar_total} tâche(s) sur le serveur. Réévaluation rapide dans 5s...", "info")
                    pause_sec = 5
                else:
                    self.log("Aucune nouvelle tâche disponible actuellement. Veille rapide de 6s...", "info")
                    pause_sec = 6

                for _ in range(pause_sec):
                    if self.stop_requested:
                        break
                    time.sleep(1)

        self.log("=== AUTOMATISATION ARRÊTÉE ===", "warning")
        self.browser_bot.stop_driver()
