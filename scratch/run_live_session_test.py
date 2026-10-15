import os
import sys
import time
import json
import random

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
print(" DÉMONSTRATION EN DIRECT : EXÉCUTION DE 3 TÂCHES RÉELLES")
print("="*60)

st, me = client.get_me()
u = me.get("user", {})
print(f"Utilisateur connecté : @{u.get('username')}")
print(f"Solde en ligne initial : ${u.get('balance')}")

# Récupérer comptes approuvés
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

target_platforms = ["twitter", "snapchat", "github", "youtube", "discord", "linkedin"]
tasks_executed = 0
max_tasks = 3

try:
    for plat in target_platforms:
        if tasks_executed >= max_tasks:
            break
        if plat not in approved_accounts:
            continue

        acc_id = approved_accounts[plat].get("id")
        st, data = client.get_available_tasks(plat, limit=10)
        tasks = data.get("tasks", []) if st == 200 else []
        if not tasks:
            continue

        for t in tasks:
            if tasks_executed >= max_tasks:
                break

            task_id = t["id"]
            action = (t.get("action") or "FOLLOW").upper()
            reward = float(t.get("worker_reward") or t.get("cost_per_task") or 0.0)

            print("\n" + "-"*55)
            print(f"▶ [Tâche {tasks_executed + 1}/{max_tasks}] #{task_id} sur {plat.upper()} ({action}) - Gain : ${reward:.3f}")

            # 1. Démarrer la tâche
            start_st, start_res = client.start_task(task_id, acc_id)
            if start_st != 200 or not start_res.get("ok"):
                print(f"   [!] Démarrage refusé : {start_res.get('error')}")
                continue

            target_url = start_res.get("task", {}).get("target_url") or t.get("target_url") or ""
            wait_sec = int(start_res.get("submit_after_sec") or 5)
            api_check_enabled = start_res.get("api_check_enabled", 0)
            print(f"   URL : {target_url}")

            # 2. Gestion intelligente du commentaire si applicable
            comment_text = None
            if "comment" in action.lower():
                assigned = start_res.get("completion", {}).get("assigned_comment") or start_res.get("task", {}).get("assigned_comment") or t.get("assigned_comment")
                if not assigned:
                    c_list = start_res.get("task", {}).get("comment_list") or t.get("comment_list")
                    if isinstance(c_list, str):
                        try:
                            c_list = json.loads(c_list)
                        except Exception:
                            c_list = [line.strip() for line in c_list.split("\n") if line.strip()]
                    if isinstance(c_list, list) and c_list:
                        assigned = random.choice(c_list)
                if not assigned and ("emoji" in (start_res.get("task", {}).get("comment_type") or "").lower() or "emoji" in action.lower()):
                    assigned = random.choice(["🔥", "👏", "🚀", "❤️", "👍", "✨"])
                if not assigned:
                    assigned = random.choice(["Great post! 👍", "Top ! 🔥", "Interesting! 👏"])
                comment_text = str(assigned).strip()
                print(f"   Commentaire à insérer : '{comment_text}'")

            # 3. Exécution invisible
            print("   [1] Navigation et exécution silencieuse en arrière-plan...")
            act_ok, act_msg, shot_path = browser_bot.execute_task_action(
                platform=plat,
                action=action,
                target_url=target_url,
                task_id=task_id,
                comment_text=comment_text
            )
            print(f"   [2] Capture d'écran enregistrée : {os.path.basename(shot_path)}")

            is_validated = False

            # 4. Vérification API si activée
            if api_check_enabled == 1:
                chk_st, chk_res = client.api_check_task(task_id)
                if chk_st == 200 and chk_res.get("found") is True and chk_res.get("approved") is True:
                    is_validated = True
                    print("   [✓] Validée immédiatement par l'API PR.Social !")

            # 5. Soumission de la preuve
            if not is_validated and os.path.exists(shot_path):
                print(f"   [3] Attente de sécurité ({wait_sec}s) puis envoi de la preuve...")
                time.sleep(wait_sec)
                sub_st, sub_res = client.submit_screenshot_file(task_id, shot_path)
                if sub_st == 200 and sub_res.get("ok"):
                    is_validated = True
                    st_val = sub_res.get("completion", {}).get("status", "pending_review")
                    print(f"   [✓] Preuve acceptée par PR.Social (Statut : {st_val})")
                else:
                    print(f"   [!] Non validée ({sub_res.get('error', sub_st)}). Annulation immédiate...")
                    client.cancel_task(task_id)

            if is_validated:
                tasks_executed += 1
                _, fresh_me = client.get_me()
                print(f"   [💰] Solde réel mis à jour : ${fresh_me.get('user', {}).get('balance')}")

            time.sleep(5)

finally:
    browser_bot.stop_driver()

print("\n" + "="*60)
print(f" SESSION TERMINÉE : {tasks_executed} tâche(s) validée(s) !")
_, final_me = client.get_me()
print(f" Solde en ligne final : ${final_me.get('user', {}).get('balance')}")
print("="*60)
