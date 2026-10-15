import os
import sys
import json

sys.path.insert(0, os.path.abspath("."))
from pc_bot.http_action_engine import PrSocialClient

with open(r"D:\social_pc_bot\config.json", "r", encoding="utf-8") as f:
    cfg = json.load(f)

client = PrSocialClient(cfg.get("token"), cfg.get("cf_clearance"))
st, soc = client.get_socials()

print(f"Status /socials : {st}")

all_accounts = list(soc.get("accounts", []))
for p in soc.get("platforms", []):
    all_accounts.extend(p.get("accounts", []))

print("\n--- COMPTES ENREGISTRÉS SUR PR.SOCIAL ---")
platforms_found = set()
for a in all_accounts:
    plat = a.get("platform", "").lower()
    platforms_found.add(plat)
    print(f"[{plat.upper()}] ID={a.get('id')} Status={a.get('status')} Username=@{a.get('username')}")

print("\n--- PLATEFORMES GLOBALES SUR PR.SOCIAL ---")
for p in soc.get("platforms", []):
    print(f"- {p.get('name')} (key: {p.get('key') or p.get('platform') or p.get('id')})")
