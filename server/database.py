import os
import sqlite3
from datetime import datetime
from typing import Optional, List, Dict, Any

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "licensing.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Table Administrateurs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
    );
    """)

    # 2. Table Réglages Généraux (Coordonnées de paiement, taux)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    );
    """)

    # 3. Table Clients
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id TEXT UNIQUE NOT NULL,
        device_info TEXT,
        contact TEXT,
        first_seen TEXT NOT NULL,
        last_seen TEXT NOT NULL
    );
    """)

    # 4. Table Licences
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS licenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        license_key TEXT UNIQUE NOT NULL,
        duration_days INTEGER NOT NULL DEFAULT 7,
        status TEXT NOT NULL DEFAULT 'UNUSED', -- UNUSED, ACTIVE, EXPIRED, REVOKED
        created_at TEXT NOT NULL,
        activated_at TEXT,
        expires_at TEXT,
        device_id TEXT,
        client_contact TEXT,
        notes TEXT,
        FOREIGN KEY (device_id) REFERENCES clients (device_id)
    );
    """)

    # 5. Table Paiements (MVola & USDT)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        method TEXT NOT NULL, -- MVOLA ou USDT
        amount_usd REAL NOT NULL DEFAULT 2.0,
        amount_local TEXT,     -- ex: '9 500 MGA' ou '2.00 USDT'
        transaction_ref TEXT UNIQUE NOT NULL, -- Réf SMS MVola ou TxHash crypto
        sender_contact TEXT NOT NULL,         -- Numéro téléphone ou wallet
        status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
        license_id INTEGER,
        created_at TEXT NOT NULL,
        approved_at TEXT,
        notes TEXT,
        FOREIGN KEY (license_id) REFERENCES licenses (id)
    );
    """)

    # Insertion des réglages par défaut si non existants
    default_settings = {
        "price_usd": "2.00",
        "duration_days": "7",
        "mvola_number": "034 00 000 00",
        "mvola_name": "PR.Social Bot Support",
        "mvola_rate_mga": "9500",
        "usdt_address": "Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "usdt_network": "TRC-20 (Tron)",
        "support_telegram": "@votre_contact_telegram"
    }

    for k, v in default_settings.items():
        cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?);", (k, v))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Base de données initialisée avec succès !")
