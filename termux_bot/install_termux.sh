#!/data/data/com.termux/files/usr/bin/bash
# ==============================================================================
# Script d'installation automatique pour Termux (Android) - PR.Social Bot
# Option 1 : Proot Debian + Chromium Headless ARM64 + Python Selenium
# ==============================================================================

set -e

echo ""
echo "============================================================"
echo "🚀 Installation de l'environnement PR.Social Bot sur Termux"
echo "============================================================"
echo ""

# 1. Mise à jour des dépôts Termux
echo "[1/5] Mise à jour des paquets Termux..."
pkg update -y && pkg upgrade -y

# 2. Installation des dépendances de base Termux
echo "[2/5] Installation de proot-distro, git et python..."
pkg install -y proot-distro git python tsu

# 3. Installation de Debian via proot-distro
echo "[3/5] Configuration du conteneur Debian Linux..."
if [ -d "$PREFIX/var/lib/proot-distro/installed-rootfs/debian" ] || proot-distro list | grep -q "debian"; then
    echo " -> Debian est déjà installé, passage à la suite."
else
    echo " -> Installation du conteneur Debian..."
    proot-distro install debian || true
fi

# 4. Configuration interne de Debian (Chromium, Chromedriver, Python3, Selenium)
echo "[4/5] Installation de Chromium Headless, Chromedriver et Python dans Debian..."
proot-distro login debian -- bash -c '
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -y || true
    apt-get install -y --no-install-recommends \
        python3 \
        python3-pip \
        python3-requests \
        python3-pil \
        python3-selenium \
        chromium \
        chromium-driver \
        ca-certificates \
        curl || true
    
    # Installation de Selenium fallback si nécessaire
    pip3 install selenium --break-system-packages 2>/dev/null || pip3 install selenium 2>/dev/null || true
    
    # Création des dossiers de travail
    mkdir -p /root/social_bot_data/screenshots
    echo " -> Dépendances Debian installées avec succès !"
'

# 5. Création du lanceur rapide dans Termux
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LAUNCHER="$HOME/lancer_bot.sh"
cat << EOF > "$LAUNCHER"
#!/data/data/com.termux/files/usr/bin/bash
BOT_DIR="$CURRENT_DIR"
if [ ! -d "\$BOT_DIR" ]; then
    if [ -d "\$HOME/prsocial/termux_bot" ]; then
        BOT_DIR="\$HOME/prsocial/termux_bot"
    elif [ -d "\$HOME/pr_social/termux_bot" ]; then
        BOT_DIR="\$HOME/pr_social/termux_bot"
    fi
fi

echo "============================================================"
echo "⚡ Démarrage du PR.Social Bot sous Termux (Android Debian)"
echo "============================================================"
proot-distro login debian --bind "\$BOT_DIR":/root/termux_bot -- bash -c "
    cd /root/termux_bot
    python3 termux_action_engine.py
"
EOF
chmod +x "$LAUNCHER"

echo ""
echo "============================================================"
echo "✅ INSTALLATION TERMUX TERMINÉE AVEC SUCCÈS !"
echo "============================================================"
echo "Pour démarrer votre bot à tout moment dans Termux, tapez :"
echo "   ./lancer_bot.sh"
echo "============================================================"
