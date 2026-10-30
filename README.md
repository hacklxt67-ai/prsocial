# 🚀 PR.Social Bot - Automatisation PC & Android Termux

Solution complète d'automatisation intelligente pour **PR.Social**, compatible avec les ordinateurs **Windows** et les smartphones **Android (Termux)**.

---

## 📱 1. Guide Rapide Android (Termux)

Faites tourner le bot 24h/24 directement sur votre téléphone Android sans laisser votre PC allumé.

### ⚡ A. Installation Complète en 1 Ligne (Premier Démarrage)
Ouvrez l'application **Termux** et collez cette commande unique :

```bash
pkg update -y && pkg install -y git && git clone https://github.com/hacklxt67-ai/prsocial.git && cd prsocial/termux_bot && bash install_termux.sh
```

Cette commande installe automatiquement :
- L'environnement Linux Debian ARM64 (`proot-distro`).
- Python 3, Selenium, Requests, Pillow.
- Chromium Headless et Chromedriver adaptés à Android.
- Les lanceurs rapides `~/lancer_bot.sh` et `~/recuperer_rejets.sh`.

---

### 🎮 B. Commandes de Lancement

Depuis Termux, vous disposez de deux commandes directes :

#### 1. Menu Principal Complet
```bash
./lancer_bot.sh
```
Ce menu interactif propose :
- **`[1]` Start Tout** : Démarre l'exécution continue de toutes les tâches courantes avec déblocage auto des tâches orphelines.
- **`[2]` Récupérer & Réessayer les Tâches Rejetées** : Analyse vos tâches rejetées, filtre les motifs et les réexécute en Mode Strict.
- **`[3]` Comptes Liés** : Affiche vos profils approuvés sur PR.Social.
- **`[4]` Changer de Cookie / Déconnexion** : Réinitialise la session pour changer de compte.
- **`[5]` Quitter Bot**

#### 2. Récupération Directe 1-Clic des Tâches Rejetées
Pour relancer directement la récupération des rejets sans passer par le bot classique :
```bash
./recuperer_rejets.sh
```

---

### 🔄 C. Forcer la Mise à Jour sur Termux
Copiez et collez cette commande dans **Termux** pour synchroniser instantanément le bot avec les dernières nouveautés de GitHub :

```bash
cd ~/prsocial && git fetch origin && git reset --hard origin/main && cd termux_bot && bash install_termux.sh
```

---

### 🔋 D. Laisser Tourner le Bot 24h/24 Écran Éteint
Pour empêcher Android de mettre Termux en veille :
1. Dans Termux, tapez :
   ```bash
   termux-wake-lock
   ```
2. Dans les paramètres Android de votre téléphone :
   - *Paramètres > Applications > Termux > Batterie > Choisir "Non restreinte"*.

---

## ☁️ 2. Hébergement 24h/24 Gratuit sur GitHub Actions

Vous pouvez faire tourner le bot **100% en arrière-plan sans laisser aucun appareil allumé** grâce à GitHub Actions.

### 🔑 Configuration en 2 minutes :
1. Sur la page de votre dépôt GitHub, cliquez sur **Settings** (en haut à droite).
2. Dans le menu de gauche, allez dans **Secrets and variables** > **Actions**.
3. Cliquez sur le bouton vert **New repository secret**.
4. Définissez :
   - **Name** : `PR_TOKEN`
   - **Secret** : Collez votre Cookie ou Token de session PR.Social.
5. *(Optionnel)* Créez un second secret `PR_CF_CLEARANCE` si votre compte utilise la protection Cloudflare.

### 🚀 Fonctionnement :
- **Automatique 24h/24** : GitHub Actions lance automatiquement le bot toutes les 25 minutes pour récupérer vos gains.
- **Lancement Manuel 1-Clic** : Allez dans l'onglet **Actions** sur GitHub > cliquez sur **PR.Social 24/7 Automation Bot** > **Run workflow**.

---

## 💻 3. Guide Rapide PC (Windows)

### ⚡ Installation Rapide des Dépendances
Double-cliquez sur :
```text
INSTALLER_DEPENDANCES_PC.cmd
```
Ce script vérifie Python, installe les bibliothèques (`selenium`, `customtkinter`, `requests`, `Pillow`) et vérifie Google Chrome.

### 🎮 Lancement sur PC
- **Interface Graphique Moderne (GUI)** : double-cliquez sur `LANCER_PR_SOCIAL_PC.bat`
- **Menu Terminal Interactif** : double-cliquez sur `LANCER_MENU_TERMINAL.bat`
- **Récupération des Tâches Rejetées** : double-cliquez sur `RECUPERER_REJETS.bat`
- **Mode 100% Silencieux / Arrière-Plan** : double-cliquez sur `LANCER_BOT_PUR_HTTP.bat`

---

## 🛡️ Fonctionnalités & Sécurité Anti-Ban

- **Moteur de Récupération Strict des Tâches Rejetées** : Diagnostic précis (screenshot dupliqué, compte non lié, etc.) et réexécution sécurisée.
- **Preuve Visuelle HD à Hash Unique** : Modification perceptuelle invisible pour éviter tout rejet pour "capture dupliquée".
- **Rotation Dynamique des User-Agents & Client Hints (Sec-CH-UA)** : Empreintes de navigateur réalistes alternées périodiquement.
- **Déblocage Automatique des Tâches Orphelines** : Annulation proactive des tâches bloquantes pour ne jamais geler le bot.
- **Interleaving Intelligent** : Alternance dynamique des actions (Follow, Like, Comment) et radar de présence de tâches sur le serveur.
- **Multi-Réseaux Pris en Charge** : Threads, Reddit, Pinterest, SoundCloud, Bluesky, TikTok, Instagram, YouTube, Facebook, LinkedIn, Twitter, Telegram, Spotify, Snapchat, Discord, GitHub.

---

## 🌐 4. Serveur de Licences & Administration Web (SaaS)

Pour commercialiser l'accès au bot (2 USD / 7 jours via MVola & USDT) :

### 🚀 Lancement Rapide du Serveur
Double-cliquez sur :
```text
LANCER_SERVEUR_LICENCE.bat
```
- **Dashboard Web Administrateur** : `http://127.0.0.1:8000`
- **Documentation API Interactive (Swagger)** : `http://127.0.0.1:8000/docs`
- **Identifiants Admin par défaut** : `admin` / `Admin1234!`

### ✨ Fonctionnalités Administrateur
- **Génération de Clés 1-Clic** : Créez des clés de licence hebdomadaires (format `PR-XXXX-XXXX-XXXX`).
- **Verrouillage Matériel (Device ID)** : Chaque licence est automatiquement liée au smartphone de l'acheteur.
- **Validation des Paiements MVola & USDT** : Validez les références de transaction en un clic pour générer ou prolonger l'accès du client.
- **Prolongation Intelligente (+7 jours)** : Ajout automatique de 7 jours à la date d'expiration pour les renouvellements anticipés.

