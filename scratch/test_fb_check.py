import json
import requests
import time

with open(r"D:\social_pc_bot\config.json", "r", encoding="utf-8") as f:
    cfg = json.load(f)

tok = cfg.get("token", "").replace("token=", "").strip()
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/147.0.0.0 Safari/537.36",
    "Cookie": f"token={tok}",
    "Accept": "application/json"
}

# 1. Get Facebook account
soc = requests.get("https://pr.social/api/profile/socials", headers=headers).json()
fb_acc = [a for a in soc.get("accounts", []) if a.get("platform") == "facebook"]
fb_id = fb_acc[0]["id"] if fb_acc else None

# 2. Get 1 available Facebook task
r = requests.get("https://pr.social/api/tasks/available?platform=facebook&limit=1", headers=headers)
tasks = r.json().get("tasks", [])
if tasks:
    t = tasks[0]
    tid = t["id"]
    print(f"Testing Facebook task #{tid}...")
    start_r = requests.post(f"https://pr.social/api/tasks/{tid}/start", json={"social_account_id": fb_id}, headers=headers)
    print("START:", start_r.status_code, start_r.json())
    time.sleep(2)
    chk_r = requests.post(f"https://pr.social/api/tasks/{tid}/api-check", headers=headers)
    print("API-CHECK:", chk_r.status_code, chk_r.json())
    time.sleep(2)
    # cancel to keep account clean
    c_r = requests.post(f"https://pr.social/api/tasks/{tid}/cancel", headers=headers)
    print("CANCEL:", c_r.status_code, c_r.json())
