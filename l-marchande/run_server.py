#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
   L-MARCHANDE ENTERPRISE - SERVEUR PRINCIPAL & API ENGINE
   Plateforme d'Engagement & Monétisation Réseaux Sociaux Haute Performance
================================================================================
"""

import os
import sys
import webbrowser
import time

BANNER = """
\033[96m\033[1m
  ██╗      ███╗   ███╗ █████╗ ██████╗  ██████╗██╗  ██╗ █████╗ ███╗   ██╗██████╗ ███████╗
  ██║      ████╗ ████║██╔══██╗██╔══██╗██╔════╝██║  ██║██╔══██╗████╗  ██║██╔══██╗██╔════╝
  ██║█████╗██╔████╔██║███████║██████╔╝██║     ███████║███████║██╔██╗ ██║██║  ██║█████╗  
  ██║╚════╝██║╚██╔╝██║██╔══██║██╔══██╗██║     ██╔══██║██╔══██║██║╚██╗██║██║  ██║██╔══╝  
  ███████╗ ██║ ╚═╝ ██║██║  ██║██║  ██║╚██████╗██║  ██║██║  ██║██║ ╚████║██████╔╝███████╗
  ╚══════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝
\033[0m
  \033[97m\033[1m┌─ 🏢 PLATEFORME SOCIAL SAAS CLOUD · L-MARCHANDE ENTERPRISE v1.0 ──────────────┐\033[0m
  \033[97m\033[1m│\033[0m  \033[92m● Statut API\033[0m : En Ligne               \033[93m⚡ Moteur Tâches\033[0m : Multi-Réseaux Actif \033[97m\033[1m│\033[0m
  \033[97m\033[1m│\033[0m  \033[96m🌐 Frontend\033[0m  : http://localhost:8000   \033[95m🛡️ Sentinel\033[0m     : Anti-Fraude Actif    \033[97m\033[1m│\033[0m
  \033[97m\033[1m│\033[0m  \033[94m📖 API Docs\033[0m  : http://localhost:8000/docs \033[90m(Documentation Swagger OpenAPI)\033[0m    \033[97m\033[1m│\033[0m
  \033[97m\033[1m└──────────────────────────────────────────────────────────────────────────────┘\033[0m
"""

def main():
    if os.name == 'nt':
        os.system('color')
    print(BANNER)

    # Vérification et migration de la base de données
    backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
    sys.path.insert(0, backend_dir)

    print("  \033[93m[*] Initialisation et contrôle du grand livre comptable...\033[0m")
    try:
        import seed_data
        seed_data.seed()
        print("  \033[92m[✓] Base de données relationnelle SQLite WAL prête.\033[0m")
    except Exception as e:
        print(f"  \033[91m[!] Avertissement initialisation DB : {e}\033[0m")

    # Démarrage du serveur Uvicorn
    import uvicorn
    print("\n  \033[96m\033[1m🚀 Lancement du serveur L-Marchande sur http://localhost:8000...\033[0m")
    print("  \033[90m(Appuyez sur Ctrl+C pour arrêter le serveur à tout moment)\033[0m\n")

    # Ouvrir automatiquement le navigateur après 1.5s
    def open_browser():
        time.sleep(1.2)
        try:
            webbrowser.open("http://localhost:8000")
        except Exception:
            pass

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False, app_dir=backend_dir)

if __name__ == "__main__":
    main()
