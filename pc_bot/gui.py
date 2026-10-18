import os
import json
import time
import threading
import customtkinter as ctk
from datetime import datetime
from typing import Optional

from .pr_api import PrSocialAPI
from .browser_bot import BrowserBot
from .automation_engine import AutomationEngine
from .rejected_tasks_manager import RejectedTasksManager, analyze_rejection_error

CONFIG_FILE = r"D:\social_pc_bot\config.json"
os.makedirs(r"D:\social_pc_bot", exist_ok=True)

class PRSocialApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        # Configuration de la fenêtre principale
        self.title("PR.Social Bot PC - Édition Professionnelle v1.2.0")
        self.geometry("1100, 720")
        self.minsize(950, 650)
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")

        # Initialisation composants métier
        self.config = self.load_config()
        self.api = PrSocialAPI(
            token=self.config.get("token", ""),
            cf_clearance=self.config.get("cf_clearance", "")
        )
        self.browser_bot = BrowserBot(
            headless=self.config.get("headless", False)
        )
        self.engine = AutomationEngine(self.api, self.browser_bot)
        self.rejected_manager = RejectedTasksManager(self.api, self.browser_bot)
        self.rejected_dialog = None


        # Connecter les callbacks de l'engine
        self.engine.cb_log = self.gui_log
        self.engine.cb_balance = self.update_balance_display
        self.engine.cb_stats = self.update_stats_display
        self.engine.cb_status = self.update_status_display

        # Construire l'interface
        self._build_ui()

        # Tester la connexion au démarrage
        self.after(500, self.test_connection_startup)

    def load_config(self) -> dict:
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {"token": "", "cf_clearance": "", "headless": False, "delay_min": 5, "delay_max": 12}

    def save_config(self):
        try:
            with open(CONFIG_FILE, "w", encoding="utf-8") as f:
                json.dump(self.config, f, indent=2)
        except Exception:
            pass

    def _build_ui(self):
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(2, weight=1)

        # 1. HEADER BAR
        header_frame = ctk.CTkFrame(self, height=70, corner_radius=10, fg_color="#181926")
        header_frame.grid(row=0, column=0, sticky="ew", padx=15, pady=(15, 10))
        header_frame.grid_columnconfigure(1, weight=1)

        # Titre et Version
        title_label = ctk.CTkLabel(
            header_frame,
            text="⚡ PR.Social Bot PC",
            font=ctk.CTkFont(size=22, weight="bold"),
            text_color="#38bdf8"
        )
        title_label.grid(row=0, column=0, padx=20, pady=15, sticky="w")

        # Indicateur de Statut Compte
        self.lbl_auth_status = ctk.CTkLabel(
            header_frame,
            text="🔴 Déconnecté",
            font=ctk.CTkFont(size=14, weight="bold"),
            text_color="#ef4444"
        )
        self.lbl_auth_status.grid(row=0, column=2, padx=15, pady=15)

        # Solde Actuel
        self.lbl_balance = ctk.CTkLabel(
            header_frame,
            text="Solde: $0.000",
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color="#10b981"
        )
        self.lbl_balance.grid(row=0, column=3, padx=20, pady=15)

        # 2. STATS CARDS
        stats_frame = ctk.CTkFrame(self, fg_color="transparent")
        stats_frame.grid(row=1, column=0, sticky="ew", padx=15, pady=5)
        for i in range(4):
            stats_frame.grid_columnconfigure(i, weight=1)

        self.card_tasks_ok = self._create_stat_card(stats_frame, 0, "Tâches Réussies", "0", "#10b981")
        self.card_tasks_err = self._create_stat_card(stats_frame, 1, "Échecs / Ignorées", "0", "#f59e0b")
        self.card_earnings = self._create_stat_card(stats_frame, 2, "Gains Session", "$0.000", "#38bdf8")
        self.card_status = self._create_stat_card(stats_frame, 3, "État du Bot", "En veille", "#94a3b8")

        # 3. MAIN WORKSPACE (Controls + Logs)
        main_workspace = ctk.CTkFrame(self, fg_color="transparent")
        main_workspace.grid(row=2, column=0, sticky="nsew", padx=15, pady=10)
        main_workspace.grid_columnconfigure(0, weight=1)
        main_workspace.grid_columnconfigure(1, weight=2)
        main_workspace.grid_rowconfigure(0, weight=1)

        # Panneau de contrôle gauche
        left_panel = ctk.CTkFrame(main_workspace, fg_color="#1e1e2e", corner_radius=10)
        left_panel.grid(row=0, column=0, sticky="nsew", padx=(0, 10))

        # 1. Section Connexion & Session
        auth_box = ctk.CTkFrame(left_panel, fg_color="#181926", corner_radius=8)
        auth_box.pack(fill="x", padx=12, pady=(12, 8))

        lbl_auth_box = ctk.CTkLabel(
            auth_box,
            text="🔑 Connexion Compte PR.Social",
            font=ctk.CTkFont(size=13, weight="bold"),
            text_color="#38bdf8"
        )
        lbl_auth_box.pack(padx=10, pady=(8, 4), anchor="w")

        self.entry_token = ctk.CTkEntry(
            auth_box,
            placeholder_text="Coller votre Token ici...",
            height=30,
            font=ctk.CTkFont(size=11)
        )
        if self.config.get("token"):
            self.entry_token.insert(0, self.config.get("token"))
        self.entry_token.pack(fill="x", padx=10, pady=4)

        btn_auth_row = ctk.CTkFrame(auth_box, fg_color="transparent")
        btn_auth_row.pack(fill="x", padx=10, pady=(4, 8))
        btn_auth_row.grid_columnconfigure(0, weight=1)
        btn_auth_row.grid_columnconfigure(1, weight=1)

        self.btn_save_token = ctk.CTkButton(
            btn_auth_row,
            text="💾 Valider Token",
            font=ctk.CTkFont(size=11, weight="bold"),
            fg_color="#059669",
            hover_color="#047857",
            height=30,
            command=self.action_save_manual_token
        )
        self.btn_save_token.grid(row=0, column=0, padx=(0, 4), sticky="ew")

        self.btn_login_chrome = ctk.CTkButton(
            btn_auth_row,
            text="🌐 Ouvrir Chrome",
            font=ctk.CTkFont(size=11, weight="bold"),
            fg_color="#6366f1",
            hover_color="#4f46e5",
            height=30,
            command=self.action_login_chrome
        )
        self.btn_login_chrome.grid(row=0, column=1, padx=(4, 0), sticky="ew")

        # 2. Section Actions & Exécution
        lbl_controls = ctk.CTkLabel(left_panel, text="🎮 Actions & Lancement", font=ctk.CTkFont(size=14, weight="bold"))
        lbl_controls.pack(padx=15, pady=(8, 6), anchor="w")

        # Bouton Principal Lancer Tout
        self.btn_start_all = ctk.CTkButton(
            left_panel,
            text="🚀 LANCER TOUT (AUTO)",
            font=ctk.CTkFont(size=14, weight="bold"),
            fg_color="#10b981",
            hover_color="#059669",
            height=40,
            command=self.action_start_all
        )
        self.btn_start_all.pack(fill="x", padx=15, pady=4)

        # Bouton Arrêt
        self.btn_stop = ctk.CTkButton(
            left_panel,
            text="⏹️ ARRÊTER LE BOT",
            font=ctk.CTkFont(size=13, weight="bold"),
            fg_color="#ef4444",
            hover_color="#dc2626",
            height=34,
            state="disabled",
            command=self.action_stop
        )
        self.btn_stop.pack(fill="x", padx=15, pady=4)

        # Bouton Tâches Rejetées (Récupération, Analyse d'Erreurs & Réessai Strict)
        self.btn_rejected_mgr = ctk.CTkButton(
            left_panel,
            text="🔄 TÂCHES REJETÉES (RÉESSAI)",
            font=ctk.CTkFont(size=12, weight="bold"),
            fg_color="#d97706",
            hover_color="#b45309",
            height=36,
            command=self.action_open_rejected_dialog
        )
        self.btn_rejected_mgr.pack(fill="x", padx=15, pady=(4, 6))

        # Séparateur
        sep = ctk.CTkFrame(left_panel, height=2, fg_color="#313244")
        sep.pack(fill="x", padx=15, pady=8)

        # Plateformes individuelles
        lbl_indiv = ctk.CTkLabel(left_panel, text="Lancer une plateforme :", font=ctk.CTkFont(size=12, weight="bold"), text_color="#a6adc8")
        lbl_indiv.pack(padx=15, pady=(0, 4), anchor="w")

        self.btn_tt = self._create_platform_btn(left_panel, "🎵 TikTok", "tiktok")
        self.btn_fb = self._create_platform_btn(left_panel, "📘 Facebook", "facebook")
        self.btn_ig = self._create_platform_btn(left_panel, "📸 Instagram", "instagram")
        self.btn_yt = self._create_platform_btn(left_panel, "▶️ YouTube", "youtube")
        self.btn_tg = self._create_platform_btn(left_panel, "✈️ Telegram", "telegram")
        self.btn_threads = self._create_platform_btn(left_panel, "🧵 Threads", "threads")
        self.btn_reddit = self._create_platform_btn(left_panel, "🟠 Reddit", "reddit")
        self.btn_pinterest = self._create_platform_btn(left_panel, "📌 Pinterest", "pinterest")
        self.btn_soundcloud = self._create_platform_btn(left_panel, "☁️ SoundCloud", "soundcloud")
        self.btn_bluesky = self._create_platform_btn(left_panel, "🦋 Bluesky", "bluesky")

        # Options rapides
        sep2 = ctk.CTkFrame(left_panel, height=2, fg_color="#313244")
        sep2.pack(fill="x", padx=15, pady=8)

        self.chk_headless = ctk.CTkCheckBox(
            left_panel,
            text="Cacher Chrome (Mode invisible)",
            command=self.toggle_headless
        )
        if self.config.get("headless", False):
            self.chk_headless.select()
        self.chk_headless.pack(padx=15, pady=(2, 10), anchor="w")

        # Panneau de droite : Console de logs
        right_panel = ctk.CTkFrame(main_workspace, fg_color="#1e1e2e", corner_radius=10)
        right_panel.grid(row=0, column=1, sticky="nsew")
        right_panel.grid_columnconfigure(0, weight=1)
        right_panel.grid_rowconfigure(1, weight=1)

        log_header = ctk.CTkFrame(right_panel, fg_color="transparent")
        log_header.grid(row=0, column=0, sticky="ew", padx=15, pady=10)
        log_header.grid_columnconfigure(0, weight=1)

        lbl_log_title = ctk.CTkLabel(log_header, text="📜 Journal d'Exécution en Direct", font=ctk.CTkFont(size=16, weight="bold"))
        lbl_log_title.grid(row=0, column=0, sticky="w")

        btn_clear_log = ctk.CTkButton(
            log_header,
            text="Effacer logs",
            width=90,
            height=28,
            fg_color="#313244",
            hover_color="#45475a",
            command=self.clear_logs
        )
        btn_clear_log.grid(row=0, column=1, sticky="e")

        self.log_textbox = ctk.CTkTextbox(
            right_panel,
            font=ctk.CTkFont(family="Consolas", size=12),
            fg_color="#11111b",
            text_color="#cdd6f4",
            wrap="word"
        )
        self.log_textbox.grid(row=1, column=0, sticky="nsew", padx=15, pady=(0, 15))

    def _create_stat_card(self, parent, col, title, initial_val, color):
        card = ctk.CTkFrame(parent, fg_color="#1e1e2e", corner_radius=8, height=65)
        card.grid(row=0, column=col, sticky="ew", padx=5)
        card.grid_columnconfigure(0, weight=1)

        lbl_t = ctk.CTkLabel(card, text=title, font=ctk.CTkFont(size=11), text_color="#a6adc8")
        lbl_t.pack(pady=(8, 0))

        lbl_v = ctk.CTkLabel(card, text=initial_val, font=ctk.CTkFont(size=16, weight="bold"), text_color=color)
        lbl_v.pack(pady=(0, 8))
        return lbl_v

    def _create_platform_btn(self, parent, text, platform):
        btn = ctk.CTkButton(
            parent,
            text=text,
            height=30,
            fg_color="#313244",
            hover_color="#45475a",
            anchor="w",
            command=lambda p=platform: self.action_start_single(p)
        )
        btn.pack(fill="x", padx=15, pady=3)
        return btn

    def gui_log(self, message: str, level: str = "info"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        prefix = {
            "success": "[SUCCÈS]",
            "error": "[ERREUR]",
            "warning": "[ATTENTION]",
            "info": "[INFO]"
        }.get(level, "[INFO]")

        log_line = f"[{timestamp}] {prefix} {message}\n"

        def _append():
            self.log_textbox.insert("end", log_line)
            self.log_textbox.see("end")

        self.after(0, _append)

    def update_balance_display(self, balance: float):
        self.after(0, lambda: self.lbl_balance.configure(text=f"Solde: ${balance:.3f}"))

    def update_stats_display(self, success: int, failed: int, earnings: float):
        def _update():
            self.card_tasks_ok.configure(text=str(success))
            self.card_tasks_err.configure(text=str(failed))
            self.card_earnings.configure(text=f"${earnings:.3f}")
        self.after(0, _update)

    def update_status_display(self, is_running: bool):
        def _update():
            if is_running:
                self.card_status.configure(text="En cours...", text_color="#10b981")
                self.btn_start_all.configure(state="disabled")
                self.btn_stop.configure(state="normal")
            else:
                self.card_status.configure(text="En veille", text_color="#94a3b8")
                self.btn_start_all.configure(state="normal")
                self.btn_stop.configure(state="disabled")
        self.after(0, _update)

    def clear_logs(self):
        self.log_textbox.delete("1.0", "end")

    def toggle_headless(self):
        val = bool(self.chk_headless.get())
        self.browser_bot.headless = val
        self.config["headless"] = val
        self.save_config()
        state = "Activé (Chrome tournera en arrière-plan)" if val else "Désactivé (Chrome s'ouvrira visible à l'écran)"
        self.gui_log(f"Mode discret : {state}", "info")

    def test_connection_startup(self):
        def _test():
            self.gui_log("Vérification de la session PR.Social...", "info")
            status, me = self.api.get_me()
            if status == 200 and me.get("user"):
                u = me["user"]
                bal = float(u.get("balance", 0.0))
                self.lbl_auth_status.configure(text=f"🟢 @{u.get('username')}", text_color="#10b981")
                self.lbl_balance.configure(text=f"Solde: ${bal:.3f}")
                self.gui_log(f"Session validée avec succès pour @{u.get('username')} (Solde: ${bal:.3f}).", "success")
            else:
                self.lbl_auth_status.configure(text="🔴 Déconnecté", text_color="#ef4444")
                self.gui_log("Non connecté. Saisissez votre Token ci-dessus ou cliquez sur 'Ouvrir Chrome'.", "warning")

        threading.Thread(target=_test, daemon=True).start()

    def action_save_manual_token(self):
        tok = self.entry_token.get().strip()
        if not tok:
            self.gui_log("Veuillez saisir ou coller un Token PR.Social.", "warning")
            return
        self.config["token"] = tok
        self.save_config()
        self.api.update_credentials(tok, self.config.get("cf_clearance", ""))
        self.gui_log("Token enregistré manuellement. Vérification du compte...", "info")
        self.test_connection_startup()

    def action_login_chrome(self):
        def _do_login():
            try:
                self.gui_log("Lancement de Chrome pour connexion automatique...", "info")
                creds = self.browser_bot.capture_login_session(timeout_seconds=180, log_cb=self.gui_log)
                if creds and creds.get("token"):
                    tok = creds["token"]
                    self.config["token"] = tok
                    self.config["cf_clearance"] = creds.get("cf_clearance", "")
                    self.save_config()
                    self.api.update_credentials(tok, creds.get("cf_clearance", ""))
                    self.after(0, lambda: self.entry_token.delete(0, "end"))
                    self.after(0, lambda: self.entry_token.insert(0, tok))
                    self.gui_log("Connexion réussie ! Session enregistrée.", "success")
                    self.test_connection_startup()
                else:
                    self.gui_log("Connexion non finalisée. Vous pouvez coller votre jeton manuellement dans le champ prévu.", "warning")
            except Exception as e:
                self.gui_log(f"Erreur Chrome : {str(e)}", "error")

        threading.Thread(target=_do_login, daemon=True).start()

    def action_start_all(self):
        self.engine.start()

    def action_start_single(self, platform: str):
        self.engine.start([platform])

    def action_stop(self):
        self.engine.stop()

    def action_open_rejected_dialog(self):
        if self.rejected_dialog is None or not self.rejected_dialog.winfo_exists():
            self.rejected_dialog = RejectedTasksDialog(self)
        else:
            self.rejected_dialog.lift()
            self.rejected_dialog.focus()


class RejectedTasksDialog(ctk.CTkToplevel):
    """
    Fenêtre modale dédiée à la récupération, l'analyse des erreurs et le réessai avec vérification stricte des tâches rejetées.
    """
    def __init__(self, parent_app: PRSocialApp):
        super().__init__(parent_app)
        self.app = parent_app
        self.title("PR.Social - Récupération & Réessai des Tâches Rejetées")
        self.geometry("980, 700")
        self.minsize(850, 600)
        self.attributes("-topmost", True)

        self.tasks_list = []
        self.is_retrying = False
        self.stop_requested = False
        self.card_widgets = {}

        self._build_dialog_ui()
        # Charger automatiquement les tâches rejetées à l'ouverture
        self.after(300, self.action_fetch_rejected)

    def _build_dialog_ui(self):
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(2, weight=1)

        # 1. En-tête
        header = ctk.CTkFrame(self, height=65, corner_radius=10, fg_color="#181926")
        header.grid(row=0, column=0, sticky="ew", padx=15, pady=(15, 8))
        header.grid_columnconfigure(0, weight=1)

        title_lbl = ctk.CTkLabel(
            header,
            text="🔄 Tâches Rejetées : Diagnostic d'Erreurs & Réessai Strict",
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color="#f59e0b"
        )
        title_lbl.grid(row=0, column=0, padx=20, pady=12, sticky="w")

        self.lbl_stats = ctk.CTkLabel(
            header,
            text="0 tâche(s) chargée(s)",
            font=ctk.CTkFont(size=13, weight="bold"),
            text_color="#94a3b8"
        )
        self.lbl_stats.grid(row=0, column=1, padx=20, pady=12, sticky="e")

        # 2. Barre d'outils
        toolbar = ctk.CTkFrame(self, height=45, fg_color="transparent")
        toolbar.grid(row=1, column=0, sticky="ew", padx=15, pady=4)
        toolbar.grid_columnconfigure(3, weight=1)

        self.btn_fetch = ctk.CTkButton(
            toolbar,
            text="📥 Récupérer les Tâches Rejetées",
            font=ctk.CTkFont(size=12, weight="bold"),
            fg_color="#3b82f6",
            hover_color="#2563eb",
            height=32,
            command=self.action_fetch_rejected
        )
        self.btn_fetch.grid(row=0, column=0, padx=(0, 8))

        self.btn_retry_all = ctk.CTkButton(
            toolbar,
            text="🚀 Réessayer Tout (Mode Strict)",
            font=ctk.CTkFont(size=12, weight="bold"),
            fg_color="#10b981",
            hover_color="#059669",
            height=32,
            command=self.action_retry_all
        )
        self.btn_retry_all.grid(row=0, column=1, padx=(0, 8))

        self.btn_stop_retry = ctk.CTkButton(
            toolbar,
            text="⏹️ Arrêter",
            font=ctk.CTkFont(size=12, weight="bold"),
            fg_color="#ef4444",
            hover_color="#dc2626",
            height=32,
            state="disabled",
            command=self.action_stop_retry
        )
        self.btn_stop_retry.grid(row=0, column=2, padx=(0, 8))

        # 3. Zone centrale défilante pour les cartes de tâches
        self.scroll_frame = ctk.CTkScrollableFrame(
            self,
            fg_color="#1e1e2e",
            corner_radius=10,
            label_text="Liste des Tâches Rejetées & Analyses d'Erreurs",
            label_font=ctk.CTkFont(size=13, weight="bold")
        )
        self.scroll_frame.grid(row=2, column=0, sticky="nsew", padx=15, pady=8)
        self.scroll_frame.grid_columnconfigure(0, weight=1)

        # 4. Console de logs spécifique
        log_frame = ctk.CTkFrame(self, height=130, fg_color="#181926", corner_radius=8)
        log_frame.grid(row=3, column=0, sticky="ew", padx=15, pady=(4, 15))
        log_frame.grid_columnconfigure(0, weight=1)

        lbl_log = ctk.CTkLabel(log_frame, text="📜 Journal du Mode Strict :", font=ctk.CTkFont(size=11, weight="bold"), text_color="#a6adc8")
        lbl_log.pack(anchor="w", padx=10, pady=(4, 0))

        self.log_box = ctk.CTkTextbox(
            log_frame,
            height=100,
            font=ctk.CTkFont(family="Consolas", size=11),
            fg_color="#11111b",
            text_color="#cdd6f4",
            wrap="word"
        )
        self.log_box.pack(fill="both", expand=True, padx=10, pady=(2, 6))

    def dialog_log(self, message: str, level: str = "info"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        prefix = {
            "success": "[SUCCÈS]",
            "error": "[ERREUR]",
            "warning": "[ATTENTION]",
            "info": "[INFO]"
        }.get(level, "[INFO]")
        line = f"[{timestamp}] {prefix} {message}\n"

        def _append():
            if self.winfo_exists():
                self.log_box.insert("end", line)
                self.log_box.see("end")
            # Également refléter dans la console principale
            self.app.gui_log(f"[REJET-STRICT] {message}", level)

        self.after(0, _append)

    def action_fetch_rejected(self):
        def _fetch():
            self.dialog_log("Récupération des tâches rejetées depuis PR.Social...", "info")
            self.btn_fetch.configure(state="disabled")
            try:
                tasks = self.app.rejected_manager.fetch_all_rejected_tasks(max_pages=4, log_cb=self.dialog_log)
                self.tasks_list = tasks
                self.after(0, self._render_task_cards)
            except Exception as e:
                self.dialog_log(f"Erreur lors de la récupération : {str(e)}", "error")
            finally:
                self.after(0, lambda: self.btn_fetch.configure(state="normal"))

        threading.Thread(target=_fetch, daemon=True).start()

    def _render_task_cards(self):
        # Nettoyer l'affichage précédent
        for widget in self.scroll_frame.winfo_children():
            widget.destroy()
        self.card_widgets.clear()

        if not self.tasks_list:
            lbl_empty = ctk.CTkLabel(
                self.scroll_frame,
                text="🎉 Aucune tâche rejetée trouvée ! Toutes vos tâches sont validées ou aucune n'est en rejet.",
                font=ctk.CTkFont(size=14),
                text_color="#10b981"
            )
            lbl_empty.pack(pady=40)
            self.lbl_stats.configure(text="0 tâche rejetée", text_color="#10b981")
            return

        total_gain = sum(t.get("reward", 0.0) for t in self.tasks_list)
        self.lbl_stats.configure(
            text=f"{len(self.tasks_list)} tâche(s) rejetée(s) | Total à récupérer : ${total_gain:.3f}",
            text_color="#f59e0b"
        )

        for idx, task in enumerate(self.tasks_list):
            tid = task["task_id"]
            plat = task["platform"].upper()
            act = task["action"].upper()
            rew = task.get("reward", 0.0)
            analysis = task.get("analysis", {})

            card = ctk.CTkFrame(self.scroll_frame, fg_color="#181926", corner_radius=8)
            card.pack(fill="x", padx=6, pady=6)
            card.grid_columnconfigure(1, weight=1)

            # En-tête de la carte
            top_row = ctk.CTkFrame(card, fg_color="transparent")
            top_row.pack(fill="x", padx=12, pady=(10, 4))
            top_row.grid_columnconfigure(1, weight=1)

            lbl_badge = ctk.CTkLabel(
                top_row,
                text=f"[{plat} - {act}] #{tid}",
                font=ctk.CTkFont(size=13, weight="bold"),
                text_color="#38bdf8"
            )
            lbl_badge.grid(row=0, column=0, sticky="w")

            lbl_rew = ctk.CTkLabel(
                top_row,
                text=f"+${rew:.3f}",
                font=ctk.CTkFont(size=14, weight="bold"),
                text_color="#10b981"
            )
            lbl_rew.grid(row=0, column=1, padx=15, sticky="w")

            lbl_status = ctk.CTkLabel(
                top_row,
                text=task.get("status_retry", "En attente"),
                font=ctk.CTkFont(size=12, weight="bold"),
                text_color="#94a3b8"
            )
            lbl_status.grid(row=0, column=2, sticky="e")

            # Boîte d'analyse de l'erreur
            analysis_box = ctk.CTkFrame(card, fg_color="#11111b", corner_radius=6)
            analysis_box.pack(fill="x", padx=12, pady=4)

            lbl_cat = ctk.CTkLabel(
                analysis_box,
                text=f"❌ Motif du rejet : {analysis.get('category', 'Général')}",
                font=ctk.CTkFont(size=11, weight="bold"),
                text_color="#ef4444"
            )
            lbl_cat.pack(anchor="w", padx=8, pady=(4, 1))

            lbl_exp = ctk.CTkLabel(
                analysis_box,
                text=f"🔍 Diagnostic : {analysis.get('explanation', '')}",
                font=ctk.CTkFont(size=11),
                text_color="#cbd5e1",
                wraplength=750,
                justify="left"
            )
            lbl_exp.pack(anchor="w", padx=8, pady=1)

            lbl_mes = ctk.CTkLabel(
                analysis_box,
                text=f"🛡️ Mesure stricte : {analysis.get('strict_measure', '')}",
                font=ctk.CTkFont(size=11, weight="bold"),
                text_color="#f59e0b",
                wraplength=750,
                justify="left"
            )
            lbl_mes.pack(anchor="w", padx=8, pady=(1, 4))

            # Barre d'action inférieure de la carte
            bot_row = ctk.CTkFrame(card, fg_color="transparent")
            bot_row.pack(fill="x", padx=12, pady=(4, 10))
            bot_row.grid_columnconfigure(0, weight=1)

            url_txt = task.get("target_url") or task.get("target_username") or "URL non renseignée"
            lbl_url = ctk.CTkLabel(
                bot_row,
                text=f"Cible : {url_txt[:75]}",
                font=ctk.CTkFont(size=11),
                text_color="#64748b"
            )
            lbl_url.grid(row=0, column=0, sticky="w")

            btn_single = ctk.CTkButton(
                bot_row,
                text="🔄 Réessayer (Strict)",
                font=ctk.CTkFont(size=11, weight="bold"),
                fg_color="#313244",
                hover_color="#45475a",
                width=140,
                height=28,
                command=lambda t=task, lbl=lbl_status: self.action_retry_single(t, lbl)
            )
            btn_single.grid(row=0, column=1, sticky="e")

            self.card_widgets[tid] = {
                "lbl_status": lbl_status,
                "btn_single": btn_single
            }

    def action_retry_single(self, task: Dict[str, Any], lbl_status: ctk.CTkLabel):
        def _retry():
            tid = task["task_id"]
            lbl_status.configure(text="En cours...", text_color="#38bdf8")
            self.dialog_log(f"Lancement du réessai strict pour la tâche #{tid}...", "info")
            ok, msg = self.app.rejected_manager.retry_single_task(task, log_cb=self.dialog_log)
            if ok:
                lbl_status.configure(text="Succès ✅", text_color="#10b981")
                # Actualiser le solde sur l'application principale
                _, me = self.app.api.get_me()
                if me.get("user"):
                    self.app.update_balance_display(float(me["user"].get("balance", 0.0)))
            else:
                lbl_status.configure(text=f"Échec ❌ ({msg[:15]})", text_color="#ef4444")

        threading.Thread(target=_retry, daemon=True).start()

    def action_retry_all(self):
        if self.is_retrying:
            return
        self.is_retrying = True
        self.stop_requested = False
        self.btn_retry_all.configure(state="disabled")
        self.btn_fetch.configure(state="disabled")
        self.btn_stop_retry.configure(state="normal")

        def _run_all():
            self.dialog_log("=== DÉBUT DU TRAITEMENT EN LOT DES TÂCHES REJETÉES ===", "info")
            total = len(self.tasks_list)
            success_count = 0

            for idx, task in enumerate(self.tasks_list):
                if self.stop_requested:
                    self.dialog_log("Arrêt du réessai demandé par l'utilisateur.", "warning")
                    break

                tid = task["task_id"]
                widgets = self.card_widgets.get(tid)
                lbl_st = widgets["lbl_status"] if widgets else None

                if lbl_st:
                    lbl_st.configure(text="En cours...", text_color="#38bdf8")

                self.dialog_log(f"Traitement de la tâche {idx + 1}/{total} (#{tid})...", "info")
                ok, msg = self.app.rejected_manager.retry_single_task(task, log_cb=self.dialog_log)

                if ok:
                    success_count += 1
                    if lbl_st:
                        lbl_st.configure(text="Succès ✅", text_color="#10b981")
                    # Mettre à jour le solde
                    _, me = self.app.api.get_me()
                    if me.get("user"):
                        self.app.update_balance_display(float(me["user"].get("balance", 0.0)))
                else:
                    if lbl_st:
                        lbl_st.configure(text=f"Échec ❌ ({msg[:15]})", text_color="#ef4444")

                # Pause de sécurité stricte entre chaque tentative
                time.sleep(random.uniform(5.0, 8.0))

            self.dialog_log(f"=== FIN DU RÉESSAI EN LOT : {success_count}/{total} tâches récupérées avec succès ! ===", "success")
            self.is_retrying = False
            self.after(0, lambda: self.btn_retry_all.configure(state="normal"))
            self.after(0, lambda: self.btn_fetch.configure(state="normal"))
            self.after(0, lambda: self.btn_stop_retry.configure(state="disabled"))

        threading.Thread(target=_run_all, daemon=True).start()

    def action_stop_retry(self):
        self.stop_requested = True
        self.dialog_log("Arrêt du processus en cours...", "warning")
