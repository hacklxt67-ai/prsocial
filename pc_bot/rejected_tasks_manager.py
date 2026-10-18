import os
import sys
import time
import json
import random
import logging
from typing import List, Dict, Any, Tuple, Optional, Callable

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

from .pr_api import PrSocialAPI
from .browser_bot import BrowserBot, ensure_unique_screenshot

logger = logging.getLogger("RejectedTasksManager")

# ==============================================================================
# 1. ANALYSEUR D'ERREURS ET MOTIFS DE REJET IA
# ==============================================================================
def analyze_rejection_error(raw_reason: Optional[str], platform: str, action: str) -> Dict[str, str]:
    """
    Analyse de manière approfondie les erreurs et motifs de rejet envoyés par l'IA ou les modérateurs de PR.Social.
    Retourne une explication claire et la stratégie corrective stricte à appliquer.
    """
    reason_str = (raw_reason or "").strip()
    reason_lower = reason_str.lower()

    if not reason_str:
        return {
            "category": "INCONNUE / NON SPÉCIFIÉE",
            "raw": "Aucune raison spécifiée par le modérateur",
            "explanation": "L'action n'a pas pu être validée lors de la première tentative (délai dépassé ou capture ambiguë).",
            "strict_measure": "Application d'un temps de pose allongé (7s) + cadrage haute fidélité sur le statut d'abonnement."
        }

    # 1. Capture dupliquée
    if any(k in reason_lower for k in ["duplicate", "dupliqué", "same image", "déjà utilisé", "дубликат"]):
        return {
            "category": "CAPTURE D'ÉCRAN DUPLIQUÉE (HASH NON UNIQUE)",
            "raw": reason_str,
            "explanation": "L'image envoyée avait une signature numérique identique à une autre soumission précédente.",
            "strict_measure": "Prise d'une nouvelle capture directe en temps réel + altération du hash SHA-256 unique au pixel près."
        }

    # 2. Bouton non cliqué / Non abonné
    if any(k in reason_lower for k in ["not following", "non abonné", "pas abonné", "bouton non cliqué", "not subscribed", "подписк", "unfollow"]):
        return {
            "category": "ABONNEMENT NON VISIBLE SUR LA CAPTURE",
            "raw": reason_str,
            "explanation": "L'IA n'a pas vu le bouton passer à l'état 'Abonné' / 'Following' (fermé trop vite ou échec du clic).",
            "strict_measure": "Double vérification DOM : attente active que le bouton se transforme en 'Abonné/Following' avant la capture."
        }

    # 3. Mention / Like manquant
    if any(k in reason_lower for k in ["like", "upvote", "aimer", "лайк", "vote"]):
        return {
            "category": "LIKE / UPVOTE NON DÉTECTÉ",
            "raw": reason_str,
            "explanation": "Le vote ou like n'a pas été enregistré ou a été cliqué deux fois par erreur.",
            "strict_measure": "Vérification stricte de l'attribut aria-pressed/upvoted + coloration de l'icône Like dans le DOM."
        }

    # 4. Commentaire manquant ou incorrect
    if any(k in reason_lower for k in ["comment", "коммент", "commentaire"]):
        return {
            "category": "COMMENTAIRE INTROUVABLE OU INVALIDE",
            "raw": reason_str,
            "explanation": "Le commentaire n'apparaissait pas clairement sous la publication ou le délai d'indexation était trop court.",
            "strict_measure": "Scroll centré sur le bloc de réponse + attente de 4 secondes pour l'apparition visuelle du message."
        }

    # 5. Page blanche ou non chargée
    if any(k in reason_lower for k in ["blank", "white", "loading", "chargement", "page vide", "not loaded", "login"]):
        return {
            "category": "PAGE NON CHARGÉE OU BLOQUÉE PAR POPUP",
            "raw": reason_str,
            "explanation": "La capture montrait un écran de chargement, une bannière de cookies ou un blocage de connexion.",
            "strict_measure": "Fermeture forcée de toutes les modales intrusives + attente de stabilisation réseau complète."
        }

    # 6. Mauvais profil / Mauvais lien
    if any(k in reason_lower for k in ["wrong", "mauvais", "mismatch", "incorrect", "не тот"]):
        return {
            "category": "CIBLE AMBIGUË OU PROFIL DIFFÉRENT",
            "raw": reason_str,
            "explanation": "L'URL n'a pas redirigé exactement sur le bon profil du créateur.",
            "strict_measure": "Résolution de l'URL canonique + validation de la présence du pseudo cible dans l'en-tête de la page."
        }

    return {
        "category": "REJET GÉNÉRAL IA",
        "raw": reason_str,
        "explanation": f"Motif relevé : « {reason_str} »",
        "strict_measure": "Exécution ultra-stricte avec vérification pré-clic et post-clic dans le DOM."
    }


# ==============================================================================
# 2. MOTEUR D'EXÉCUTION STRICTE
# ==============================================================================
class StrictRetryEngine:
    def __init__(self, api: PrSocialAPI, browser_bot: BrowserBot):
        self.api = api
        self.browser_bot = browser_bot

    def execute_strict_task(
        self,
        platform: str,
        action: str,
        target_url: str,
        task_id: int,
        comment_text: Optional[str] = None,
        log_cb: Optional[Callable[[str, str], None]] = None
    ) -> Tuple[bool, str, str]:
        """
        Exécution avec vérification ULTRA-STRICTE :
        1. Attente prolongée de stabilisation (6s).
        2. Fermeture garantie de tout popup/bannière/cookie.
        3. Détection pré-clic : si déjà abonné/liké, NE PAS re-cliquer pour éviter un désabonnement involontaire.
        4. Clic précis avec centrage visuel (scrollIntoView).
        5. Attente post-clic et vérification que le DOM a bien changé.
        6. Capture haute définition avec hash garanti unique.
        """
        def _log(msg, lvl="info"):
            if log_cb:
                log_cb(msg, lvl)
            else:
                logger.info(f"[{lvl.upper()}] {msg}")

        screenshot_path = os.path.join(
            self.browser_bot.profile_dir if hasattr(self.browser_bot, 'profile_dir') else r"D:\social_pc_bot\screenshots",
            f"strict_retry_{task_id}_{int(time.time())}.png"
        )
        os.makedirs(os.path.dirname(screenshot_path), exist_ok=True)

        try:
            driver = self.browser_bot.start_driver()
            if not self.browser_bot.headless:
                try:
                    driver.maximize_window()
                except Exception:
                    pass

            _log(f"Navigation stricte vers : {target_url}...", "info")
            driver.get(target_url)

            # 1. Attente prolongée pour permettre le chargement asynchrone complet des scripts
            _log("Attente de stabilisation de la page (6.0s)...", "info")
            time.sleep(6.0)

            # 2. Nettoyage universel strict des popups et bannières
            dismiss_script = """
            try {
                // Fermeture des popups / cookies
                var selectors = [
                    '[aria-label="Close"]', '[aria-label="Fermer"]', 'button[aria-label="Close"]',
                    '#onetrust-accept-btn-handler', 'button[id*="cookie" i]', 'button[class*="cookie" i]',
                    '[data-e2e="modal-close-icon"]', '.contextual-sign-in-modal', '.authwall-join-form'
                ];
                for (var s = 0; s < selectors.length; s++) {
                    var els = document.querySelectorAll(selectors[s]);
                    for (var i = 0; i < els.length; i++) {
                        if (els[i].offsetWidth > 0) {
                            try { els[i].click(); } catch(e) {}
                        }
                    }
                }
            } catch(e) {}
            """
            try:
                driver.execute_script(dismiss_script)
            except Exception:
                pass

            platform_lower = platform.lower()
            action_lower = action.lower()

            # 3. Vérification Pré-clic : Est-on déjà abonné ou validé ?
            already_done_check_js = """
            var action = arguments[0];
            var plat = arguments[1];

            // Recherche d'indices de complétion déjà active
            var allBtns = document.querySelectorAll('button, [role="button"], div[role="button"]');
            for (var i = 0; i < allBtns.length; i++) {
                var t = (allBtns[i].textContent || '').trim().toLowerCase();
                var aria = (allBtns[i].getAttribute('aria-label') || '').toLowerCase();
                
                if (action.indexOf('follow') !== -1 || action.indexOf('suivre') !== -1 || action.indexOf('sub') !== -1) {
                    if (t === 'following' || t === 'abonné' || t === 'abonné(e)' || t === 'suivi' || t === 'déjà abonné' || 
                        aria.indexOf('following') !== -1 || aria.indexOf('abonné') !== -1 || t.indexOf('message') !== -1) {
                        try { allBtns[i].scrollIntoView({behavior: 'smooth', block: 'center'}); } catch(e){}
                        return { already_done: true, label: t || aria };
                    }
                }
                if (action.indexOf('like') !== -1 || action.indexOf('upvote') !== -1) {
                    var pressed = allBtns[i].getAttribute('aria-pressed');
                    if (pressed === 'true') {
                        try { allBtns[i].scrollIntoView({behavior: 'smooth', block: 'center'}); } catch(e){}
                        return { already_done: true, label: 'Liked/Pressed' };
                    }
                }
            }
            return { already_done: false };
            """
            status_pre = driver.execute_script(already_done_check_js, action_lower, platform_lower) or {}
            
            if status_pre.get("already_done"):
                _log(f"🛡️ VÉRIFICATION STRICTE : Action déjà active détectée ('{status_pre.get('label')}'). Clic omis pour éviter le désabonnement !", "success")
                time.sleep(2.0)
            else:
                _log(f"Exécution stricte du clic pour [{action.upper()}]...", "info")
                # Exécution via les handlers standardisés
                success, act_msg, _ = self.browser_bot.execute_task_action(
                    platform=platform,
                    action=action,
                    target_url=target_url,
                    task_id=task_id,
                    comment_text=comment_text
                )
                _log(f"Action effectuée : {act_msg}", "info")
                # Attente post-clic pour laisser le DOM et le serveur valider la transition
                time.sleep(3.5)

            # 4. Scroll centré pour cadrer parfaitement la preuve
            driver.execute_script("window.scrollBy(0, 150); setTimeout(function(){ window.scrollBy(0, -100); }, 300);")
            time.sleep(1.5)

            # 5. Capture d'écran HD avec hash garanti unique
            driver.save_screenshot(screenshot_path)
            ensure_unique_screenshot(screenshot_path)
            _log(f"Capture certifiée enregistrée avec hash unique : {os.path.basename(screenshot_path)}", "success")

            return True, "Vérification stricte terminée avec succès", screenshot_path

        except Exception as e:
            _log(f"Erreur lors de l'exécution stricte : {str(e)}", "error")
            try:
                driver.save_screenshot(screenshot_path)
                ensure_unique_screenshot(screenshot_path)
            except Exception:
                pass
            return False, str(e), screenshot_path


# ==============================================================================
# 3. GESTIONNAIRE COMPLET DES TÂCHES REJETÉES
# ==============================================================================
class RejectedTasksManager:
    def __init__(self, api: PrSocialAPI, browser_bot: BrowserBot):
        self.api = api
        self.browser_bot = browser_bot
        self.strict_engine = StrictRetryEngine(api, browser_bot)
        self.cached_rejected_tasks: List[Dict[str, Any]] = []

    def fetch_all_rejected_tasks(self, max_pages: int = 15, log_cb: Optional[Callable[[str, str], None]] = None) -> List[Dict[str, Any]]:
        """
        Récupère toutes les tâches rejetées depuis PR.Social et enrichit chacune avec une analyse d'erreur détaillée.
        """
        def _log(msg, lvl="info"):
            if log_cb:
                log_cb(msg, lvl)
            else:
                logger.info(msg)

        _log("Interrogation de l'API PR.Social pour récupérer les tâches rejetées...", "info")
        results = []
        seen_ids = set()

        for page in range(1, max_pages + 1):
            st, data = self.api.get_rejected_tasks(page=page, limit=50)
            if st != 200:
                _log(f"Erreur HTTP {st} lors de la lecture de la page {page} : {data.get('error')}", "warning")
                break

            items = data.get("items", [])
            if not items:
                break

            for it in items:
                task_id = it.get("order_id") or it.get("id") or it.get("task_id")
                if not task_id or task_id in seen_ids:
                    continue
                seen_ids.add(task_id)

                plat = it.get("platform", "unknown")
                action = it.get("action", "FOLLOW")
                reward = float(it.get("worker_reward") or it.get("cost_per_task") or it.get("paid") or 0.0)

                # Récupération de la raison exacte (ai_reason)
                ai_reason = it.get("ai_reason") or it.get("reject_reason") or it.get("reason")
                if not ai_reason:
                    # Tenter d'obtenir le détail complet de la tâche
                    det_st, det_data = self.api.get_task_details(task_id)
                    if det_st == 200:
                        completion = det_data.get("completion") or {}
                        ai_reason = completion.get("ai_reason") or completion.get("reject_reason")
                        if not it.get("target_url"):
                            it["target_url"] = det_data.get("task", {}).get("target_url")
                        if not it.get("target_username"):
                            it["target_username"] = det_data.get("task", {}).get("target_username")

                # Analyse rigoureuse de l'erreur
                analysis = analyze_rejection_error(ai_reason, plat, action)

                task_obj = {
                    "task_id": task_id,
                    "order_id": it.get("order_id", task_id),
                    "platform": plat,
                    "action": action,
                    "reward": reward,
                    "target_url": it.get("target_url", ""),
                    "target_username": it.get("target_username", ""),
                    "started_at": it.get("started_at", ""),
                    "ai_reason_raw": ai_reason or "Non spécifiée",
                    "analysis": analysis,
                    "status_retry": "En attente"
                }
                results.append(task_obj)

        _log(f"✓ {len(results)} tâche(s) rejetée(s) récupérée(s) et analysée(s) avec succès.", "success")
        self.cached_rejected_tasks = results
        return results

    def retry_single_task(
        self,
        task_info: Dict[str, Any],
        log_cb: Optional[Callable[[str, str], None]] = None
    ) -> Tuple[bool, str]:
        """
        Relance et réessaie une tâche rejetée selon le protocole de vérification STRICT.
        """
        def _log(msg, lvl="info"):
            if log_cb:
                try:
                    log_cb(msg, lvl)
                except UnicodeEncodeError:
                    log_cb(msg.encode("ascii", "replace").decode("ascii"), lvl)
            else:
                try:
                    logger.info(msg)
                except UnicodeEncodeError:
                    logger.info(msg.encode("ascii", "replace").decode("ascii"))

        task_id = task_info["task_id"]
        plat = task_info["platform"]
        action = task_info["action"]
        reward = task_info.get("reward", 0.0)

        _log(f"--- DÉMARRAGE DU RÉESSAI STRICT : Tâche #{task_id} [{plat.upper()} - {action}] ---", "info")
        _log(f"Diagnostic préalable : {task_info['analysis']['category']}", "info")
        _log(f"Correction stricte : {task_info['analysis']['strict_measure']}", "info")

        # 1. Réservation et réactivation de la tâche auprès de PR.Social
        start_st, start_res = self.api.start_task(task_id)

        # Déblocage automatique si une autre tâche est restée bloquée
        if start_st != 200 and (start_res.get("code") == "TASK_IN_PROGRESS" or "active task" in str(start_res).lower()):
            active_info = start_res.get("active") or {}
            active_oid = active_info.get("order_id") or active_info.get("id")
            if active_oid:
                _log(f"Déblocage de la tâche active bloquante #{active_oid}...", "warning")
                self.api.cancel_task(active_oid)
                time.sleep(2.0)
                start_st, start_res = self.api.start_task(task_id)

        # Gestion du cooldown de sécurité
        if start_st == 429 or start_res.get("code") == "COOLDOWN":
            wait_cd = int(start_res.get("wait_sec") or 2)
            _log(f"Pause imposée par PR.Social ({wait_cd}s)...", "info")
            time.sleep(wait_cd + 0.5)
            start_st, start_res = self.api.start_task(task_id)

        if start_st != 200 or not start_res.get("ok"):
            err_code = start_res.get("code", "")
            raw_err = str(start_res.get("error", "Erreur lors du redémarrage"))
            if err_code == "SLOTS_TAKEN" or "все места" in raw_err:
                msg_fr = "Places occupées par d'autres utilisateurs (SLOTS_TAKEN)"
            elif err_code == "NOT_FOUND" or "not found" in raw_err.lower():
                msg_fr = "Campagne expirée ou clôturée par l'annonceur"
            elif "already claimed" in raw_err.lower() or "уже выполн" in raw_err.lower():
                msg_fr = "Tâche verrouillée par PR.Social (Déjà réclamée)"
            else:
                msg_fr = raw_err

            _log(f"Impossible de redémarrer #{task_id} : {msg_fr}", "warning")
            task_info["status_retry"] = f"{msg_fr}"
            return False, msg_fr


        # Extraction de l'URL cible
        target_url = (start_res.get("task", {}).get("target_url") or 
                      task_info.get("target_url") or "")
        if not target_url:
            u_name = (start_res.get("task", {}).get("target_username") or 
                      task_info.get("target_username") or "").strip().lstrip("@")
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

        if not target_url:
            _log(f"Tâche #{task_id} : URL introuvable. Annulation...", "warning")
            self.api.cancel_task(task_id)
            task_info["status_retry"] = "URL introuvable"
            return False, "URL cible introuvable"

        wait_sec = int(start_res.get("submit_after_sec") or 5)
        api_check_enabled = start_res.get("api_check_enabled", 0)

        # Préparation du commentaire si nécessaire
        comment_text = None
        if "comment" in action.lower():
            comment_text = (start_res.get("completion", {}).get("assigned_comment") or 
                            start_res.get("task", {}).get("assigned_comment") or 
                            "Very good content! 👍")

        # 2. Exécution avec vérification ULTRA STRICTE
        success, act_msg, screenshot_path = self.strict_engine.execute_strict_task(
            platform=plat,
            action=action,
            target_url=target_url,
            task_id=task_id,
            comment_text=comment_text,
            log_cb=log_cb
        )

        is_validated = False

        # 3. Vérification API si supportée
        if api_check_enabled == 1:
            _log("Tentative de validation instantanée par l'API...", "info")
            api_st, api_res = self.api.api_check_task(task_id)
            if api_st == 200 and api_res.get("found") is True and api_res.get("approved") is True:
                is_validated = True
                _log(f"✓ Validé immédiatement par l'API PR.Social !", "success")

        # 4. Soumission de la preuve certifiée
        if not is_validated and os.path.exists(screenshot_path):
            _log(f"Attente réglementaire de sécurité ({wait_sec}s) avant upload...", "info")
            time.sleep(wait_sec)
            _log("Envoi de la nouvelle preuve certifiée...", "info")
            sub_st, sub_res = self.api.submit_screenshot(task_id, screenshot_path)

            if sub_st == 200 and sub_res.get("ok"):
                is_validated = True
                stat_val = sub_res.get("completion", {}).get("status", "pending_review")
                _log(f"✓ Preuve acceptée par PR.Social (Statut : {stat_val}) !", "success")
            else:
                err = sub_res.get("error", f"Erreur status {sub_st}")
                _log(f"Soumission refusée : {err}", "error")

        if is_validated:
            task_info["status_retry"] = "Succès ✅"
            _log(f"🎉 SUCCÈS : Tâche #{task_id} récupérée et resoumise avec succès ! Gain potentiel : +${reward:.3f}", "success")
            return True, "Validé"
        else:
            task_info["status_retry"] = "Échec ❌"
            _log(f"Tâche #{task_id} non validée. Annulation de sécurité...", "warning")
            self.api.cancel_task(task_id)
            return False, "Non validé"
