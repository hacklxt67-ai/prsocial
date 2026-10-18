import os
import sys
import json
import time
import random

# Assurer l'encodage UTF-8 sous Windows CMD
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
from pc_bot.rejected_tasks_manager import RejectedTasksManager, analyze_rejection_error

CONFIG_FILE = os.path.join(current_dir, "config.json") if os.path.exists(os.path.join(current_dir, "config.json")) else r"D:\social_pc_bot\config.json"

class Colors:
    RESET   = "\033[0m"
    BOLD    = "\033[1m"
    GREEN   = "\033[92m"
    YELLOW  = "\033[93m"
    RED     = "\033[91m"
    CYAN    = "\033[96m"
    MAGENTA = "\033[95m"
    WHITE   = "\033[97m"
    GRAY    = "\033[90m"

BANNER = f"""{Colors.CYAN}{Colors.BOLD}
  ██████╗ ██████╗       ███████╗ ██████╗  ██████╗██╗ █████╗ ██╗     
  ██╔══██╗██╔══██╗      ██╔════╝██╔═══██╗██╔════╝██║██╔══██╗██║     
  ██████╔╝██████╔╝█████╗███████╗██║   ██║██║     ██║███████║██║     
  ██╔═══╝ ██╔══██╗╚════╝╚════██║██║   ██║██║     ██║██╔══██║██║     
  ██║     ██║  ██║      ███████║╚██████╔╝╚██████╗██║██║  ██║███████╗
  ╚═╝     ╚═╝  ╚═╝      ╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝{Colors.RESET}
         {Colors.MAGENTA}{Colors.BOLD}⚡ RÉCUPÉRATION STRICTE DES 209 TÂCHES REJETÉES ⚡{Colors.RESET}
{Colors.GRAY}  ─────────────────────────────────────────────────────────────{Colors.RESET}"""

def main():
    print(BANNER)

    if not os.path.exists(CONFIG_FILE):
        print(f"  {Colors.RED}Fichier de configuration introuvable : {CONFIG_FILE}{Colors.RESET}")
        return

    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        cfg = json.load(f)

    token = cfg.get("token", "").strip()
    cf = cfg.get("cf_clearance", "").strip()

    if not token:
        print(f"  {Colors.RED}Aucun token configuré.{Colors.RESET}")
        return

    api = PrSocialAPI(token=token, cf_clearance=cf)
    st, me = api.get_me()
    if st != 200 or not me.get("user"):
        print(f"  {Colors.RED}Échec d'authentification PR.Social. Token invalide.{Colors.RESET}")
        return

    user = me["user"]
    initial_balance = float(user.get("balance", 0.0))
    print(f"  {Colors.GREEN}{Colors.BOLD}● CONNECTÉ : @{user.get('username')}{Colors.RESET}  |  {Colors.YELLOW}{Colors.BOLD}💰 Solde actuel : ${initial_balance:.4f}{Colors.RESET}\n")

    browser_bot = BrowserBot(headless=True)
    manager = RejectedTasksManager(api=api, browser_bot=browser_bot)

    def log_msg(msg: str, level: str = "info"):
        if level == "success":
            print(f"      {Colors.GREEN}{msg}{Colors.RESET}")
        elif level == "warning":
            print(f"      {Colors.YELLOW}{msg}{Colors.RESET}")
        elif level == "error":
            print(f"      {Colors.RED}{msg}{Colors.RESET}")
        else:
            print(f"      {Colors.GRAY}{msg}{Colors.RESET}")

    print(f"  {Colors.YELLOW}🔍 Récupération et analyse de toutes les tâches rejetées (15 pages)...{Colors.RESET}")
    all_tasks = manager.fetch_all_rejected_tasks(max_pages=15)
    print(f"  {Colors.GREEN}✓ {len(all_tasks)} tâches rejetées trouvées au total sur le compte.{Colors.RESET}\n")

    # Statistiques préliminaires
    plat_counts = {}
    for t in all_tasks:
        p = t["platform"]
        plat_counts[p] = plat_counts.get(p, 0) + 1

    print(f"  {Colors.WHITE}{Colors.BOLD}📊 Répartition des rejets par plateforme :{Colors.RESET}")
    for p, c in sorted(plat_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"    • {p.upper():<12} : {c} tâches")
    print()

    print(f"  {Colors.CYAN}{Colors.BOLD}🚀 Démarrage du traitement strict de récupération...{Colors.RESET}")
    print(f"  {Colors.GRAY}(Appuyez sur Ctrl+C à tout moment pour arrêter proprement){Colors.RESET}\n")

    success_count = 0
    expired_count = 0
    slots_count = 0
    total_gains = 0.0

    try:
        for idx, t in enumerate(all_tasks, 1):
            tid = t["task_id"]
            plat = t["platform"].upper()
            act = t["action"].upper()
            rew = t.get("reward", 0.0)

            print(f"  {Colors.CYAN}[{idx}/{len(all_tasks)}] Tâche #{tid} [{plat} - {act}] (Gain: +${rew:.3f}){Colors.RESET}")

            ok, res_msg = manager.retry_single_task(t, log_cb=log_msg)

            if ok:
                success_count += 1
                total_gains += rew
                print(f"      {Colors.GREEN}{Colors.BOLD}🎉 Tâche #{tid} RÉCUPÉRÉE ET SOUMISE ! Gain: +${rew:.3f}{Colors.RESET}\n")
                # Pause humaine entre les vraies tâches exécutées
                pause = random.uniform(4.0, 7.0)
                time.sleep(pause)
            else:
                if "expirée" in res_msg.lower() or "not_found" in res_msg.lower():
                    expired_count += 1
                elif "places" in res_msg.lower() or "slots" in res_msg.lower():
                    slots_count += 1
                # Fast-skip (0.4s) pour ne pas perdre de temps
                time.sleep(0.4)

    except KeyboardInterrupt:
        print(f"\n  {Colors.YELLOW}Arrêt demandé par l'utilisateur.{Colors.RESET}")
    finally:
        browser_bot.stop_driver()

    # Bilan final
    st_fresh, me_fresh = api.get_me()
    fresh_balance = float(me_fresh.get("user", {}).get("balance", initial_balance)) if st_fresh == 200 else initial_balance

    print(f"\n  {Colors.WHITE}{Colors.BOLD}=================== BILAN DE LA SESSION ==================={Colors.RESET}")
    print(f"  {Colors.GREEN}{Colors.BOLD}✓ Tâches récupérées et soumises : {success_count}{Colors.RESET}")
    print(f"  {Colors.YELLOW}⏳ Tâches temporairement occupées (SLOTS_TAKEN) : {slots_count}{Colors.RESET}")
    print(f"  {Colors.GRAY}❌ Campagnes expirées/terminées par l'annonceur : {expired_count}{Colors.RESET}")
    print(f"  {Colors.YELLOW}{Colors.BOLD}💰 Solde PR.Social mis à jour : ${fresh_balance:.4f} (+${fresh_balance - initial_balance:.4f}){Colors.RESET}\n")

if __name__ == "__main__":
    main()
