import os
import sys
import time
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

sys.path.insert(0, os.path.abspath("."))
from pc_bot.http_action_engine import PrSocialClient
from pc_bot.browser_bot import BrowserBot

with open(r"D:\social_pc_bot\config.json", "r", encoding="utf-8") as f:
    cfg = json.load(f)

client = PrSocialClient(cfg.get("token"), cfg.get("cf_clearance"))
browser_bot = BrowserBot(headless=True)

print("="*60)
print(" TEST RÉEL STRICT SUR TWITTER ET SNAPCHAT")
print("="*60)

st, me = client.get_me()
u = me.get("user", {})
print(f"Utilisateur : @{u.get('username')} | Solde actuel : ${u.get('balance')}")

accounts_tested = [
    ("twitter", 350070),
    ("snapchat", 350100)
]

try:
    for plat, acc_id in accounts_tested:
        st, data = client.get_available_tasks(plat, limit=5)
        tasks = data.get("tasks", []) if st == 200 else []
        if not tasks:
            print(f"Aucune tâche disponible sur {plat.upper()}.")
            continue

        t = tasks[0]
        task_id = t["id"]
        action = (t.get("action") or "FOLLOW").upper()
        reward = float(t.get("worker_reward") or t.get("cost_per_task") or 0.0)

        print("\n" + "-"*55)
        print(f"▶ TEST TÂCHE #{task_id} sur {plat.upper()} ({action}) - Récompense : ${reward:.3f}")

        # 1. Démarrer la tâche
        start_st, start_res = client.start_task(task_id, acc_id)
        if start_st != 200 or not start_res.get("ok"):
            print(f"   [!] Erreur start_task: {start_res}")
            continue

        target_url = start_res.get("task", {}).get("target_url") or t.get("target_url") or ""
        wait_sec = int(start_res.get("submit_after_sec") or 5)
        api_check_enabled = start_res.get("api_check_enabled", 0)
        print(f"   URL : {target_url} (Attente requise : {wait_sec}s, API Check : {api_check_enabled})")

        # 2. Exécution invisible
        print(f"   [1] Navigation & exécution en arrière-plan...")
        act_ok, act_msg, shot_path = browser_bot.execute_task_action(
            platform=plat,
            action=action,
            target_url=target_url,
            task_id=task_id
        )
        print(f"   [2] Résultat action : ok={act_ok}, capture={os.path.basename(shot_path)}")

        is_validated = False

        # 3. Vérification API si supportée
        if api_check_enabled == 1:
            print("   [3] Test validation directe par API PR.Social...")
            chk_st, chk_res = client.api_check_task(task_id)
            print(f"       Réponse API Check : status={chk_st}, body={chk_res}")
            if chk_st == 200 and chk_res.get("found") is True and chk_res.get("approved") is True:
                is_validated = True
                print("   [✓] Validée instantanément par l'API !")

        # 4. Soumission par capture d'écran
        if not is_validated and os.path.exists(shot_path):
            print(f"   [4] Attente réglementaire de {wait_sec}s avant soumission...")
            time.sleep(wait_sec)
            print("       Envoi de la capture d'écran réelle à PR.Social...")
            sub_st, sub_res = client.submit_screenshot_file(task_id, shot_path)
            print(f"       Réponse soumission : status={sub_st}, body={sub_res}")
            if sub_st == 200 and sub_res.get("ok"):
                is_validated = True
                print(f"   [✓] Succès ! Preuve acceptée par PR.Social ({sub_res.get('completion', {}).get('status')})")

        if not is_validated:
            print("   [!] Non validée. Annulation immédiate de sécurité...")
            client.cancel_task(task_id)
        else:
            _, fresh_me = client.get_me()
            print(f"   [💰] Nouveau solde en ligne : ${fresh_me.get('user', {}).get('balance')}")

        time.sleep(5)

finally:
    browser_bot.stop_driver()

# Nettoyage de vérification
st, inp = client.get_in_progress_tasks()
print("\n" + "="*60)
print(f"Vérification finale : {len(inp.get('items', []))} tâche(s) en cours.")
_, final_me = client.get_me()
print(f"Solde final : ${final_me.get('user', {}).get('balance')}")
print("="*60)
