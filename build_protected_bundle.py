#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
   PR.SOCIAL SECURE COMPILER & MULTI-LAYER OBFUSCATION ENGINE
   Générateur d'exécutable unique Ultra-Sécurisé Anti-IA & Anti-Décompilation
================================================================================
"""

import os
import sys
import ast
import zlib
import base64
import random
import hashlib
import json
import types

class ASTCleaner(ast.NodeTransformer):
    """Supprime tous les docstrings, annotations et commentaires du code AST."""
    def visit_FunctionDef(self, node):
        self.generic_visit(node)
        node.returns = None
        for arg in node.args.args + node.args.kwonlyargs:
            arg.annotation = None
        if (node.body and isinstance(node.body[0], ast.Expr) and
            isinstance(node.body[0].value, ast.Constant) and
            isinstance(node.body[0].value.value, str)):
            node.body.pop(0)
            if not node.body:
                node.body.append(ast.Pass())
        return node

    def visit_AsyncFunctionDef(self, node):
        return self.visit_FunctionDef(node)

    def visit_ClassDef(self, node):
        self.generic_visit(node)
        if (node.body and isinstance(node.body[0], ast.Expr) and
            isinstance(node.body[0].value, ast.Constant) and
            isinstance(node.body[0].value.value, str)):
            node.body.pop(0)
            if not node.body:
                node.body.append(ast.Pass())
        return node

    def visit_Module(self, node):
        self.generic_visit(node)
        if (node.body and isinstance(node.body[0], ast.Expr) and
            isinstance(node.body[0].value, ast.Constant) and
            isinstance(node.body[0].value.value, str)):
            node.body.pop(0)
        return node

def clean_source_code(source: str) -> str:
    try:
        tree = ast.parse(source)
        cleaner = ASTCleaner()
        cleaned_tree = cleaner.visit(tree)
        ast.fix_missing_locations(cleaned_tree)
        return ast.unparse(cleaned_tree)
    except Exception as e:
        print(f"Warning during AST cleaning: {e}")
        return source

def generate_sbox(seed: int):
    rng = random.Random(seed)
    sbox = list(range(256))
    rng.shuffle(sbox)
    inv_sbox = [0] * 256
    for i, v in enumerate(sbox):
        inv_sbox[v] = i
    return sbox, inv_sbox

def rolling_encrypt(data: bytes, master_seed: int) -> bytes:
    sbox, _ = generate_sbox(master_seed)
    # Étape 1 : Substitution non-linéaire S-Box + Rotation binaire 3-bits
    stage1 = bytearray(len(data))
    for i, b in enumerate(data):
        sub = sbox[b]
        stage1[i] = ((sub << 3) | (sub >> 5)) & 0xFF

    # Étape 2 : Chiffrement par chaînage de blocs dynamique (CBC Rolling Hash Keystream)
    out = bytearray(len(stage1))
    prev = (master_seed & 0xFF)
    for i, b in enumerate(stage1):
        h = hashlib.sha256(bytes([prev, (i * 37) & 0xFF, (master_seed >> 8) & 0xFF])).digest()
        k = h[i % 32]
        enc_b = b ^ k
        out[i] = enc_b
        prev = enc_b
    return bytes(out)

def build_single_file_obfuscated(output_path: str):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    pc_dir = os.path.join(base_dir, "pc_bot")
    termux_dir = os.path.join(base_dir, "termux_bot")

    modules_to_bundle = [
        ("user_agents", os.path.join(termux_dir, "user_agents.py")),
        ("pr_api", os.path.join(pc_dir, "pr_api.py")),
        ("license_client", os.path.join(termux_dir, "license_client.py")),
        ("browser_bot", os.path.join(pc_dir, "browser_bot.py")),
        ("profile_sentinel", os.path.join(pc_dir, "profile_sentinel.py")),
        ("profile_auto_completer", os.path.join(pc_dir, "profile_auto_completer.py")),
        ("rejected_tasks_manager", os.path.join(pc_dir, "rejected_tasks_manager.py")),
    ]

    main_script_path = os.path.join(pc_dir, "http_action_engine.py")

    bundle_dict = {}

    for mod_name, file_path in modules_to_bundle:
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                raw_code = f.read()
                cleaned = clean_source_code(raw_code)
                bundle_dict[mod_name] = cleaned
                print(f"[+] Module bundled & AST cleaned: {mod_name} ({len(cleaned)} chars)")
        else:
            print(f"[-] Warning: Module file {file_path} not found.")

    with open(main_script_path, "r", encoding="utf-8") as f:
        main_raw = f.read()
        main_cleaned = clean_source_code(main_raw)
        print(f"[+] Core engine bundled & AST cleaned: ({len(main_cleaned)} chars)")

    # 1. Sérialisation JSON compacte
    raw_payload = json.dumps({
        "modules": bundle_dict,
        "main": main_cleaned
    }, separators=(',', ':')).encode("utf-8")

    # 2. Compression zlib niveau 9 (maximum)
    compressed = zlib.compress(raw_payload, 9)

    # 3. Graine maîtresse aléatoire et chiffrement dynamique par flux chaîné
    master_seed = random.randint(100000000, 999999999)
    encrypted = rolling_encrypt(compressed, master_seed)

    # 4. Double encodage Base85 + Base64
    b85 = base64.b85encode(encrypted)
    b64 = base64.b64encode(b85).decode("ascii")

    # 5. Empreinte cryptographique d'intégrité SHA-256
    sig = hashlib.sha256(b64.encode("ascii")).hexdigest()

    # Découpage en blocs de 110 caractères
    chunk_size = 110
    chunks = [b64[i:i+chunk_size] for i in range(0, len(b64), chunk_size)]
    payload_str = "\n".join([f"    '{c}'" for c in chunks])

    # 6. Template du chargeur ultra-sécurisé Anti-IA & Anti-Hook
    stub = f'''# -*- coding: utf-8 -*-
"""
================================================================================
   PR.SOCIAL PC & MULTI-PLATFORM BOT • SECURE PRODUCTION RUNTIME
   (C) 2026 PR.SOCIAL ALL RIGHTS RESERVED.
   UNAUTHORIZED DECOMPILATION, ANALYSIS, REDISTRIBUTION OR REVERSE ENGINEERING
   IS STRICTLY PROHIBITED AND PROTECTED BY DIGITAL TAMPER DEFENSES.
================================================================================
"""
import sys
import os
import types
import zlib
import json
import base64
import hashlib
import builtins
import gc

# [DEFENSE 1] Garde Anti-Hooking & Anti-Monkeypatching (Intercepte toute tentative de dump par exec=print)
if not isinstance(builtins.exec, types.BuiltinFunctionType) or getattr(builtins.exec, "__name__", "") != "exec":
    sys.exit(0)

# [DEFENSE 2] Garde Anti-Traçage & Anti-Débogueur
if hasattr(sys, "gettrace") and sys.gettrace() is not None:
    sys.exit(0)

_K = {master_seed}
_S = "{sig}"
_P = (
{payload_str}
)

def _boot():
    # [DEFENSE 3] Vérification d'intégrité anti-falsification
    raw_b64 = "".join(_P.split())
    if hashlib.sha256(raw_b64.encode("ascii")).hexdigest() != _S:
        sys.stderr.write("\\n[FATAL ERROR] Code signature mismatch. Execution aborted.\\n")
        sys.exit(1)

    try:
        raw_b85 = base64.b64decode(raw_b64)
        enc = base64.b85decode(raw_b85)

        # [DEFENSE 4] Inversion cryptographique non-linéaire S-Box & Keystream
        import random as _rnd
        rng = _rnd.Random(_K)
        sbox = list(range(256))
        rng.shuffle(sbox)
        inv_sbox = [0] * 256
        for i, v in enumerate(sbox):
            inv_sbox[v] = i

        stage1 = bytearray(len(enc))
        prev = (_K & 0xFF)
        for i, b in enumerate(enc):
            h = hashlib.sha256(bytes([prev, (i * 37) & 0xFF, (_K >> 8) & 0xFF])).digest()
            k = h[i % 32]
            stage1[i] = b ^ k
            prev = b

        dec = bytearray(len(stage1))
        for i, b in enumerate(stage1):
            rot_rev = ((b >> 3) | (b << 5)) & 0xFF
            dec[i] = inv_sbox[rot_rev]

        comp = bytes(dec)
        data = json.loads(zlib.decompress(comp).decode("utf-8"))
    except Exception:
        sys.stderr.write("\\n[FATAL] Corrupted binary runtime environment.\\n")
        sys.exit(1)

    # [DEFENSE 5] Nettoyage immédiat de la mémoire RAM
    del stage1, dec, comp, enc, raw_b85, raw_b64
    gc.collect()

    # Injection dynamique en deux phases en mémoire vive des sous-modules
    modules = data.get("modules", {{}})
    pc_pkg = types.ModuleType("pc_bot")
    pc_pkg.__path__ = []
    sys.modules["pc_bot"] = pc_pkg
    termux_pkg = types.ModuleType("termux_bot")
    termux_pkg.__path__ = []
    sys.modules["termux_bot"] = termux_pkg

    mod_objs = {{}}
    for mod_name in modules:
        m = types.ModuleType(mod_name)
        m.__file__ = f"<prsocial_core_{{mod_name}}>"
        m.__package__ = "pc_bot"
        sys.modules[mod_name] = m
        sys.modules[f"pc_bot.{{mod_name}}"] = m
        setattr(pc_pkg, mod_name, m)
        sys.modules[f"termux_bot.{{mod_name}}"] = m
        setattr(termux_pkg, mod_name, m)
        mod_objs[mod_name] = m

    for mod_name, mod_src in modules.items():
        code_obj = compile(mod_src, f"<prsocial_core_{{mod_name}}>", "exec")
        exec(code_obj, mod_objs[mod_name].__dict__)

    # Exécution protégée du moteur principal
    main_src = data.get("main", "")
    del data, modules
    gc.collect()

    main_mod = types.ModuleType("__main__")
    main_mod.__file__ = "<prsocial_runtime>"
    code_main = compile(main_src, "<prsocial_runtime>", "exec")
    exec(code_main, main_mod.__dict__)

if __name__ == "__main__":
    _boot()
'''

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(stub)

    print(f"\n========================================================")
    print(f"[SUCCESS] Ultra-protected binary script generated at:")
    print(f"  --> {output_path}")
    print(f"  --> File size: {os.path.getsize(output_path)} bytes")
    print(f"========================================================")

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist_public", "bot.py")
    build_single_file_obfuscated(out)
