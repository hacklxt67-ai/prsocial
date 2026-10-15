import json
import requests

with open(r"D:\social_pc_bot\config.json", "r", encoding="utf-8") as f:
    cfg = json.load(f)

tok = cfg.get("token", "").replace("token=", "").strip()
cf = cfg.get("cf_clearance", "").strip()

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Cookie": f"token={tok}; cf_clearance={cf}",
    "Accept": "application/json"
}

endpoints = [
    "/tasks/my/list?status=in_progress",
    "/tasks/my/list?status=pending",
    "/tasks/my/summary"
]

for ep in endpoints:
    r = requests.get(f"https://pr.social/api{ep}", headers=headers)
    print(ep, r.status_code, r.text[:300])
