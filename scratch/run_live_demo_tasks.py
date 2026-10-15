import os
import sys
import time
import json
import logging

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

sys.path.insert(0, os.path.abspath("."))
from pc_bot.http_action_engine import PrSocialClient
from pc_bot.browser_bot import BrowserBot

# Charger configuration
with open(r"D:\social_pc_bot\config.json", "r", encoding="utf-8") as f:
    cfg = json.load(f)

token = cfg.get("token", "")
cf = cfg.get("cf_clearance", "")

client = PrSocialClient(token, cf)
browser_bot = BrowserBot(headless=True)

print("="*60)
print(" DÉMONSTRATION EN DIRECT : EXÉCUTION DE TÂCHES RÉELLES")
print("="*60)

# 1. Vérification connexion et solde
st, me = client.get_me()
user = me.get("user", {})
print(f"Utilisateur connecté : @{user.get('username')}")
print(f"Solde initial : ${user.get('balance')}")

# 2. Récupération des comptes approuvés
st_soc, socials = client.get_socials()
all_accounts = list(socials.get("accounts", []))
for p_obj in socials.get("platforms", []):
    all_accounts.extend(p_obj.get("accounts", []))

approved_accounts = {}
for acc in all_accounts:
    if acc.get("status") == "approved":
        p = acc.get("platform", "").lower()
        if p not in approved_accounts:
            approved_accounts[p] = acc

print(f"\nComptes prêts : {', '.join([p.upper() for p in approved_accounts.keys()])}")

# 3. Exécution séquentielle de 3 tâches réelles
# Priorités : linkedin, github, discord, youtube
target_order = ["linkedin", "github", "discord", "youtube", "facebook", "instagram"]
tasks_executed = 0
max_tasks = 3

try:
    for plat in target_order:
        if tasks_executed >= max_tasks:
            break
        if plat not in approved_accounts:
            continue

        acc = approved_accounts[plat]
        acc_id = acc.get("id")

        st, data = client.get_available_tasks(plat, limit=5)
        tasks = data.get("tasks", []) if st == 200 else []
        if not tasks:
            continue

        for t in tasks:
            if tasks_executed >= max_tasks:
                break

            task_id = t["id"]
            action = (t.get("action") or "FOLLOW").upper()
            reward = float(t.get("worker_reward") or t.get("cost_per_task") or 0.0)

            # Ignorer commentaires manuels
            if "comment" in action.lower():
                continue

            print("\n" + "-"*55)
            print(f"▶ [Tâche {tasks_executed + 1}/{max_tasks}] #{task_id} sur {plat.upper()} ({action}) - Gain : ${reward:.3f}")

            # Démarrage de la tâche
            start_st, start_res = client.start_task(task_id, acc_id)
            if start_st != 200 or not start_res.get("ok"):
                print(f"   [!] Impossible de démarrer : {start_res.get('error')}")
                continue

            target_url = start_res.get("task", {}).get("target_url") or t.get("target_url") or ""
            wait_sec = int(start_res.get("submit_after_sec") or 5)
            print(f"   URL : {target_url}")

            # Action réelle en arrière-plan + capture d'écran
            print("   [1] Navigation et exécution invisible en arrière-plan...")
            act_ok, act_msg, shot_path = browser_bot.execute_task_action(
                platform=plat,
                action=action,
                target_url=target_url,
                task_id=task_id
            )
            print(f"   [2] Capture d'écran générée : {os.path.basename(shot_path)}")

            # Attente réglementaire
            print(f"   [3] Attente de sécurité réglementaire ({wait_sec}s)...")
            time.sleep(wait_sec)

            # Envoi de la preuve à PR.Social
            print("   [4] Envoi de la preuve réelle à PR.Social...")
            sub_st, sub_res = client.submit_screenshot_file(task_id, shot_path)

            if sub_st == 200 and sub_res.get("ok"):
                status_val = sub_res.get("completion", {}).get("status", "pending_review")
                print(f"   [✓] Succès ! Preuve acceptée par PR.Social (Statut : {status_val})")
                tasks_executed += 1
                
                # Vérification du solde en direct
                _, fresh_me = client.get_me()
                fresh_bal = fresh_me.get("user", {}).get("balance")
                print(f"   [💰] Solde actuel sur PR.Social : ${fresh_bal}")
            else:
                print(f"   [!] Échec soumission ({sub_st}): {sub_res}. Annulation de sécurité...")
                client.cancel_task(task_id)

            # Petite pause anti-spam entre deux tâches
            if tasks_executed < max_tasks:
                print("   Pause de 6s avant la prochaine tâche...")
                time.sleep(6)
finally:
    browser_bot.stop_driver()

print("\n" + "="*60)
print(f" DÉMONSTRATION TERMINÉE : {tasks_executed} tâche(s) exécutée(s) avec succès !")
_, final_me = client.get_me()
print(f" Solde final réel : ${final_me.get('user', {}).get('balance')}")
print("="*60)
