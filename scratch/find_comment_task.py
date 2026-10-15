import os
import sys
import json

sys.path.insert(0, os.path.abspath("."))
from pc_bot.http_action_engine import PrSocialClient

with open(r"D:\social_pc_bot\config.json", "r", encoding="utf-8") as f:
    cfg = json.load(f)

client = PrSocialClient(cfg.get("token"), cfg.get("cf_clearance"))

st_soc, socials = client.get_socials()
all_accounts = list(socials.get("accounts", []))
for p in socials.get("platforms", []):
    all_accounts.extend(p.get("accounts", []))

acc_map = {a.get("platform"): a.get("id") for a in all_accounts if a.get("status") == "approved"}

for plat in ["twitter", "linkedin", "youtube"]:
    acc_id = acc_map.get(plat)
    if not acc_id:
        continue
    st, data = client.get_available_tasks(plat, limit=50)
    tasks = data.get("tasks", []) if st == 200 else []
    comment_tasks = [t for t in tasks if "comment" in (t.get("action") or "").lower()]
    print(f"\n--- TEST SUR {plat.upper()} ({len(comment_tasks)} comment tasks) ---")
    for ct in comment_tasks:
        tid = ct["id"]
        cst, cres = client.start_task(tid, acc_id)
        if cst == 200 and cres.get("ok"):
            print(f"SUCCESS start #{tid} on {plat}!")
            task_obj = cres.get("task", {})
            comp_obj = cres.get("completion", {})
            print("Task action:", task_obj.get("action"))
            print("Task comment_type:", task_obj.get("comment_type"))
            print("Task comment_list:", task_obj.get("comment_list"))
            print("Completion assigned_comment:", comp_obj.get("assigned_comment"))
            print("Task target_url:", task_obj.get("target_url"))
            client.cancel_task(tid)
            break
        else:
            code = cres.get("code")
            err = cres.get("error")
            print(f"Task #{tid} start failed: {code} ({err})")
