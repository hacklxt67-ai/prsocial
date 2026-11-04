#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
   PR.SOCIAL • OUTIL D'ADMINISTRATION EXCLUSIF : GÉNÉRATEUR DE CLÉS DE LICENCE
   Usage réservé à l'administrateur pour délivrer des clés aux utilisateurs.
   Règle : 1 Utilisateur = 1 Appareil = 1 Clé
================================================================================
"""

import os
import sys
import hmac
import hashlib
import sqlite3
from datetime import datetime, timedelta

# Couleurs ANSI
RESET = "\033[0m"
BOLD = "\033[1m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
RED = "\033[91m"
WHITE = "\033[97m"
MAGENTA = "\033[95m"

MASTER_SECRET = b"PR_SOCIAL_ADMIN_MASTER_SECRET_KEY_2026_BAGIO67"

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "server", "licensing.db")

def generate_hardware_locked_key(device_input: str, days: int) -> str:
    """
    Génère une clé de licence cryptographiquement signée et scellée
    sur l'identifiant matériel de l'appareil (1 Clé = 1 Appareil).
    """
    clean_dev = device_input.strip().upper()
    # Si l'admin colle PC-8F2A-4B91-C3D7, on extrait le bloc discriminant '8F2A'
    if "-" in clean_dev:
        parts = clean_dev.split("-")
        dev_code = parts[1] if len(parts) > 1 else parts[0]
    else:
        dev_code = clean_dev[:4]

    dev_code = dev_code[:4].upper()
    exp_date = (datetime.now() + timedelta(days=days)).strftime("%Y%m%d")

    payload = f"{dev_code}:{exp_date}".encode("utf-8")
    sig = hmac.new(MASTER_SECRET, payload, hashlib.sha256).hexdigest()[:8].upper()

    return f"PR-KEY-{dev_code}-{exp_date}-{sig}"

def generate_server_database_key(duration_days: int = 7, notes: str = "", contact: str = "") -> str:
    """Génère une clé standard enregistrée dans la base de données du serveur."""
    import secrets
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    p1 = "".join(secrets.choice(chars) for _ in range(4))
    p2 = "".join(secrets.choice(chars) for _ in range(4))
    p3 = "".join(secrets.choice(chars) for _ in range(4))
    key = f"PR-{p1}-{p2}-{p3}"

    if os.path.exists(DB_PATH):
        try:
            conn = sqlite3.connect(DB_PATH)
            cur = conn.cursor()
            now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cur.execute("""
                INSERT INTO licenses (license_key, duration_days, status, created_at, notes, client_contact)
                VALUES (?, ?, 'UNUSED', ?, ?, ?);
            """, (key, duration_days, now_str, notes, contact))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Erreur DB locale : {e}")
    return key

def list_server_licenses():
    if not os.path.exists(DB_PATH):
        print(f"\n  {RED}Base de données server/licensing.db introuvable.{RESET}")
        return

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("SELECT * FROM licenses ORDER BY id DESC LIMIT 50;")
    rows = cur.fetchall()
    conn.close()

    print(f"\n  {CYAN}{BOLD}ID  | CLÉ DE LICENCE      | STATUT    | EXPIRATION          | APPAREIL LIÉ (HWID){RESET}")
    print(f"  {'-'*85}")
    for r in rows:
        st = r["status"]
        st_color = GREEN if st == "ACTIVE" else (YELLOW if st == "UNUSED" else RED)
        dev = r["device_id"] or "Aucun (En attente)"
        exp = r["expires_at"] or f"+{r['duration_days']}j après activation"
        print(f"  {r['id']:<3} | {r['license_key']:<19} | {st_color}{st:<9}{RESET} | {exp:<19} | {dev}")
    print()

def main():
    while True:
        os.system('cls' if os.name == 'nt' else 'clear')
        print(f"""
  {MAGENTA}{BOLD}╔══════════════════════════════════════════════════════════════════════╗{RESET}
  {MAGENTA}{BOLD}║{RESET}         👑 {WHITE}{BOLD}PR.SOCIAL · GÉNÉRATEUR EXCLUSIF DE CLÉS ADMIN{RESET}             {MAGENTA}{BOLD}║{RESET}
  {MAGENTA}{BOLD}╠══════════════════════════════════════════════════════════════════════╣{RESET}
  {MAGENTA}{BOLD}║{RESET}  {CYAN}Ce menu permet à l'administrateur de générer et délivrer des clés{RESET}  {MAGENTA}{BOLD}║{RESET}
  {MAGENTA}{BOLD}║{RESET}  {WHITE}Règle d'or : 1 Utilisateur = 1 Appareil (HWID) = 1 Clé Unique{RESET}       {MAGENTA}{BOLD}║{RESET}
  {MAGENTA}{BOLD}╚══════════════════════════════════════════════════════════════════════╝{RESET}

  {GREEN}{BOLD}[ 1 ] 🔐 Générer une Clé Verrouillée 1 Appareil (Recommandé - Sans Serveur){RESET}
        {WHITE}Lie instantanément la licence à l'identifiant matériel du client.{RESET}

  {CYAN}{BOLD}[ 2 ] 🌐 Générer une Clé Serveur de Base de Données (PR-XXXX-XXXX-XXXX){RESET}
        {WHITE}Clé standard enregistrée dans la DB du serveur de licences.{RESET}

  {YELLOW}{BOLD}[ 3 ] 📋 Voir la Liste des Licences & Appareils Liés (DB){RESET}

  {RED}{BOLD}[ 4 ] ❌ Quitter{RESET}
""")

        try:
            choice = input(f"  {MAGENTA}⚡ {WHITE}{BOLD}Votre choix [1-4] :{RESET} ").strip()
        except (KeyboardInterrupt, EOFError):
            break

        if choice == "1":
            print(f"\n  {WHITE}{BOLD}--- GÉNÉRATION DE CLÉ VERROUILLÉE 1 APPAREIL ---{RESET}")
            dev_id = input(f"  Entrez l'Identifiant Appareil du client (ex: PC-8F2A-4B91-C3D7 ou TMX-...) : ").strip()
            if not dev_id:
                print(f"  {RED}Identifiant obligatoire.{RESET}")
                input("  Appuyez sur Entrée...")
                continue

            print(f"\n  Choisissez la durée de validité :")
            print(f"    [1] 7 Jours (1 semaine)")
            print(f"    [2] 14 Jours (2 semaines)")
            print(f"    [3] 30 Jours (1 mois)")
            print(f"    [4] 90 Jours (3 mois)")
            print(f"    [5] 365 Jours (1 an)")
            print(f"    [6] 3650 Jours (Illimité / Permanent)")
            d_choice = input(f"  Durée [1-6, défaut=1] : ").strip()

            days_map = {"1": 7, "2": 14, "3": 30, "4": 90, "5": 365, "6": 3650}
            days = days_map.get(d_choice, 7)

            key = generate_hardware_locked_key(dev_id, days)
            exp_date = (datetime.now() + timedelta(days=days)).strftime("%d/%m/%Y")

            print(f"""
  {GREEN}{BOLD}══════════════════════════════════════════════════════════════════════{RESET}
  {GREEN}{BOLD}✅ CLÉ DE LICENCE GÉNÉRÉE AVEC SUCCÈS POUR CET APPAREIL :{RESET}

     👉  {YELLOW}{BOLD}{key}{RESET}

  • Appareil client lié : {WHITE}{BOLD}{dev_id.upper()}{RESET}
  • Durée accordée      : {WHITE}{days} jours (Expire le {exp_date}){RESET}
  • Sécurité            : {CYAN}Verrouillage matériel 1 Appareil = 1 Clé{RESET}
  {GREEN}{BOLD}══════════════════════════════════════════════════════════════════════{RESET}
  {DIM}(Copiez la clé ci-dessus et transmettez-la à votre utilisateur){RESET}
""")
            input(f"  Appuyez sur {BOLD}Entrée{RESET} pour continuer...")

        elif choice == "2":
            print(f"\n  {WHITE}{BOLD}--- GÉNÉRATION DE CLÉ SERVEUR (BASE DE DONNÉES) ---{RESET}")
            contact = input(f"  Contact client (optionnel, ex: @telegram / nom) : ").strip()
            days_str = input(f"  Nombre de jours de validité [défaut=7] : ").strip()
            days = int(days_str) if days_str.isdigit() else 7
            key = generate_server_database_key(duration_days=days, notes="Généré via Admin CLI", contact=contact)
            print(f"""
  {GREEN}{BOLD}══════════════════════════════════════════════════════════════════════{RESET}
  {GREEN}{BOLD}✅ CLÉ SERVEUR GÉNÉRÉE AVEC SUCCÈS :{RESET}

     👉  {YELLOW}{BOLD}{key}{RESET}

  • Statut initial : {YELLOW}UNUSED{RESET} (Sera liée au premier appareil qui l'active)
  • Durée accordée : {WHITE}{days} jours{RESET}
  {GREEN}{BOLD}══════════════════════════════════════════════════════════════════════{RESET}
""")
            input(f"  Appuyez sur {BOLD}Entrée{RESET} pour continuer...")

        elif choice == "3":
            list_server_licenses()
            input(f"  Appuyez sur {BOLD}Entrée{RESET} pour continuer...")

        elif choice in ["4", "q", "exit"]:
            break

if __name__ == "__main__":
    main()

