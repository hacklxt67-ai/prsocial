#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Outil de Diagnostic et d'Analyse Approfondie des Cookies / Sessions PR.Social
"""

import sys
import os
import json
import requests
from datetime import datetime

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

def load_default_token() -> str:
    candidates = [
        "config.json",
        "termux_bot/config.json",
        "pc_bot/config.json",
        os.path.expanduser("~/social_bot_data/config.json"),
        os.path.expanduser("~/.social_bot_data/config.json")
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                with open(c, "r", encoding="utf-8") as f:
                    d = json.load(f)
                    tok = d.get("token", "").strip()
                    if tok:
                        return tok
            except Exception:
                pass
    return ""

def analyze_jwt_payload(token: str):
    print("------------------------------------------------------------")
    print("🔑 ANALYSE DU JETON (JWT)")
    print("------------------------------------------------------------")
    parts = token.split(".")
    if len(parts) >= 2:
        import base64
        payload_b64 = parts[1]
        # Padding base64
        payload_b64 += "=" * ((4 - len(payload_b64) % 4) % 4)
        try:
            payload_json = json.loads(base64.urlsafe_b64decode(payload_b64.encode("utf-8")).decode("utf-8"))
            print(f"  • ID Utilisateur PR.Social : {payload_json.get('id')}")
            print(f"  • Rôle                     : {payload_json.get('role')}")
            if "iat" in payload_json:
                dt_iat = datetime.fromtimestamp(payload_json["iat"]).strftime("%Y-%m-%d %H:%M:%S")
                print(f"  • Date d'émission (iat)    : {dt_iat}")
            if "exp" in payload_json:
                dt_exp = datetime.fromtimestamp(payload_json["exp"]).strftime("%Y-%m-%d %H:%M:%S")
                expired = datetime.now().timestamp() > payload_json["exp"]
                status_exp = "⚠️ EXPIRÉ" if expired else "✅ VALIDE (Non expiré dans le temps)"
                print(f"  • Date d'expiration (exp)  : {dt_exp} ({status_exp})")
        except Exception as e:
            print(f"  • Impossible de décoder le payload JWT : {e}")
    else:
        print("  • Format du token non-JWT ou tronqué.")

def test_pr_server(token: str, cf_clearance: str = ""):
    print("\n------------------------------------------------------------")
    print("🌐 TEST EN DIRECT DES SERVEURS PR.SOCIAL")
    print("------------------------------------------------------------")

    clean_tok = token.strip()
    if clean_tok.startswith("token="):
        clean_tok = clean_tok[6:]
    if clean_tok.startswith("Bearer "):
        clean_tok = clean_tok[7:]
    clean_tok = clean_tok.strip('"\'')

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://pr.social/tasks",
        "Cookie": f"token={clean_tok}" + (f"; cf_clearance={cf_clearance}" if cf_clearance else "")
    }

    session = requests.Session()
    session.headers.update(headers)

    # 1. Test /api/auth/me
    print("[1] Requête : GET https://pr.social/api/auth/me")
    try:
        r1 = session.get("https://pr.social/api/auth/me", timeout=20)
        print(f"    ↳ Code HTTP : {r1.status_code} {r1.reason}")
        print(f"    ↳ Cloudflare Server : {r1.headers.get('Server', 'Inconnu')}")
        print(f"    ↳ CF-Ray ID         : {r1.headers.get('CF-RAY', 'Inconnu')}")
        set_cookie = r1.headers.get("Set-Cookie", "")
        if set_cookie:
            print(f"    ↳ Header Set-Cookie : {set_cookie}")
        
        try:
            body1 = r1.json()
            print(f"    ↳ Réponse JSON      : {json.dumps(body1, indent=6)}")
        except Exception:
            body1 = {}
            print(f"    ↳ Réponse HTML/Texte: {r1.text[:300]}...")

        # Diagnostic précis
        print("\n------------------------------------------------------------")
        print("📋 VERDICT & ANALYSE DU RÉSULTAT")
        print("------------------------------------------------------------")
        
        err_msg = body1.get("error", "") if isinstance(body1, dict) else ""
        
        if r1.status_code == 200 and body1.get("user"):
            user = body1["user"]
            print("  🟢 STATUT : SESSION VALIDE ET ACTIVE !")
            print(f"  • Nom d'utilisateur : @{user.get('username')}")
            print(f"  • Solde actuel      : ${user.get('balance', 0):.4f}")
            print(f"  • Rôle              : {user.get('role')}")
        elif r1.status_code == 403 and "Account is banned" in str(body1):
            print("  🔴 STATUT : COMPTE DÉFINITIVEMENT BANNI PAR PR.SOCIAL")
            print("  • Cause exacte : Le serveur de PR.Social a classé l'ID utilisateur dans sa liste noire.")
            print("  • Conséquence  : Le serveur renvoie 'Set-Cookie: token=; Expires=1970' pour forcer l'effacement du cookie.")
            print("  • Conclusion   : Ce cookie/compte ne peut PLUS JAMAIS être réutilisé sur PR.Social.")
            print("  • Action requise: Créer un NOUVEAU COMPTE avec une NOUVELLE IP.")
        elif r1.status_code == 401 or "Session expired" in str(body1):
            print("  🟡 STATUT : SESSION EXPIRÉE OU TOKEN INVALIDE")
            print("  • Cause exacte : La session a expiré dans le temps ou l'utilisateur s'est déconnecté manuellement.")
            print("  • Action requise: Se reconnecter sur PR.Social via navigateur pour obtenir un nouveau token.")
        elif r1.status_code in [403, 503] and ("cloudflare" in r1.text.lower() or "just a moment" in r1.text.lower()):
            print("  🟠 STATUT : BLOCAGE PAR LE PARE-FEU CLOUDFLARE (WAF)")
            print("  • Cause exacte : Cloudflare bloque la requête avant qu'elle n'atteigne PR.Social.")
            print("  • Action requise: Cookie cf_clearance manquant ou adresse IP suspecte.")
        else:
            print(f"  ⚪ STATUT INATTENDU : Code {r1.status_code} - {body1}")

    except Exception as e:
        print(f"    ❌ Échec de la requête réseau : {e}")

if __name__ == "__main__":
    print("============================================================")
    print("🔍 VÉRIFICATION ET ANALYSE DE CONNEXION COOKIE PR.SOCIAL")
    print("============================================================")

    arg_tok = sys.argv[1] if len(sys.argv) > 1 else ""
    if not arg_tok:
        arg_tok = load_default_token()

    if not arg_tok:
        print("Aucun cookie/token trouvé dans la configuration.")
        print("Usage: python verifier_cookie.py <votre_token_ou_cookie>")
        sys.exit(1)

    print(f"Token détecté : {arg_tok[:20]}...{arg_tok[-15:]}")
    analyze_jwt_payload(arg_tok)
    test_pr_server(arg_tok)
