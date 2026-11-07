# 📱 Guide d'Utilisation - PR.Social Bot sur Android (Termux)

Ce guide vous donne les commandes prêtes à l'emploi pour installer, mettre à jour et faire tourner le bot **PR.Social 24h/24 directement sur votre smartphone Android**.

---

## ⚡ 1. NOUVEAU DÉBUTANT (Installation Complète en 1 Clic)

Si vous installez Termux pour la première fois, ouvrez l'application **Termux**, copiez et collez cette commande unique :

```bash
pkg update -y && pkg install -y git python && git clone https://github.com/hacklxt67-ai/prsocial.git && cd prsocial && pip install requests pillow && python pc_bot/http_action_engine.py
```

> **Ce que fait cette commande :**
> 1. Installe `git` et `python`.
> 2. Télécharge le projet complet depuis GitHub.
> 3. Installe les dépendances requises (`requests`, `pillow`).
> 4. Démarre directement le bot avec l'interface interactive.

---

## 🚀 2. UTILISATEUR DÉJÀ INSTALLÉ (Mise à Jour Rapide & Lancement)

Si vous avez déjà le bot installé sur votre téléphone et souhaitez appliquer toutes les dernières mises à jour (support Instagram, correctif anti-quarantaine, nouvelles tâches) :

```bash
cd ~/prsocial && git fetch origin main && git reset --hard origin/main && python pc_bot/http_action_engine.py
```

> **Astuce :** Vous pouvez aussi relancer simplement le bot à tout moment avec :
> ```bash
> cd ~/prsocial && python pc_bot/http_action_engine.py
> ```

---

## 🎮 3. Options Disponibles dans le Bot

Au lancement, vous accédez au tableau de bord :
- `[1]` **Start Tout** : Démarre automatiquement le traitement des tâches rémunérées (Instagram, YouTube, Twitter, TikTok, etc.) avec déblocage auto des tâches orphelines.
- `[2]` **Surf Automatique** : Effectue les visites de sites rémunérées.
- `[3]` **Comptes Liés** : Affiche vos comptes sociaux approuvés par PR.Social.
- `[4]` **Changer de Token / Cookie** : Pour connecter un nouveau compte PR.Social.
- `[5]` **Quitter**

---

## 🛡️ 4. Faire Tourner le Bot en Arrière-Plan H24 (Écran Éteint)

Pour éviter qu'Android n'arrête Termux lorsque vous verrouillez votre écran :
1. Dans Termux, descendez le volet des notifications Android.
2. Cliquez sur la notification Termux et sélectionnez **`Acquire Wakelock`** (ou tapez `termux-wake-lock`).
3. Dans les paramètres de votre téléphone : *Paramètres > Applications > Termux > Batterie > Non restreinte*.
