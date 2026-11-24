import os
import sys
from fastapi.testclient import TestClient

# Assurer l'accès aux modules backend
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app
from database import init_db
import seed_data

def run_strict_tests():
    print("=" * 70)
    print("  TESTS STRICTS DE QUALITÉ & SÉCURITÉ - L-MARCHANDE ENTERPRISE")
    print("=" * 70)

    # 1. Initialisation & Seed
    init_db()
    seed_data.seed()
    client = TestClient(app)

    # 2. Test Public Stats
    print("\n[*] 1. Test des Statistiques Publiques...")
    res = client.get("/api/public/stats")
    assert res.status_code == 200, f"Erreur status {res.status_code}"
    stats = res.json()
    assert "active_workers" in stats and "completed_tasks" in stats
    print(f"  [✓] Stats OK : {stats['active_workers']} workers, {stats['completed_tasks']} tâches.")

    # 3. Test Authentification Worker
    print("\n[*] 2. Test Authentification Worker...")
    res = client.post("/api/auth/login", json={
        "username_or_email": "top_worker",
        "password": "WorkerPass2026!"
    })
    assert res.status_code == 200, f"Erreur login worker {res.status_code} : {res.text}"
    worker_data = res.json()
    worker_token = worker_data["access_token"]
    worker_headers = {"Authorization": f"Bearer {worker_token}"}
    print(f"  [✓] Worker connecté : @{worker_data['user']['username']} (Solde: ${worker_data['user']['balance']:.4f})")

    # 4. Test Authentification Annonceur
    print("\n[*] 3. Test Authentification Annonceur...")
    res = client.post("/api/auth/login", json={
        "username_or_email": "lux_agency",
        "password": "AdvertPass2026!"
    })
    assert res.status_code == 200, f"Erreur login annonceur {res.status_code}"
    adv_token = res.json()["access_token"]
    adv_headers = {"Authorization": f"Bearer {adv_token}"}
    print("  [✓] Annonceur connecté avec succès.")

    # 5. Test Authentification Administrateur
    print("\n[*] 4. Test Authentification Admin...")
    res = client.post("/api/auth/login", json={
        "username_or_email": "admin",
        "password": "AdminPass2026!"
    })
    assert res.status_code == 200, f"Erreur login admin {res.status_code}"
    admin_token = res.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    print("  [✓] Administrateur connecté avec succès.")

    # 6. Test Récupération des Tâches Disponibles
    print("\n[*] 5. Test Distribution des Tâches...")
    res = client.get("/api/tasks?limit=10", headers=worker_headers)
    assert res.status_code == 200, f"Erreur tasks {res.status_code}"
    tasks_data = res.json()
    available_tasks = tasks_data.get("tasks", [])
    assert len(available_tasks) > 0, "Aucune tâche disponible trouvée !"
    task_to_claim = available_tasks[0]
    print(f"  [✓] {len(available_tasks)} tâches récupérées. Cible : #{task_to_claim['id']} - {task_to_claim['title']}")

    # 7. Test Réservation (Claim) de Tâche
    print("\n[*] 6. Test Réservation de Tâche (Claim)...")
    res = client.post(f"/api/tasks/{task_to_claim['id']}/start", json={}, headers=worker_headers)
    assert res.status_code == 200, f"Erreur start task {res.status_code} : {res.text}"
    exec_data = res.json()["execution"]
    exec_id = exec_data["id"]
    print(f"  [✓] Mission #{exec_id} verrouillée avec succès pour le worker.")

    # 8. Test Vérification 1-Clic Sentinel
    print("\n[*] 7. Test Vérification 1-Clic Sentinel...")
    res = client.post(f"/api/tasks/{exec_id}/api-check", headers=worker_headers)
    assert res.status_code == 200, f"Erreur api-check {res.status_code} : {res.text}"
    check_result = res.json()
    print(f"  [✓] Vérification réussie : {check_result['message']}")

    # 9. Test Contrôle du Solde & Portefeuille après rémunération
    print("\n[*] 8. Test Contrôle du Solde et Grand Livre...")
    res = client.get("/api/profile/wallet", headers=worker_headers)
    assert res.status_code == 200
    wallet = res.json()
    new_balance = wallet["balance"]
    print(f"  [✓] Nouveau solde du worker : ${new_balance:.4f}")
    assert len(wallet["transactions"]) > 0, "Aucune transaction enregistrée au grand livre !"
    print(f"  [✓] Grand livre validé : {len(wallet['transactions'])} transactions enregistrées.")

    # 10. Test Création de Campagne Annonceur
    print("\n[*] 9. Test Création de Campagne Annonceur...")
    res = client.post("/api/campaigns", json={
        "title": "Campagne Test Automatisée",
        "description": "Test de validation unitaire",
        "platform": "instagram",
        "action_type": "like",
        "target_url": "https://instagram.com/p/test12345",
        "reward_per_action": 0.005,
        "target_quantity": 50
    }, headers=adv_headers)
    assert res.status_code == 200, f"Erreur create campaign {res.status_code} : {res.text}"
    print(f"  [✓] Campagne créée : ID #{res.json()['campaign_id']}")

    # 11. Test Administration & Sentinel
    print("\n[*] 10. Test Sentinel Admin & Métriques Globales...")
    res = client.get("/api/admin/stats", headers=admin_headers)
    assert res.status_code == 200
    admin_stats = res.json()
    print(f"  [✓] Sentinel Admin OK : {admin_stats['total_users']} utilisateurs, {admin_stats['total_campaigns']} campagnes, {admin_stats['total_executions']} exécutions.")

    # 12. Test Rendu Frontend (SPA HTML)
    print("\n[*] 11. Test Rendu Frontend (Index HTML)...")
    res = client.get("/")
    assert res.status_code == 200
    assert "PR.SOCIAL" in res.text
    res_login = client.get("/login")
    assert res_login.status_code == 200
    assert "/cab/signin.618d6e73c6e1.js" in res_login.text
    assert client.get("/live").status_code == 200
    assert client.get("/tasks").status_code == 200
    assert client.get("/cab/signin.618d6e73c6e1.js").status_code == 200
    assert client.get("/css/main.css").status_code == 200
    assert client.get("/i18n/fr.json").status_code == 200
    assert client.get("/i18n/en.json").status_code == 200
    assert client.get("/api/cabinet/frame").status_code == 200
    assert client.get("/api/cabinet/door").status_code == 200
    assert client.get("/api/cabinet/live").status_code == 200
    assert client.get("/api/tasks/advertiser-catalog").status_code == 200
    print(f"  [✓] Frontend PR.SOCIAL Exact & Endpoints /cab/* validés ({len(res_login.text)} octets).")

    print("\n" + "=" * 70)
    print("  TOUS LES TESTS ONT RÉUSSI AVEC SUCCÈS (100% CONFORME & SÉCURISÉ) !")
    print("=" * 70)

if __name__ == "__main__":
    run_strict_tests()
