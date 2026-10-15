# 📱 Guide d'Utilisation - PR.Social Bot sur Android (Termux)

Ce guide vous explique pas-à-pas comment faire tourner le bot **PR.Social 24h/24 directement sur votre smartphone Android**, sans laisser votre PC allumé.

---

## ⚡ 1. Prérequis sur votre Téléphone Android

1. Téléchargez et installez l'application **Termux** (depuis [F-Droid](https://f-droid.org/fr/packages/com.termux/) de préférence pour avoir la version à jour).
2. Ouvrez l'application **Termux**.

---

## 🚀 2. Installation Automatique en 1 Étape

Dans Termux, copiez et collez la commande suivante pour tout installer automatiquement (Proot Linux Debian, Chromium Headless ARM64, Python, Selenium) :

```bash
pkg update -y && pkg install -y git proot-distro python
```

Ensuite, lancez le script d'installation inclus :
```bash
bash install_termux.sh
```

Le script va automatiquement :
- Configurer l'environnement Linux Debian ARM64.
- Installer Chromium et Chromedriver headless adaptés à Android.
- Installer les modules Python (`selenium`, `requests`, `Pillow`).
- Créer un raccourci direct sur votre écran Termux nommé **`./lancer_bot.sh`**.

---

## 🎮 3. Lancer le Bot

Pour démarrer le bot à tout moment, tapez simplement :
```bash
./lancer_bot.sh
```
ou directement depuis le dossier `termux_bot` :
```bash
python3 termux_action_engine.py
```

Le bot va immédiatement :
1. Se connecter à votre compte PR.Social (`@michelbaggio`).
2. Détecter tous vos réseaux sociaux approuvés (**Threads**, **Reddit**, **TikTok**, **Instagram**, **YouTube**, **Facebook**, etc.).
3. Réclamer les tâches les plus rémunératrices.
4. Effectuer les actions en arrière-plan sans ouvrir aucune fenêtre.
5. Capturer la preuve et soumettre la capture automatiquement.
6. Actualiser votre solde en direct sur votre terminal.

---

## 🛡️ 4. Faire Tourner le Bot en Arrière-Plan H24 (Écran Éteint)

Pour que Termux ne soit pas fermé par la gestion de batterie d'Android quand vous éteignez l'écran :
1. Dans Termux, descendez le volet des notifications Android.
2. Cliquez sur la notification Termux et sélectionnez **`Acquire Wakelock`** (ou tapez la commande `termux-wake-lock`).
3. Dans les paramètres de votre téléphone Android : *Paramètres > Applications > Termux > Batterie > Définir sur "Non restreinte"*.
