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
db_path = os.path.expanduser('~\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Network\\Cookies')

tmp_db = os.path.join(tempfile.gettempdir(), "test_cookies.db")
shutil.copy2(db_path, tmp_db)
conn = sqlite3.connect(tmp_db)
cursor = conn.cursor()

targets = ["instagram.com", "tiktok.com", "youtube.com", "facebook.com", "pr.social"]
for t in targets:
    cursor.execute(f"SELECT host_key, name, encrypted_value FROM cookies WHERE host_key LIKE '%{t}%'")
    rows = cursor.fetchall()
    c_dict = {}
    for host, name, enc in rows:
        val = decrypt_cookie(enc, key)
        if val:
            c_dict[name] = val
    print(f"=== {t.upper()} === ({len(c_dict)} cookies)")
    keys = list(c_dict.keys())
    print("Names:", keys)
    # Check important auth cookies
    if "sessionid" in c_dict:
        print("  -> sessionid FOUND!")
    if "SAPISID" in c_dict:
        print("  -> SAPISID FOUND!")
    if "c_user" in c_dict:
        print("  -> c_user (FB) FOUND!")
conn.close()
os.remove(tmp_db)
