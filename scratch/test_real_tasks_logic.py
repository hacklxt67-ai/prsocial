import json
import urllib.request
import urllib.error

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTE4MDE4LCJyb2xlIjoidXNlciIsInR2IjoxLCJpYXQiOjE3ODk4NDg3NzEsImV4cCI6MTc5MDQ1MzU3MX0.zV27CsLBx-UqibJT39Ez3Ztb_9BphNNm9kdn-5u_quc"
CF = "2WL4ST4VqBxvr4ty22McmC8JOA9TGYQ_7uxkas61KTU-1789848643-1.2.1.1-JmONcBboPPOl4VgDSNWs3UoRXdFg7z0DWDnxpD.xfpY8MkD57HvqM4raH4QokS8gEKiQCPhtEfY4ngg0LVpKBI2XhFB4VMpqOE8r4HxSWP9HvMKIvZ_pqupgn6c5.bzuW8y55rAzJznBZag.FwJD1wArqyiuyWaulCuiCsOWITdIfC3s7OvRhCDwCuKCMJAkND5Kcvojx_wFN359XUqDx3B.HKq5onCk6DZL82FKI24vKjgSQ0ps1KFcmfWKY9qpECQoTzrN_LULeG1ftq.EKyfo7poUSMFmz624.4P_QYFOmYJefJd0ALq8Juox8wHSX_6XKVsVy.xpIEire4bFF4lL.pIHp9RkbJT7URpMM20"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
    "Cookie": f"token={TOKEN}; cf_clearance={CF}",
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://pr.social/tasks",
    "Content-Type": "application/json"
}

PRIORITY_PLATFORMS = ['instagram', 'youtube', 'tiktok', 'telegram', 'facebook', 'github']

def api_request(method, path, body=None):
    url = "https://pr.social/api" + path
    data = json.dumps(body).encode('utf-8') if body else None
    req = urllib.request.Request(url, data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(err_body)
        except:
            return e.code, {"error": err_body}
    except Exception as e:
        return 0, {"error": str(e)}

print("=== 1. VERIFICATION DU COMPTE UTILISATEUR ===")
status, me = api_request("GET", "/auth/me")
print(f"Status /auth/me: {status}")
if status == 200 and me.get('user'):
    u = me['user']
    print(f" -> Utilisateur: {u.get('username')} (ID: {u.get('id')}) | Solde: ${u.get('balance')}")
else:
    print(f" -> Echec auth: {me}")
    exit(1)

print("\n=== 2. COMPTES SOCIAUX LIES SUR LE SITE ===")
status, socials = api_request("GET", "/profile/socials")
linked_platforms = {}
if status == 200 and 'accounts' in socials:
    for acc in socials['accounts']:
        p = acc.get('platform')
        st = acc.get('status')
        un = acc.get('username')
        print(f" -> [{p.upper()}] @{un} | statut: {st} | id: {acc.get('id')}")
        if st == 'approved':
            linked_platforms[p] = acc
else:
    print(f"Erreur socials: {socials}")

print("\n=== 3. EVALUATION DE LA PRIORITE DES TACHES REELLES ===")
print("Ordre teste: " + " -> ".join(PRIORITY_PLATFORMS))

selected_task = None
selected_platform = None

for p in PRIORITY_PLATFORMS:
    is_linked = p in linked_platforms
    print(f"\nPlateforme: [{p.upper()}]")
    print(f" -> Compte lie et approuve: {'OUI (@' + linked_platforms[p]['username'] + ')' if is_linked else 'NON (IGNORE)'}")
    
    if not is_linked:
        print(" -> SKIP: aucun compte actif pour cette plateforme.")
        continue
        
    status, tasks_data = api_request("GET", f"/tasks/available?platform={p}&sort=reward&limit=50")
    if status == 200:
        tasks = tasks_data.get('tasks', [])
        count = len(tasks)
        print(f" -> Taches disponibles sur le site: {count}")
        if count > 0:
            print(f" -> Apercu des 3 meilleures taches ({p}) :")
            for t in tasks[:3]:
                reward = t.get('worker_reward') or t.get('cost_per_task')
                action = t.get('action')
                target = t.get('target_username') or t.get('target_url')
                rem = t.get('total_count', 0) - t.get('completed_count', 0)
                print(f"    - ID {t.get('id')}: {action} -> {target} | Gain: ${reward} | Restant: {rem}")
            
            if selected_task is None:
                selected_task = tasks[0]
                selected_platform = p
        else:
            print(" -> Aucune tache disponible actuellement sur cette plateforme -> passage a la suivante.")
    else:
        print(f" -> Erreur recup taches ({status}): {tasks_data}")

print("\n=== 4. SIMULATION DE L'EXECUTION DE LA TACHE SELECTIONNEE ===")
if selected_task:
    t_id = selected_task['id']
    reward = selected_task.get('worker_reward') or selected_task.get('cost_per_task')
    print(f"Plateforme prioritaire choisie: [{selected_platform.upper()}]")
    print(f"Tache ID: {t_id}")
    print(f"Action: {selected_task.get('action')} sur {selected_task.get('target_username') or selected_task.get('target_url')}")
    print(f"Gain prevu: ${reward}")
    
    # Check api-check flag
    status, flag = api_request("GET", "/tasks/api-check-enabled")
    print(f"Mode API Check actif: {flag.get('enabled') == 1}")
    
    # Test task start
    print(f"\nEnvoi de la requete de demarrage: POST /api/tasks/{t_id}/start ...")
    acc_id = linked_platforms[selected_platform]['id']
    start_status, start_res = api_request("POST", f"/tasks/{t_id}/start", {"social_account_id": acc_id})
    print(f"Reponse du serveur ({start_status}):")
    print(json.dumps(start_res, indent=2))
    
    if start_status == 200 and start_res.get('ok'):
        print("\n -> TACHE DEMARREE AVEC SUCCES!")
        print(f"    Completion ID: {start_res.get('completion', {}).get('id')}")
        print(f"    Statut completion: {start_res.get('completion', {}).get('status')}")
        print(f"    URL cible a traiter: {start_res.get('task', {}).get('target_url')}")
        
        # Test API check
        print(f"\nVerification API automatique: POST /api/tasks/{t_id}/api-check ...")
        check_status, check_res = api_request("POST", f"/tasks/{t_id}/api-check")
        print(f"Reponse API check ({check_status}):")
        print(json.dumps(check_res, indent=2))
    elif start_status == 429:
        print(" -> Limite horaire atteinte pour cette action, l'algorithme passe automatiquement a la plateforme suivante.")
    elif start_status == 409:
        print(" -> Conflit ou compte necessaire.")
else:
    print("Aucune tache disponible sur l'ensemble des plateformes liees.")

print("\n=== FIN DU TEST LOGIQUE ===")
