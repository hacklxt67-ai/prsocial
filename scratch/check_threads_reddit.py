import json
import urllib.request
import os

config_file = r"D:\social_pc_bot\config.json"
with open(config_file, "r", encoding="utf-8") as f:
    cfg = json.load(f)

token = cfg.get("token", "").replace("token=", "").strip()
cf = cfg.get("cf_clearance", "").replace("cf_clearance=", "").strip()

cookie_parts = []
if token:
    cookie_parts.append(f"token={token}")
if cf:
    cookie_parts.append(f"cf_clearance={cf}")

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://pr.social/tasks",
    "Cookie": "; ".join(cookie_parts)
}

def get(path):
    url = "https://pr.social/api" + path
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.status, json.loads(r.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode('utf-8'))
        except:
            return e.code, {"error": str(e)}
    except Exception as e:
        return 0, {"error": str(e)}

print("=== CHECK AUTH ===")
st, me = get("/auth/me")
print(f"Status: {st}, User: {me.get('user', {}).get('username')}, Balance: {me.get('user', {}).get('balance')}")

print("\n=== CHECK SOCIALS (RESEAUX DU COMPTE) ===")
st, soc = get("/profile/socials")
print(f"Status: {st}")
if st == 200:
    accounts = soc.get("accounts", [])
    platforms = soc.get("platforms", [])
    all_acc = list(accounts)
    for p in platforms:
        all_acc.extend(p.get("accounts", []))
    print(f"Total comptes listes: {len(all_acc)}")
    for a in all_acc:
        print(f"  [{a.get('platform')}] @{a.get('username')} (ID: {a.get('id')}) - Status: {a.get('status')}")

print("\n=== CHECK AVAILABLE TASKS POUR THREADS ET REDDIT ===")
for plat in ["threads", "reddit", "twitter", "snapchat"]:
    st, tasks_res = get(f"/tasks/available?platform={plat}&sort=reward&limit=5")
    tasks = tasks_res.get("tasks", [])
    counts = tasks_res.get("platformCounts", [])
    print(f"\n--- Platform: {plat.upper()} (HTTP Status: {st}) ---")
    print(f"Tâches trouvées: {len(tasks)}")
    for t in tasks:
        rew = t.get("worker_reward") or t.get("cost_per_task")
        act = t.get("action")
        target = t.get("target_url") or t.get("target_username")
        print(f"  Tâche #{t.get('id')} | Action: {act} | Gain: ${rew} | URL: {target}")
    if not tasks and "error" in tasks_res:
        print(f"  Erreur API: {tasks_res['error']}")
