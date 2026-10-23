#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
PR.SOCIAL - CLOUD & GITHUB ACTIONS RUNNER 100% AUTONOME
================================================================================
Dossier isolé : cloud_deploy/
Ne modifie aucun fichier du dossier original pc_bot/.
================================================================================
"""

import os
import sys
import time
import json
import random
import argparse
from datetime import datetime
from typing import Dict, Any, List, Optional

# Assurer l'encodage UTF-8
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Ajouter les chemins sans modifier les fichiers originaux
cloud_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(cloud_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if cloud_dir not in sys.path:
    sys.path.insert(0, cloud_dir)

from pc_bot.pr_api import PrSocialAPI
from pc_bot.http_action_engine import UniversalSilentEngine
from termux_bot.rejected_tasks_manager import TermuxRejectedTasksManager
from termux_bot.browser_termux import BrowserTermux

# Couleurs ANSI
RESET = "\033[0m"
BOLD = "\033[1m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BLUE = "\033[94m"
MAGENTA = "\033[95m"
WHITE = "\033[97m"
RED = "\033[91m"


def print_banner():
    print(f"""{CYAN}{BOLD}
  ██████╗ ██████╗       ███████╗ ██████╗  ██████╗██╗ █████╗ ██╗     
  ██╔══██╗██╔══██╗      ██╔════╝██╔═══██╗██╔════╝██║██╔══██╗██║     
  ██████╔╝██████╔╝█████╗███████╗██║   ██║██║     ██║███████║██║     
  ██╔═══╝ ██╔══██╗╚════╝╚════██║██║   ██║██║     ██║██╔══██║██║     
  ██║     ██║  ██║      ███████║╚██████╔╝╚██████╗██║██║  ██║███████╗
  ╚═╝     ╚═╝  ╚═╝      ╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝
        {MAGENTA}★ GITHUB ACTIONS / CLOUD RUNNER • 100% AUTONOME ★{RESET}
  ─────────────────────────────────────────────────────────────""")


def get_credentials() -> tuple[str, str]:
    token = os.environ.get("PR_TOKEN", "").strip()
    cf = os.environ.get("PR_CF_CLEARANCE", "").strip()

    if not token:
        for p in [os.path.join(root_dir, "config.json"), os.path.join(root_dir, "termux_bot", "config.json")]:
            if os.path.exists(p):
                try:
                    with open(p, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        token = data.get("token", "").strip()
                        cf = data.get("cf_clearance", "").strip()
                        if token:
                            break
                except Exception:
                    pass

    return token, cf


def main():
    print_banner()

    parser = argparse.ArgumentParser(description="PR.Social Cloud & GitHub Actions Runner")
    parser.add_argument("--mode", choices=["all", "tasks", "rejected"], default=os.environ.get("RUN_MODE", "all"),
                        help="Mode : all (tâches + rejets), tasks (nouvelles tâches), rejected (rejets uniquement)")
    parser.add_argument("--max-minutes", type=int, default=int(os.environ.get("MAX_MINUTES", "15")),
                        help="Durée max en minutes par cycle (défaut: 15 min)")
    args = parser.parse_args()

    token, cf = get_credentials()

    if not token:
        print(f"\n{RED}{BOLD}[ERREUR] Secret PR_TOKEN manquant dans GitHub Secrets !{RESET}")
        print(f"{YELLOW}Configurez votre token dans : Settings > Secrets and variables > Actions > New repository secret (Nom: PR_TOKEN){RESET}")
        sys.exit(1)

    print(f"\n{CYAN}🔑 Connexion sécurisée à l'API PR.Social...{RESET}")
    api = PrSocialAPI(token=token, cf_clearance=cf)
    
    st, me = api.get_me()
    if st != 200 or not me.get("user"):
        print(f"\n{RED}{BOLD}✖ Impossible de se connecter à PR.Social (Code {st}).{RESET}")
        print(f"{YELLOW}Vérifiez que votre jeton PR_TOKEN est toujours valide.{RESET}")
        sys.exit(1)

    user = me["user"]
    username = user.get("username", "Utilisateur")
    initial_balance = float(user.get("balance", 0.0))

    approved_accounts: Dict[str, Any] = {}
    st_soc, soc = api.get_socials()
    if st_soc == 200:
        all_acc = list(soc.get("accounts", []))
        for p in soc.get("platforms", []):
            all_acc.extend(p.get("accounts", []))
        for a in all_acc:
            if a.get("status") == "approved":
                plat = a.get("platform", "").lower()
                if plat not in approved_accounts:
                    approved_accounts[plat] = a

    print(f"{GREEN}✓ Connecté avec succès !{RESET}")
    print(f"👤 {BOLD}Utilisateur :{RESET} @{username}")
    print(f"💰 {BOLD}Solde de départ :{RESET} ${initial_balance:.4f}")
    print(f"🔗 {BOLD}Comptes liés ({len(approved_accounts)}) :{RESET} {', '.join([p.upper() for p in approved_accounts.keys()])}")
    print(f"⏱️ {BOLD}Durée max prévue :{RESET} {args.max_minutes} min | Mode: {args.mode.upper()}")
    print(f"🕒 {BOLD}Heure UTC :{RESET} {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    start_time = time.time()
    max_duration_sec = args.max_minutes * 60

    # 1. RÉCUPÉRATION DES TÂCHES REJETÉES
    if args.mode in ["all", "rejected"]:
        print(f"{MAGENTA}{BOLD}============================================================{RESET}")
        print(f"{MAGENTA}{BOLD}🔄 ÉTAPE 1 : RÉCUPÉRATION DES TÂCHES REJETÉES (MODE STRICT){RESET}")
        print(f"{MAGENTA}{BOLD}============================================================{RESET}")
        try:
            browser = BrowserTermux(headless=True, user_agent=api.user_agent)
            rej_mgr = TermuxRejectedTasksManager(api, browser)
            tasks = rej_mgr.fetch_rejected_tasks(max_pages=3)
            
            if not tasks:
                print(f"{GREEN}✓ Aucune tâche rejetée détectée.{RESET}")
            else:
                recoverable = [t for t in tasks if t.get("recoverable")]
                print(f"{YELLOW}Trouvé {len(tasks)} tâches rejetées ({len(recoverable)} éligibles).{RESET}")
                
                success_rej = 0
                for t in recoverable:
                    if time.time() - start_time > (max_duration_sec - 120):
                        print(f"{YELLOW}Temps limite approchant. Arrêt de la récupération des rejets.{RESET}")
                        break
                    ok, msg = rej_mgr.retry_single_task(t, approved_accounts)
                    if ok:
                        success_rej += 1
                    time.sleep(random.uniform(3.0, 6.0))
                
                print(f"\n{GREEN}{BOLD}🎉 Rejets récupérés : {success_rej}/{len(recoverable)}{RESET}")
            browser.stop_driver()
        except Exception as e:
            print(f"{RED}⚠️ Erreur rejets : {e}{RESET}")

    # 2. EXÉCUTION DES NOUVELLES TÂCHES DISPONIBLES
    if args.mode in ["all", "tasks"]:
        print(f"\n{GREEN}{BOLD}============================================================{RESET}")
        print(f"{GREEN}{BOLD}🚀 ÉTAPE 2 : EXÉCUTION AUTOMATIQUE DES NOUVELLES TÂCHES{RESET}")
        print(f"{GREEN}{BOLD}============================================================{RESET}")
        
        engine = UniversalSilentEngine(token=token, cf_clearance=cf)
        engine.approved_accounts = approved_accounts

        def check_timeout():
            if time.time() - start_time >= max_duration_sec:
                print(f"\n{YELLOW}⏱️ Fin du créneau ({args.max_minutes} min atteintes). Clôture propre...{RESET}")
                engine.stop_requested = True
                return True
            return False

        # Déblocage automatique des tâches orphelines
        engine.auto_unblock_active_tasks()

        target_platforms = ["threads", "reddit", "pinterest", "soundcloud", "bluesky", "tiktok", "instagram", "youtube", "facebook", "linkedin", "telegram", "twitter", "snapchat", "github", "discord", "spotify"]
        active_list = [p for p in target_platforms if p in approved_accounts] if approved_accounts else target_platforms

        consecutive_empty_cycles = 0

        while not engine.stop_requested:
            if check_timeout():
                break

            tasks_found = 0
            for plat in active_list:
                if engine.stop_requested or check_timeout():
                    break

                acc_id = approved_accounts.get(plat, {}).get("id")
                st, data = engine.pr_api.get_available_tasks(plat, sort="reward", limit=30)
                if st != 200:
                    continue

                tasks = data.get("tasks", [])
                if not tasks:
                    continue

                tasks = engine.interleave_task_actions(tasks)

                for t in tasks:
                    if engine.stop_requested or check_timeout():
                        break

                    task_id = t.get("id")
                    if not task_id or task_id in engine.failed_tasks:
                        continue

                    reward = float(t.get("reward", 0.0))
                    action = (t.get("action") or "FOLLOW").upper()

                    start_st, start_res = engine.pr_api.start_task(task_id, acc_id)
                    if start_st != 200 or not start_res.get("ok"):
                        engine.failed_tasks[task_id] = time.time()
                        continue

                    tasks_found += 1
                    print(f"🚀 Tâche réservée #{task_id} [{plat.upper()} - {action}] (+${reward:.4f})")

                    target_url = start_res.get("task", {}).get("target_url") or t.get("target_url") or ""
                    if not target_url:
                        u_name = (start_res.get("task", {}).get("target_username") or t.get("target_username") or "").strip().lstrip("@")
                        target_url = engine.build_fallback_url(plat, u_name)

                    success, msg = engine.execute_action(plat, action, target_url, t)
                    wait_sec = int(t.get("execution_time") or 8)
                    time.sleep(min(wait_sec, 6))

                    val_st, val_res = engine.pr_api.check_task(task_id)
                    if val_st == 200 and val_res.get("ok"):
                        print(f"  {GREEN}✓ Tâche #{task_id} validée ! (+${reward:.4f}){RESET}")
                    else:
                        print(f"  {YELLOW}⚠️ Non validée : déblocage immédiat.{RESET}")
                        engine.pr_api.cancel_task(task_id)

                    time.sleep(random.uniform(3.0, 6.0))

            if tasks_found == 0:
                consecutive_empty_cycles += 1
                if consecutive_empty_cycles >= 3:
                    print(f"{DIM}Scan terminé : aucune tâche supplémentaire. En attente du prochain cycle.{RESET}")
                    break
                print(f"{DIM}Pause courte avant le prochain scan...{RESET}")
                time.sleep(10)
            else:
                consecutive_empty_cycles = 0

    # 3. BILAN FINAL
    _, fresh_me = api.get_me()
    fresh_user = fresh_me.get("user", {})
    final_balance = float(fresh_user.get("balance", initial_balance))
    gained = final_balance - initial_balance
    elapsed_min = (time.time() - start_time) / 60.0

    print(f"\n{CYAN}{BOLD}============================================================{RESET}")
    print(f"{CYAN}{BOLD}🏁 BILAN DE SESSION CLOUD{RESET}")
    print(f"{CYAN}{BOLD}============================================================{RESET}")
    print(f"⏱️ Durée totale        : {elapsed_min:.1f} minutes")
    print(f"💰 Solde initial       : ${initial_balance:.4f}")
    print(f"💵 Solde final         : {GREEN}{BOLD}${final_balance:.4f}{RESET}")
    print(f"📈 Bénéfice net cycle  : {GREEN}{BOLD}+${gained:.4f}{RESET}")
    print(f"{CYAN}{BOLD}============================================================{RESET}\n")


if __name__ == "__main__":
    main()
