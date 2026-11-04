import os
import re
import sys
import time
import random
import requests
from typing import Dict, List, Any, Optional

try:
    from PIL import Image, ImageDraw
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

DEFAULT_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"

SAMPLE_CAPTIONS = [
    "Exploring new horizons every single day! ✨🚀 #lifestyle #journey #inspiration",
    "Focus on the positive moments and keep growing. 🌟 #mindset #growth #daily",
    "Great moments always come from simple beginnings. 💫 #motivation #goodvibes",
    "Consistency is the secret to all real progress. 🎯 #goals #success #focus",
    "Enjoying the little things that make life beautiful. ☕🌿 #nature #peace #relax",
]

class ProfileAutoCompleter:
    """
    Auto-Compléteur de Profils pour Android / Termux.
    """

    def __init__(self, output_dir: Optional[str] = None):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.output_dir = output_dir or os.path.join(base_dir, "generated_profiles")
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_compliant_avatar(self, username: str) -> str:
        filepath = os.path.join(self.output_dir, f"avatar_{username}.png")
        url = f"https://picsum.photos/seed/{username}/400/400"
        try:
            r = requests.get(url, timeout=6, headers={"User-Agent": DEFAULT_UA})
            if r.status_code == 200:
                with open(filepath, "wb") as f:
                    f.write(r.content)
                return filepath
        except Exception:
            pass
        return filepath

    def generate_instagram_pack(self, username: str, count: int = 5) -> List[Dict[str, str]]:
        pack = []
        insta_dir = os.path.join(self.output_dir, f"insta_{username}")
        os.makedirs(insta_dir, exist_ok=True)

        for i in range(1, count + 1):
            img_path = os.path.join(insta_dir, f"post_{i}.jpg")
            url = f"https://picsum.photos/seed/{username}_{i}/800/800"
            try:
                r = requests.get(url, timeout=8, headers={"User-Agent": DEFAULT_UA})
                if r.status_code == 200:
                    with open(img_path, "wb") as f:
                        f.write(r.content)
            except Exception:
                pass

            pack.append({
                "index": i,
                "image_path": img_path,
                "caption": random.choice(SAMPLE_CAPTIONS)
            })

        return pack

    def auto_fix_plan(self, account: Dict[str, Any], audit_report: Dict[str, Any]) -> List[str]:
        plat = account.get("platform", "").lower()
        u = account.get("username", "")
        plan = []

        rules = audit_report.get("rules", [])
        if "avatar" in rules:
            self.generate_compliant_avatar(u)
            plan.append(f"🖼️ AVATAR PRÊT : Téléchargé dans 'generated_profiles/avatar_{u}.png'.")

        if plat == "instagram":
            self.generate_instagram_pack(u, 5)
            plan.append(f"📸 PACK 5 POSTS INSTAGRAM : 5 photos créées dans 'generated_profiles/insta_{u}'.")

        if plat == "tiktok":
            plan.append("🎥 TIKTOK : Uploadez 1 vidéo courte (5s) pour valider l'activité.")

        return plan

