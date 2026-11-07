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

# Forcer UTF-8 sous Windows CMD
try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

# Couleurs ANSI
RESET = "\033[0m"
BOLD = "\033[1m"
DIM = "\033[2m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
RED = "\033[91m"
WHITE = "\033[97m"
MAGENTA = "\033[95m"

MASTER_SECRET = b"PR_SOCIAL_ADMIN_MASTER_SECRET_KEY_2026_BAGIO67"

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "server", "licensing.db")

def sync_admin_registry():
    """Synchronise le coffre-fort chiffré (.lic_registry.json) pour Termux et les clients distants (zéro fuite de clé)."""
    import json
    import base64
    if not os.path.exists(DB_PATH):
        return
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT license_key FROM licenses WHERE status = 'ACTIVE';")
        active = [r[0] for r in cur.fetchall()]
        cur.execute("SELECT license_key FROM licenses WHERE status = 'REVOKED';")
        revoked = [r[0] for r in cur.fetchall()]
        cur.execute("SELECT license_key FROM deleted_licenses;")
        deleted = [r[0] for r in cur.fetchall()]
        conn.close()

        all_revoked = list(set(revoked + deleted))

        def hash_k(k: str) -> str:
            return hashlib.sha256(MASTER_SECRET + b"::SALT_KEY::" + k.strip().upper().encode("utf-8")).hexdigest()

        active_hashes = [hash_k(k) for k in active if k]
        revoked_hashes = [hash_k(k) for k in all_revoked if k]

        payload_dict = {
            "v": 2,
            "ts": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "act": active_hashes,
            "rev": revoked_hashes
        }

        raw_bytes = json.dumps(payload_dict).encode("utf-8")
        keystream = hashlib.sha256(MASTER_SECRET + b"_REG_CIPHER_2026").digest()
        enc = bytearray(len(raw_bytes))
        for i, b in enumerate(raw_bytes):
            enc[i] = b ^ keystream[i % 32] ^ ((i * 41) & 0xFF)

        b64_enc = base64.b64encode(enc).decode("ascii")
        sig = hashlib.sha256(MASTER_SECRET + b64_enc.encode("ascii")).hexdigest()[:16]

        data = {
            "sig": sig,
            "vault": b64_enc
        }
        root = os.path.dirname(os.path.abspath(__file__))
        for path in [os.path.join(root, ".lic_registry.json"), os.path.join(root, "dist_public", ".lic_registry.json")]:
            try:
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2)
            except Exception:
                pass

        # Synchronisation automatique GitHub en arrière-plan pour Termux & dist_public
        import subprocess
        import threading
        def _bg_push():
            try:
                dist_dir = os.path.join(root, "dist_public")
                subprocess.run(["git", "-C", dist_dir, "add", ".lic_registry.json"], capture_output=True, timeout=10)
                subprocess.run(["git", "-C", dist_dir, "commit", "-m", "sync(registry): auto-update encrypted vault"], capture_output=True, timeout=10)
                subprocess.run(["git", "-C", dist_dir, "push", "origin", "main"], capture_output=True, timeout=20)
            except Exception:
                pass
        threading.Thread(target=_bg_push, daemon=True).start()
    except Exception:
        pass

def generate_hardware_locked_key(device_input: str, days: int, notes: str = "", contact: str = "") -> str:
    """
    Génère une clé de licence cryptographiquement signée et scellée
    sur l'identifiant matériel de l'appareil (1 Clé = 1 Appareil).
    Enregistre IMMÉDIATEMENT la clé dans server/licensing.db pour un contrôle total en temps réel.
    """
    clean_dev = device_input.strip().upper()
    # Si l'admin colle PC-8F2A-4B91-C3D7, on extrait le bloc discriminant '8F2A'
    if "-" in clean_dev:
        parts = clean_dev.split("-")
        dev_code = parts[1] if len(parts) > 1 else parts[0]
    else:
        dev_code = clean_dev[:4]

    dev_code = dev_code[:4].upper()
    exp_dt = datetime.now() + timedelta(days=days)
    exp_date_short = exp_dt.strftime("%Y%m%d")
    exp_date_full = exp_dt.replace(hour=23, minute=59, second=59).strftime("%Y-%m-%d %H:%M:%S")

    payload = f"{dev_code}:{exp_date_short}".encode("utf-8")
    sig = hmac.new(MASTER_SECRET, payload, hashlib.sha256).hexdigest()[:8].upper()

    key = f"PR-KEY-{dev_code}-{exp_date_short}-{sig}"

    # Enregistrement immédiat dans la base de données du serveur
    if os.path.exists(DB_PATH):
        try:
            conn = sqlite3.connect(DB_PATH)
            cur = conn.cursor()
            now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cur.execute("""
                INSERT OR REPLACE INTO licenses (license_key, duration_days, status, created_at, activated_at, expires_at, device_id, notes, client_contact)
                VALUES (?, ?, 'ACTIVE', ?, ?, ?, ?, ?, ?);
            """, (key, days, now_str, now_str, exp_date_full, clean_dev, notes or "Clé Matérielle Admin", contact))
            conn.commit()
            conn.close()
            sync_admin_registry()
        except Exception as e:
            print(f"  {YELLOW}Avertissement DB locale : {e}{RESET}")

    return key

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
            sync_admin_registry()
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

def revoke_license_action(target: str) -> bool:
    """Révoque immédiatement une licence par ID ou clé."""
    if not os.path.exists(DB_PATH):
        return False
    target = target.strip()
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    if target.isdigit():
        cur.execute("UPDATE licenses SET status = 'REVOKED' WHERE id = ?;", (int(target),))
    else:
        cur.execute("UPDATE licenses SET status = 'REVOKED' WHERE license_key = ?;", (target.upper(),))
    changed = cur.rowcount > 0
    conn.commit()
    conn.close()
    sync_admin_registry()
    return changed

def reactivate_license_action(target: str) -> bool:
    """Réactive une licence révoquée par ID ou clé."""
    if not os.path.exists(DB_PATH):
        return False
    target = target.strip()
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    if target.isdigit():
        cur.execute("UPDATE licenses SET status = 'ACTIVE' WHERE id = ?;", (int(target),))
    else:
        cur.execute("UPDATE licenses SET status = 'ACTIVE' WHERE license_key = ?;", (target.upper(),))
    changed = cur.rowcount > 0
    conn.commit()
    conn.close()
    sync_admin_registry()
    return changed

def delete_license_action(target: str) -> bool:
    """Supprime définitivement une licence par ID ou clé et bloque toute réutilisation."""
    if not os.path.exists(DB_PATH):
        return False
    target = target.strip()
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Récupérer la clé si ID
    lic_key = None
    if target.isdigit():
        cur.execute("SELECT license_key FROM licenses WHERE id = ?;", (int(target),))
        row = cur.fetchone()
        if row:
            lic_key = row[0]
        cur.execute("DELETE FROM licenses WHERE id = ?;", (int(target),))
    else:
        lic_key = target.upper()
        cur.execute("DELETE FROM licenses WHERE license_key = ?;", (lic_key,))

    changed = cur.rowcount > 0
    if lic_key:
        cur.execute("INSERT OR REPLACE INTO deleted_licenses (license_key, deleted_at) VALUES (?, ?);", (lic_key, now_str))

    conn.commit()
    conn.close()
    sync_admin_registry()
    return changed

def main():
    while True:
        os.system('cls' if os.name == 'nt' else 'clear')
        print(f"""
  {MAGENTA}{BOLD}╔══════════════════════════════════════════════════════════════════════╗{RESET}
  {MAGENTA}{BOLD}║{RESET}         👑 {WHITE}{BOLD}PR.SOCIAL · CONTRÔLE TOTAL DES CLÉS ADMIN{RESET}                   {MAGENTA}{BOLD}║{RESET}
  {MAGENTA}{BOLD}╠══════════════════════════════════════════════════════════════════════╣{RESET}
  {MAGENTA}{BOLD}║{RESET}  {CYAN}Contrôle absolu en temps réel : Activation, Révocation, Suppression{RESET} {MAGENTA}{BOLD}║{RESET}
  {MAGENTA}{BOLD}║{RESET}  {WHITE}Règle d'or : 1 Utilisateur = 1 Appareil (HWID) = 1 Clé Unique{RESET}       {MAGENTA}{BOLD}║{RESET}
  {MAGENTA}{BOLD}╚══════════════════════════════════════════════════════════════════════╝{RESET}

  {GREEN}{BOLD}[ 1 ] 🔐 Générer une Clé Verrouillée 1 Appareil (Auto-Enregistrée DB){RESET}
        {WHITE}Lie la licence à l'appareil et l'enregistre pour contrôle en direct.{RESET}

  {CYAN}{BOLD}[ 2 ] 🌐 Générer une Clé Serveur de Base de Données (PR-XXXX-XXXX-XXXX){RESET}
        {WHITE}Clé standard enregistrée dans la DB du serveur de licences.{RESET}

  {YELLOW}{BOLD}[ 3 ] 📋 Voir la Liste des Licences & Appareils Liés (DB){RESET}

  {RED}{BOLD}[ 4 ] 🚫 Révoquer / Bannir une Licence (Bloquer immédiatement un utilisateur){RESET}

  {GREEN}{BOLD}[ 5 ] 🔄 Réactiver une Licence (Lever la révocation){RESET}

  {RED}{BOLD}[ 6 ] 🗑️ Supprimer définitivement une Licence{RESET}

  {WHITE}{BOLD}[ 7 ] ❌ Quitter{RESET}
""")

        try:
            choice = input(f"  {MAGENTA}⚡ {WHITE}{BOLD}Votre choix [1-7] :{RESET} ").strip()
        except (KeyboardInterrupt, EOFError):
            break

        if choice == "1":
            print(f"\n  {WHITE}{BOLD}--- GÉNÉRATION DE CLÉ VERROUILLÉE 1 APPAREIL ---{RESET}")
            dev_id = input(f"  Entrez l'Identifiant Appareil du client (ex: PC-8F2A-4B91-C3D7 ou TMX-...) : ").strip()
            if not dev_id:
                print(f"  {RED}Identifiant obligatoire.{RESET}")
                input("  Appuyez sur Entrée...")
                continue

            contact = input(f"  Contact client (optionnel, ex: @telegram / nom) : ").strip()

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

            key = generate_hardware_locked_key(dev_id, days, contact=contact)
            exp_date = (datetime.now() + timedelta(days=days)).strftime("%d/%m/%Y")

            print(f"""
  {GREEN}{BOLD}══════════════════════════════════════════════════════════════════════{RESET}
  {GREEN}{BOLD}✅ CLÉ DE LICENCE GÉNÉRÉE & ENREGISTRÉE EN BASE DE DONNÉES :{RESET}

     👉  {YELLOW}{BOLD}{key}{RESET}

  • Appareil client lié : {WHITE}{BOLD}{dev_id.upper()}{RESET}
  • Durée accordée      : {WHITE}{days} jours (Expire le {exp_date}){RESET}
  • Contrôle direct     : {CYAN}Visible sur le Dashboard Web et révocable à tout moment{RESET}
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

        elif choice == "4":
            print(f"\n  {RED}{BOLD}--- 🚫 RÉVOCATION IMMÉDIATE D'UNE LICENCE ---{RESET}")
            list_server_licenses()
            target = input(f"  Entrez l'ID ou la Clé de la licence à révoquer : ").strip()
            if not target:
                continue
            if revoke_license_action(target):
                print(f"\n  {GREEN}{BOLD}✓ SUCCÈS : La licence '{target}' a été révoquée !{RESET}")
                print(f"  {YELLOW}L'utilisateur associé sera bloqué dès sa prochaine action.{RESET}")
            else:
                print(f"\n  {RED}✖ Aucune licence trouvée correspondant à '{target}'.{RESET}")
            input(f"\n  Appuyez sur {BOLD}Entrée{RESET} pour continuer...")

        elif choice == "5":
            print(f"\n  {GREEN}{BOLD}--- 🔄 RÉACTIVATION D'UNE LICENCE ---{RESET}")
            list_server_licenses()
            target = input(f"  Entrez l'ID ou la Clé de la licence à réactiver : ").strip()
            if not target:
                continue
            if reactivate_license_action(target):
                print(f"\n  {GREEN}{BOLD}✓ SUCCÈS : La licence '{target}' a été réactivée !{RESET}")
            else:
                print(f"\n  {RED}✖ Aucune licence trouvée correspondant à '{target}'.{RESET}")
            input(f"\n  Appuyez sur {BOLD}Entrée{RESET} pour continuer...")

        elif choice == "6":
            print(f"\n  {RED}{BOLD}--- 🗑️ SUPPRESSION DÉFINITIVE D'UNE LICENCE ---{RESET}")
            list_server_licenses()
            target = input(f"  Entrez l'ID ou la Clé de la licence à supprimer : ").strip()
            if not target:
                continue
            confirm = input(f"  {RED}Confirmer la suppression définitive de '{target}' ? (o/n) : {RESET}").strip().lower()
            if confirm in ["o", "oui", "y", "yes"]:
                if delete_license_action(target):
                    print(f"\n  {GREEN}{BOLD}✓ SUCCÈS : Licence supprimée définitivement.{RESET}")
                else:
                    print(f"\n  {RED}✖ Impossible de supprimer cette licence.{RESET}")
            input(f"\n  Appuyez sur {BOLD}Entrée{RESET} pour continuer...")

        elif choice in ["7", "q", "exit"]:
            break

if __name__ == "__main__":
    main()

