import os
import sys
import json

sys.path.insert(0, os.path.abspath("."))
from pc_bot.http_action_engine import PrSocialClient

with open(r"D:\social_pc_bot\config.json", "r", encoding="utf-8") as f:
    cfg = json.load(f)

client = PrSocialClient(cfg.get("token"), cfg.get("cf_clearance"))

platforms = ["youtube", "instagram", "tiktok", "facebook", "twitter", "linkedin"]

print("=== RECHERCHE DE TÂCHES COMMENTAIRE SUR PR.SOCIAL ===")
for plat in platforms:
    st, data = client.get_available_tasks(plat, limit=50)
    tasks = data.get("tasks", []) if st == 200 else []
    comment_tasks = [t for t in tasks if "comment" in (t.get("action") or "").lower()]
    print(f"\n[{plat.upper()}] : {len(comment_tasks)} tâche(s) de commentaire sur {len(tasks)} tâches disponibles")
    for ct in comment_tasks[:3]:
        print(f"  - ID: #{ct.get('id')} | Action: {ct.get('action')} | Gain: ${ct.get('worker_reward') or ct.get('cost_per_task')}")
        print(f"    Raw keys: {[k for k in ct.keys() if 'comment' in k.lower() or 'text' in k.lower() or 'desc' in k.lower()]}")
        for k in ['comment_list', 'comment_type', 'assigned_comment', 'description', 'label']:
            if ct.get(k):
                print(f"    {k}: {ct.get(k)}")
