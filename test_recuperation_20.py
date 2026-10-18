import os
import sys
import json
import time
import random

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

if os.name == 'nt':
    os.system('color')

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from pc_bot.pr_api import PrSocialAPI
from pc_bot.browser_bot import BrowserBot
from pc_bot.rejected_tasks_manager import RejectedTasksManager

CONFIG_FILE = os.path.join(current_dir, "config.json") if os.path.exists(os.path.join(current_dir, "config.json")) else r"D:\social_pc_bot\config.json"

with open(CONFIG_FILE, "r", encoding="utf-8") as f:
    cfg = json.load(f)

token = cfg.get("token")
cf = cfg.get("cf_clearance")
api = PrSocialAPI(token=token, cf_clearance=cf)
browser_bot = BrowserBot(headless=True)
manager = RejectedTasksManager(api=api, browser_bot=browser_bot)

print("=" * 65)
print("  TEST DE RÉCUPÉRATION STRICTE SUR UN ÉCHANTILLON DE 20 TÂCHES")
print("=" * 65)

st, me = api.get_me()
u = me.get("user", {})
initial_balance = float(u.get("balance", 0.0))
print(f"Utilisateur : @{u.get('username')} | Solde initial : ${initial_balance:.4f}\n")

# Récupération de 20 tâches rejetées récentes
st_list, data = api.get_rejected_tasks(page=1, limit=20)
raw_items = data.get("items", [])[:20]

print(f"✓ {len(raw_items)} tâches récupérées pour le test.\n")

results = []
success_count = 0
slots_count = 0
expired_count = 0
gains = 0.0

for idx, it in enumerate(raw_items, 1):
    tid = it.get("order_id") or it.get("id")
    plat = (it.get("platform") or "unknown").upper()
    act = (it.get("action") or "FOLLOW").upper()
    rew = float(it.get("worker_reward") or it.get("cost_per_task") or 0.0)

    print(f"[{idx}/20] Tâche #{tid} [{plat} - {act}] (Gain: +${rew:.3f})")

    # Création de l'objet pour RejectedTasksManager
    task_obj = {
        "task_id": tid,
        "order_id": tid,
        "platform": it.get("platform", "").lower(),
        "action": it.get("action", "").lower(),
        "reward": rew,
        "target_url": it.get("target_url", ""),
        "target_username": it.get("target_username", ""),
        "ai_reason_raw": it.get("ai_reason") or "REJET GENERAL IA",
        "analysis": {
            "category": "REJET IA",
            "strict_measure": "Vérification DOM stricte + hash unique"
        }
    }

    ok, msg = manager.retry_single_task(task_obj, log_cb=lambda m, l: print(f"    [{l.upper()}] {m}"))

    if ok:
        success_count += 1
        gains += rew
        print(f"    --> VALIDÉE ET RESOUMISE ! +${rew:.3f}\n")
        time.sleep(random.uniform(3.0, 5.0))
    else:
        status_detail = task_obj.get("status_retry", msg)
        print(f"    --> Non exécutable : {status_detail}\n")
        if "expirée" in str(status_detail).lower() or "not_found" in str(status_detail).lower():
            expired_count += 1
        elif "places" in str(status_detail).lower() or "slots" in str(status_detail).lower():
            slots_count += 1
        time.sleep(0.3)

browser_bot.stop_driver()

st_me2, me2 = api.get_me()
fresh_balance = float(me2.get("user", {}).get("balance", initial_balance))

print("=" * 65)
print("  RÉSULTATS DU TEST SUR LES 20 TÂCHES")
print("=" * 65)
print(f"  ✓ Tâches récupérées et soumises : {success_count}")
print(f"  ⏳ Tâches temporairement occupées (SLOTS_TAKEN) : {slots_count}")
print(f"  ❌ Campagnes closes par l'annonceur : {expired_count}")
print(f"  💰 Solde actuel : ${fresh_balance:.4f} (Variation: +${fresh_balance - initial_balance:.4f})")
print("=" * 65)
