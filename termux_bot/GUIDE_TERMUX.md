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

## 🎮 3. Connexion et Lancement du Bot

Pour démarrer le bot à tout moment dans Termux, tapez simplement :
```bash
./lancer_bot.sh
```

### 🔑 A. Première Utilisation (Login Cookie)
1. Au tout premier lancement (ou après déconnexion), le bot affiche :
   `[1] Login Cookie (Coller le Cookie / Token)`
2. Choisissez `1` et collez votre Cookie / Token PR.Social récupéré depuis votre navigateur (`token=eyJ...` ou jeton direct).
3. Le bot vérifie instantanément votre session auprès de PR.Social et **la sauvegarde définitivement**.

### ⚡ B. Connexion Automatique aux Lancements Suivants
- Dès le lancement suivant, vous n'avez **plus rien à saisir** !
- Le bot détecte votre session enregistrée, se connecte automatiquement et affiche :  
  `✓ Connexion automatique réussie ! Bienvenue @VotreCompte (Solde: $X.XXXX)`
- Vous accédez directement au tableau de bord.
- Si vous souhaitez changer de compte, il vous suffit de choisir l'option **`[3] Changer de Cookie / Déconnexion`**.

---

## 🛡️ 4. Faire Tourner le Bot en Arrière-Plan H24 (Écran Éteint)

Pour que Termux ne soit pas fermé par la gestion de batterie d'Android quand vous éteignez l'écran :
1. Dans Termux, descendez le volet des notifications Android.
2. Cliquez sur la notification Termux et sélectionnez **`Acquire Wakelock`** (ou tapez la commande `termux-wake-lock`).
3. Dans les paramètres de votre téléphone Android : *Paramètres > Applications > Termux > Batterie > Définir sur "Non restreinte"*.
