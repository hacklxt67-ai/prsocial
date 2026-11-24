import os
import re
import hashlib
import secrets
import urllib.request
import urllib.error
import json
from typing import Tuple, Optional, Dict, Any
from database import query_one, query_all, execute_commit

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads", "verify_screenshots"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

PLATFORM_URLS = {
    "instagram": "https://www.instagram.com/{u}/",
    "tiktok": "https://www.tiktok.com/@{u}",
    "youtube": "https://www.youtube.com/@{u}",
    "twitter": "https://x.com/{u}",
    "telegram": "https://t.me/{u}",
    "threads": "https://www.threads.net/@{u}",
    "reddit": "https://www.reddit.com/user/{u}",
    "github": "https://github.com/{u}",
    "bluesky": "https://bsky.app/profile/{u}",
    "vk": "https://vk.com/{u}",
    "snapchat": "https://www.snapchat.com/add/{u}",
    "facebook": "https://www.facebook.com/{u}",
    "linkedin": "https://www.linkedin.com/in/{u}",
    "pinterest": "https://www.pinterest.com/{u}/",
    "twitch": "https://www.twitch.tv/{u}",
}

def clean_username(raw: str, platform: str) -> str:
    u = (raw or "").strip()
    if not u:
        return ""
    # Extract username if user pasted a full URL
    if "://" in u:
        u = u.split("://", 1)[1]
        parts = [p for p in u.split("/") if p]
        if len(parts) >= 2:
            u = parts[-1]
            if u in ("about", "posts", "videos", "reels") and len(parts) >= 3:
                u = parts[-2]
    u = u.split("?")[0].split("#")[0].strip("/")
    if u.startswith("@"):
        u = u[1:]
    return u

def build_profile_url(platform: str, username: str) -> str:
    tmpl = PLATFORM_URLS.get(platform.lower(), "https://{p}.com/{u}")
    return tmpl.format(p=platform.lower(), u=username)

def generate_verify_code() -> str:
    return "PR-" + secrets.token_hex(3).upper()

def fetch_live_bio(platform: str, username: str, code: str) -> Tuple[str, str]:
    """
    Effectue une vérification HTTP réelle en direct sur le profil public.
    Retourne: ('found' | 'not_found' | 'profile_not_found' | 'blocked', message)
    """
    p = platform.lower()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9,fr;q=0.8",
    }

    if p == "github":
        url = f"https://api.github.com/users/{username}"
    elif p == "reddit":
        url = f"https://www.reddit.com/user/{username}/about.json"
    elif p == "bluesky":
        actor = username if "." in username else f"{username}.bsky.social"
        url = f"https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor={actor}"
    elif p == "telegram":
        url = f"https://t.me/{username}"
    else:
        url = build_profile_url(p, username)

    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            status_code = resp.getcode()
            body = resp.read(250_000).decode("utf-8", errors="ignore")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return "profile_not_found", f"Profil @{username} introuvable sur {platform}."
        return "blocked", f"Accès restreint par {platform} (HTTP {e.code}). Utilisez la vérification par capture d'écran."
    except Exception as e:
        return "blocked", f"Impossible de joindre {platform} en direct ({str(e)[:60]}). Utilisez la vérification par capture d'écran."

    if status_code == 404:
        return "profile_not_found", f"Profil @{username} introuvable sur {platform}."

    # Check JSON APIs specifically
    if p == "github":
        try:
            data = json.loads(body)
            bio = (data.get("bio") or "") + " " + (data.get("name") or "")
            if code in bio:
                return "found", f"Code {code} vérifié en direct sur GitHub (@{username}) !"
            return "not_found", f"Code {code} introuvable dans la bio GitHub de @{username}."
        except Exception:
            pass

    if p == "reddit":
        try:
            data = json.loads(body)
            sub = data.get("data", {}).get("subreddit", {})
            bio = (sub.get("public_description") or "") + " " + (sub.get("title") or "")
            if code in bio:
                return "found", f"Code {code} vérifié en direct sur Reddit (u/{username}) !"
            return "not_found", f"Code {code} introuvable dans la description Reddit de u/{username}."
        except Exception:
            pass

    if p == "bluesky":
        try:
            data = json.loads(body)
            bio = (data.get("description") or "") + " " + (data.get("displayName") or "")
            if code in bio:
                return "found", f"Code {code} vérifié en direct sur Bluesky (@{username}) !"
            return "not_found", f"Code {code} introuvable dans la bio Bluesky de @{username}."
        except Exception:
            pass

    # Check if platform served a login wall (common on Instagram/TikTok/X without session)
    lower_body = body.lower()
    if p in ("instagram", "threads") and ("accounts/login" in lower_body and "og:description" not in lower_body):
        return "blocked", f"{platform.capitalize()} exige une connexion pour lire la bio. Utilisez la vérification par capture d'écran."

    if p == "telegram" and "tgme_page_title" not in body and "tgme_page_extra" not in body:
        return "profile_not_found", f"Compte Telegram @{username} introuvable."

    if code in body:
        return "found", f"Code {code} vérifié en direct sur {platform} (@{username}) !"

    return "not_found", f"Code {code} introuvable dans la bio publique de @{username} sur {platform}. Ajoutez-le puis réessayez."

def validate_and_save_screenshot(user_id: int, platform: str, username: str, raw_bytes: bytes) -> Tuple[bool, str]:
    if not raw_bytes or len(raw_bytes) < 1024:
        return False, "Image invalide ou trop petite (minimum 1 Ko)."
    if len(raw_bytes) > 10 * 1024 * 1024:
        return False, "Image trop volumineuse (maximum 10 Mo)."

    # Check PNG / JPEG / WEBP / GIF magic bytes
    is_png = raw_bytes.startswith(b"\x89PNG\r\n\x1a\n")
    is_jpg = raw_bytes.startswith(b"\xff\xd8\xff")
    is_webp = raw_bytes[:4] == b"RIFF" and raw_bytes[8:12] == b"WEBP"
    if not (is_png or is_jpg or is_webp):
        return False, "Format non supporté. Envoyez une capture PNG, JPG ou WEBP."

    file_hash = hashlib.sha256(raw_bytes).hexdigest()
    # Anti-reuse: check if another user already used this exact screenshot hash
    dup = query_one(
        "SELECT id, user_id FROM social_accounts WHERE verification_token = ? AND user_id != ?",
        (f"SHA:{file_hash}", user_id)
    )
    if dup:
        return False, "Cette capture d'écran a déjà été utilisée sur un autre compte."

    ext = "png" if is_png else ("webp" if is_webp else "jpg")
    fname = f"u{user_id}_{platform}_{username}_{file_hash[:10]}.{ext}"
    fpath = os.path.join(UPLOAD_DIR, fname)
    with open(fpath, "wb") as f:
        f.write(raw_bytes)

    return True, f"SHA:{file_hash}"
