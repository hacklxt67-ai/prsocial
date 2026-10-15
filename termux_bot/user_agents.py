import random
from typing import Dict, Tuple

# Liste réaliste de User-Agents Android et Desktop modernes pour éviter la détection et les blocages
MOBILE_USER_AGENTS = [
    # Samsung Galaxy S24 Ultra & S24
    "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.6668.100 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36",
    # Samsung Galaxy S23 & S23 Ultra
    "Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.6668.70 Mobile Safari/537.36",
    # Google Pixel 8 & Pixel 8 Pro
    "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.6668.100 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.70 Mobile Safari/537.36",
    # Google Pixel 7 & 7a
    "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.88 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 14; Pixel 7a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.6668.81 Mobile Safari/537.36",
    # Xiaomi 14 & 13
    "Mozilla/5.0 (Linux; Android 14; 23127PN0CG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.6668.81 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 13; 2211133G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.14 Mobile Safari/537.36",
    # OnePlus 12 & 11
    "Mozilla/5.0 (Linux; Android 14; CPH2581) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 13; CPH2449) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.99 Mobile Safari/537.36",
    # Redmi Note 13 Pro
    "Mozilla/5.0 (Linux; Android 13; 2312DRA50G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.6668.70 Mobile Safari/537.36",
]

DESKTOP_USER_AGENTS = [
    # Chrome Windows 10/11
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    # Chrome Linux aarch64 & x86_64
    "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    # Edge Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0",
]

def get_random_user_agent(allow_desktop: bool = True) -> str:
    """Retourne un User-Agent aléatoire parmi le pool, avec légère variation de build."""
    if allow_desktop and random.random() < 0.35:
        base_ua = random.choice(DESKTOP_USER_AGENTS)
    else:
        base_ua = random.choice(MOBILE_USER_AGENTS)
    
    # Légère variance aléatoire sur le patch build pour un fingerprint unique
    patch = random.randint(10, 150)
    if "Mobile Safari" in base_ua:
        # Remplacer le dernier bloc numérique avant Mobile Safari
        parts = base_ua.split("Mobile Safari")
        prefix = parts[0]
        if "." in prefix:
            sub = prefix.rstrip(". ").rsplit(".", 1)[0]
            base_ua = f"{sub}.{patch} Mobile Safari{parts[1]}"
    return base_ua

def get_client_hints(user_agent: str) -> Dict[str, str]:
    """Génère les headers Sec-CH-UA cohérents avec le User-Agent pour passer Cloudflare Turnstile sans friction."""
    is_mobile = "?1" if "Mobile" in user_agent else "?0"
    if "Android" in user_agent:
        platform = '"Android"'
    elif "Windows" in user_agent:
        platform = '"Windows"'
    elif "Linux" in user_agent:
        platform = '"Linux"'
    elif "Macintosh" in user_agent:
        platform = '"macOS"'
    else:
        platform = '"Android"'

    # Extraire version majeure Chrome
    major = "129"
    if "Chrome/" in user_agent:
        try:
            major = user_agent.split("Chrome/")[1].split(".")[0]
        except Exception:
            major = "129"

    sec_ch_ua = f'"Chromium";v="{major}", "Not=A?Brand";v="24", "Google Chrome";v="{major}"'
    return {
        "sec-ch-ua": sec_ch_ua,
        "sec-ch-ua-mobile": is_mobile,
        "sec-ch-ua-platform": platform
    }
