import os
import time
import requests
from typing import Optional, Dict, Any, Tuple

BASE_URL = "https://pr.social/api"
DEFAULT_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"

class PrSocialAPI:
    def __init__(self, token: str = "", cf_clearance: str = "", user_agent: str = DEFAULT_UA):
        self.session = requests.Session()
        self.user_agent = user_agent
        self.token = token.strip()
        self.cf_clearance = cf_clearance.strip()
        self._update_headers()

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
        self.session.headers.update({
            "User-Agent": self.user_agent,
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
            "Referer": "https://pr.social/tasks",
            "Cookie": cookie_str
        })

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

    def api_check_task(self, task_id: int) -> Tuple[int, Dict[str, Any]]:
        return self.request("POST", f"/tasks/{task_id}/api-check")

    def is_api_check_enabled(self) -> bool:
        status, data = self.request("GET", "/tasks/api-check-enabled")
        if status == 200:
            return data.get("enabled") == 1
        return False

    def submit_screenshot(self, task_id: int, screenshot_path: str) -> Tuple[int, Dict[str, Any]]:
        if not os.path.exists(screenshot_path):
            return 0, {"error": f"Fichier screenshot introuvable: {screenshot_path}"}

        url = f"{BASE_URL}/tasks/{task_id}/submit"
        filename = os.path.basename(screenshot_path)
        mime_type = "image/png" if filename.lower().endswith(".png") else "image/jpeg"

        headers = dict(self.session.headers)
        headers.pop("Content-Type", None)

        try:
            with open(screenshot_path, "rb") as f:
                files = {"screenshot": (filename, f, mime_type)}
                resp = requests.post(url, files=files, headers=headers, timeout=30)
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
