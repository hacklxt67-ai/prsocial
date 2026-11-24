# 🏢 L-MARCHANDE ENTERPRISE v1.0
### Plateforme SaaS d'Engagement & Monétisation Réseaux Sociaux Haute Performance

L-MARCHANDE est une plateforme complète et autonome développée pour les entreprises souhaitant opérer leur propre écosystème de micro-tâches et d'engagement social (alternative 100% indépendante et souveraine à PR.Social).

---

## ⚡ Fonctionnalités Clés

### 1. 🌐 Frontend & Expérience Utilisateur (UI/UX)
- **Design Glassmorphism Cyberpunk & Fintech** : Interface sombre haute définition optimisée pour mobile, tablette et desktop (Tailwind CSS, Plus Jakarta Sans, Lucide Icons).
- **Missions Réseaux Sociaux en Direct** : Filtres par réseaux (Instagram, Telegram, YouTube, TikTok, Twitter/X, Surf Web).
- **Exécution & Vérification en 1-Clic** : Minuteur interactif (25 min), consignes de sécurité, ouverture directe du lien et validation instantanée via l'API.
- **Espace Annonceur (Campagnes)** : Simulateur de devis instantané avec marge plateforme intégrée (40%), suivi de progression en temps réel.
- **Portefeuille & Grand Livre** : Dépôts et retraits automatiques (USDT TRC20/BEP20, Payeer, Mobile Money, Virement), historique comptable complet.
- **Programme d'Affiliation (10% à Vie)** : Lien unique de parrainage avec copie en 1 clic et commission automatique sur chaque mission complétée par les filleuls.
- **Panneau d'Administration Sentinel** : Modération des utilisateurs, statistiques globales, journal des alertes anti-triche et bascule Bannir / Réactiver instantanée.

### 2. 🛡️ Sécurité & Sentinel Anti-Fraude
- **Authentification Sécurisée PBKDF2 + JWT** : Hash NIST 100 000 itérations avec sel cryptographique, tokens HMAC-SHA256 auto-signés sans dépendances externes.
- **Protection Anti-Speedhack** : Détection des validations automatisées anormalement rapides (< 3 secondes).
- **Anti-Doublon d'Images & Preuves** : Empreinte de hachage SHA-256 sur les captures d'écran empêchant la réutilisation de la même preuve.
- **Score de Confiance Sentinel (0 - 100%)** : Ajustement dynamique de la réputation de l'utilisateur avec dégradation automatique en cas de fraude.
- **Système de Frappes (Strikes)** : Suspension automatique des tricheurs récidivistes.

### 3. ⚙️ Moteur de Distribution & Base de Données
- **Base de Données Relationnelle SQLite WAL** : Concurrence d'accès élevée, transactions ACID sans aucune perte de données.
- **Grand Livre Comptable (Ledger)** : Traçabilité absolue de chaque centime (crédit travailleur, commission parrain, débit annonceur).

---

## 🚀 Démarrage Rapide

### Prérequis
- Python 3.10+
- Dépendances requises : `fastapi`, `uvicorn`, `pydantic`, `python-multipart`, `requests`

### Lancement en 1 Commande :
Dans le dossier du projet :
```bash
python run_server.py
```
Le serveur démarrera automatiquement sur **`http://localhost:8000`** et ouvrira votre navigateur par défaut.

---

## 🔑 Comptes de Démonstration Pré-configurés

La base de données est livrée avec des comptes démo prêts à l'emploi (boutons de connexion 1-clic disponibles sur la page de connexion) :

| Rôle | Identifiant / Email | Mot de Passe | Solde Initial |
| :--- | :--- | :--- | :--- |
| **Administrateur** | `admin` (`admin@l-marchande.io`) | `AdminPass2026!` | $500.00 |
| **Travailleur (Worker)** | `top_worker` (`worker@l-marchande.io`) | `WorkerPass2026!` | $12.8450 |
| **Annonceur** | `lux_agency` (`agency@l-marchande.io`) | `AdvertPass2026!` | $250.00 |

---

## 📡 Spécification de l'API REST (Documentation Swagger)

Lorsque le serveur est en cours d'exécution, la documentation interactive Swagger est accessible sur :
👉 **`http://localhost:8000/docs`**

### Principaux Endpoints :
- `POST /api/auth/register` : Inscription d'un nouvel utilisateur ou annonceur.
- `POST /api/auth/login` : Connexion et obtention du token JWT Bearer.
- `GET /api/auth/me` : Données de session, solde et statut.
- `GET /api/tasks` : Liste filtrée des missions disponibles.
- `POST /api/tasks/{campaign_id}/start` : Réservation d'une mission (délai de 25 min).
- `POST /api/tasks/{execution_id}/api-check` : Validation instantanée de la mission et versement des gains.
- `GET /api/tasks/my/list` : Historique des missions complétées ou en cours.
- `GET /api/campaigns` & `POST /api/campaigns` : Gestion des campagnes annonceurs.
- `GET /api/profile/wallet` : Consultation du grand livre comptable.
- `POST /api/wallet/deposit` & `POST /api/wallet/withdraw` : Flux financiers.
- `GET /api/referrals` : Tableau de bord parrainage et commissions.
- `GET /api/admin/stats` & `GET /api/admin/users` : Administration globale.

---

## 🐳 Déploiement en Production (Docker)

Pour déployer L-MARCHANDE sur un VPS ou serveur Cloud en un clic :
```bash
docker-compose up -d --build
```
Le conteneur isolera automatiquement la base de données dans un volume persistant et exposera le port `8000`.

---
© 2026 **L-MARCHANDE** · Tous droits réservés.
