# 🚀 PR.Social Bot v3.2 - Automatisation Windows & Android Termux

Solution complète d'automatisation intelligente et silencieuse pour **PR.Social**, 100% compatible avec les ordinateurs **Windows** et les smartphones **Android (Termux)**.

---

## 💻 1. Guide d'Installation & Démarrage sur Windows (Débutant)

### Étape 1 : Prérequis
- Installez **Python 3.10+** depuis le site officiel [python.org](https://www.python.org/downloads/).
- ⚠️ **Important :** Lors de l'installation, cochez bien la case **"Add Python to PATH"**.

### Étape 2 : Installation en 1 Clic
1. Téléchargez ou clonez le projet dans un dossier sur votre PC.
2. Double-cliquez sur le fichier :
   ```cmd
   INSTALLER_WINDOWS.bat
   ```
   *Ce script vérifie Python, installe automatiquement `requests` et `Pillow`, et prépare votre fichier de configuration.*

### Étape 3 : Lancement du Bot
Double-cliquez simplement sur :
```cmd
LANCER_BOT_WINDOWS.bat
```
Ou dans un terminal :
```cmd
python run_bot.py
```

---

## 📱 2. Guide d'Installation sur Android (Termux)

Faites tourner le bot 24h/24 directement sur votre smartphone sans laisser votre PC allumé.

### ⚡ Installation Complète en 1 Ligne (Pour Débutant)
Ouvrez l'application **Termux** et collez cette commande unique :

```bash
pkg update -y && pkg install -y git python python-pillow && git clone https://github.com/hacklxt67-ai/prsocial.git && cd prsocial && pip install -r requirements.txt && python run_bot.py
```

### 🔄 Mise à Jour Rapide & Relance (Pour Utilisateur Déjà Installé)
Si vous avez déjà cloné le projet sur Termux, tapez simplement :

```bash
cd ~/prsocial && git pull && python run_bot.py
```

### 🎮 Lancement Quotidien sur Termux
Depuis le dossier `prsocial`, lancez :
```bash
./lancer_termux.sh
```
Ou :
```bash
python run_bot.py
```

---

## 🔋 3. Tourner 24h/24 Écran Éteint sur Téléphone (Termux)

Pour empêcher Android de mettre Termux en veille :
1. Dans Termux, activez le maintien en éveil :
   ```bash
   termux-wake-lock
   ```
2. Dans les paramètres Android de votre téléphone :
   - *Paramètres > Applications > Termux > Batterie > Choisir "Non restreinte"*.

---

## 📋 4. Fonctionnalités & Menu v3.2

```text
  ╔══ ⚡MENU PRINCIPAL · MODE SILENCIEUX (v3.2) ═══════════════════════╗
  ║                                                                    ║
  ║  [ 1 ] 🚀 START        Lancer (Tâches Réseaux Sociaux)             ║
  ║  [ 2 ] ⚡ TG WORKER    PR Worker Telegram (Lancer / Lier Compte)   ║
  ║  [ 3 ] 🔑 TOKEN        Changer / Vérifier Token PR.Social          ║
  ║  [ 4 ] 🌐 SURF WEBSITE  Auto-Surfeur (Sites Web)                   ║
  ║  [ 5 ] 🔄 RÉCUPÉRER    Scanner & Réessayer Tâches Rejetées         ║
  ║  [ 6 ] 📷 COOKIE INSTA Coller / Activer Cookie Instagram (APK)     ║
  ║  [ 7 ] 🛠️  AUTO-FIX     Auto-Complétion Profils (Anti-Ban)         ║
  ║  [ 8 ] ❌ EXIT         Fermer                                      ║
  ║                                                                    ║
  ╚════════════════════════════════════════════════════════════════════╝
```

- **Option [ 1 ] START (Sous-menu ciblé) :**
  - `[ 1 ] 📷 Instagram Seul` : Actions directes et indépendantes via Cookie Instagram.
  - `[ 2 ] 🌐 Tous Réseaux Sociaux` : Traite tous les réseaux (YouTube, Twitter/X, TikTok, Threads, Reddit, etc.) **sauf** Instagram.
  - `[ 3 ] ⚡ Mix Total` : Traite tous les réseaux y compris Instagram.
- **Option [ 2 ] TG WORKER :**
  - `[ 1 ] 🚀 Lancer le Worker` : Exécution ultra-rapide des tâches Telegram (0s de délai).
  - `[ 2 ] ✈️ Associer Compte Telegram` : Lier votre compte Telegram facilement.
- **Vérification Stricte Anti-Rejet :**
  - Preuves certifiées d'écran WebP optimisées avec horodatage et hash anti-doublon.
  - Protection automatique contre l'annulation des tâches en cours de vérification.
  - Bouclier anti-quarantaine et détection des pauses de sécurité.

---

## 🔒 5. Sécurité des Identifiants

- Vos cookies et jetons d'accès restent stockés localement dans votre fichier `config.json` sur votre appareil.
- Le fichier `config.json` est automatiquement ignoré par `.gitignore` pour éviter toute fuite accidentelle sur GitHub.
