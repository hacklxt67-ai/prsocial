import os
import sys
import time
import json
import random
from typing import Optional, List, Dict, Any

try:
    if sys.stdout:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    if sys.stderr:
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

# Activer les codes couleurs ANSI sur Windows
if os.name == 'nt':
    os.system('color')

# Assurer le chemin d'import du package
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from pc_bot.pr_api import PrSocialAPI
from pc_bot.browser_bot import BrowserBot
from pc_bot.automation_engine import AutomationEngine
from pc_bot.rejected_tasks_manager import RejectedTasksManager, analyze_rejection_error

CONFIG_FILE = (
    os.path.join(parent_dir, "config.json")
    if os.path.exists(os.path.join(parent_dir, "config.json"))
    else (
        os.path.join(current_dir, "config.json")
        if os.path.exists(os.path.join(current_dir, "config.json"))
        else r"D:\social_pc_bot\config.json"
    )
)

# ==============================================================================
# COULEURS & STYLES ANSI
# ==============================================================================
class C:
    RESET   = "\033[0m"
    BOLD    = "\033[1m"
    DIM     = "\033[2m"
    UNDER   = "\033[4m"
    
    # Couleurs de texte
    RED     = "\033[91m"
    GREEN   = "\033[92m"
    YELLOW  = "\033[93m"
    BLUE    = "\033[94m"
    MAGENTA = "\033[95m"
    CYAN    = "\033[96m"
    WHITE   = "\033[97m"
    GRAY    = "\033[90m"
    
    # Fonds
    BG_BLUE = "\033[44m"
    BG_DARK = "\033[100m"

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

# ==============================================================================
# BANNIÈRE & LOGO STYLÉ
# ==============================================================================
LOGO = f"""{C.CYAN}{C.BOLD}
  ██████╗ ██████╗       ███████╗ ██████╗  ██████╗██╗ █████╗ ██╗     
  ██╔══██╗██╔══██╗      ██╔════╝██╔═══██╗██╔════╝██║██╔══██╗██║     
  ██████╔╝██████╔╝█████╗███████╗██║   ██║██║     ██║███████║██║     
  ██╔═══╝ ██╔══██╗╚════╝╚════██║██║   ██║██║     ██║██╔══██║██║     
  ██║     ██║  ██║      ███████║╚██████╔╝╚██████╗██║██║  ██║███████╗
  ╚═╝     ╚═╝  ╚═╝      ╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝{C.RESET}
       {C.MAGENTA}{C.BOLD}⚡ REVERSED ENGINEERING BOT PC — ÉDITION PRO v3.0 ⚡{C.RESET}
       {C.YELLOW}{C.DIM}— L'argent c'est un chiffre —{C.RESET}
  {C.GRAY}─────────────────────────────────────────────────────────────{C.RESET}"""

class TerminalApp:
    def __init__(self):
        self.config = self.load_config()
        self.token = self.config.get("token", "").strip()
        self.cf = self.config.get("cf_clearance", "").strip()
        self.headless = self.config.get("headless", True)
        
        self.api = PrSocialAPI(token=self.token, cf_clearance=self.cf)
        self.browser_bot = BrowserBot(headless=self.headless)
        self.engine = AutomationEngine(self.api, self.browser_bot)
        self.rejected_manager = RejectedTasksManager(self.api, self.browser_bot)

    def load_config(self) -> dict:
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {"token": "", "cf_clearance": "", "headless": True}

    def save_config(self):
        try:
            os.makedirs(os.path.dirname(CONFIG_FILE), exist_ok=True)
            with open(CONFIG_FILE, "w", encoding="utf-8") as f:
                json.dump(self.config, f, indent=2)
        except Exception:
            pass

    def get_user_status(self) -> Tuple[bool, str, float]:
        st, me = self.api.get_me()
        if st == 200 and me.get("user"):
            u = me["user"]
            return True, u.get("username", "Inconnu"), float(u.get("balance", 0.0))
        return False, "", 0.0

    def print_header(self):
        clear_screen()
        print(LOGO)
        
        ok, uname, bal = self.get_user_status()
        if ok:
            status_badge = f"{C.GREEN}{C.BOLD}● CONNECTÉ : @{uname}{C.RESET}"
            balance_badge = f"{C.YELLOW}{C.BOLD}💰 Solde : ${bal:.4f}{C.RESET}"
        else:
            status_badge = f"{C.RED}{C.BOLD}● NON CONNECTÉ (Token invalide ou manquant){C.RESET}"
            balance_badge = f"{C.GRAY}Solde : $0.000{C.RESET}"

        mode_badge = f"{C.MAGENTA}Mode : {'Invisible (Headless)' if self.headless else 'Visible (Écran)'}{C.RESET}"
        
        print(f"  {status_badge}  |  {balance_badge}  |  {mode_badge}")
        print(f"{C.GRAY}  ─────────────────────────────────────────────────────────────{C.RESET}\n")

    def print_menu(self):
        print(f"  {C.WHITE}{C.BOLD}┌── MENU PRINCIPAL ──────────────────────────────────────────┐{C.RESET}")
        print(f"  {C.WHITE}{C.BOLD}│{C.RESET}                                                            {C.WHITE}{C.BOLD}│{C.RESET}")
        print(f"  {C.WHITE}{C.BOLD}│{C.RESET}   {C.GREEN}{C.BOLD}[ 1 ] 🚀 START{C.RESET}  - Lancer le Bot Automatique (Toutes tâches) {C.WHITE}{C.BOLD}│{C.RESET}")
        print(f"  {C.WHITE}{C.BOLD}│{C.RESET}   {C.YELLOW}{C.BOLD}[ 2 ] 🔄 RÉCUPÉRER & RÉESSAYER LES TÂCHES REJETÉES{C.RESET}      {C.WHITE}{C.BOLD}│{C.RESET}")
        print(f"  {C.WHITE}{C.BOLD}│{C.RESET}   {C.CYAN}{C.BOLD}[ 3 ] 🔑 Changer de Token PR.Social{C.RESET}                     {C.WHITE}{C.BOLD}│{C.RESET}")
        print(f"  {C.WHITE}{C.BOLD}│{C.RESET}   {C.BLUE}{C.BOLD}[ 4 ] 👁️  Basculer Mode Invisible / Visible{C.RESET}             {C.WHITE}{C.BOLD}│{C.RESET}")
        print(f"  {C.WHITE}{C.BOLD}│{C.RESET}   {C.RED}{C.BOLD}[ 5 ] ❌ EXIT (Quitter){C.RESET}                                {C.WHITE}{C.BOLD}│{C.RESET}")
        print(f"  {C.WHITE}{C.BOLD}│{C.RESET}                                                            {C.WHITE}{C.BOLD}│{C.RESET}")
        print(f"  {C.WHITE}{C.BOLD}└─── Entrez votre choix (1, 2, 3, 4, 5) ────────────────────┘{C.RESET}")
        print()

    # ==========================================================================
    # ACTION 1 : START BOT AUTOMATIQUE
    # ==========================================================================
    def action_start_bot(self):
        self.print_header()
        ok, uname, bal = self.get_user_status()
        if not ok:
            print(f"  {C.RED}❌ Impossible de démarrer : Vous n'êtes pas connecté.{C.RESET}")
            print(f"  {C.YELLOW}Veuillez choisir l'option 3 pour configurer votre token.{C.RESET}\n")
            input(f"  Appuyez sur {C.BOLD}Entrée{C.RESET} pour revenir au menu...")
            return

        print(f"  {C.GREEN}{C.BOLD}=== DÉMARRAGE DU BOT AUTOMATIQUE PR.SOCIAL ==={C.RESET}")
        print(f"  {C.GRAY}Appuyez sur {C.WHITE}{C.BOLD}Ctrl + C{C.RESET}{C.GRAY} à tout moment pour arrêter et revenir au menu.{C.RESET}\n")

        # Callback intelligent pour afficher les logs sans désordre
        def cli_log(msg, lvl="info"):
            timestamp = time.strftime("%H:%M:%S")
            if "Radar PR.Social" in msg:
                sys.stdout.write(f"\r  {C.GRAY}[{timestamp}]{C.RESET} {C.MAGENTA}⚡ {msg}{C.RESET}   ")
                sys.stdout.flush()
                return

            # Effacer la ligne du radar si présente avant d'imprimer
            sys.stdout.write("\r" + " " * 95 + "\r")
            sys.stdout.flush()

            if lvl == "success":
                prefix = f"{C.GREEN}[SUCCÈS]{C.RESET}"
            elif lvl == "error":
                prefix = f"{C.RED}[ERREUR]{C.RESET}"
            elif lvl == "warning":
                prefix = f"{C.YELLOW}[ATTENTION]{C.RESET}"
            else:
                prefix = f"{C.CYAN}[INFO]{C.RESET}"
            print(f"  {C.GRAY}[{timestamp}]{C.RESET} {prefix} {msg}")

        self.engine.cb_log = cli_log
        self.engine.start()

        try:
            while self.engine.is_running:
                time.sleep(0.5)
        except KeyboardInterrupt:
            print(f"\n\n  {C.YELLOW}Arrêt demandé par l'utilisateur...{C.RESET}")
            self.engine.stop()
            time.sleep(1.5)

        print(f"\n  {C.GREEN}✓ Bot arrêté proprement.{C.RESET}")
        input(f"  Appuyez sur {C.BOLD}Entrée{C.RESET} pour revenir au menu...")

    # ==========================================================================
    # ACTION 2 : RÉCUPÉRER ET RÉESSAYER LES TÂCHES REJETÉES
    # ==========================================================================
    def action_manage_rejected(self):
        self.print_header()
        ok, uname, bal = self.get_user_status()
        if not ok:
            print(f"  {C.RED}❌ Impossible : Vous n'êtes pas connecté.{C.RESET}")
            input(f"  Appuyez sur {C.BOLD}Entrée{C.RESET} pour continuer...")
            return

        print(f"  {C.YELLOW}{C.BOLD}🔍 Récupération des tâches rejetées depuis PR.Social en cours...{C.RESET}\n")
        
        def cli_log(msg, lvl="info"):
            if lvl == "success":
                print(f"  {C.GREEN}✓ {msg}{C.RESET}")
            elif lvl == "error":
                print(f"  {C.RED}✗ {msg}{C.RESET}")
            elif lvl == "warning":
                print(f"  {C.YELLOW}⚠️ {msg}{C.RESET}")
            else:
                print(f"  {C.CYAN}• {msg}{C.RESET}")

        tasks = self.rejected_manager.fetch_all_rejected_tasks(max_pages=100, log_cb=cli_log)

        if not tasks:
            print(f"\n  {C.GREEN}{C.BOLD}🎉 Félicitations ! Aucune tâche rejetée trouvée sur votre compte.{C.RESET}\n")
            input(f"  Appuyez sur {C.BOLD}Entrée{C.RESET} pour revenir au menu...")
            return

        total_reward = sum(t.get("reward", 0.0) for t in tasks)
        print(f"\n  {C.WHITE}{C.BOLD}📊 {len(tasks)} Tâche(s) Rejetée(s) Trouvée(s) | Total à récupérer : ${total_reward:.4f}{C.RESET}")
        print(f"{C.GRAY}  ─────────────────────────────────────────────────────────────{C.RESET}\n")

        # Affichage des 10 premières tâches avec détails
        for i, t in enumerate(tasks[:10], 1):
            tid = t["task_id"]
            plat = t["platform"].upper()
            act = t["action"].upper()
            rew = t.get("reward", 0.0)
            diag = t.get("analysis", {})
            print(f"  {C.BOLD}{i}. [{plat} - {act}] #{tid}{C.RESET} {C.GREEN}+${rew:.3f}{C.RESET}")
            print(f"     {C.GRAY}Cible :{C.RESET} {t.get('target_url') or t.get('target_username')}")
            print(f"     {C.RED}Erreur :{C.RESET} {diag.get('category')} ({t.get('ai_reason_raw')})")
            print(f"     {C.YELLOW}Correction stricte :{C.RESET} {diag.get('strict_measure')}")
            print()

        if len(tasks) > 10:
            print(f"  {C.GRAY}... et {len(tasks) - 10} autre(s) tâche(s) rejetée(s).{C.RESET}\n")

        print(f"  {C.WHITE}{C.BOLD}Actions possibles :{C.RESET}")
        print(f"  {C.GREEN}[ A ] 🚀 Réessayer TOUTES les tâches rejetées en Mode Strict{C.RESET}")
        print(f"  {C.CYAN}[ 1-{min(len(tasks), 10)} ] 🔄 Réessayer uniquement cette tâche{C.RESET}")
        print(f"  {C.RED}[ R ] ⬅️  Retour au Menu Principal{C.RESET}\n")

        choice = input(f"  {C.BOLD}Votre choix :{C.RESET} ").strip().lower()

        if choice == 'r' or not choice:
            return

        if choice == 'a':
            clear_screen()
            print(LOGO)
            print(f"\n  {C.YELLOW}{C.BOLD}=== DÉMARRAGE DU RÉESSAI EN LOT (MODE STRICT) ==={C.RESET}")
            print(f"  {C.GRAY}Appuyez sur Ctrl+C pour interrompre.{C.RESET}\n")
            success_count = 0
            expired_count = 0
            slots_count = 0
            
            try:
                for idx, t in enumerate(tasks, 1):
                    tid = t["task_id"]
                    print(f"  {C.CYAN}{C.BOLD}>>> Tâche {idx}/{len(tasks)} : #{tid} [{t['platform'].upper()} - {t['action']}]{C.RESET}")
                    ok, msg = self.rejected_manager.retry_single_task(t, log_cb=cli_log)
                    if ok:
                        success_count += 1
                        print(f"      {C.GREEN}✅ Validée et resoumise avec succès !{C.RESET}")
                        time.sleep(random.uniform(4.0, 7.0))
                    else:
                        print(f"      {C.YELLOW}⚠️ {t.get('status_retry', msg)}{C.RESET}")
                        if "expirée" in msg.lower() or "not_found" in msg.lower():
                            expired_count += 1
                        elif "places" in msg.lower() or "slots" in msg.lower():
                            slots_count += 1
                        time.sleep(0.5)
                    print()
            except KeyboardInterrupt:
                print(f"\n  {C.YELLOW}Interruption par l'utilisateur.{C.RESET}")

            print(f"\n  {C.WHITE}{C.BOLD}=== RÉCAPITULATIF DU RÉESSAI EN LOT ==={C.RESET}")
            print(f"  {C.GREEN}✓ {success_count} tâche(s) relancée(s) et validée(s) avec succès !{C.RESET}")
            print(f"  {C.YELLOW}⏳ {slots_count} tâche(s) temporairement occupées par d'autres ouvriers (SLOTS_TAKEN){C.RESET}")
            print(f"  {C.GRAY}❌ {expired_count} campagne(s) déjà terminées ou clôturées par l'annonceur{C.RESET}\n")
            input(f"  Appuyez sur {C.BOLD}Entrée{C.RESET} pour continuer...")

        elif choice.isdigit():
            idx_chosen = int(choice) - 1
            if 0 <= idx_chosen < min(len(tasks), 10):
                target_t = tasks[idx_chosen]
                print(f"\n  {C.CYAN}>>> Lancement du réessai strict pour #{target_t['task_id']}...{C.RESET}\n")
                ok, msg = self.rejected_manager.retry_single_task(target_t, log_cb=cli_log)
                if ok:
                    print(f"\n  {C.GREEN}{C.BOLD}✅ SUCCÈS ! Tâche #{target_t['task_id']} validée et renvoyée.{C.RESET}\n")
                else:
                    print(f"\n  {C.YELLOW}⚠️ Résultat : {target_t.get('status_retry', msg)}{C.RESET}\n")
                input(f"  Appuyez sur {C.BOLD}Entrée{C.RESET} pour continuer...")

    # ==========================================================================
    # ACTION 3 : CONFIGURER LE TOKEN
    # ==========================================================================
    def action_config_token(self):
        self.print_header()
        print(f"  {C.CYAN}{C.BOLD}=== CONFIGURATION DU JETON PR.SOCIAL ==={C.RESET}\n")
        print(f"  Jeton actuel enregistré : {C.GRAY}{self.token[:25]}...{self.token[-10:] if len(self.token)>35 else ''}{C.RESET}\n")
        print(f"  Collez votre nouveau Token PR.Social (ou appuyez sur Entrée pour annuler) :")
        new_token = input(f"  {C.BOLD}> {C.RESET}").strip()
        
        if new_token:
            if new_token.startswith("token="):
                new_token = new_token[6:]
            self.token = new_token.strip()
            self.config["token"] = self.token
            self.save_config()
            self.api.update_credentials(self.token, self.cf)
            print(f"\n  {C.GREEN}✓ Nouveau token enregistré avec succès !{C.RESET}")
            ok, uname, bal = self.get_user_status()
            if ok:
                print(f"  {C.GREEN}✓ Connexion réussie : @{uname} | Solde : ${bal:.4f}{C.RESET}\n")
            else:
                print(f"  {C.RED}⚠️ Le token semble invalide ou expiré.{C.RESET}\n")
        else:
            print(f"\n  {C.GRAY}Modification annulée.{C.RESET}\n")
            
        input(f"  Appuyez sur {C.BOLD}Entrée{C.RESET} pour continuer...")

    # ==========================================================================
    # ACTION 4 : BASCULER MODE INVISIBLE
    # ==========================================================================
    def action_toggle_headless(self):
        self.headless = not self.headless
        self.config["headless"] = self.headless
        self.save_config()
        self.browser_bot.headless = self.headless
        state = "ACTIVÉ (Chrome tournera en tâche de fond invisible)" if self.headless else "DÉSACTIVÉ (Chrome s'ouvrira visiblement)"
        self.print_header()
        print(f"  {C.MAGENTA}{C.BOLD}Mode invisible : {state}{C.RESET}\n")
        time.sleep(1.5)

    # ==========================================================================
    # BOUCLE PRINCIPALE DU MENU
    # ==========================================================================
    def run(self):
        while True:
            self.print_header()
            self.print_menu()
            
            try:
                choice = input(f"  {C.BOLD}{C.CYAN}Votre sélection [1-5] : {C.RESET}").strip()
            except (KeyboardInterrupt, EOFError):
                break

            if choice == "1":
                self.action_start_bot()
            elif choice == "2":
                self.action_manage_rejected()
            elif choice == "3":
                self.action_config_token()
            elif choice == "4":
                self.action_toggle_headless()
            elif choice == "5" or choice.lower() in ["exit", "quit", "q"]:
                break
            else:
                print(f"  {C.RED}Option invalide. Choisissez 1, 2, 3, 4 ou 5.{C.RESET}")
                time.sleep(1)

        # Nettoyage à la fermeture
        clear_screen()
        print(LOGO)
        print(f"  {C.GREEN}{C.BOLD}Merci d'avoir utilisé PR.Social Bot PC. À bientôt !{C.RESET}\n")
        try:
            self.browser_bot.stop_driver()
        except Exception:
            pass

def main():
    app = TerminalApp()
    app.run()

if __name__ == "__main__":
    main()
