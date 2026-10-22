#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
PR.SOCIAL TERMUX - LANCEUR DÉDIÉ RÉCUPÉRATION DES TÂCHES REJETÉES
================================================================================
Ce script se connecte avec votre session sauvegardée ou demande vos identifiants,
puis lance directement l'analyse et la réexécution des tâches rejetées en Mode Strict.
================================================================================
"""

import os
import sys
import time
import json
import random
from typing import Dict, Any, List

# Forcer l'encodage UTF-8 sous Termux/Linux
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

try:
    from pr_api import PrSocialAPI
    from browser_termux import BrowserTermux
    from rejected_tasks_manager import TermuxRejectedTasksManager
    from termux_action_engine import load_saved_session, save_session, parse_cookie_input
except ImportError:
    from termux_bot.pr_api import PrSocialAPI
    from termux_bot.browser_termux import BrowserTermux
    from termux_bot.rejected_tasks_manager import TermuxRejectedTasksManager
    from termux_bot.termux_action_engine import load_saved_session, save_session, parse_cookie_input

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

def main():
    print(f"""{CYAN}{BOLD}
  ██████╗ ██████╗       ███████╗ ██████╗  ██████╗██╗ █████╗ ██╗     
  ██╔══██╗██╔══██╗      ██╔════╝██╔═══██╗██╔════╝██║██╔══██╗██║     
  ██████╔╝██████╔╝█████╗███████╗██║   ██║██║     ██║███████║██║     
  ██╔═══╝ ██╔══██╗╚════╝╚════██║██║   ██║██║     ██║██╔══██║██║     
  ██║     ██║  ██║      ███████║╚██████╔╝╚██████╗██║██║  ██║███████╗
  ╚═╝     ╚═╝  ╚═╝      ╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝
       {MAGENTA}⚡ RÉCUPÉRATION STRICTE DES TÂCHES REJETÉES (TERMUX) ⚡{RESET}
  ─────────────────────────────────────────────────────────────""")

    session = load_saved_session()
    token = session.get("token", "").strip()
    cf = session.get("cf_clearance", "").strip()

    api = PrSocialAPI(token=token, cf_clearance=cf)
    
    # Vérification de connexion
    st, me = api.get_me() if token else (0, {})
    if st != 200 or not me.get("user"):
        print(f"\n{YELLOW}{BOLD}⚠️ Aucune session active valide.{RESET}")
        print(f"{CYAN}Collez votre Cookie / Token de connexion PR.Social :{RESET}")
        raw = input("👉 ").strip()
        if not raw:
            print(f"{RED}Session non renseignée. Annulation.{RESET}")
            return
        tok, cf = parse_cookie_input(raw)
        api.update_credentials(tok, cf)
        st, me = api.get_me()
        if st != 200 or not me.get("user"):
            print(f"{RED}✖ Impossible de valider la session auprès de PR.Social.{RESET}")
            return
        save_session(tok, cf)
        print(f"{GREEN}✓ Session validée et enregistrée !{RESET}")

    user_info = me.get("user", {})
    username = user_info.get("username", "Utilisateur")
    balance = float(user_info.get("balance", 0.0))
    print(f"\n{BLUE}👤 Connecté en tant que :{RESET} {GREEN}{BOLD}@{username}{RESET} (Solde: ${balance:.4f})")

    # Charger les comptes approuvés
    approved_accounts = {}
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

    print(f"{CYAN}🔍 Récupération des tâches rejetées depuis PR.Social...{RESET}")
    browser = BrowserTermux(headless=True, user_agent=api.user_agent)
    manager = TermuxRejectedTasksManager(api, browser)

    try:
        tasks = manager.fetch_rejected_tasks(max_pages=5)
        if not tasks:
            print(f"\n{GREEN}{BOLD}✓ Aucune tâche rejetée trouvée sur votre compte PR.Social !{RESET}")
            return

        print(f"\n{YELLOW}{BOLD}📋 Tâches Rejetées Détectées ({len(tasks)}) :{RESET}")
        print(f"{CYAN}┌────────────┬─────────────┬─────────────┬─────────────┬────────────────────────────────────────┐{RESET}")
        print(f"{CYAN}│{RESET} {BOLD}{'ID':<10}{RESET} {CYAN}│{RESET} {BOLD}{'Plateforme':<11}{RESET} {CYAN}│{RESET} {BOLD}{'Action':<11}{RESET} {CYAN}│{RESET} {BOLD}{'Gain':<11}{RESET} {CYAN}│{RESET} {BOLD}{'Diagnostic & Motif':<38}{RESET} {CYAN}│{RESET}")
        print(f"{CYAN}├────────────┼─────────────┼─────────────┼─────────────┼────────────────────────────────────────┤{RESET}")
        for t in tasks:
            tid = str(t['id'])[:10]
            plat = str(t['platform']).upper()[:11]
            act = str(t['action'])[:11]
            rew = f"+${t['reward']:.4f}"[:11]
            diag = str(t['diagnosis'])[:38]
            color = GREEN if t.get('recoverable') else RED
            print(f"{CYAN}│{RESET} {tid:<10} {CYAN}│{RESET} {plat:<11} {CYAN}│{RESET} {act:<11} {CYAN}│{RESET} {color}{rew:<11}{RESET} {CYAN}│{RESET} {diag:<38} {CYAN}│{RESET}")
        print(f"{CYAN}└────────────┴─────────────┴─────────────┴─────────────┴────────────────────────────────────────┘{RESET}")

        print(f"\n{CYAN}Que souhaitez-vous faire ?{RESET}")
        print(f" {GREEN}[1]{RESET} 🚀 Réessayer TOUTES les tâches éligibles (Mode Strict)")
        print(f" {BLUE}[2]{RESET} 🎯 Réessayer une tâche spécifique par son ID")
        print(f" {RED}[3]{RESET} 🚪 Quitter")

        choice = input(f"\n{BOLD}Votre choix [1-3] : {RESET}").strip()

        if choice == "1":
            print(f"\n{MAGENTA}🚀 Lancement de la récupération automatique...{RESET}")
            success_count = 0
            for t in tasks:
                if not t.get("recoverable"):
                    print(f"\n{YELLOW}⏩ Tâche #{t['id']} écartée ({t['diagnosis']}){RESET}")
                    continue
                ok, msg = manager.retry_single_task(t, approved_accounts)
                if ok:
                    success_count += 1
                time.sleep(random.uniform(4.0, 7.0))
            print(f"\n{GREEN}{BOLD}🎉 Récupération terminée : {success_count} tâche(s) validée(s) avec succès !{RESET}")

        elif choice == "2":
            target_id = input(f"\n{CYAN}Entrez l'ID de la tâche à récupérer : {RESET}").strip()
            matched = next((t for t in tasks if str(t['id']) == target_id), None)
            if not matched:
                print(f"{RED}✖ Tâche #{target_id} introuvable.{RESET}")
            else:
                ok, msg = manager.retry_single_task(matched, approved_accounts)
                if ok:
                    print(f"\n{GREEN}{BOLD}✓ Tâche #{target_id} récupérée avec succès !{RESET}")
                else:
                    print(f"\n{YELLOW}⚠️ La tâche #{target_id} n'a pas pu être validée : {msg}{RESET}")

    finally:
        browser.stop_driver()

if __name__ == "__main__":
    main()
