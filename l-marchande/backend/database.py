import os
import sqlite3
import threading
from typing import Optional, List, Dict, Any

DB_FILE = os.environ.get("L_MARCHANDE_DB", os.path.join(os.path.dirname(os.path.abspath(__file__)), "l_marchande.db"))

_lock = threading.Lock()

def get_db_connection() -> sqlite3.Connection:
    """Fournit une connexion SQLite sécurisée avec WAL mode et row_factory."""
    conn = sqlite3.connect(DB_FILE, check_same_thread=False, timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL;")
    conn.execute("PRAGMA synchronous = NORMAL;")
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    """Initialise le schéma relationnel complet de L-Marchande."""
    with _lock:
        conn = get_db_connection()
        cur = conn.cursor()

        # 1. Table Utilisateurs (Workers, Annonceurs, Administrateurs)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            role TEXT DEFAULT 'worker' CHECK(role IN ('worker', 'advertiser', 'admin')), -- 'worker', 'advertiser', 'admin'
            email_verified INTEGER DEFAULT 0,
            email_verify_token TEXT,
            email_verify_expires_at TIMESTAMP,
            email_verify_sent_at TIMESTAMP,
            pending_email TEXT,
            email_change_code TEXT,
            email_change_expires_at TIMESTAMP,
            reset_token TEXT,
            reset_expires_at TIMESTAMP,
            balance REAL DEFAULT 0.0,
            hold_balance REAL DEFAULT 0.0,
            referral_code TEXT UNIQUE NOT NULL,
            referred_by INTEGER,
            is_active INTEGER DEFAULT 1,
            is_banned INTEGER DEFAULT 0,
            ban_reason TEXT,
            warning_strikes INTEGER DEFAULT 0,
            trust_score REAL DEFAULT 100.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_ip TEXT DEFAULT '127.0.0.1',
            FOREIGN KEY (referred_by) REFERENCES users (id)
        );
        """)

        # 2. Table Comptes Réseaux Sociaux (Instagram, Telegram, YouTube, TikTok, etc.)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS social_accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            platform TEXT NOT NULL, -- 'instagram', 'telegram', 'youtube', 'tiktok', 'twitter', 'vk', 'website'
            account_identifier TEXT NOT NULL,
            account_url TEXT,
            status TEXT DEFAULT 'verified', -- 'verified', 'approved', 'pending', 'invalid', 'restricted'
            verification_token TEXT,
            is_default INTEGER DEFAULT 0,
            ai_attempts INTEGER DEFAULT 0,
            followers_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            UNIQUE(user_id, platform, account_identifier)
        );
        """)

        # 3. Table Campagnes & Tâches Créées par les Annonceurs
        cur.execute("""
        CREATE TABLE IF NOT EXISTS campaigns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            advertiser_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            platform TEXT NOT NULL,
            action_type TEXT NOT NULL, -- 'follow', 'like', 'comment', 'view', 'join', 'surf'
            target_url TEXT NOT NULL,
            reward_per_action REAL NOT NULL, -- Rémunération versée au worker (ex: $0.005)
            cost_per_action REAL NOT NULL,   -- Coût facturé à l'annonceur (ex: $0.008)
            target_quantity INTEGER NOT NULL,
            completed_quantity INTEGER DEFAULT 0,
            total_budget REAL NOT NULL,
            remaining_budget REAL NOT NULL,
            status TEXT DEFAULT 'active', -- 'active', 'paused', 'completed', 'cancelled'
            min_account_age_days INTEGER DEFAULT 0,
            cooldown_seconds INTEGER DEFAULT 60,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (advertiser_id) REFERENCES users (id) ON DELETE CASCADE
        );
        """)

        # 4. Table Exécutions des Tâches par les Travailleurs (Worker Executions)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS task_executions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            campaign_id INTEGER NOT NULL,
            worker_id INTEGER NOT NULL,
            social_account_id INTEGER,
            status TEXT DEFAULT 'claimed', -- 'claimed', 'submitted', 'verified', 'rejected', 'abandoned'
            claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            submitted_at TIMESTAMP,
            verified_at TIMESTAMP,
            reward_amount REAL NOT NULL,
            proof_type TEXT DEFAULT 'api_check', -- 'api_check', 'screenshot', 'token', 'surf_time'
            proof_data TEXT,
            rejection_reason TEXT,
            fraud_score REAL DEFAULT 0.0,
            ip_address TEXT,
            FOREIGN KEY (campaign_id) REFERENCES campaigns (id) ON DELETE CASCADE,
            FOREIGN KEY (worker_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (social_account_id) REFERENCES social_accounts (id)
        );
        """)

        # 5. Grand Livre Comptable / Transactions Financières
        cur.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL, -- 'task_reward', 'campaign_funding', 'withdrawal', 'deposit', 'referral_commission', 'penalty'
            amount REAL NOT NULL,
            balance_after REAL NOT NULL,
            status TEXT DEFAULT 'completed', -- 'completed', 'pending', 'rejected'
            reference_id TEXT,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
        """)

        # 6. Journal de Sécurité Anti-Fraude (Sentinel)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS anti_fraud_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            event_type TEXT NOT NULL, -- 'speed_hack', 'duplicate_proof', 'ip_mismatch', 'invalid_signature'
            severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
            details TEXT,
            ip_address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # 7. Paramètres Système Globaux
        cur.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            description TEXT
        );
        """)

        # 8. Tickets de Support
        cur.execute("""
        CREATE TABLE IF NOT EXISTS support_tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            subject TEXT NOT NULL,
            category TEXT DEFAULT 'general',
            status TEXT DEFAULT 'open',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
        """)

        cur.execute("""
        CREATE TABLE IF NOT EXISTS support_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket_id INTEGER NOT NULL,
            sender_id INTEGER NOT NULL,
            is_staff INTEGER DEFAULT 0,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ticket_id) REFERENCES support_tickets (id) ON DELETE CASCADE
        );
        """)

        # 9. Tables Idempotence Webhooks, Audit Admin & Migrations Versionnées
        cur.execute("""
        CREATE TABLE IF NOT EXISTS webhook_events (
            event_id TEXT PRIMARY KEY,
            tx_id INTEGER,
            amount REAL,
            currency TEXT DEFAULT 'USD',
            processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        cur.execute("""
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            actor_id INTEGER,
            action TEXT NOT NULL,
            target_type TEXT,
            target_id INTEGER,
            details TEXT,
            ip_address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        cur.execute("""
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        for col_sql in (
            "ALTER TABLE social_accounts ADD COLUMN is_default INTEGER DEFAULT 0",
            "ALTER TABLE social_accounts ADD COLUMN ai_attempts INTEGER DEFAULT 0",
            "ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0",
            "ALTER TABLE users ADD COLUMN email_verify_token TEXT",
            "ALTER TABLE users ADD COLUMN email_verify_expires_at TIMESTAMP",
            "ALTER TABLE users ADD COLUMN email_verify_sent_at TIMESTAMP",
            "ALTER TABLE users ADD COLUMN pending_email TEXT",
            "ALTER TABLE users ADD COLUMN email_change_code TEXT",
            "ALTER TABLE users ADD COLUMN email_change_expires_at TIMESTAMP",
            "ALTER TABLE users ADD COLUMN reset_token TEXT",
            "ALTER TABLE users ADD COLUMN reset_expires_at TIMESTAMP",
            "ALTER TABLE transactions ADD COLUMN currency TEXT DEFAULT 'USD'",
        ):
            try:
                cur.execute(col_sql)
            except sqlite3.OperationalError:
                pass

        conn.commit()
        _run_migrations(conn)
        conn.close()

def _run_migrations(conn: sqlite3.Connection):
    """Exécute les migrations versionnées (compatibles avec les anciennes bases SQLite)."""
    cur = conn.cursor()
    applied = {r[0] for r in cur.execute("SELECT version FROM schema_migrations").fetchall()}

    # Migration 1 : Contrainte CHECK(role IN ('worker', 'advertiser', 'admin')) sur anciennes tables users
    if 1 not in applied:
        row = cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'").fetchone()
        if row and row[0] and "CHECK" not in row[0].upper():
            cols = [r[1] for r in cur.execute("PRAGMA table_info(users)").fetchall()]
            col_list = ", ".join(cols)
            cur.execute("PRAGMA foreign_keys = OFF;")
            try:
                cur.execute("BEGIN;")
                cur.execute("""
                CREATE TABLE users_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    username TEXT UNIQUE NOT NULL,
                    hashed_password TEXT NOT NULL,
                    role TEXT DEFAULT 'worker' CHECK(role IN ('worker', 'advertiser', 'admin')),
                    email_verified INTEGER DEFAULT 0,
                    email_verify_token TEXT,
                    email_verify_expires_at TIMESTAMP,
                    email_verify_sent_at TIMESTAMP,
                    pending_email TEXT,
                    email_change_code TEXT,
                    email_change_expires_at TIMESTAMP,
                    reset_token TEXT,
                    reset_expires_at TIMESTAMP,
                    balance REAL DEFAULT 0.0,
                    hold_balance REAL DEFAULT 0.0,
                    referral_code TEXT UNIQUE NOT NULL,
                    referred_by INTEGER,
                    is_active INTEGER DEFAULT 1,
                    is_banned INTEGER DEFAULT 0,
                    ban_reason TEXT,
                    warning_strikes INTEGER DEFAULT 0,
                    trust_score REAL DEFAULT 100.0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_ip TEXT DEFAULT '127.0.0.1',
                    FOREIGN KEY (referred_by) REFERENCES users (id)
                );
                """)
                cur.execute(f"INSERT INTO users_new ({col_list}) SELECT {col_list} FROM users;")
                cur.execute("DROP TABLE users;")
                cur.execute("ALTER TABLE users_new RENAME TO users;")
                cur.execute("COMMIT;")
            except Exception:
                cur.execute("ROLLBACK;")
                raise
            finally:
                cur.execute("PRAGMA foreign_keys = ON;")
        cur.execute("INSERT OR IGNORE INTO schema_migrations (version, name) VALUES (1, '001_users_role_check')")
        conn.commit()

def query_one(query: str, params: tuple = ()) -> Optional[Dict[str, Any]]:
    """Exécute une requête et renvoie une ligne sous forme de dictionnaire."""
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute(query, params)
        row = cur.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()

def query_all(query: str, params: tuple = ()) -> List[Dict[str, Any]]:
    """Exécute une requête et renvoie toutes les lignes sous forme de dictionnaires."""
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute(query, params)
        rows = cur.fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()

def execute_commit(query: str, params: tuple = ()) -> int:
    """Exécute une commande d'écriture avec verrou et renvoie le lastrowid."""
    with _lock:
        conn = get_db_connection()
        try:
            cur = conn.cursor()
            cur.execute(query, params)
            conn.commit()
            return cur.lastrowid
        finally:
            conn.close()
