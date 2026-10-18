# 📘 Guide d'Utilisation - PR.Social Bot PC v1.2.0

Bienvenue dans l'application **PR.Social Bot PC**.  
Cette version a été spécialement conçue pour fonctionner de manière autonome directement sur ordinateur **Windows**, sans aucun smartphone Android ni émulateur requis.

---

## 🚀 Comment Lancer l'Application

Vous avez deux façons simples de démarrer l'application depuis votre dossier :

1. **Lancement de l'Exécutable (.exe) :**
   - Double-cliquez sur : **`LANCER_PR_SOCIAL_PC_EXE.bat`**
   - Ou ouvrez directement : `D:\social_pc_bot\dist\PR_Social_PC\PR_Social_PC.exe`

2. **Lancement Direct Python (Interface Graphique) :**
   - Double-cliquez sur : **`LANCER_PR_SOCIAL_PC.bat`**

3. **Lancement Mode Pur HTTP (100% Invisible / Sans Navigateur) :**
   - Double-cliquez sur : **`http.bat`** ou **`LANCER_BOT_PUR_HTTP.bat`**
   - Ce mode fonctionne en tâche de fond avec menu interactif stylé, récupération des rejets, requêtes HTTP rapides et ultra-légères.
   - Intègre un système de déblocage automatique anti-blocage (annule toute tâche bloquée instantanément).

4. **Lancement Menu Terminal Stylé (Console Interactive) :**
   - Double-cliquez sur : **`LANCER_MENU_TERMINAL.bat`**
   - Affiche le logo ASCII art, le solde en direct et un menu interactif :
     * `[ 1 ] START` : Démarre l'automatisation en continu avec logs colorés.
     * `[ 2 ] RÉCUPÉRER & RÉESSAYER LES TÂCHES REJETÉES` : Analyse les rejets et relance en mode strict.
     * `[ 3 ] Changer Token` / `[ 4 ] Mode Invisible` / `[ 5 ] Quitter`.


---

## 🔑 1. Connexion à PR.Social (2 Méthodes Disponibles)

L'application vous propose deux méthodes au choix :

### Méthode A : Saisie Rapide du Token (Instantanée en 1 seconde)
1. Si vous possédez déjà votre jeton de session (ou que vous le récupérez depuis votre navigateur habituel via `F12 > Application > Cookies > token`), collez-le directement dans le champ :  
   `[ Coller votre Token ici... ]`
2. Cliquez sur le bouton vert : **`💾 Valider Token`**.
3. Votre session est validée immédiatement et votre solde s'affiche.

### Méthode B : Connexion Automatique Chrome
1. Dans le panneau de gauche, cliquez sur le bouton bleu/violet :  
   👉 **`🌐 Ouvrir Chrome`**
2. Une fenêtre Google Chrome s'ouvre directement sur la page de connexion de **`https://pr.social/login`**.
3. Connectez-vous à votre compte.
4. Le bot détecte votre connexion automatiquement, enregistre le jeton et met à jour votre solde en haut :  
   `🟢 @VotreUsername | Solde: $X.XXX`.

---

## 🎮 2. Lancement des Tâches et Automatisation

Dans le panneau de gauche :

- **Pour tout automatiser (Recommandé) :**  
  Cliquez sur le bouton vert **`🚀 LANCER TOUT (AUTO)`**.  
  Le bot va automatiquement :
  - Consulter vos réseaux liés et approuvés (**TikTok**, **Facebook**, **Instagram**, **YouTube**, **Telegram**).
  - Chercher les tâches les plus rémunératrices en priorité.
  - Ouvrir chaque page, effectuer l'action (Suivre / Like / Rejoindre).
  - Capturer automatiquement la preuve d'écran.
  - Soumettre la capture et valider la tâche auprès de PR.Social.
  - Créditer vos gains et actualiser votre solde en temps réel.

- **Pour cibler un seul réseau :**  
  Cliquez sur le bouton spécifique désiré :
  - `🎵 TikTok uniquement`
  - `📘 Facebook uniquement`
  - `📸 Instagram uniquement`
  - `▶️ YouTube uniquement`
  - `✈️ Telegram uniquement`

- **Pour arrêter l'automatisation :**  
  Cliquez simplement sur **`⏹️ ARRÊTER LE BOT`**.

---

## 🛡️ 3. Sécurité et Paramètres Anti-Ban

- **Mode Invisible (Headless) :**  
  Cochez la case *« Mode invisible (Headless) »* si vous ne souhaitez pas voir les fenêtres de navigation s'ouvrir pendant que vous travaillez sur votre PC.
- **Profil Utilisateur Persistant :**  
  Le bot utilise un profil Chrome dédié situé sur `D:\social_pc_bot\chrome_profile`. Une fois que vous êtes connecté à vos réseaux sociaux (Facebook, Instagram, TikTok, etc.) sur ce profil, vous restez connecté indéfiniment.
- **Délais de sécurité :**  
  Une pause aléatoire de 5 à 12 secondes est automatiquement respectée entre chaque tâche pour protéger vos comptes contre les limitations de plateformes.
