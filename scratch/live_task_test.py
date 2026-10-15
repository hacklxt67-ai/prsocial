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
logger = logging.getLogger("LiveTaskTest")

config_file = r"D:\social_pc_bot\config.json"
with open(config_file, "r", encoding="utf-8") as f:
    cfg = json.load(f)

token = cfg.get("token", "").replace("token=", "").strip()
cf = cfg.get("cf_clearance", "").replace("cf_clearance=", "").strip()

api = PrSocialAPI(token=token, cf_clearance=cf)
browser = BrowserBot(headless=True)

print("="*70)
print("🧪 TEST RÉEL D'EXÉCUTION ET DE VALIDATION DE TÂCHE PR.SOCIAL")
print("="*70)

# 1. Vérification connexion et solde initial
st, me = api.get_me()
if st != 200 or not me.get("user"):
    print(f"❌ Erreur authentification: {me}")
    sys.exit(1)

user = me["user"]
initial_balance = float(user.get("balance", 0.0))
print(f"✅ Connecté avec succès : @{user.get('username')} (ID: {user.get('id')})")
print(f"💰 Solde initial : ${initial_balance:.4f}")

# 2. Récupération des comptes liés approuvés
st_soc, socials = api.get_socials()
approved = {}
if st_soc == 200:
    all_accounts = list(socials.get("accounts", []))
    for p_obj in socials.get("platforms", []):
        all_accounts.extend(p_obj.get("accounts", []))
    for acc in all_accounts:
        if acc.get("status") == "approved":
            plat = acc.get("platform", "").lower()
            if plat not in approved:
                approved[plat] = acc

print(f"📋 Plateformes approuvées disponibles: {', '.join([p.upper() for p in approved.keys()])}")

# 3. Déblocage préventif
st_hist, my_active = api.get_active_tasks()
if st_hist == 200:
    for act in my_active.get("items", []):
        aid = act.get("order_id") or act.get("id")
        if aid:
            print(f"⚠️ Nettoyage tâche précédente #{aid}...")
            api.cancel_task(aid)

# 4. Sélectionner une tâche réelle parmi Threads, Reddit ou autres plateformes approuvées
test_platforms = ["threads", "reddit", "youtube", "tiktok", "instagram"]
selected_task = None
selected_platform = None

for p in test_platforms:
    if p not in approved:
        continue
    st_t, t_data = api.get_available_tasks(p, limit=5)
    if st_t == 200:
        tasks = t_data.get("tasks", [])
        if tasks:
            selected_task = tasks[0]
            selected_platform = p
            break

if not selected_task:
    print("❌ Aucune tâche disponible sur les plateformes de test.")
    sys.exit(1)

task_id = selected_task["id"]
action = selected_task.get("action", "follow").upper()
reward = float(selected_task.get("worker_reward") or selected_task.get("cost_per_task") or 0.0)
acc_id = approved[selected_platform].get("id")

print(f"\n🎯 TÂCHE SÉLECTIONNÉE : #{task_id}")
print(f"   Plateforme  : [{selected_platform.upper()}]")
print(f"   Action      : {action}")
print(f"   Récompense  : ${reward:.4f}")
print(f"   Compte lié  : @{approved[selected_platform].get('username')} (ID: {acc_id})")

# 5. Démarrer la tâche sur PR.Social
print(f"\n▶️ Démarrage de la tâche #{task_id} sur l'API...")
st_start, res_start = api.start_task(task_id, social_account_id=acc_id)
print(f"   Status HTTP : {st_start}")
print(f"   Réponse API : {json.dumps(res_start, indent=2)}")

if st_start != 200 and ("active" in res_start or "TASK_IN_PROGRESS" in str(res_start)):
    act = res_start.get("active", {})
    aid = act.get("order_id") or act.get("id")
    if aid:
        print(f"⚠️ Déblocage automatique tâche active #{aid}...")
        api.cancel_task(aid)
        time.sleep(1)
        st_start, res_start = api.start_task(task_id, social_account_id=acc_id)
        print(f"   Deuxième tentative Status HTTP : {st_start}")

if st_start != 200 or not res_start.get("ok"):
    print(f"❌ Impossible de démarrer la tâche: {res_start.get('error')}")
    sys.exit(1)

# 6. Résolution de l'URL cible
target_url = res_start.get("task", {}).get("target_url") or selected_task.get("target_url") or ""
if not target_url:
    u_name = (res_start.get("task", {}).get("target_username") or selected_task.get("target_username") or "").strip().lstrip("@")
    if u_name:
        if selected_platform == "threads":
            target_url = f"https://www.threads.net/@{u_name}"
        elif selected_platform == "reddit":
            target_url = f"https://www.reddit.com/user/{u_name}"
        elif selected_platform in ["twitter", "x"]:
            target_url = f"https://x.com/{u_name}"
        elif selected_platform == "instagram":
            target_url = f"https://www.instagram.com/{u_name}"
        elif selected_platform == "tiktok":
            target_url = f"https://www.tiktok.com/@{u_name}"

wait_sec = int(res_start.get("submit_after_sec") or 5)
api_check_enabled = res_start.get("api_check_enabled", 0)

print(f"\n🌐 URL Cible résolue : {target_url}")
print(f"⏳ Délai imposé avant soumission : {wait_sec}s")
print(f"⚡ API Check enabled : {api_check_enabled}")

# 7. Exécution dans le navigateur
print(f"\n🤖 Exécution de l'action [{action}] via BrowserBot (Headless)...")
ok_act, msg_act, screenshot_path = browser.execute_task_action(
    platform=selected_platform,
    action=action,
    target_url=target_url,
    task_id=task_id
)
print(f"   Résultat Browser : {msg_act}")
print(f"   Screenshot créé  : {screenshot_path} (Existe: {os.path.exists(screenshot_path)}, Taille: {os.path.getsize(screenshot_path) if os.path.exists(screenshot_path) else 0} octets)")

# 8. Validation
is_validated = False

# Option A: API Check si activé
if api_check_enabled == 1:
    print("   Vérification par API Check...")
    st_chk, res_chk = api.api_check_task(task_id)
    print(f"   API Check Réponse: {res_chk}")
    if st_chk == 200 and res_chk.get("found") is True and res_chk.get("approved") is True:
        is_validated = True
        print("   ✅ Validé instantanément par API Check !")

# Option B: Soumission Capture
if not is_validated and os.path.exists(screenshot_path):
    print(f"   Attente du délai de sécurité de {wait_sec}s...")
    time.sleep(wait_sec + 1)
    print("   📤 Upload et soumission de la capture d'écran...")
    st_sub, res_sub = api.submit_screenshot(task_id, screenshot_path)
    print(f"   Status HTTP : {st_sub}")
    print(f"   Réponse Soumission : {json.dumps(res_sub, indent=2)}")
    if st_sub == 200 and res_sub.get("ok"):
        is_validated = True
        c_status = res_sub.get("completion", {}).get("status", "pending_review")
        print(f"   ✅ Capture acceptée par PR.Social ! (Statut completion: {c_status})")
    else:
        print(f"   ⚠️ Échec soumission: {res_sub}")
        print("   Annulation de sécurité pour débloquer le compte...")
        api.cancel_task(task_id)

# 9. Re-vérification du solde final
st_final, me_final = api.get_me()
if st_final == 200 and me_final.get("user"):
    final_balance = float(me_final["user"].get("balance", 0.0))
    print("\n" + "="*70)
    print(f"📊 RÉSULTAT FINAL DU TEST")
    print(f"   Solde avant test : ${initial_balance:.4f}")
    print(f"   Solde après test : ${final_balance:.4f}")
    if final_balance > initial_balance:
        print(f"   🎉 GAIN CRÉDITÉ EN DIRECT : +${(final_balance - initial_balance):.4f}")
    else:
        print(f"   ℹ️ Preuve enregistrée en révision (crédit dès validation par le modérateur/système).")
    print("="*70)

browser.stop_driver()
