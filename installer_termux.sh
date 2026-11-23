#!/bin/bash
# ==============================================================================
# Script d'installation automatique pour Android Termux
# ==============================================================================
set -e

echo -e "\033[1;36m========================================================\033[0m"
echo -e "\033[1;36m  🚀 PR.Social Bot v3.2 - Installation Rapide Termux\033[0m"
echo -e "\033[1;36m========================================================\033[0m"
echo ""

echo -e "\033[1;33m[1/3] Mise à jour et paquets Termux...\033[0m"
pkg update -y
pkg install -y python python-pillow git

echo -e "\033[1;33m[2/3] Installation des dépendances Python...\033[0m"
pip install --upgrade pip
pip install -r requirements.txt

echo -e "\033[1;33m[3/3] Préparation du fichier de configuration...\033[0m"
if [ ! -f "config.json" ] && [ -f "config.example.json" ]; then
    cp config.example.json config.json
    echo "[OK] Fichier config.json initialisé."
fi

chmod +x lancer_termux.sh 2>/dev/null || true
chmod +x installer_termux.sh 2>/dev/null || true

echo ""
echo -e "\033[1;32m========================================================\033[0m"
echo -e "\033[1;32m  ✓ Installation terminée ! Lancez : ./lancer_termux.sh\033[0m"
echo -e "\033[1;32m========================================================\033[0m"
