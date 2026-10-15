import json
import requests

with open(r"D:\social_pc_bot\config.json", "r", encoding="utf-8") as f:
    cfg = json.load(f)

tok = cfg.get("token", "").replace("token=", "").strip()
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/147.0.0.0 Safari/537.36",
    "Cookie": f"token={tok}",
    "Accept": "application/json"
}

for platform in ["instagram", "youtube", "tiktok", "facebook", "telegram"]:
    r = requests.get(f"https://pr.social/api/tasks/available?platform={platform}&sort=reward&limit=5", headers=headers)
    tasks = r.json().get("tasks", [])
    print(f"\n=== PLATFORM: {platform.upper()} ({len(tasks)} tasks) ===")
    for t in tasks:
        tid = t["id"]
        # get task detail
        td = requests.get(f"https://pr.social/api/tasks/{tid}", headers=headers).json()
        api_chk = td.get("api_check_enabled")
        print(f"#{tid} action={t.get('action')} reward=${t.get('worker_reward')} api_check_enabled={api_chk}")
