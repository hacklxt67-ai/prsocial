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
    "Cookie": f"token={token}; cf_clearance={cf}",
    "Content-Type": "application/json"
}

def post(path, body=None):
    url = "https://pr.social/api" + path
    data = json.dumps(body or {}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, json.loads(r.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))
    except Exception as e:
        return 0, {"error": str(e)}

print("Annulation tâche #2020915...")
st, res = post("/tasks/2020915/cancel")
print(f"Status: {st}, Res: {res}")
