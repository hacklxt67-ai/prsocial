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
print(" TEST RÉEL STRICT SUR TÂCHE DE COMMENTAIRE")
print("="*60)

st, me = client.get_me()
u = me.get("user", {})
print(f"Utilisateur : @{u.get('username')} | Solde : ${u.get('balance')}")

# Récupérer un compte approuvé (par ex twitter: 350070, youtube: 285765, etc.)
st_soc, socials = client.get_socials()
all_accounts = list(socials.get("accounts", []))
for p in socials.get("platforms", []):
    all_accounts.extend(p.get("accounts", []))
acc_map = {a.get("platform"): a.get("id") for a in all_accounts if a.get("status") == "approved"}

test_platforms = ["twitter", "youtube", "linkedin"]
tested = False

try:
    for plat in test_platforms:
        if tested:
            break
        acc_id = acc_map.get(plat)
        if not acc_id:
            continue

        st, data = client.get_available_tasks(plat, limit=30)
        tasks = data.get("tasks", []) if st == 200 else []
        comment_tasks = [t for t in tasks if "comment" in (t.get("action") or "").lower()]
        if not comment_tasks:
            continue

        for ct in comment_tasks:
            task_id = ct["id"]
            action = ct.get("action", "COMMENT").upper()
            reward = float(ct.get("worker_reward") or ct.get("cost_per_task") or 0.0)

            print(f"\n▶ TÂCHE #{task_id} sur {plat.upper()} ({action}) - Gain : ${reward:.3f}")
            start_st, start_res = client.start_task(task_id, acc_id)
            if start_st != 200 or not start_res.get("ok"):
                print(f"   [!] Impossible de démarrer : {start_res.get('error')}")
                continue

            target_url = start_res.get("task", {}).get("target_url") or ct.get("target_url") or ""
            wait_sec = int(start_res.get("submit_after_sec") or 5)

            # Extraction du commentaire intelligent
            assigned = start_res.get("completion", {}).get("assigned_comment")
            if not assigned:
                assigned = start_res.get("task", {}).get("assigned_comment")
            if not assigned:
                c_list = start_res.get("task", {}).get("comment_list")
                if isinstance(c_list, str):
                    try:
                        c_list = json.loads(c_list)
                    except Exception:
                        c_list = [line.strip() for line in c_list.split("\n") if line.strip()]
                if isinstance(c_list, list) and c_list:
                    assigned = random.choice(c_list)
            if not assigned:
                assigned = "Great! 👍"

            comment_text = str(assigned).strip()
            print(f"   URL : {target_url}")
            print(f"   Commentaire à poster : '{comment_text}'")

            # Exécution réelle en arrière-plan
            print(f"   [1] Navigation & saisie automatique du commentaire...")
            act_ok, act_msg, shot_path = browser_bot.execute_task_action(
                platform=plat,
                action=action,
                target_url=target_url,
                task_id=task_id,
                comment_text=comment_text
            )
            print(f"   [2] Résultat : ok={act_ok}, capture={os.path.basename(shot_path)}")

            print(f"   [3] Attente réglementaire de {wait_sec}s...")
            time.sleep(wait_sec)

            print(f"   [4] Soumission de la capture d'écran...")
            sub_st, sub_res = client.submit_screenshot_file(task_id, shot_path)
            print(f"       Réponse PR.Social : {sub_st} -> {sub_res}")

            if sub_st == 200 and sub_res.get("ok"):
                print(f"   [✓] SUCCÈS ! Tâche #{task_id} acceptée par PR.Social ({sub_res.get('completion', {}).get('status')})")
                _, fresh_me = client.get_me()
                print(f"   [💰] Nouveau solde en ligne : ${fresh_me.get('user', {}).get('balance')}")
            else:
                print(f"   [!] Non validée. Annulation immédiate...")
                client.cancel_task(task_id)

            tested = True
            break
finally:
    browser_bot.stop_driver()

st, inp = client.get_in_progress_tasks()
print("\n" + "="*60)
print(f"Nettoyage final : {len(inp.get('items', []))} tâche(s) en cours.")
print("="*60)
