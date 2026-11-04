import re
import requests
from typing import Dict, List, Tuple, Any, Optional

NEED_RULES = {
    "tiktok": ["public", "video1", "avatar", "digits"],
    "twitter": ["public", "post1", "avatar", "digits"],
    "instagram": ["public", "post5", "digits"],
    "youtube": ["video1"],
    "threads": ["avatar"],
    "linkedin": ["avatar"],
    "reddit": ["avatar"],
}

DEFAULT_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"

class ProfileComplianceSentinel:
    """
    Sentinelle de conformité et audit préventif des profils sociaux pour Android / Termux.
    """

    @staticmethod
    def audit_account(platform: str, username: str, profile_url: str = "") -> Dict[str, Any]:
        plat = platform.lower()
        rules = NEED_RULES.get(plat, [])
        issues: List[str] = []
        recommendations: List[str] = []
        is_safe = True

        if re.search(r'\d{5,}', username):
            issues.append(f"Le pseudo '{username}' a 5 chiffres consécutifs ou plus (risque détection bot).")
            is_safe = False

        target_url = profile_url.strip()
        if not target_url:
            if plat == "instagram": target_url = f"https://www.instagram.com/{username}/"
            elif plat == "tiktok": target_url = f"https://www.tiktok.com/@{username}"
            elif plat == "linkedin": target_url = f"https://www.linkedin.com/in/{username}/"
            elif plat in ["twitter", "x"]: target_url = f"https://x.com/{username}"
            elif plat == "youtube": target_url = f"https://www.youtube.com/@{username}"
            elif plat == "threads": target_url = f"https://www.threads.net/@{username}"
            elif plat == "reddit": target_url = f"https://www.reddit.com/user/{username}"
            elif plat == "snapchat": target_url = f"https://www.snapchat.com/add/{username}"

        headers = {
            "User-Agent": DEFAULT_UA,
            "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        }

        body_text = ""
        http_ok = True
        try:
            r = requests.get(target_url, headers=headers, timeout=6, allow_redirects=True)
            if r.status_code in [404, 410]:
                issues.append(f"Profil inaccessible (Erreur HTTP {r.status_code}).")
                is_safe = False
                http_ok = False
            body_text = r.text.lower()
        except Exception:
            pass

        if http_ok and body_text:
            if any(k in body_text for k in ["ce compte est privé", "this account is private"]):
                issues.append("Compte PRIVÉ. PR.Social exige un compte PUBLIC.")
                is_safe = False

            if any(k in body_text for k in ["page not found", "cette page n'est pas disponible"]):
                issues.append("Page de profil introuvable (404/Non existant).")
                is_safe = False

            if plat == "instagram":
                m_posts = re.search(r'([0-9,]+)\s*(?:publications|posts)', body_text)
                if m_posts:
                    try:
                        n_posts = int(m_posts.group(1).replace(',', ''))
                        if n_posts < 5:
                            issues.append(f"Instagram exige 5 posts minimum (détecté : {n_posts}/5).")
                            is_safe = False
                    except Exception:
                        pass
                else:
                    recommendations.append("Vérifiez la présence de 5 photos et d'un avatar.")

            elif plat == "tiktok":
                if any(k in body_text for k in ["pas encore de contenu", "no videos yet"]):
                    issues.append("TikTok exige au moins 1 vidéo publique et un avatar.")
                    is_safe = False

        return {
            "platform": plat,
            "username": username,
            "url": target_url,
            "is_safe": is_safe,
            "issues": issues,
            "recommendations": recommendations,
            "rules": rules
        }

    @classmethod
    def audit_all(cls, accounts: List[Dict[str, Any]]) -> Tuple[List[str], Dict[str, Dict[str, Any]]]:
        quarantined: List[str] = []
        details: Dict[str, Dict[str, Any]] = {}

        for acc in accounts:
            if acc.get("status") != "approved":
                continue
            p = acc.get("platform", "").lower()
            u = acc.get("username", "")
            url = acc.get("profile_url", "")

            report = cls.audit_account(p, u, url)
            details[p] = report
            if not report["is_safe"]:
                quarantined.append(p)

        return quarantined, details

