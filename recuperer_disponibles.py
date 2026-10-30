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

api = PrSocialAPI(token=cfg.get("token"), cf_clearance=cfg.get("cf_clearance"))
b_bot = BrowserBot(headless=True)
mgr = RejectedTasksManager(api=api, browser_bot=b_bot)

os.system('cls' if os.name == 'nt' else 'clear')
print("=== SCAN ET RÉCUPÉRATION DIRECTE DES TÂCHES REJETÉES DISPONIBLES ===")
st_me, me = api.get_me()
u = me.get("user", {})
print(f"Utilisateur : @{u.get('username')} | Solde de départ : ${float(u.get('balance', 0)):.4f}\n")

print("1. Récupération de la liste complète des rejets...")
all_tasks = mgr.fetch_all_rejected_tasks(max_pages=100)
print(f"   -> {len(all_tasks)} tâches trouvées au total.\n")

print("2. Démarrage de la récupération...")
success_count = 0
total_earnings = 0.0

for idx, t in enumerate(all_tasks, 1):
    tid = t["task_id"]
    plat = t["platform"].upper()
    act = t["action"].upper()
    rew = t.get("reward", 0.0)

    print(f"\n>>> [{idx}/{len(all_tasks)}] Tâche #{tid} [{plat} - {act}] (Gain potentiel: +${rew:.3f})...")
    ok, msg = mgr.retry_single_task(t, log_cb=lambda m, l: print(f"    [{l.upper()}] {m}"))
    if ok:
        success_count += 1
        total_earnings += rew
        print(f"    [SUCCÈS] Tâche #{tid} soumise avec succès ! Total session: +${total_earnings:.3f}")
        time.sleep(random.uniform(4.0, 6.0))
    else:
        print(f"    [ÉCHEC] #{tid} non validée : {msg}")
        time.sleep(1.0)

b_bot.stop_driver()

st_me2, me2 = api.get_me()
bal2 = float(me2.get("user", {}).get("balance", 0))
print(f"\n=== BILAN COMPLET ===")
print(f"Tâches validées et récupérées : {success_count}")
print(f"Gains potentiels session : +${total_earnings:.3f}")
print(f"Nouveau solde : ${bal2:.4f}")
