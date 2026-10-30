import os
import sys
import re
import time
import json
import random
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List, Tuple

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
try:
    from rejected_tasks_manager import TermuxRejectedTasksManager
except ImportError:
    from termux_bot.rejected_tasks_manager import TermuxRejectedTasksManager

try:
    from license_client import TermuxLicenseClient
except ImportError:
    from termux_bot.license_client import TermuxLicenseClient

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

def parse_cookie_input(raw: str) -> Tuple[str, str]:
    """Extrait de manière tolérante le token JWT et le cookie cf_clearance."""
    raw = raw.strip()
    if raw.lower().startswith("cookie:"):
        raw = raw[7:].strip()

    # Si chaîne JSON collée
    if raw.startswith("{") and raw.endswith("}"):
        try:
            j = json.loads(raw)
            return j.get("token", "").strip(), j.get("cf_clearance", "").strip()
        except Exception:
            pass

    tok = raw
    cf = ""

    # Extraction par regex pour token
    m_tok = re.search(r'(?:^|[;\s])token=["\']?([^"\'\s;]+)["\']?', raw)
    if m_tok:
        tok = m_tok.group(1).strip()

    # Extraction par regex pour cf_clearance
    m_cf = re.search(r'(?:^|[;\s])cf_clearance=["\']?([^"\'\s;]+)["\']?', raw)
    if m_cf:
        cf = m_cf.group(1).strip()

    # Nettoyage supplémentaire
    if tok.startswith("Bearer "):
        tok = tok[7:].strip()
    tok = tok.strip('"\'')
    cf = cf.strip('"\'')
    return tok, cf

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

def clear_saved_session():
    """Efface les informations de session sauvegardées."""
    data = {"token": "", "cf_clearance": "", "delay_min": 5, "delay_max": 10}
    for path in [CONFIG_PATH_LOCAL, CONFIG_PATH_HOME]:
        try:
            if os.path.exists(path):
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
        self.browser = BrowserTermux(headless=True, user_agent=self.api.user_agent)
        self.current_user = ""
        self.current_balance = 0.0
        self.approved_accounts = {}
        self.failed_tasks = set()
        self.rejected_manager = TermuxRejectedTasksManager(self.api, self.browser)
        self.license_client = TermuxLicenseClient()
        self.is_licensed = False
        self.license_info = {}

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
            print(f"\n{CYAN}Collez votre Cookie / Token de connexion :{RESET}")
            print(f"{DIM}(Formats acceptés : eyJhb... OU token=eyJ... OU Cookie de navigateur complet){RESET}")
            raw = input("👉 ").strip()
            if raw:
                tok, cf = parse_cookie_input(raw)
                
                self.api.update_credentials(tok, cf)
                self.token = tok
                self.cf = cf

                print(f"\n{YELLOW}Vérification de la session en cours auprès de PR.Social...{RESET}")
                if self.verify_login():
                    save_session(self.token, self.cf)
                    print(f"\n{GREEN}{BOLD}✓ Connexion réussie !{RESET}")
                    print(f"{GREEN}Session enregistrée. Les prochains lancements se feront automatiquement !{RESET}")
                    time.sleep(2.0)
                else:
                    self.token = ""
                    self.cf = ""
                    print(f"\n{RED}✖ Cookie ou Jeton invalide / refusé par PR.Social. Veuillez réessayer.{RESET}")
                    time.sleep(2.5)
        elif choice == "2":
            print(f"\n{CYAN}Au revoir ! 👋{RESET}\n")
            sys.exit(0)

    # ==========================================================================
    # MENU ÉTAT 2 : CONNECTÉ (TABLEAU DE BORD + CONTRÔLE DE LICENCE)
    # ==========================================================================
    def show_authenticated_menu(self):
        clear_screen()
        self.print_logo()
        self.verify_login()

        # Date et heure actuelles
        now_str = datetime.now().strftime("%d/%m/%Y - %H:%M:%S")

        # Contrôle de la licence Termux
        is_val, msg, info = self.license_client.check_license()
        self.is_licensed = is_val
        self.license_info = info

        if is_val:
            exp_date = info.get("expires_at", "")
            d_left = info.get("days_left", 0)
            h_left = info.get("hours_left", 0)
            lic_str = f"{GREEN}{BOLD}ACTIVE{RESET} ({d_left}j {h_left}h restants)"
        elif info.get("status") == "EXPIRED":
            lic_str = f"{RED}{BOLD}EXPIRÉE{RESET} (Renouvellement 2 USD)"
        elif info.get("status") == "DEVICE_MISMATCH":
            lic_str = f"{RED}{BOLD}VERROUILLÉE SUR AUTRE SMARTPHONE{RESET}"
        else:
            lic_str = f"{YELLOW}{BOLD}AUCUNE LICENCE ACTIVE{RESET}"

        # Tableau de bord : Utilisateur, Solde, Licence, Date et Heure
        bal_str = f"${self.current_balance:.4f}"
        print(f"\n{BLUE}╭─────────────────────────────────────────────────────────────╮{RESET}")
        print(f"{BLUE}│{RESET}  👤 {WHITE}Utilisateur connecté :{RESET} {GREEN}{BOLD}@{self.current_user:<31}{RESET} {BLUE}│{RESET}")
        print(f"{BLUE}│{RESET}  💰 {WHITE}Solde actuel         :{RESET} {YELLOW}{BOLD}{bal_str:<32}{RESET} {BLUE}│{RESET}")
        print(f"{BLUE}│{RESET}  🛡️  {WHITE}Licence Bot (7j)     :{RESET} {lic_str:<42} {BLUE}│{RESET}")
        print(f"{BLUE}│{RESET}  🕒 {WHITE}Date et Heure        :{RESET} {CYAN}{now_str:<32}{RESET} {BLUE}│{RESET}")
        print(f"{BLUE}╰─────────────────────────────────────────────────────────────╯{RESET}")

        # Menu à 6 choix clairs
        print(f"\n{CYAN}┌─────────────────────────────────────────────────────────────┐{RESET}")
        print(f"{CYAN}│{RESET}  {GREEN}{BOLD}[1]{RESET} 🚀 {WHITE}{BOLD}Start Tout (Auto-Bot + Déblocage Auto Tâches){RESET}       {CYAN}│{RESET}")
        print(f"{CYAN}│{RESET}  {MAGENTA}{BOLD}[2]{RESET} 🔄 {WHITE}{BOLD}Récupérer & Réessayer les Tâches Rejetées{RESET}         {CYAN}│{RESET}")
        print(f"{CYAN}│{RESET}  {CYAN}{BOLD}[3]{RESET} 🔗 {WHITE}Comptes Liés{RESET}                                          {CYAN}│{RESET}")
        print(f"{CYAN}│{RESET}  {YELLOW}{BOLD}[4]{RESET} 🔑 {WHITE}Changer de Cookie / Déconnexion{RESET}                       {CYAN}│{RESET}")
        print(f"{CYAN}│{RESET}  {BLUE}{BOLD}[5]{RESET} 🛡️ {WHITE}{BOLD}Gestion Licence & Paiements (MVola & USDT){RESET}      {CYAN}│{RESET}")
        print(f"{CYAN}│{RESET}  {RED}{BOLD}[6]{RESET} 🚪 {WHITE}Quitter Bot{RESET}                                           {CYAN}│{RESET}")
        print(f"{CYAN}└─────────────────────────────────────────────────────────────┘{RESET}")

        choice = input(f"\n{BOLD}Votre choix [1-6] : {RESET}").strip()

        # Protection stricte par licence pour les fonctions [1] et [2]
        if choice in ["1", "2"] and not self.is_licensed:
            print(f"\n{RED}{BOLD}⛔ ACCÈS BLOQUÉ : LICENCE HEBDOMADAIRE REQUISE (2 USD / 7 JOURS){RESET}")
            print(f"{YELLOW}Cette fonctionnalité est réservée aux utilisateurs disposant d'une licence active.{RESET}")
            print(f"{CYAN}Allez dans le menu [5] pour activer une clé ou payer via MVola / USDT.{RESET}")
            time.sleep(3.0)
            return

        if choice == "1":
            self.start_all_tasks()
        elif choice == "2":
            self.recover_rejected_tasks()
        elif choice == "3":
            self.show_linked_accounts()
        elif choice == "4":
            print(f"\n{YELLOW}Déconnexion en cours...{RESET}")
            clear_saved_session()
            self.token = ""
            self.cf = ""
            self.current_user = ""
            self.current_balance = 0.0
            self.approved_accounts.clear()
            self.api.update_credentials("", "")
            print(f"{GREEN}✓ Déconnecté. La session précédente a été réinitialisée.{RESET}")
            time.sleep(1.5)
        elif choice == "5":
            self.show_license_menu()
        elif choice == "6":
            print(f"\n{CYAN}Arrêt du bot. À bientôt ! 👋{RESET}\n")
            self.browser.stop_driver()
            sys.exit(0)

    # ==========================================================================
    # GESTION COMMERCIALE & PAIEMENTS (MVOLA & USDT)
    # ==========================================================================
    def show_license_menu(self):
        clear_screen()
        self.print_logo()
        print(f"\n{BLUE}{BOLD}🛡️ GESTION DE LA LICENCE & PAIEMENTS (2 USD / 7 JOURS){RESET}")
        print(f"{DIM}Identifiant Smartphone (HWID) : {self.license_client.device_id}{RESET}\n")

        # Statut actuel
        is_val, msg, info = self.license_client.check_license()
        if is_val:
            print(f"  {GREEN}✓ Statut : ACTIVE{RESET}")
            print(f"  📅 Expire le : {info.get('expires_at')}")
            print(f"  ⏳ Temps restant : {info.get('days_left')} jours et {info.get('hours_left')} heures")
            print(f"  🔑 Clé active : {info.get('license_key')}\n")
        else:
            print(f"  {RED}✖ Statut : INACTIVE / EXPIRÉE{RESET}")
            print(f"  ℹ️  Détail : {msg}\n")

        print(f"{CYAN}┌─────────────────────────────────────────────────────────────┐{RESET}")
        print(f"{CYAN}│{RESET}  {GREEN}[1]{RESET} 🔑 Activer / Prolonger avec une Clé (PR-XXXX-XXXX-XXXX)   {CYAN}│{RESET}")
        print(f"{CYAN}│{RESET}  {YELLOW}[2]{RESET} 💳 Afficher les Coordonnées de Paiement (MVola & USDT)     {CYAN}│{RESET}")
        print(f"{CYAN}│{RESET}  {MAGENTA}[3]{RESET} 📤 Envoyer une Preuve de Paiement (Validation en 2 min)    {CYAN}│{RESET}")
        print(f"{CYAN}│{RESET}  {RED}[4]{RESET} ↩️  Retour au Menu Principal                              {CYAN}│{RESET}")
        print(f"{CYAN}└─────────────────────────────────────────────────────────────┘{RESET}")

        opt = input(f"\n{BOLD}Votre choix [1-4] : {RESET}").strip()

        if opt == "1":
            print(f"\n{CYAN}Entrez votre clé de licence reçue :{RESET}")
            key = input("👉 ").strip()
            if not key:
                return
            contact = input(f"{DIM}Votre Contact Telegram ou Téléphone (Optionnel) : {RESET}").strip()
            print(f"{YELLOW}Activation auprès du serveur en cours...{RESET}")
            ok, act_msg, act_info = self.license_client.activate_license(key, contact)
            if ok:
                print(f"\n{GREEN}{BOLD}🎉 Félicitations ! {act_msg}{RESET}")
                if act_info.get("expires_at"):
                    print(f"{GREEN}Nouvelle date d'expiration : {act_info['expires_at']}{RESET}")
            else:
                print(f"\n{RED}✖ Échec d'activation : {act_msg}{RESET}")
            time.sleep(2.5)

        elif opt == "2":
            clear_screen()
            self.print_logo()
            print(f"\n{YELLOW}{BOLD}💳 INSTRUCTIONS DE PAIEMENT POUR LA LICENCE (2 USD / 7 JOURS){RESET}\n")
            info_pay = self.license_client.get_payment_instructions()
            if not info_pay:
                print(f"{RED}Impossible de joindre le serveur. Contactez le support.{RESET}")
            else:
                mv = info_pay.get("mvola", {})
                us = info_pay.get("usdt", {})
                print(f"{YELLOW}{BOLD}1. PAIEMENT MVOLA (MADAGASCAR) :{RESET}")
                print(f"   • Numéro Destinataire : {GREEN}{BOLD}{mv.get('number')}{RESET}")
                print(f"   • Nom du Titulaire   : {WHITE}{BOLD}{mv.get('name')}{RESET}")
                print(f"   • Montant à envoyer  : {YELLOW}{BOLD}{mv.get('amount_to_pay')}{RESET}")
                print(f"   {DIM}(Gardez bien la référence de transaction SMS reçue){RESET}\n")

                print(f"{GREEN}{BOLD}2. PAIEMENT USDT CRYPTO (TRC-20) :{RESET}")
                print(f"   • Réseau              : {WHITE}{us.get('network')}{RESET}")
                print(f"   • Adresse Wallet     : {CYAN}{BOLD}{us.get('address')}{RESET}")
                print(f"   • Montant exact       : {YELLOW}{BOLD}{us.get('amount_to_pay')}{RESET}\n")

                print(f"💬 Support Telegram : {info_pay.get('support')}")
            input(f"\n{DIM}Appuyez sur Entrée pour continuer...{RESET}")

        elif opt == "3":
            print(f"\n{CYAN}Choisissez le moyen de paiement utilisé :{RESET}")
            print(" [1] MVola")
            print(" [2] USDT")
            p_choice = input("👉 ").strip()
            method = "MVOLA" if p_choice == "1" else "USDT"

            print(f"\n{WHITE}Entrez la référence de transaction :{RESET}")
            print(f"{DIM}(Ex: Réf SMS MV2410... ou Hash de transaction USDT){RESET}")
            ref = input("👉 ").strip()

            print(f"\n{WHITE}Entrez votre numéro de téléphone ou wallet expéditeur :{RESET}")
            contact = input("👉 ").strip()

            if not ref or not contact:
                print(f"{RED}Informations incomplètes. Annulation.{RESET}")
                time.sleep(2)
                return

            print(f"{YELLOW}Transmission de la preuve à l'administrateur...{RESET}")
            ok_sub, msg_sub = self.license_client.submit_payment_proof(method, ref, contact)
            if ok_sub:
                print(f"\n{GREEN}{BOLD}✓ Preuve envoyée avec succès !{RESET}")
                print(f"{GREEN}L'administrateur valide votre accès dans les prochaines minutes.{RESET}")
            else:
                print(f"\n{RED}✖ {msg_sub}{RESET}")
            time.sleep(3.0)

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

        target_platforms = ["threads", "reddit", "pinterest", "soundcloud", "bluesky", "tiktok", "instagram", "youtube", "facebook", "linkedin", "telegram", "twitter", "snapchat", "github", "discord", "spotify"]
        active_list = [p for p in target_platforms if p in self.approved_accounts] if self.approved_accounts else target_platforms

        print(f"{WHITE}Réseaux surveillés : {', '.join([f'{CYAN}{p.upper()}{RESET}' for p in active_list])}\n")

        tasks_completed_count = 0

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
                        if task_id in self.failed_tasks:
                            continue

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
                            self.failed_tasks.add(task_id)
                            continue

                        # Résolution URL cible (Threads / Reddit / LinkedIn / Pinterest / etc.)
                        target_url = res_start.get("task", {}).get("target_url") or t.get("target_url") or ""
                        if not target_url:
                            u_name = (res_start.get("task", {}).get("target_username") or t.get("target_username") or "").strip().lstrip("@")
                            if u_name:
                                if plat == "threads": target_url = f"https://www.threads.net/@{u_name}"
                                elif plat == "reddit": target_url = f"https://www.reddit.com/user/{u_name}"
                                elif plat in ["twitter", "x"]: target_url = f"https://x.com/{u_name}"
                                elif plat == "instagram": target_url = f"https://www.instagram.com/{u_name}"
                                elif plat == "tiktok": target_url = f"https://www.tiktok.com/@{u_name}"
                                elif plat == "linkedin": target_url = f"https://www.linkedin.com/in/{u_name}"
                                elif plat == "snapchat": target_url = f"https://www.snapchat.com/add/{u_name}"
                                elif plat == "telegram": target_url = f"https://t.me/{u_name}"
                                elif plat == "github": target_url = f"https://github.com/{u_name}"
                                elif plat == "facebook": target_url = f"https://www.facebook.com/{u_name}"
                                elif plat == "pinterest": target_url = f"https://www.pinterest.com/{u_name}/"
                                elif plat in ["soundcloud", "sound_cloud"]: target_url = f"https://soundcloud.com/{u_name}"
                                elif plat in ["bluesky", "bsky"]:
                                    bsky_handle = u_name if "." in u_name else f"{u_name}.bsky.social"
                                    target_url = f"https://bsky.app/profile/{bsky_handle}"

                        wait_sec = int(res_start.get("submit_after_sec") or 5)
                        api_check = res_start.get("api_check_enabled", 0)

                        # Préparation rigoureuse du commentaire si l'action est un commentaire
                        comment_text = None
                        if "COMMENT" in action:
                            assigned = (
                                res_start.get("completion", {}).get("assigned_comment")
                                or res_start.get("task", {}).get("assigned_comment")
                                or t.get("assigned_comment")
                            )
                            if not assigned:
                                c_list = res_start.get("task", {}).get("comment_list") or t.get("comment_list")
                                if isinstance(c_list, str):
                                    try:
                                        c_list = json.loads(c_list)
                                    except Exception:
                                        c_list = [line.strip() for line in c_list.split("\n") if line.strip()]
                                if isinstance(c_list, list) and c_list:
                                    assigned = random.choice(c_list)

                            c_type = (res_start.get("task", {}).get("comment_type") or t.get("comment_type") or "").lower()
                            if not assigned and ("emoji" in c_type or "emoji" in action.lower()):
                                assigned = random.choice(["🔥", "👏", "🚀", "❤️", "👍", "✨", "💯", "🙌"])

                            if not assigned:
                                if plat == "linkedin":
                                    assigned = random.choice([
                                        "Great insights, thanks for sharing! 👏",
                                        "Very inspiring and relevant topic! 🚀",
                                        "Thanks for this valuable perspective! ✨",
                                        "Great share, very insightful! 💡"
                                    ])
                                elif plat in ["youtube", "tiktok"]:
                                    assigned = random.choice([
                                        "Top video ! 🔥",
                                        "Great content, keep it up! 👏",
                                        "Super vidéo ! 👍",
                                        "Awesome! ✨"
                                    ])
                                else:
                                    assigned = random.choice([
                                        "Great content! 👍",
                                        "Very interesting, thanks for sharing! ✨",
                                        "Top ! 🔥",
                                        "Nice post! 👏"
                                    ])
                            comment_text = str(assigned).strip()
                            print(f"  💬 Commentaire préparé : {MAGENTA}'{comment_text}'{RESET}")

                        print(f"  🌐 URL : {DIM}{target_url}{RESET}")
                        print(f"  🤖 Exécution en arrière-plan...")
                        ok_act, msg_act, shot_path = self.browser.execute_task_action(
                            platform=plat, action=action, target_url=target_url, task_id=task_id, comment_text=comment_text
                        )

                        is_valid = False
                        if api_check == 1:
                            c_st, c_res = self.api.api_check_task(task_id)
                            if c_st == 200 and c_res.get("found") is True and c_res.get("approved") is True:
                                is_valid = True
                                print(f"  {GREEN}✓ Validé instantanément par API Check !{RESET}")

                        # GARDE-FOU ANTI-BAN STRICT : Ne JAMAIS soumettre si l'action ou la capture est invalide
                        if not is_valid:
                            if ok_act and os.path.exists(shot_path):
                                print(f"  ⏳ Sécurité ({wait_sec}s) puis soumission de la preuve vérifiée...")
                                time.sleep(wait_sec + 1)
                                s_st, s_res = self.api.submit_screenshot(task_id, shot_path)
                                if s_st == 200 and s_res.get("ok"):
                                    is_valid = True
                                    print(f"  {GREEN}✓ Preuve enregistrée avec succès !{RESET}")
                            else:
                                print(f"  🛡️ {RED}{BOLD}SÉCURITÉ ANTI-BAN STRICTE: Capture non conforme écartée.{RESET}")
                                print(f"  ⚠️ {YELLOW}Raison : {msg_act}{RESET}")
                                print(f"  🛡️ {CYAN}Annulation propre de la tâche #{task_id} pour empêcher tout ban PR.Social.{RESET}")
                                self.api.cancel_task(task_id)
                                self.failed_tasks.add(task_id)

                        if is_valid:
                            _, fresh = self.api.get_me()
                            if fresh.get("user"):
                                self.current_balance = float(fresh["user"].get("balance", 0.0))
                            print(f"  {GREEN}{BOLD}🎉 Tâche #{task_id} validée ! Nouveau solde : ${self.current_balance:.4f}{RESET}")
                        elif ok_act:
                            print(f"  {YELLOW}⚠️ Non validée. Déblocage automatique de sécurité...{RESET}")
                            self.api.cancel_task(task_id)
                            self.failed_tasks.add(task_id)

                        tasks_completed_count += 1
                        if tasks_completed_count % 4 == 0:
                            new_ua = self.api.rotate_user_agent()
                            self.browser.user_agent = new_ua
                            print(f"  🛡️ {CYAN}Protection Anti-Ban : Empreinte User-Agent renouvelée avec succès.{RESET}")

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
    # OPTION 2 : RÉCUPÉRATION DES TÂCHES REJETÉES (MODE STRICT)
    # ==========================================================================
    def recover_rejected_tasks(self):
        clear_screen()
        self.print_logo()
        print(f"\n{MAGENTA}{BOLD}🔄 GESTIONNAIRE DE RÉCUPÉRATION DES TÂCHES REJETÉES (MODE STRICT){RESET}\n")
        
        tasks = self.rejected_manager.fetch_rejected_tasks(max_pages=5)
        if not tasks:
            print(f"\n{GREEN}✓ Aucune tâche rejetée trouvée sur votre compte PR.Social.{RESET}")
            input(f"\n{CYAN}Appuyez sur Entrée pour retourner au menu...{RESET}")
            return

        print(f"\n{YELLOW}{BOLD}📋 Tâches Rejetées Trouvées ({len(tasks)}) :{RESET}")
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

        print(f"\n{CYAN}Options disponibles :{RESET}")
        print(f" {GREEN}[1]{RESET} 🚀 Réessayer TOUTES les tâches récupérables (Mode Strict)")
        print(f" {BLUE}[2]{RESET} 🎯 Réessayer une tâche spécifique par son ID")
        print(f" {RED}[3]{RESET} ↩️ Retour au menu principal")

        opt = input(f"\n{BOLD}Votre choix [1-3] : {RESET}").strip()

        if opt == "1":
            print(f"\n{MAGENTA}🚀 Lancement de la récupération automatique de toutes les tâches éligibles...{RESET}")
            success_count = 0
            for t in tasks:
                if not t.get("recoverable"):
                    print(f"\n{YELLOW}⏩ Tâche #{t['id']} écartée car jugée non récupérable ({t['diagnosis']}){RESET}")
                    continue
                ok, msg = self.rejected_manager.retry_single_task(t, self.approved_accounts)
                if ok:
                    success_count += 1
                time.sleep(random.uniform(4.0, 7.0))
            
            print(f"\n{GREEN}{BOLD}🎉 Récupération terminée : {success_count} tâche(s) validée(s) avec succès !{RESET}")
            input(f"\n{CYAN}Appuyez sur Entrée pour retourner au menu...{RESET}")

        elif opt == "2":
            target_id = input(f"\n{CYAN}Entrez l'ID de la tâche à récupérer : {RESET}").strip()
            matched = next((t for t in tasks if str(t['id']) == target_id), None)
            if not matched:
                print(f"{RED}✖ Tâche #{target_id} introuvable dans la liste des tâches rejetées.{RESET}")
            else:
                ok, msg = self.rejected_manager.retry_single_task(matched, self.approved_accounts)
                if ok:
                    print(f"\n{GREEN}{BOLD}✓ Tâche #{target_id} récupérée avec succès !{RESET}")
                else:
                    print(f"\n{YELLOW}⚠️ La tâche #{target_id} n'a pas pu être validée : {msg}{RESET}")
            input(f"\n{CYAN}Appuyez sur Entrée pour retourner au menu...{RESET}")

    # ==========================================================================
    # OPTION 3 : COMPTES LIÉS
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
    # MENU D'ABONNEMENT PRÉALABLE (AVANT TOUT ACCÈS AU BOT ET AUX COOKIES)
    # ==========================================================================
    def show_subscription_gate_menu(self):
        """
        Affiche le menu d'abonnement élégant avant tout accès au bot.
        Présente le tarif (2 USD / 7 jours), les moyens de paiement (MVola & USDT),
        l'identifiant unique HWID, et propose :
        [1] 💬 Contacter l'Administrateur
        [2] 🚪 Exit
        Une fois le contact pris, l'option 1 devient :
        [1] 🔑 Entrer la Clé de Licence reçue (PR-XXXX-XXXX-XXXX)
        """
        step = "CONTACT"

        while not self.is_licensed:
            clear_screen()
            self.print_logo()

            # Récupérer les coordonnées officielles (depuis l'API ou fallback)
            pay_info = self.license_client.get_payment_instructions()
            mv = pay_info.get("mvola", {})
            us = pay_info.get("usdt", {})
            support = pay_info.get("support", "@PRSocialSupport")
            hwid = self.license_client.device_id

            # En-tête PRO et élégant
            print(f"\n{CYAN}{BOLD}╭─────────────────────────────────────────────────────────────╮{RESET}")
            print(f"{CYAN}│{RESET}  💎 {WHITE}{BOLD}ABONNEMENT BOT TERMUX REQUIS (ACCÈS COMPLET 7 JOURS){RESET}   {CYAN}│{RESET}")
            print(f"{CYAN}│{RESET}                                                             {CYAN}│{RESET}")
            print(f"{CYAN}│{RESET}  💰 {WHITE}Tarif officiel       :{RESET} {GREEN}{BOLD}2 USD / 7 JOURS{RESET} {DIM}(Renouvelable){RESET}  {CYAN}│{RESET}")
            print(f"{CYAN}│{RESET}  📱 {WHITE}Identifiant Smartphone:{RESET} {MAGENTA}{BOLD}{hwid:<30}{RESET} {CYAN}│{RESET}")
            print(f"{CYAN}╰─────────────────────────────────────────────────────────────╯{RESET}")

            # Bloc Moyens de paiement avec couleurs professionnelles
            print(f"\n{YELLOW}{BOLD}🇲🇬 MOYEN DE PAIEMENT 1 : MVOLA (MADAGASCAR){RESET}")
            print(f"   {WHITE}• Numéro Destinataire :{RESET} {GREEN}{BOLD}{mv.get('number', '034 00 000 00')}{RESET}")
            print(f"   {WHITE}• Nom du Titulaire    :{RESET} {WHITE}{BOLD}{mv.get('name', 'PR.Social Support')}{RESET}")
            print(f"   {WHITE}• Montant à envoyer   :{RESET} {YELLOW}{BOLD}{mv.get('amount_to_pay', '9 500 MGA')}{RESET}")

            print(f"\n{GREEN}{BOLD}🪙 MOYEN DE PAIEMENT 2 : USDT CRYPTO (TRC-20){RESET}")
            print(f"   {WHITE}• Réseau Blockchain   :{RESET} {WHITE}{BOLD}{us.get('network', 'TRC-20 (Tron)')}{RESET}")
            print(f"   {WHITE}• Adresse Wallet USDT :{RESET} {CYAN}{BOLD}{us.get('address', 'Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')}{RESET}")
            print(f"   {WHITE}• Montant exact       :{RESET} {GREEN}{BOLD}{us.get('amount_to_pay', '2.00 USDT')}{RESET}")

            print(f"\n{DIM}─────────────────────────────────────────────────────────────{RESET}")

            if step == "CONTACT":
                print(f"{CYAN}┌─────────────────────────────────────────────────────────────┐{RESET}")
                print(f"{CYAN}│{RESET}  {GREEN}{BOLD}[1]{RESET} 💬 {WHITE}{BOLD}Contacter l'Administrateur pour Acheter{RESET}              {CYAN}│{RESET}")
                print(f"{CYAN}│{RESET}  {RED}{BOLD}[2]{RESET} 🚪 {WHITE}Quitter le Bot (Exit){RESET}                                  {CYAN}│{RESET}")
                print(f"{CYAN}└─────────────────────────────────────────────────────────────┘{RESET}")

                choice = input(f"\n{BOLD}Votre choix [1-2] : {RESET}").strip()

                if choice == "1":
                    clear_screen()
                    self.print_logo()
                    print(f"\n{CYAN}{BOLD}💬 CONTACTEZ L'ADMINISTRATEUR POUR VALIDER VOTRE ABONNEMENT :{RESET}\n")
                    print(f"  {WHITE}1. Envoyez votre paiement de {YELLOW}{BOLD}2 USD{RESET} ({YELLOW}{mv.get('amount_to_pay', '9 500 MGA')}{RESET} ou {GREEN}{us.get('amount_to_pay', '2.00 USDT')}{RESET}).")
                    print(f"  {WHITE}2. Contactez l'administrateur et transmettez-lui :{RESET}")
                    print(f"     • Votre preuve de paiement (Capture ou référence SMS / TxID)")
                    print(f"     • Votre Identifiant Smartphone (HWID) : {MAGENTA}{BOLD}{hwid}{RESET}")
                    print(f"\n  {GREEN}👉 Contact Support Officiel :{RESET} {BOLD}{support}{RESET}\n")
                    print(f"{YELLOW}Dès réception, l'administrateur vous remettra votre Clé de Licence.{RESET}")
                    print(f"{DIM}─────────────────────────────────────────────────────────────{RESET}")
                    input(f"\n{CYAN}Appuyez sur Entrée pour entrer votre clé reçue...{RESET}")
                    step = "ENTER_KEY"

                elif choice == "2":
                    print(f"\n{CYAN}Au revoir ! 👋{RESET}\n")
                    sys.exit(0)

            elif step == "ENTER_KEY":
                print(f"{CYAN}┌─────────────────────────────────────────────────────────────┐{RESET}")
                print(f"{CYAN}│{RESET}  {GREEN}{BOLD}[1]{RESET} 🔑 {WHITE}{BOLD}Entrer la Clé de Licence reçue (PR-XXXX-XXXX-XXXX){RESET}   {CYAN}│{RESET}")
                print(f"{CYAN}│{RESET}  {RED}{BOLD}[2]{RESET} 🚪 {WHITE}Quitter le Bot (Exit){RESET}                                  {CYAN}│{RESET}")
                print(f"{CYAN}└─────────────────────────────────────────────────────────────┘{RESET}")

                choice = input(f"\n{BOLD}Votre choix [1-2] : {RESET}").strip()

                if choice == "1":
                    print(f"\n{CYAN}🔑 Collez la Clé de Licence remise par l'administrateur :{RESET}")
                    key = input("👉 ").strip()
                    if not key:
                        continue

                    print(f"\n{YELLOW}⏳ Vérification de votre abonnement auprès du serveur...{RESET}")
                    ok, act_msg, act_info = self.license_client.activate_license(key)
                    if ok:
                        self.is_licensed = True
                        self.license_info = act_info
                        exp_str = act_info.get("expires_at", "7 jours")
                        print(f"\n{GREEN}{BOLD}🎉 FÉLICITATIONS ! ABONNEMENT CONFIRMÉ ET VALIDÉ !{RESET}")
                        print(f"{GREEN}✓ Accès accordé pour 7 jours jusqu'au : {BOLD}{exp_str}{RESET}")
                        print(f"{CYAN}Chargement de votre session PR.Social dans 2 secondes...{RESET}")
                        time.sleep(2.0)
                        return
                    else:
                        print(f"\n{RED}{BOLD}✖ ERREUR D'ACTIVATION :{RESET} {RED}{act_msg}{RESET}")
                        print(f"{YELLOW}Vérifiez la clé saisie ou contactez l'administrateur.{RESET}")
                        time.sleep(3.0)

                elif choice == "2":
                    print(f"\n{CYAN}Au revoir ! 👋{RESET}\n")
                    sys.exit(0)

    def run(self):
        clear_screen()
        self.print_logo()

        # ÉTAPE 1 : CONTRÔLE D'ABONNEMENT STRICT AVANT TOUT ACCÈS AU BOT
        is_val, msg, info = self.license_client.check_license()
        self.is_licensed = is_val
        self.license_info = info

        if not self.is_licensed:
            # Affiche le menu d'abonnement élégant en priorité
            self.show_subscription_gate_menu()

        # ÉTAPE 2 : UNE FOIS L'ABONNEMENT CONFIRMÉ -> GESTION DU COOKIE PR.SOCIAL
        if self.token:
            print(f"\n{CYAN}🔄 Session PR.Social trouvée. Connexion automatique en cours...{RESET}")
            if self.verify_login():
                print(f"{GREEN}{BOLD}✓ Connexion automatique réussie !{RESET} {GREEN}Bienvenue @{self.current_user} (Solde: ${self.current_balance:.4f}){RESET}")
                time.sleep(1.2)
            else:
                print(f"{YELLOW}⚠️ La session enregistrée a expiré ou est invalide.{RESET}")
                time.sleep(1.5)
                self.token = ""
                self.cf = ""

        while True:
            # Sécurité anti-expiration continue
            is_val, _, info = self.license_client.check_license()
            if not is_val:
                self.is_licensed = False
                self.show_subscription_gate_menu()
                continue

            # Si pas de session valide -> Menu Demande Login Cookie PR.Social
            if not self.token or not self.verify_login():
                self.show_unauthenticated_menu()
            else:
                # Session valide -> Menu connecté
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
