#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
   PR.SOCIAL ULTRA-ARMORED OBFUSCATION & SELF-DESTRUCT COMPILER
   Générateur d'exécutable unique avec :
   - Auto-destruction physique du fichier en cas de tentative de décodage / dump
   - Chiffrement non-linéaire (Nibble-Swap + S-Box + CBC Rolling Keystream)
   - Bouclier Anti-Hooking, Anti-Traçage, Anti-Débogueur et Anti-Désassembleur
   - Dérivation mathématique polynomiale des clés (zéro clé statique)
   - Nettoyage AST complet (suppression docstrings, commentaires, types)
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
    """Purge absolue de tous les docstrings, annotations et métadonnées du code."""
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

def compute_polynomial_seed() -> int:
    """Génère une graine maîtresse dérivée d'un polynôme complexe."""
    raw = sum([(i**3 * 83 + i**2 * 47 + 109) % 251 for i in range(24)]) * 65539 + 784321
    return raw & 0x7FFFFFFF

def generate_sbox(seed: int):
    rng = random.Random(seed)
    sbox = list(range(256))
    rng.shuffle(sbox)
    inv_sbox = [0] * 256
    for i, v in enumerate(sbox):
        inv_sbox[v] = i
    return sbox, inv_sbox

def rolling_armored_encrypt(data: bytes, master_seed: int) -> bytes:
    sbox, _ = generate_sbox(master_seed)
    # Étape 1 : Substitution S-Box + Inversion des Nibbles (4-bits) + Rotation binaire 3-bits
    stage1 = bytearray(len(data))
    for i, b in enumerate(data):
        sub = sbox[b]
        nib = ((sub & 0x0F) << 4) | ((sub & 0xF0) >> 4)
        stage1[i] = ((nib << 3) | (nib >> 5)) & 0xFF

    # Étape 2 : Chiffrement dynamique par chaîne de blocs (CBC Rolling Keystream)
    out = bytearray(len(stage1))
    prev = (master_seed & 0xFF)
    for i, b in enumerate(stage1):
        h = hashlib.sha256(bytes([prev, (i * 47) & 0xFF, (master_seed >> 9) & 0xFF])).digest()
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
        ("license_manager", os.path.join(pc_dir, "license_manager.py")),
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

    # 3. Graine maîtresse polynomiale et chiffrement renforcé
    master_seed = compute_polynomial_seed()
    encrypted = rolling_armored_encrypt(compressed, master_seed)

    # 4. Double encodage Base85 + Base64
    b85 = base64.b85encode(encrypted)
    b64 = base64.b64encode(b85).decode("ascii")

    # 5. Empreinte SHA-384 ultra-stricte
    sig = hashlib.sha384(b64.encode("ascii")).hexdigest()

    # Découpage en blocs de 115 caractères
    chunk_size = 115
    chunks = [b64[i:i+chunk_size] for i in range(0, len(b64), chunk_size)]
    payload_str = "\n".join([f"    '{c}'" for c in chunks])

    # 6. Template du chargeur avec AUTO-DESTRUCTION PHYSIQUE & SÉCURITÉS C-LIKE
    stub = f'''# -*- coding: utf-8 -*-
"""
================================================================================
   PR.SOCIAL HIGH-SECURITY COMPILED RUNTIME • HARDENED ANTI-REVERSE ARCHITECTURE
   (C) 2026 PR.SOCIAL ALL RIGHTS RESERVED.
   DIGITAL RIGHTS PROTECTED UNDER TAMPER RESISTANT ARMORED VIRTUALIZATION.
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

# ==============================================================================
# PROTOCOLE D'AUTO-DESTRUCTION PHYSIQUE DU FICHIER EN CAS D'ANOMALIE OU DÉCODAGE
# ==============================================================================
def _0x_shred():
    try:
        _tgt = os.path.abspath(__file__)
        if os.path.exists(_tgt):
            _sz = max(os.path.getsize(_tgt), 8192)
            # 1. Écrasement immédiat avec du bruit binaire aléatoire
            with open(_tgt, "wb") as _f:
                _f.write(os.urandom(_sz))
                _f.flush()
                try:
                    os.fsync(_f.fileno())
                except Exception:
                    pass
            # 2. Suppression physique directe
            try:
                os.remove(_tgt)
            except Exception:
                with open(_tgt, "w") as _f:
                    _f.truncate(0)
    except Exception:
        pass
    os._exit(137)

# [GARDE 1] Vérification de non-altération des primitives natives builtins
if not isinstance(builtins.exec, types.BuiltinFunctionType) or getattr(builtins.exec, "__name__", "") != "exec":
    _0x_shred()

if not isinstance(builtins.compile, types.BuiltinFunctionType) or getattr(builtins.compile, "__name__", "") != "compile":
    _0x_shred()

# [GARDE 2] Détection active des débogueurs, traçages ou désassembleurs
if hasattr(sys, "gettrace") and sys.gettrace() is not None:
    _0x_shred()

for _bad_mod in ["pdb", "bdb", "dis", "inspect", "pydevd", "debugpy", "uncompyle6", "decompyle"]:
    if _bad_mod in sys.modules:
        _0x_shred()

# [DÉRIVATION DYNAMIQUE DE LA CLÉ MAÎTRESSE]
_K = sum([(i**3 * 83 + i**2 * 47 + 109) % 251 for i in range(24)]) * 65539 + 784321 & 0x7FFFFFFF
_S = "{sig}"
_P = (
{payload_str}
)

def _boot():
    # [GARDE 3] Contrôle d'intégrité SHA-384 scellé
    _raw_b64 = "".join(_P.split())
    if hashlib.sha384(_raw_b64.encode("ascii")).hexdigest() != _S:
        _0x_shred()

    try:
        _raw_b85 = base64.b64decode(_raw_b64)
        _enc = base64.b85decode(_raw_b85)

        # [RECONSTITUTION DE LA S-BOX INVERSE]
        import random as _rnd
        _rng = _rnd.Random(_K)
        _sbox = list(range(256))
        _rng.shuffle(_sbox)
        _inv_sbox = [0] * 256
        for _i, _v in enumerate(_sbox):
            _inv_sbox[_v] = _i

        # [DÉ-CHAÎNAGE CBC ROLLING KEYSTREAM]
        _stage1 = bytearray(len(_enc))
        _prev = (_K & 0xFF)
        for _i, _b in enumerate(_enc):
            _h = hashlib.sha256(bytes([_prev, (_i * 47) & 0xFF, (_K >> 9) & 0xFF])).digest()
            _stage1[_i] = _b ^ _h[_i % 32]
            _prev = _b

        # [INVERSION BIT-ROTATION & NIBBLE-SWAP]
        _dec = bytearray(len(_stage1))
        for _i, _b in enumerate(_stage1):
            _rot_rev = ((_b >> 3) | (_b << 5)) & 0xFF
            _nib_rev = ((_rot_rev & 0x0F) << 4) | ((_rot_rev & 0xF0) >> 4)
            _dec[_i] = _inv_sbox[_nib_rev]

        _comp = bytes(_dec)
        _data = json.loads(zlib.decompress(_comp).decode("utf-8"))
    except Exception:
        # En cas d'erreur de décodage ou manipulation illégitime -> auto-destruction
        _0x_shred()

    # [PURGE RAM IMMÉDIATE DES VECTEURS DE DÉCHIFFREMENT]
    del _stage1, _dec, _comp, _enc, _raw_b85, _raw_b64, _sbox, _inv_sbox
    gc.collect()

    # [INJECTION SÉCURISÉE EN DEUX PHASES DANS SYS.MODULES]
    _modules = _data.get("modules", {{}})
    _pc_pkg = types.ModuleType("pc_bot")
    _pc_pkg.__path__ = []
    sys.modules["pc_bot"] = _pc_pkg
    _termux_pkg = types.ModuleType("termux_bot")
    _termux_pkg.__path__ = []
    sys.modules["termux_bot"] = _termux_pkg

    _mod_objs = {{}}
    for _mod_name in _modules:
        _m = types.ModuleType(_mod_name)
        _m.__file__ = f"<prsocial_armored_{{_mod_name}}>"
        _m.__package__ = "pc_bot"
        sys.modules[_mod_name] = _m
        sys.modules[f"pc_bot.{{_mod_name}}"] = _m
        setattr(_pc_pkg, _mod_name, _m)
        sys.modules[f"termux_bot.{{_mod_name}}"] = _m
        setattr(_termux_pkg, _mod_name, _m)
        _mod_objs[_mod_name] = _m

    for _mod_name, _mod_src in _modules.items():
        _code_obj = compile(_mod_src, f"<prsocial_armored_{{_mod_name}}>", "exec")
        exec(_code_obj, _mod_objs[_mod_name].__dict__)

    # [EXÉCUTION DU MOTEUR PRINCIPAL DANS UN FRAME ISOLE]
    _main_src = _data.get("main", "")
    del _data, _modules
    gc.collect()

    _main_mod = types.ModuleType("__main__")
    _main_mod.__file__ = "<prsocial_core_runtime>"
    _code_main = compile(_main_src, "<prsocial_core_runtime>", "exec")
    exec(_code_main, _main_mod.__dict__)

if __name__ == "__main__":
    _boot()
'''

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(stub)

    print(f"\n========================================================")
    print(f"[SUCCESS] Ultra-Armored self-destructing binary generated at:")
    print(f"  --> {output_path}")
    print(f"  --> File size: {os.path.getsize(output_path)} bytes")
    print(f"  --> Defense mechanism: Self-destruct on tamper / decode")
    print(f"========================================================")

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist_public", "bot.py")
    build_single_file_obfuscated(out)
