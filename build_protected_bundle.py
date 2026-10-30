import os
import sys
import zlib
import base64
import random
import hashlib

def xor_encrypt(data: bytes, key: int) -> bytes:
    return bytes([b ^ key for b in data])

def build_single_file_obfuscated(output_path: str):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    termux_dir = os.path.join(base_dir, "termux_bot")

    modules_to_bundle = [
        ("user_agents", os.path.join(termux_dir, "user_agents.py")),
        ("pr_api", os.path.join(termux_dir, "pr_api.py")),
        ("license_client", os.path.join(termux_dir, "license_client.py")),
        ("browser_termux", os.path.join(termux_dir, "browser_termux.py")),
        ("rejected_tasks_manager", os.path.join(termux_dir, "rejected_tasks_manager.py")),
    ]

    main_script_path = os.path.join(termux_dir, "termux_action_engine.py")

    bundle_dict = {}

    for mod_name, file_path in modules_to_bundle:
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                code = f.read()
                bundle_dict[mod_name] = code
        else:
            print(f"Warning: Module file {file_path} not found.")

    with open(main_script_path, "r", encoding="utf-8") as f:
        main_code = f.read()

    # Structure du bundle JSON / dict encodé
    import json
    raw_payload = json.dumps({
        "modules": bundle_dict,
        "main": main_code
    }).encode("utf-8")

    # Étape 1 : Compression zlib niveau 9 (maximum)
    compressed = zlib.compress(raw_payload, 9)

    # Étape 2 : Chiffrement par clé XOR dynamique
    xor_key = random.randint(33, 222)
    encrypted = xor_encrypt(compressed, xor_key)

    # Étape 3 : Double encodage Base85 / Base64 pour éliminer tout motif lisible
    b85 = base64.b85encode(encrypted)
    b64 = base64.b64encode(b85).decode("ascii")

    # Hash d'intégrité anti-falsification (SHA256)
    sig = hashlib.sha256(b64.encode("ascii")).hexdigest()

    # Découpage en blocs pour éviter de trop longues lignes
    chunk_size = 120
    chunks = [b64[i:i+chunk_size] for i in range(0, len(b64), chunk_size)]
    payload_str = "\n".join([f"    '{c}'" for c in chunks])

    # Template du chargeur ultra-obfusqué
    stub = f'''# -*- coding: utf-8 -*-
"""
================================================================================
   PR.SOCIAL ANDROID TERMUX OFFICIAL CLIENT • PROTECTED BINARY DISTRIBUTION
   (C) 2026 PR.SOCIAL ALL RIGHTS RESERVED.
   UNAUTHORIZED DECOMPILATION, MODIFICATION OR REDISTRIBUTION IS FORBIDDEN.
================================================================================
"""
import sys
import types
import zlib
import json
import base64
import hashlib

_K = {xor_key}
_S = "{sig}"
_P = (
{payload_str}
)

def _boot():
    raw_b64 = "".join(_P.split())
    if hashlib.sha256(raw_b64.encode("ascii")).hexdigest() != _S:
        sys.stderr.write("\\n[ERROR] Integrity check failed. File has been tampered with or corrupted.\\n")
        sys.exit(1)
    
    try:
        raw_b85 = base64.b64decode(raw_b64)
        enc = base64.b85decode(raw_b85)
        comp = bytes([b ^ _K for b in enc])
        data = json.loads(zlib.decompress(comp).decode("utf-8"))
    except Exception as e:
        sys.stderr.write(f"\\n[FATAL] Loader execution error: {{e}}\\n")
        sys.exit(1)

    # Injection en mémoire des sous-modules
    for mod_name, mod_src in data.get("modules", {{}}).items():
        m = types.ModuleType(mod_name)
        m.__file__ = f"<prsocial_{{mod_name}}>"
        sys.modules[mod_name] = m
        code_obj = compile(mod_src, f"<prsocial_{{mod_name}}>", "exec")
        exec(code_obj, m.__dict__)

    # Exécution sécurisée du programme principal
    main_src = data.get("main", "")
    main_mod = types.ModuleType("__main__")
    main_mod.__file__ = "<prsocial_core>"
    code_main = compile(main_src, "<prsocial_core>", "exec")
    exec(code_main, main_mod.__dict__)

if __name__ == "__main__":
    _boot()
'''

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(stub)

    print(f"Obfuscated single-file distribution generated at: {output_path}")
    print(f"File size: {os.path.getsize(output_path)} bytes")

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist_public", "bot.py")
    build_single_file_obfuscated(out)
