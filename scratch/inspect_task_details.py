import os
import sys
import json

sys.path.insert(0, os.path.abspath("."))
from pc_bot.http_action_engine import PrSocialClient

with open(r"D:\social_pc_bot\config.json", "r", encoding="utf-8") as f:
    cfg = json.load(f)

client = PrSocialClient(cfg.get("token"), cfg.get("cf_clearance"))

for plat, acc_id in [("twitter", 350070), ("snapchat", 350100)]:
    st, data = client.get_available_tasks(plat, limit=2)
    tasks = data.get("tasks", []) if st == 200 else []
    if tasks:
        t = tasks[0]
        tid = t["id"]
        start_st, start_res = client.start_task(tid, acc_id)
        print(f"\n--- TEST DEPART TÂCHE {plat.upper()} #{tid} ---")
        print(f"Status start: {start_st}")
        print("Response:", start_res)
        target_url = start_res.get("task", {}).get("target_url")
        print(f"Target URL: {target_url}")
        
        # Annulation propre immédiate pour ne rien bloquer
        c_st, c_res = client.cancel_task(tid)
        print(f"Annulation #{tid}: {c_st} {c_res}")
