import os
import sys
import time
import json
import random
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List

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
except ImportError:
    try:
        from pc_bot.pr_api import PrSocialAPI
    except ImportError:
        for p in ["/root/prsocial", "/data/data/com.termux/files/home/prsocial"]:
            if os.path.isdir(p) and p not in sys.path:
                sys.path.insert(0, p)
        from pc_bot.pr_api import PrSocialAPI

from browser_termux import BrowserTermux

# Couleurs ANSI
RESET = "\033[0m"
BOLD = "\033[1m"
DIM = "\033[2m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
CYAN = "\033[96m"
WHITE = "\033[97m"
RED = "\033[91m"
MAGENTA = "\033[95m"

HOME_DIR = os.path.expanduser("~")
DATA_DIR = os.path.join(HOME_DIR, "social_bot_data")
CONFIG_PATH_HOME = os.path.join(DATA_DIR, "config.json")
CONFIG_PATH_LOCAL = os.path.join(current_dir, "config.json")

def clear_screen():
    os.system("clear" if os.name != "nt" else "cls")

def load_saved_session() -> Dict[str, Any]:
    os.makedirs(DATA_DIR, exist_ok=True)
    for path in [CONFIG_PATH_LOCAL, CONFIG_PATH_HOME]:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if data.get("token"):
                        return data
            except Exception:
                pass
    return {"token": "", "cf_clearance": ""}

def save_session(token: str, cf_clearance: str = ""):
    data = {
        "token": token.strip(),
        "cf_clearance": cf_clearance.strip(),
        "delay_min": 5,
        "delay_max": 10
    }
    for path in [CONFIG_PATH_LOCAL, CONFIG_PATH_HOME]:
        try:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception:
            pass

class TermuxBotApp:
    def __init__(self):
        self.session_data = load_saved_session()
        self.token = self.session_data.get("token", "")
        self.cf = self.session_data.get("cf_clearance", "")
        self.api = PrSocialAPI(token=self.token, cf_clearance=self.cf)
        self.browser = BrowserTermux(headless=True)
        self.current_user = ""
        self.current_balance = 0.0
        self.approved_accounts = {}

    def print_logo(self):
        print(f"""{CYAN}{BOLD}
  ██████╗ ██████╗       ███████╗ ██████╗  ██████╗██╗ █████╗ ██╗     
  ██╔══██╗██╔══██╗      ██╔════╝██╔═══██╗██╔════╝██║██╔══██╗██║     
  ██████╔╝██████╔╝█████╗███████╗██║   ██║██║     ██║███████║██║     
  ██╔═══╝ ██╔══██╗╚════╝╚════██║██║   ██║██║     ██║██╔══██║██║     
  ██║     ██║  ██║      ███████║╚██████╔╝╚██████╗██║██║  ██║███████╗
  ╚═╝     ╚═╝  ╚═╝      ╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝
           {MAGENTA}★ ANDROID TERMUX EDITION • V1.2.0 ★{RESET}""")

    def verify_login(self) -> bool:
        if not self.token:
            return False
        st, me = self.api.get_me()
        if st == 200 and me.get("user"):
            u = me["user"]
            self.current_user = u.get("username", "Utilisateur")
            self.current_balance = float(u.get("balance", 0.0))
            
            # Charger les comptes approuvés
            st_soc, soc = self.api.get_socials()
            self.approved_accounts.clear()
            if st_soc == 200:
                all_acc = list(soc.get("accounts", []))
                for p in soc.get("platforms", []):
                    all_acc.extend(p.get("accounts", []))
                for a in all_acc:
                    if a.get("status") == "approved":
                        plat = a.get("platform", "").lower()
                        if plat not in self.approved_accounts:
                            self.approved_accounts[plat] = a
            return True
        return False

    def auto_unblock_tasks(self) -> int:
        """Détecte et annule immédiatement toute tâche orpheline bloquante."""
        st, data = self.api.get_active_tasks()
        if st != 200:
            return 0
        items = data.get("items", [])
        cancelled = 0
        for it in items:
            tid = it.get("order_id") or it.get("id")
            if tid:
                c_st, c_res = self.api.cancel_task(tid)
                if c_st == 200 and c_res.get("ok"):
                    print(f" {GREEN}✓{RESET} Tâche orpheline #{tid} débloquée.")
                    cancelled += 1
        return cancelled

    # ==========================================================================
    # MENU ÉTAT 1 : AVANT CONNEXION (2 CHOIX UNIQUEMENT)
    # ==========================================================================
    def show_unauthenticated_menu(self):
        clear_screen()
        self.print_logo()
        print(f"\n{YELLOW}{BOLD}⚠️ AUCUNE SESSION ACTIVE DÉTECTÉE{RESET}")
        print(f"{CYAN}┌─────────────────────────────────────────────────────────────┐{RESET}")
        print(f"{CYAN}│{RESET}  {GREEN}{BOLD}[1]{RESET} 🔑 {WHITE}Login Cookie (Coller le Cookie / Token){RESET}               {CYAN}│{RESET}")
        print(f"{CYAN}│{RESET}  {RED}{BOLD}[2]{RESET} 🚪 {WHITE}Exit (Quitter){RESET}                                        {CYAN}│{RESET}")
        print(f"{CYAN}└─────────────────────────────────────────────────────────────┘{RESET}")

        choice = input(f"\n{BOLD}Votre choix [1-2] : {RESET}").strip()
        if choice == "1":
            print(f"\n{CYAN}Collez votre jeton/cookie (ex: eyJhb... ou token=eyJ... ou ligne de cookies) :{RESET}")
            raw = input("👉 ").strip()
            if raw:
                tok = raw
                cf = ""
                # Parser si chaîne de cookies complète
                if "token=" in raw:
                    for part in raw.split(";"):
                        part = part.strip()
                        if part.startswith("token="):
                            tok = part[6:]
                        elif part.startswith("cf_clearance="):
                            cf = part[13:]
                
                tok = tok.strip()
                self.api.update_credentials(tok, cf)
                self.token = tok
                self.cf = cf

                print(f"\n{YELLOW}Vérification de la session en cours...{RESET}")
                if self.verify_login():
                    save_session(self.token, self.cf)
                    print(f"{GREEN}✓ Connexion réussie ! Session sauvegardée définitivement.{RESET}")
                    time.sleep(1.5)
                else:
                    print(f"{RED}✖ Cookie ou Jeton invalide. Veuillez réessayer.{RESET}")
                    time.sleep(2)
        elif choice == "2":
            print(f"\n{CYAN}Au revoir ! 👋{RESET}\n")
            sys.exit(0)

    # ==========================================================================
    # MENU ÉTAT 2 : CONNECTÉ (TABLEAU DE BORD ÉPURÉ + 3 CHOIX UNIQUEMENT)
    # ==========================================================================
    def show_authenticated_menu(self):
        clear_screen()
        self.print_logo()
        self.verify_login()

        # Date et heure actuelles
        now_str = datetime.now().strftime("%d/%m/%Y - %H:%M:%S")

        # Tableau de bord : UNIQUEMENT Utilisateur, Solde, Date et Heure
        bal_str = f"${self.current_balance:.4f}"
        print(f"\n{BLUE}╭─────────────────────────────────────────────────────────────╮{RESET}")
        print(f"{BLUE}│{RESET}  👤 {WHITE}Utilisateur connecté :{RESET} {GREEN}{BOLD}@{self.current_user:<31}{RESET} {BLUE}│{RESET}")
        print(f"{BLUE}│{RESET}  💰 {WHITE}Solde actuel         :{RESET} {YELLOW}{BOLD}{bal_str:<32}{RESET} {BLUE}│{RESET}")
        print(f"{BLUE}│{RESET}  🕒 {WHITE}Date et Heure        :{RESET} {CYAN}{now_str:<32}{RESET} {BLUE}│{RESET}")
        print(f"{BLUE}╰─────────────────────────────────────────────────────────────╯{RESET}")

        # Menu 3 choix stricts
        print(f"\n{CYAN}┌─────────────────────────────────────────────────────────────┐{RESET}")
        print(f"{CYAN}│{RESET}  {GREEN}{BOLD}[1]{RESET} 🚀 {WHITE}{BOLD}Start Tout (Auto-Bot + Déblocage Auto Tâches){RESET}       {CYAN}│{RESET}")
        print(f"{CYAN}│{RESET}  {CYAN}{BOLD}[2]{RESET} 🔗 {WHITE}Comptes Liés{RESET}                                          {CYAN}│{RESET}")
        print(f"{CYAN}│{RESET}  {RED}{BOLD}[3]{RESET} 🚪 {WHITE}Quitter Bot{RESET}                                           {CYAN}│{RESET}")
        print(f"{CYAN}└─────────────────────────────────────────────────────────────┘{RESET}")

        choice = input(f"\n{BOLD}Votre choix [1-3] : {RESET}").strip()

        if choice == "1":
            self.start_all_tasks()
        elif choice == "2":
            self.show_linked_accounts()
        elif choice == "3":
            print(f"\n{CYAN}Arrêt du bot. À bientôt ! 👋{RESET}\n")
            self.browser.stop_driver()
            sys.exit(0)

    # ==========================================================================
    # OPTION 1 : START TOUT (AVEC DÉTECTION ET DÉBLOCAGE ORPHELIN)
    # ==========================================================================
    def start_all_tasks(self):
        clear_screen()
        self.print_logo()
        print(f"\n{GREEN}{BOLD}🚀 DÉMARRAGE DU BOT AUTOMATIQUE (CTRL+C POUR REVENIR AU MENU){RESET}\n")
        
        # 1. Détection & déblocage automatique immédiat
        print(f"{YELLOW}🔍 Détection automatique des tâches orphelines...{RESET}")
        unblocked = self.auto_unblock_tasks()
        if unblocked == 0:
            print(f"{GREEN}✓ Aucune tâche orpheline bloquante. Prêt pour l'automatisation.{RESET}")

        target_platforms = ["threads", "reddit", "tiktok", "instagram", "youtube", "facebook", "telegram", "twitter", "snapchat", "github", "discord"]
        active_list = [p for p in target_platforms if p in self.approved_accounts] if self.approved_accounts else target_platforms

        print(f"{WHITE}Réseaux surveillés : {', '.join([f'{CYAN}{p.upper()}{RESET}' for p in active_list])}\n")

        try:
            while True:
                tasks_found = 0
                for plat in active_list:
                    acc_id = self.approved_accounts.get(plat, {}).get("id")
                    st_t, data = self.api.get_available_tasks(plat, limit=10)
                    if st_t != 200:
                        continue

                    tasks = data.get("tasks", [])
                    if not tasks:
                        continue

                    for t in tasks:
                        task_id = t["id"]
                        action = (t.get("action") or "FOLLOW").upper()
                        reward = float(t.get("worker_reward") or t.get("cost_per_task") or 0.0)
                        tasks_found += 1

                        print(f"\n{BLUE}▶{RESET} Tâche {BOLD}#{task_id}{RESET} [{CYAN}{plat.upper()}{RESET} - {YELLOW}{action}{RESET}] (Gain: {GREEN}+${reward:.4f}{RESET})")

                        # Démarrage
                        st_start, res_start = self.api.start_task(task_id, social_account_id=acc_id)
                        if st_start != 200 or not res_start.get("ok"):
                            err_msg = str(res_start.get("error", "Erreur"))
                            print(f"  {RED}✖ Échec démarrage: {err_msg}{RESET}")
                            if "active task" in err_msg.lower() or "task_in_progress" in err_msg.lower():
                                print(f"  {YELLOW}⚠️ Tâche bloquante détectée. Déblocage automatique...{RESET}")
                                self.auto_unblock_tasks()
                                time.sleep(1)
                            continue

                        # Résolution URL cible (Threads / Reddit / etc.)
                        target_url = res_start.get("task", {}).get("target_url") or t.get("target_url") or ""
                        if not target_url:
                            u_name = (res_start.get("task", {}).get("target_username") or t.get("target_username") or "").strip().lstrip("@")
                            if u_name:
                                if plat == "threads": target_url = f"https://www.threads.net/@{u_name}"
                                elif plat == "reddit": target_url = f"https://www.reddit.com/user/{u_name}"
                                elif plat in ["twitter", "x"]: target_url = f"https://x.com/{u_name}"
                                elif plat == "instagram": target_url = f"https://www.instagram.com/{u_name}"
                                elif plat == "tiktok": target_url = f"https://www.tiktok.com/@{u_name}"

                        wait_sec = int(res_start.get("submit_after_sec") or 5)
                        api_check = res_start.get("api_check_enabled", 0)

                        print(f"  🌐 URL : {DIM}{target_url}{RESET}")
                        print(f"  🤖 Exécution en arrière-plan...")
                        ok_act, msg_act, shot_path = self.browser.execute_task_action(
                            platform=plat, action=action, target_url=target_url, task_id=task_id
                        )

                        is_valid = False
                        if api_check == 1:
                            c_st, c_res = self.api.api_check_task(task_id)
                            if c_st == 200 and c_res.get("found") is True and c_res.get("approved") is True:
                                is_valid = True
                                print(f"  {GREEN}✓ Validé instantanément par API Check !{RESET}")

                        if not is_valid and os.path.exists(shot_path):
                            print(f"  ⏳ Sécurité ({wait_sec}s) puis soumission de la preuve...")
                            time.sleep(wait_sec + 1)
                            s_st, s_res = self.api.submit_screenshot(task_id, shot_path)
                            if s_st == 200 and s_res.get("ok"):
                                is_valid = True
                                print(f"  {GREEN}✓ Preuve enregistrée avec succès !{RESET}")

                        if is_valid:
                            _, fresh = self.api.get_me()
                            if fresh.get("user"):
                                self.current_balance = float(fresh["user"].get("balance", 0.0))
                            print(f"  {GREEN}{BOLD}🎉 Tâche #{task_id} validée ! Nouveau solde : ${self.current_balance:.4f}{RESET}")
                        else:
                            print(f"  {YELLOW}⚠️ Non validée. Déblocage automatique de sécurité...{RESET}")
                            self.api.cancel_task(task_id)

                        pause = random.uniform(5.0, 9.0)
                        print(f"  ⏸️ Pause de sécurité : {pause:.1f}s...")
                        time.sleep(pause)

                if tasks_found == 0:
                    print(f"\n{DIM}⏳ Aucune nouvelle tâche. Prochain scan dans 20s...{RESET}")
                    time.sleep(20)

        except KeyboardInterrupt:
            print(f"\n{YELLOW}Arrêt demandé. Retour au menu...{RESET}")
            time.sleep(1.5)

    # ==========================================================================
    # OPTION 2 : COMPTES LIÉS
    # ==========================================================================
    def show_linked_accounts(self):
        clear_screen()
        self.print_logo()
        self.verify_login()

        print(f"\n{CYAN}{BOLD}              📋 LISTE DE VOS COMPTES SOCIAUX LIÉS{RESET}\n")
        if not self.approved_accounts:
            print(f"  {YELLOW}Aucun compte approuvé. Liez vos réseaux sur PR.Social.{RESET}")
        else:
            for p, acc in self.approved_accounts.items():
                print(f"  {GREEN}✓{RESET} {BOLD}{p.upper():<12}{RESET} : @{acc.get('username')} (ID: {acc.get('id')})")

        input(f"\n{DIM}Appuyez sur Entrée pour revenir au menu...{RESET}")

    # ==========================================================================
    # BOUCLE PRINCIPALE DE L'APPLICATION
    # ==========================================================================
    def run(self):
        while True:
            # Si pas de session valide -> Menu ÉTAT 1
            if not self.verify_login():
                self.show_unauthenticated_menu()
            else:
                # Session valide -> Menu ÉTAT 2
                self.show_authenticated_menu()

def main():
    app = TermuxBotApp()
    try:
        app.run()
    except KeyboardInterrupt:
        print(f"\n{YELLOW}Fermeture du bot.{RESET}")
    finally:
        app.browser.stop_driver()

if __name__ == "__main__":
    main()
