import os
import sys
import json

sys.path.insert(0, os.path.abspath("."))
from pc_bot.http_action_engine import PrSocialClient

with open(r"D:\social_pc_bot\config.json", "r", encoding="utf-8") as f:
    cfg = json.load(f)

token = cfg.get("token", "")
cf = cfg.get("cf_clearance", "")

client = PrSocialClient(token, cf)

st, me = client.get_me()
user = me.get("user", {})
print(f"Connecté : @{user.get('username')} | Solde réel: ${user.get('balance')}")

st_soc, socials = client.get_socials()
print("\n--- COMPTES SOCIAUX APPROUVÉS ---")
all_accounts = list(socials.get("accounts", []))
for p_obj in socials.get("platforms", []):
    all_accounts.extend(p_obj.get("accounts", []))

approved_accounts = {}
for acc in all_accounts:
    if acc.get("status") == "approved":
        plat = acc.get("platform", "").lower()
        approved_accounts[plat] = acc
        print(f"[{plat.upper()}] ID={acc.get('id')} Username=@{acc.get('username')}")

print("\n--- TÂCHES DISPONIBLES PAR PLATEFORME ---")
for plat in ["linkedin", "github", "discord"]:
    st, res = client.get_available_tasks(plat, limit=5)
    tasks = res.get("tasks", [])
    print(f"\n[{plat.upper()}]: {len(tasks)} tâches disponibles")
    for t in tasks[:3]:
        rew = t.get("worker_reward") or t.get("cost_per_task")
        print(f"  - Tâche #{t.get('id')}: Action={t.get('action')} | Gain: ${rew} | URL: {t.get('target_url')}")
