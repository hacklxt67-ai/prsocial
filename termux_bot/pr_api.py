import os
import sys
import time
import requests
from typing import Optional, Dict, Any, Tuple

try:
    from user_agents import get_random_user_agent, get_client_hints
except ImportError:
    try:
        from termux_bot.user_agents import get_random_user_agent, get_client_hints
    except ImportError:
        def get_random_user_agent(allow_desktop=True):
            return "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.6668.100 Mobile Safari/537.36"
        def get_client_hints(ua):
            return {"sec-ch-ua-platform": '"Android"', "sec-ch-ua-mobile": "?1"}

BASE_URL = "https://pr.social/api"

class PrSocialAPI:
    def __init__(self, token: str = "", cf_clearance: str = "", user_agent: Optional[str] = None):
        self.session = requests.Session()
        self.user_agent = user_agent or get_random_user_agent()
        self.token = token.strip()
        self.cf_clearance = cf_clearance.strip()
        self._update_headers()

    def rotate_user_agent(self) -> str:
        """Génère et applique un nouveau User-Agent avec headers cohérents pour éviter les restrictions."""
        self.user_agent = get_random_user_agent()
        self._update_headers()
        return self.user_agent

    def update_credentials(self, token: str, cf_clearance: str = ""):
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

        cookie_str = "; ".join(cookies)
        hints = get_client_hints(self.user_agent)

        headers = {
            "User-Agent": self.user_agent,
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
            "Origin": "https://pr.social",
            "Referer": "https://pr.social/tasks",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            "Cookie": cookie_str
        }
        headers.update(hints)
        self.session.headers.update(headers)

    def request(self, method: str, path: str, json_data: Optional[Dict] = None, params: Optional[Dict] = None, timeout: int = 35, retries: int = 3) -> Tuple[int, Dict[str, Any]]:
        url = BASE_URL + path
        last_error = ""
        for attempt in range(1, retries + 1):
            try:
                resp = self.session.request(
                    method=method,
                    url=url,
                    json=json_data,
                    params=params,
                    timeout=timeout
                )
                try:
                    data = resp.json()
                except Exception:
                    data = {"raw_text": resp.text, "error": f"Invalid JSON response (Status {resp.status_code})"}
                return resp.status_code, data
            except requests.exceptions.RequestException as e:
                last_error = str(e)
                if attempt < retries:
                    time.sleep(2.0)
                continue
        return 0, {"error": f"Erreur de connexion ({retries} tentatives): {last_error}"}

    def get_me(self) -> Tuple[int, Dict[str, Any]]:
        return self.request("GET", "/auth/me")

    def get_socials(self) -> Tuple[int, Dict[str, Any]]:
        return self.request("GET", "/profile/socials")

    def get_available_tasks(self, platform: str, sort: str = "reward", limit: int = 50) -> Tuple[int, Dict[str, Any]]:
        return self.request("GET", "/tasks/available", params={"platform": platform, "sort": sort, "limit": limit})

    def get_active_tasks(self) -> Tuple[int, Dict[str, Any]]:
        return self.request("GET", "/tasks/my/list", params={"status": "in_progress"})

    def start_task(self, task_id: int, social_account_id: Optional[int] = None) -> Tuple[int, Dict[str, Any]]:
        body = {}
        if social_account_id is not None:
            body["social_account_id"] = social_account_id
        return self.request("POST", f"/tasks/{task_id}/start", json_data=body)

    def get_warnings(self) -> Tuple[int, Dict[str, Any]]:
        """Récupère l'état officiel des avertissements du compte PR.Social."""
        return self.request("GET", "/profile/warnings")

    def api_check_task(self, task_id: int) -> Tuple[int, Dict[str, Any]]:
        # SÉCURITÉ ABSOLUE : Désactivé pour échapper à l'inspection agressive qui dissocie les comptes
        return 0, {"eligible": False, "bypass": True, "error": "API Check désactivé pour protection du compte"}

    def is_api_check_enabled(self) -> bool:
        # Forcer à False pour toujours utiliser la soumission propre de capture d'écran
        return False

    def submit_screenshot(self, task_id: int, screenshot_path: str) -> Tuple[int, Dict[str, Any]]:
        if not os.path.exists(screenshot_path):
            return 0, {"error": f"Fichier screenshot introuvable: {screenshot_path}"}

        upload_path = screenshot_path
        mime_type = "image/png"
        filename = "screenshot.png"

        # Optimisation RAM Nginx : si > 9500 octets, compression WebP pour rester sous le tampon RAM de 10 Ko
        try:
            if os.path.getsize(screenshot_path) > 9500:
                from PIL import Image
                im = Image.open(screenshot_path)
                w, h = im.size
                ratio = 540 / float(w)
                new_h = int(h * ratio)
                im_resized = im.resize((540, new_h), Image.Resampling.LANCZOS)
                
                opt_path = screenshot_path + ".ram_opt.webp"
                im_resized.save(opt_path, format="WEBP", quality=45, method=6)
                if os.path.getsize(opt_path) > 9500:
                    im_resized.save(opt_path, format="WEBP", quality=35, method=6)
                
                upload_path = opt_path
                mime_type = "image/webp"
                filename = "screenshot.webp"
        except Exception:
            upload_path = screenshot_path

        url = f"{BASE_URL}/tasks/{task_id}/submit"
        headers = dict(self.session.headers)
        headers.pop("Content-Type", None)

        try:
            with open(upload_path, "rb") as f:
                files = {"screenshot": (filename, f, mime_type)}
                resp = self.session.post(url, files=files, headers=headers, timeout=35)
                try:
                    data = resp.json()
                except Exception:
                    data = {"raw_text": resp.text, "error": f"Status {resp.status_code}"}
                return resp.status_code, data
        except Exception as e:
            return 0, {"error": f"Erreur lors de l'upload de la capture: {str(e)}"}

    def cancel_task(self, task_id: int) -> Tuple[int, Dict[str, Any]]:
        for ep in [f"/tasks/{task_id}/cancel", f"/tasks/{task_id}/abandon", f"/tasks/{task_id}/skip"]:
            status, res = self.request("POST", ep)
            if status in [200, 201]:
                return status, res
        return 0, {"error": "Impossible d'annuler la tâche sur tous les endpoints."}

    def report_task(self, task_id: int) -> Tuple[int, Dict[str, Any]]:
        return self.request("POST", f"/tasks/{task_id}/report-task", json_data={})

    def get_rejected_tasks(self, page: int = 1, limit: int = 50, scope: str = "manual") -> Tuple[int, Dict[str, Any]]:
        """Récupère la liste des tâches rejetées pour le compte actuel."""
        return self.request("GET", "/tasks/my/list", params={"status": "rejected", "scope": scope, "page": page, "limit": limit})

    def get_task_details(self, task_id: int) -> Tuple[int, Dict[str, Any]]:
        """Récupère les détails complets d'une tâche (incluant la completion et la raison du rejet ai_reason)."""
        return self.request("GET", f"/tasks/{task_id}")

