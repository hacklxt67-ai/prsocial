import time
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
        self.selected_platforms = ["threads", "reddit", "tiktok", "facebook", "instagram", "youtube", "telegram", "twitter", "snapchat", "github", "discord"]
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

    def log(self, message: str, level: str = "info"):
        if self.cb_log:
            self.cb_log(message, level)

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
        while not self.stop_requested:
            tasks_executed_in_round = 0

            for platform in active_platforms:
                if self.stop_requested:
                    break

                # Vérifier si la plateforme est en cooldown
                if platform in platform_cooldowns and time.time() < platform_cooldowns[platform]:
                    rem = int(platform_cooldowns[platform] - time.time())
                    self.log(f"Plateforme [{platform.upper()}] en pause ({rem}s restantes).", "info")
                    continue

                self.log(f"Recherche de tâches disponibles pour [{platform.upper()}]...", "info")
                status, tasks_data = self.api.get_available_tasks(platform=platform, sort="reward", limit=20)
                
                if status != 200:
                    self.log(f"Erreur API ({status}) sur [{platform.upper()}]: {tasks_data.get('error')}", "warning")
                    continue

                tasks = tasks_data.get("tasks", [])
                if not tasks:
                    self.log(f"Aucune tâche disponible pour [{platform.upper()}]. Cooldown de 45s.", "info")
                    platform_cooldowns[platform] = time.time() + 45
                    continue

                self.log(f"{len(tasks)} tâche(s) trouvée(s) pour [{platform.upper()}]. Exécution...", "info")

                for task in tasks:
                    if self.stop_requested:
                        break

                    task_id = task.get("id")
                    action = task.get("action", "FOLLOW")
                    reward = float(task.get("worker_reward") or task.get("cost_per_task") or 0.0)
                    acc_info = linked_accounts.get(platform)
                    acc_id = acc_info.get("id") if acc_info else None

                    self.log(f"Démarrage tâche #{task_id} [{platform.upper()} - {action}] (Gain: ${reward:.3f})...", "info")

                    # Démarrer la tâche sur l'API PR.Social
                    start_st, start_res = self.api.start_task(task_id, social_account_id=acc_id)
                    if start_st != 200 or not start_res.get("ok"):
                        err_msg = start_res.get("error", "Erreur inconnue")
                        if start_st == 429:
                            self.log(f"Limite horaire atteinte pour [{platform.upper()}]. Pause de 60s activée.", "warning")
                            platform_cooldowns[platform] = time.time() + 60
                            break
                        self.log(f"Impossible de démarrer la tâche #{task_id}: {err_msg}", "warning")
                        self.tasks_failed += 1
                        time.sleep(2)
                        continue

                    tasks_executed_in_round += 1

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

                    if not target_url:
                        self.log(f"Tâche #{task_id}: Aucune URL cible reçue. Annulation.", "warning")
                        self.api.cancel_task(task_id)
                        self.tasks_failed += 1
                        continue

                    self.log(f"Navigation vers: {target_url}", "info")
                    self.log(f"Exécution automatique de l'action [{action.upper()}] en cours...", "info")
                    success, act_msg, screenshot_path = self.browser_bot.execute_task_action(
                        platform=platform,
                        action=action,
                        target_url=target_url,
                        task_id=task_id
                    )

                    # GARDE-FOU ANTI-BAN STRICT : Ne JAMAIS soumettre si l'action ou la capture est invalide
                    if not success:
                        self.log(f"🛡️ SÉCURITÉ ANTI-BAN : Capture rejetée ({act_msg}). Annulation propre de #{task_id}.", "warning")
                        self.api.cancel_task(task_id)
                        self.tasks_failed += 1
                        if self.cb_stats:
                            self.cb_stats(self.tasks_success, self.tasks_failed, self.earnings_session)
                        continue

                    # Soumission de la preuve vérifiée (Capture d'écran)
                    self.log(f"Preuve vérifiée avec succès ! Envoi sécurisé pour #{task_id}...", "info")
                    sub_st, sub_res = self.api.submit_screenshot(task_id, screenshot_path)

                    # Vérification automatique si disponible
                    api_check_st, api_check_res = self.api.api_check_task(task_id)

                    is_confirmed = False
                    if sub_st == 200 and sub_res.get("ok"):
                        is_confirmed = True
                    elif api_check_st == 200 and api_check_res.get("ok"):
                        is_confirmed = True

                    if is_confirmed:
                        self.tasks_success += 1
                        self.earnings_session += reward
                        self.log(f"🎉 SUCCÈS: Tâche #{task_id} validée ! +${reward:.3f} crédités.", "success")
                        
                        # Actualiser le solde
                        _, fresh_me = self.api.get_me()
                        if fresh_me.get("user"):
                            fresh_bal = float(fresh_me["user"].get("balance", 0.0))
                            if self.cb_balance:
                                self.cb_balance(fresh_bal)
                    else:
                        self.tasks_failed += 1
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
                self.log("Rotation terminée (aucun travail actif). Pause de 15s avant le prochain cycle...", "info")
                for _ in range(15):
                    if self.stop_requested:
                        break
                    time.sleep(1)

        self.log("=== AUTOMATISATION ARRÊTÉE ===", "warning")
        self.browser_bot.stop_driver()
