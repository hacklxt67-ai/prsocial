import os
import sys
import json

sys.path.insert(0, os.path.abspath("."))
from pc_bot.http_action_engine import PrSocialClient

with open(r"D:\social_pc_bot\config.json", "r", encoding="utf-8") as f:
    cfg = json.load(f)

client = PrSocialClient(cfg.get("token"), cfg.get("cf_clearance"))

for plat in ["twitter", "snapchat"]:
    st, data = client.get_available_tasks(plat, limit=10)
    tasks = data.get("tasks", []) if st == 200 else []
    print(f"\n=======================================================")
    print(f"Plateforme : [{plat.upper()}] - {len(tasks)} tâches disponibles")
    print(f"=======================================================")
    for t in tasks[:5]:
        print(f"ID: #{t.get('id')} | Action: {t.get('action')} | Reward: ${t.get('worker_reward') or t.get('cost_per_task')} | URL: {t.get('target_url')}")
