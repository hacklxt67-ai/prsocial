import os
import sys
import json
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

sys.path.insert(0, os.path.abspath("."))
from pc_bot.http_action_engine import UniversalSilentEngine

with open(r"D:\social_pc_bot\config.json", "r", encoding="utf-8") as f:
    cfg = json.load(f)

token = cfg.get("token", "")
cf = cfg.get("cf_clearance", "")

engine = UniversalSilentEngine(token, cf)

# Limiter le test aux nouvelles plateformes ajoutées par l'utilisateur
# Priorité à LinkedIn ($0.007), puis GitHub ($0.004), Discord ($0.004)
print("=== TEST EN DIRECT D'UNE TÂCHE SUR LES NOUVELLES PLATEFORMES ===")

# Récupération des comptes approuvés
st, socials = engine.pr_api.get_socials()
all_accounts = list(socials.get("accounts", []))
for p_obj in socials.get("platforms", []):
    all_accounts.extend(p_obj.get("accounts", []))

approved_accounts = {}
for acc in all_accounts:
    if acc.get("status") == "approved":
        p = acc.get("platform", "").lower()
        if p not in approved_accounts:
            approved_accounts[p] = acc

new_platforms = ["linkedin", "github", "discord"]
tested = False

for plat in new_platforms:
    if plat not in approved_accounts:
        continue
    acc_id = approved_accounts[plat].get("id")
    st, data = engine.pr_api.get_available_tasks(plat, limit=5)
    tasks = data.get("tasks", []) if st == 200 else []
    
    if not tasks:
        continue
        
    t = tasks[0]
    task_id = t["id"]
    action = (t.get("action") or "FOLLOW").upper()
    reward = float(t.get("worker_reward") or t.get("cost_per_task") or 0.0)
    
    print(f"\n[Test] Démarrage tâche #{task_id} sur {plat.upper()} ({action}) - Récompense: ${reward}")
    start_st, start_res = engine.pr_api.start_task(task_id, acc_id)
    if start_st != 200 or not start_res.get("ok"):
        print(f"Erreur start_task: {start_res}")
        continue
        
    target_url = start_res.get("task", {}).get("target_url") or t.get("target_url") or ""
    wait_sec = int(start_res.get("submit_after_sec") or 5)
    print(f"URL cible: {target_url} (Attente: {wait_sec}s)")
    
    act_ok, act_msg, shot_path = engine.browser_bot.execute_task_action(
        platform=plat,
        action=action,
        target_url=target_url,
        task_id=task_id
    )
    print(f"Résultat action: ok={act_ok}, msg={act_msg}, screenshot={shot_path}")
    
    import time
    time.sleep(wait_sec)
    
    sub_st, sub_res = engine.pr_api.submit_screenshot_file(task_id, shot_path)
    print(f"Soumission PR.Social: status={sub_st}, reponse={sub_res}")
    
    if sub_st == 200 and sub_res.get("ok"):
        print(f"🎉 SUCCÈS CONFIRMÉ SUR {plat.upper()} !")
        st_me, me = engine.pr_api.get_me()
        print(f"Nouveau solde réel : ${me.get('user', {}).get('balance')}")
    else:
        print(f"Annulation de la tâche...")
        engine.pr_api.cancel_task(task_id)
        
    tested = True
    break

engine.browser_bot.stop_driver()
if not tested:
    print("Aucune tâche immédiate n'a pu être lancée.")
