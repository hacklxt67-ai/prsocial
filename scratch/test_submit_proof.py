import json
import requests
import time
from io import BytesIO
from PIL import Image

with open(r"D:\social_pc_bot\config.json", "r", encoding="utf-8") as f:
    cfg = json.load(f)

tok = cfg.get("token", "").replace("token=", "").strip()
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/147.0.0.0 Safari/537.36",
    "Cookie": f"token={tok}",
    "Accept": "application/json"
}

# 1. Start 1 Facebook task
r = requests.get("https://pr.social/api/tasks/available?platform=facebook&limit=1", headers=headers)
tasks = r.json().get("tasks", [])
if tasks:
    t = tasks[0]
    tid = t["id"]
    print(f"Testing Facebook task #{tid} screenshot submit...")
    
    soc = requests.get("https://pr.social/api/profile/socials", headers=headers).json()
    fb_acc = [a for a in soc.get("accounts", []) if a.get("platform") == "facebook"]
    fb_id = fb_acc[0]["id"] if fb_acc else None

    start_r = requests.post(f"https://pr.social/api/tasks/{tid}/start", json={"social_account_id": fb_id}, headers=headers)
    print("START:", start_r.status_code, start_r.json().get("ok"))
    
    # Wait submit_after_sec (5s)
    wait_sec = start_r.json().get("submit_after_sec", 5) or 5
    print(f"Waiting {wait_sec}s required by PR.Social...")
    time.sleep(wait_sec + 1)
    
    # Create simple 1366x768 proof screenshot
    img = Image.new("RGB", (1366, 768), color=(24, 25, 26))
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    
    files = {"screenshot": ("proof.png", buf.getvalue(), "image/png")}
    post_headers = dict(headers)
    post_headers.pop("Content-Type", None)
    
    sub_r = requests.post(f"https://pr.social/api/tasks/{tid}/submit", files=files, headers=post_headers)
    print("SUBMIT RESULT:", sub_r.status_code, sub_r.text[:300])
