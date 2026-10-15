import os
import sys
import time
import json
import logging

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from pc_bot.pr_api import PrSocialAPI
from pc_bot.browser_bot import BrowserBot

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("RedditLiveTest")

config_file = r"D:\social_pc_bot\config.json"
with open(config_file, "r", encoding="utf-8") as f:
    cfg = json.load(f)

token = cfg.get("token", "").replace("token=", "").strip()
cf = cfg.get("cf_clearance", "").replace("cf_clearance=", "").strip()

api = PrSocialAPI(token=token, cf_clearance=cf)
browser = BrowserBot(headless=True)

print("="*70)
print("🧪 TEST RÉEL SPÉCIFIQUE SUR REDDIT (PR.SOCIAL)")
print("="*70)

# Récupération compte Reddit
st_soc, socials = api.get_socials()
reddit_acc = None
if st_soc == 200:
    for acc in socials.get("accounts", []):
        if acc.get("platform") == "reddit" and acc.get("status") == "approved":
            reddit_acc = acc
            break
    if not reddit_acc:
        for p_obj in socials.get("platforms", []):
            for acc in p_obj.get("accounts", []):
                if acc.get("platform") == "reddit" and acc.get("status") == "approved":
                    reddit_acc = acc
                    break

if not reddit_acc:
    print("❌ Compte Reddit approuvé introuvable.")
    sys.exit(1)

print(f"✅ Compte Reddit : @{reddit_acc.get('username')} (ID: {reddit_acc.get('id')})")

# Déblocage préventif
st_hist, my_active = api.get_active_tasks()
if st_hist == 200:
    for act in my_active.get("items", []):
        aid = act.get("order_id") or act.get("id")
        if aid:
            print(f"⚠️ Nettoyage tâche précédente #{aid}...")
            api.cancel_task(aid)

# Recherche tâche Reddit
st_t, t_data = api.get_available_tasks("reddit", limit=5)
tasks = t_data.get("tasks", []) if st_t == 200 else []
if not tasks:
    print("❌ Aucune tâche Reddit disponible actuellement.")
    sys.exit(0)

task = tasks[0]
task_id = task["id"]
action = task.get("action", "follow").upper()
reward = float(task.get("worker_reward") or task.get("cost_per_task") or 0.0)

print(f"\n🎯 Tâche Reddit sélectionnée : #{task_id} | Action: {action} | Gain: ${reward:.4f}")

# Démarrer la tâche
st_start, res_start = api.start_task(task_id, social_account_id=reddit_acc.get("id"))
print(f"   Status HTTP Start : {st_start}")

if st_start != 200 and ("active" in res_start or "TASK_IN_PROGRESS" in str(res_start)):
    act = res_start.get("active", {})
    aid = act.get("order_id") or act.get("id")
    if aid:
        print(f"⚠️ Déblocage tâche active #{aid}...")
        api.cancel_task(aid)
        time.sleep(1)
        st_start, res_start = api.start_task(task_id, social_account_id=reddit_acc.get("id"))

if st_start != 200 or not res_start.get("ok"):
    print(f"❌ Échec démarrage: {res_start}")
    sys.exit(1)

# Résolution URL cible
target_url = res_start.get("task", {}).get("target_url") or task.get("target_url") or ""
if not target_url:
    u_name = (res_start.get("task", {}).get("target_username") or task.get("target_username") or "").strip().lstrip("@")
    if u_name:
        target_url = f"https://www.reddit.com/user/{u_name}"

wait_sec = int(res_start.get("submit_after_sec") or 5)
print(f"🌐 URL Reddit résolue : {target_url}")
print(f"⏳ Attente requise : {wait_sec}s")

# Exécution navigateur
print(f"\n🤖 Exécution [{action}] via BrowserBot...")
ok_act, msg_act, screenshot_path = browser.execute_task_action(
    platform="reddit",
    action=action,
    target_url=target_url,
    task_id=task_id
)
print(f"   Résultat : {msg_act}")
print(f"   Capture  : {screenshot_path} (Existe: {os.path.exists(screenshot_path)})")

# Soumission
time.sleep(wait_sec + 1)
print("📤 Soumission de la preuve Reddit à PR.Social...")
st_sub, res_sub = api.submit_screenshot(task_id, screenshot_path)
print(f"   Status Soumission : {st_sub}")
print(f"   Réponse : {json.dumps(res_sub, indent=2)}")

if st_sub == 200 and res_sub.get("ok"):
    print(f"🎉 SUCCÈS TOTAL : Tâche Reddit #{task_id} validée et envoyée avec succès !")
else:
    print(f"⚠️ Échec soumission, annulation...")
    api.cancel_task(task_id)

browser.stop_driver()
