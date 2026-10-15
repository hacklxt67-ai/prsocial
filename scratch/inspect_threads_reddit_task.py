import json
import urllib.request

config_file = r"D:\social_pc_bot\config.json"
with open(config_file, "r", encoding="utf-8") as f:
    cfg = json.load(f)

token = cfg.get("token", "").replace("token=", "").strip()
cf = cfg.get("cf_clearance", "").replace("cf_clearance=", "").strip()

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://pr.social/tasks",
    "Cookie": f"token={token}; cf_clearance={cf}"
}

def inspect_task(task_id):
    url = f"https://pr.social/api/tasks/{task_id}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read().decode('utf-8'))
    except Exception as e:
        return {"error": str(e)}

print("=== THREADS TASK DETAIL ===")
th_task = inspect_task(2020764)
print(json.dumps(th_task, indent=2))

print("\n=== REDDIT FOLLOW TASK DETAIL ===")
red_follow = inspect_task(1984846)
print(json.dumps(red_follow, indent=2))

print("\n=== REDDIT UPVOTE TASK DETAIL ===")
red_upvote = inspect_task(2015434)
print(json.dumps(red_upvote, indent=2))
