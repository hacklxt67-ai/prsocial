import os
import re
import sys
import time
import random
import requests
from typing import Dict, List, Any, Optional

try:
    from PIL import Image, ImageDraw, ImageFont
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
    "Never stop learning, never stop dreaming. 💡 #passion #learning #creativity",
    "Another step forward, one day at a time! 👣🔥 #forward #progress #dailyvibes"
]

SAMPLE_TWEETS = [
    "Technology and consistency are the two keys to unlocking great outcomes. 🚀 #tech #innovation",
    "Always learning, always moving forward. Small steps bring big results! 💡 #daily #focus",
    "Keep things simple, stay dedicated, and embrace every challenge along the way. ✨"
]

class ProfileAutoCompleter:
    """
    Système d'Auto-Complétion et de mise en conformité des profils sociaux.
    Génère automatiquement les éléments requis par PR.Social (Avatar, Posts Instagram,
    Vidéos TikTok, Contenu minimal) pour lever la quarantaine et éliminer tout avertissement.
    """

    def __init__(self, output_dir: Optional[str] = None):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.output_dir = output_dir or os.path.join(base_dir, "generated_profiles")
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_compliant_avatar(self, username: str) -> str:
        """
        Télécharge ou génère un avatar de profil esthétique et unique (PNG).
        """
        filepath = os.path.join(self.output_dir, f"avatar_{username}.png")

        # 1. Tentative de téléchargement d'un portrait libre de droits réaliste
        sources = [
            f"https://picsum.photos/seed/{username}/400/400",
            f"https://api.dicebear.com/7.x/identicon/png?seed={username}&size=400"
        ]

        for src in sources:
            try:
                r = requests.get(src, timeout=8, headers={"User-Agent": DEFAULT_UA})
                if r.status_code == 200 and len(r.content) > 1000:
                    with open(filepath, "wb") as f:
                        f.write(r.content)
                    return filepath
            except Exception:
                continue

        # 2. Génération locale de secours si pas d'internet ou échec PIL
        if HAS_PIL:
            try:
                img = Image.new("RGB", (400, 400), color=(random.randint(40, 90), random.randint(70, 150), random.randint(120, 220)))
                draw = ImageDraw.Draw(img)
                # Dessiner des cercles et initiales
                draw.ellipse([(80, 80), (320, 320)], fill=(random.randint(200, 255), random.randint(200, 255), random.randint(200, 255)))
                letter = (username[0] if username else "P").upper()
                draw.text((180, 170), letter, fill=(30, 30, 30))
                img.save(filepath, "PNG")
                return filepath
            except Exception:
                pass

        return filepath

    def generate_instagram_pack(self, username: str, count: int = 5) -> List[Dict[str, str]]:
        """
        Génère un pack de 5 publications conformes avec images HD et légendes prêtes
        pour satisfaire immédiatement la règle 'post5' de PR.Social.
        """
        pack = []
        insta_dir = os.path.join(self.output_dir, f"insta_{username}")
        os.makedirs(insta_dir, exist_ok=True)

        for i in range(1, count + 1):
            img_path = os.path.join(insta_dir, f"post_{i}.jpg")
            # Image libre de droits haute résolution
            url = f"https://picsum.photos/seed/{username}_{i}/800/800"
            try:
                r = requests.get(url, timeout=10, headers={"User-Agent": DEFAULT_UA})
                if r.status_code == 200:
                    with open(img_path, "wb") as f:
                        f.write(r.content)
            except Exception:
                if HAS_PIL:
                    img = Image.new("RGB", (800, 800), color=(random.randint(50, 180), random.randint(50, 180), random.randint(50, 180)))
                    img.save(img_path, "JPEG")

            caption = random.choice(SAMPLE_CAPTIONS)
            pack.append({
                "index": i,
                "image_path": img_path,
                "caption": caption
            })

        return pack

    def generate_tiktok_clip_info(self, username: str) -> Dict[str, str]:
        """
        Fournit une description et une ressource prête pour publier 1 courte vidéo
        sur TikTok afin de satisfaire la règle 'video1'.
        """
        return {
            "title": f"Daily Focus & Creativity #fyp #viral #life",
            "guide": "Postez une vidéo de 5 secondes (paysage, bureau ou ciel) avec son libre de droits.",
            "status": "ready"
        }

    def auto_fix_plan(self, account: Dict[str, Any], audit_report: Dict[str, Any]) -> List[str]:
        """
        Génère les actions concrètes nécessaires pour mettre un profil en conformité.
        """
        plat = account.get("platform", "").lower()
        u = account.get("username", "")
        plan = []

        issues = audit_report.get("issues", [])
        rules = audit_report.get("rules", [])

        # Règle Avatar
        if "avatar" in rules:
            avatar_path = self.generate_compliant_avatar(u)
            plan.append(f"🖼️ AVATAR PRÊT : Fichier généré ({os.path.basename(avatar_path)}). À définir comme photo de profil.")

        # Règle Instagram post5
        if plat == "instagram":
            pack = self.generate_instagram_pack(u, 5)
            plan.append(f"📸 PACK 5 POSTS INSTAGRAM : 5 photos HD + légendes créées dans le dossier 'generated_profiles/insta_{u}'.")

        # Règle TikTok video1
        if plat == "tiktok":
            clip_info = self.generate_tiktok_clip_info(u)
            plan.append(f"🎥 VIDÉO TIKTOK : Recommandation prête ({clip_info['title']}).")

        # Règle Public
        if any("privé" in iss.lower() for iss in issues):
            plan.append("🔓 CONFIDENTIALITÉ : Basculez le compte de 'Privé' à 'Public' dans les paramètres de l'application.")

        # Règle Digits
        if any("chiffres" in iss.lower() for iss in issues):
            clean_name = re.sub(r'\d{5,}', '', u) or f"{u[:4]}_user"
            plan.append(f"✏️ PSEUDO CONSEILLÉ : Changez votre identifiant en '@{clean_name}' pour supprimer les 5 chiffres consécutifs.")

        return plan

