#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PR.Social Bot v3.2 - Lanceur Universel Intelligent
Détecte automatiquement l'environnement (Windows / PC vs Android Termux)
et lance le moteur optimal adapté avec son interface propre.
"""
import os
import sys

def is_termux() -> bool:
    if os.path.exists("/data/data/com.termux"):
        return True
    if "TERMUX_VERSION" in os.environ or "PREFIX" in os.environ:
        return True
    return False

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    if root_dir not in sys.path:
        sys.path.insert(0, root_dir)

    if is_termux():
        print("\033[1;36m[DÉTECTION]\033[0m Environnement Android Termux détecté.")
        try:
            from termux_bot.termux_action_engine import main as termux_main
            termux_main()
        except ImportError:
            # Repli sur le moteur http_action_engine universel
            from pc_bot.http_action_engine import main as pc_main
            pc_main()
    else:
        # Environnement Windows / Linux / macOS PC
        from pc_bot.http_action_engine import main as pc_main
        pc_main()

if __name__ == "__main__":
    main()
