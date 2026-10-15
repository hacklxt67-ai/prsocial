import os
import sys
import json

sys.path.insert(0, os.path.abspath("."))
from pc_bot.http_action_engine import PrSocialClient

with open(r"D:\social_pc_bot\config.json", "r", encoding="utf-8") as f:
    cfg = json.load(f)

client = PrSocialClient(cfg.get("token"), cfg.get("cf_clearance"))

# Testons le démarrage d'une tâche comment_emoji sur Twitter (id: 1967372, account: 350070)
task_id = 1967372
st, start_res = client.start_task(task_id, 350070)
print("=== DÉPART TÂCHE COMMENT_EMOJI TWITTER ===")
print("Status:", st)
print("Keys in response:", list(start_res.keys()))
if "task" in start_res:
    t = start_res["task"]
    print("Task keys:", list(t.keys()))
    print("Action:", t.get("action"))
    print("Comment type:", t.get("comment_type"))
    print("Comment list:", t.get("comment_list"))
    print("Assigned comment (task):", t.get("assigned_comment"))
if "completion" in start_res:
    c = start_res["completion"]
    print("Completion keys:", list(c.keys()))
    print("Assigned comment (completion):", c.get("assigned_comment"))

# Annulation immédiate
client.cancel_task(task_id)
print("Tâche annulée.")
