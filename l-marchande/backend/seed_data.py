from database import init_db, query_one, execute_commit
from security import SecurityHelper

def seed():
    init_db()

    # 1. Administrateur Principal
    admin = query_one("SELECT id FROM users WHERE username = 'admin'")
    if not admin:
        admin_pass = SecurityHelper.hash_password("AdminPass2026!")
        admin_ref = SecurityHelper.generate_referral_code("LMA")
        execute_commit("""
            INSERT INTO users (email, username, hashed_password, role, balance, referral_code, trust_score)
            VALUES ('admin@l-marchande.io', 'admin', ?, 'admin', 500.0, ?, 100.0)
        """, (admin_pass, admin_ref))
        print("[+] Administrateur créé: admin / AdminPass2026!")

    # 2. Compte Annonceur Démo
    advertiser = query_one("SELECT id FROM users WHERE username = 'lux_agency'")
    if not advertiser:
        adv_pass = SecurityHelper.hash_password("AdvertPass2026!")
        adv_ref = SecurityHelper.generate_referral_code("LMC")
        adv_id = execute_commit("""
            INSERT INTO users (email, username, hashed_password, role, balance, referral_code, trust_score)
            VALUES ('agency@l-marchande.io', 'lux_agency', ?, 'advertiser', 250.0, ?, 98.5)
        """, (adv_pass, adv_ref))
        print("[+] Annonceur créé: lux_agency / AdvertPass2026!")
    else:
        adv_id = advertiser["id"]

    # 3. Compte Worker Démo
    worker = query_one("SELECT id FROM users WHERE username = 'top_worker'")
    if not worker:
        w_pass = SecurityHelper.hash_password("WorkerPass2026!")
        w_ref = SecurityHelper.generate_referral_code("LMW")
        w_id = execute_commit("""
            INSERT INTO users (email, username, hashed_password, role, balance, referral_code, referred_by, trust_score)
            VALUES ('worker@l-marchande.io', 'top_worker', ?, 'worker', 12.8450, ?, 1, 99.2)
        """, (w_pass, w_ref))

        # Ajouter ses comptes sociaux
        execute_commit("""
            INSERT INTO social_accounts (user_id, platform, account_identifier, account_url, status, followers_count)
            VALUES (?, 'instagram', '@alex_worker_pro', 'https://instagram.com/alex_worker_pro', 'verified', 1420),
                   (?, 'telegram', '@alex_worker_tg', 'https://t.me/alex_worker_tg', 'verified', 0),
                   (?, 'youtube', '@AlexTechReviews', 'https://youtube.com/@AlexTechReviews', 'verified', 350)
        """, (w_id, w_id, w_id))
        print("[+] Travailleur créé: top_worker / WorkerPass2026!")

    # 4. Campagnes Officielles Multi-Réseaux Démo
    existing_campaigns = query_one("SELECT COUNT(*) as cnt FROM campaigns")
    if not existing_campaigns or existing_campaigns["cnt"] == 0:
        campaigns_data = [
            # Instagram
            ("Suivre le compte Instagram @l_marchande_officiel", "Abonnez-vous au compte officiel L-Marchande pour développer la communauté.", "instagram", "follow", "https://instagram.com/l_marchande_officiel", 0.0080, 0.0120, 1000, 50.0),
            ("Liker le dernier Reel de présentation L-Marchande", "Regardez et aimez le dernier Reel vidéo.", "instagram", "like", "https://instagram.com/p/DB9412A", 0.0040, 0.0070, 2500, 30.0),
            # Telegram
            ("Rejoindre le Canal VIP Telegram L-Marchande", "Rejoignez notre canal officiel pour recevoir les annonces et signaux exclusifs.", "telegram", "join", "https://t.me/lmarchande_vip", 0.0100, 0.0150, 1500, 45.0),
            ("Rejoindre le Groupe d'Entraide & Communauté Telegram", "Rejoignez le groupe public et restez actif.", "telegram", "join", "https://t.me/lmarchande_community", 0.0075, 0.0110, 2000, 35.0),
            # YouTube
            ("S'abonner à la chaîne YouTube L-Marchande TV", "Abonnez-vous à la chaîne officielle et activez la cloche.", "youtube", "follow", "https://youtube.com/@lmarchande_tv", 0.0150, 0.0220, 800, 40.0),
            ("Visionner et Liker la vidéo de présentation (3 min)", "Regardez la vidéo jusqu'à la fin et laissez un like.", "youtube", "view", "https://youtube.com/watch?v=dQw4w9WgXcQ", 0.0120, 0.0180, 1200, 35.0),
            # TikTok
            ("Suivre le profil TikTok @lmarchande", "Abonnez-vous au profil TikTok de l'entreprise.", "tiktok", "follow", "https://tiktok.com/@lmarchande", 0.0060, 0.0095, 3000, 45.0),
            # Twitter / X
            ("Retweeter l'annonce de lancement L-Marchande v1.0", "Faites un Retweet public du post épinglé.", "twitter", "like", "https://x.com/lmarchande/status/1789421", 0.0090, 0.0135, 1200, 30.0),
            # Surf Web
            ("Visiter la boutique L-Marchande (30 secondes)", "Naviguez sur la page d'accueil de la boutique pendant au moins 30 secondes.", "website", "surf", "https://l-marchande.io/catalog", 0.0050, 0.0075, 5000, 40.0),
        ]

        for title, desc, plat, act, url, rew, cost, qty, budg in campaigns_data:
            execute_commit("""
                INSERT INTO campaigns (advertiser_id, title, description, platform, action_type, target_url, reward_per_action, cost_per_action, target_quantity, total_budget, remaining_budget, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
            """, (adv_id, title, desc, plat, act, url, rew, cost, qty, budg, budg))

        print("[+] 9 Campagnes multiréseaux pré-chargées avec succès !")

if __name__ == "__main__":
    seed()
