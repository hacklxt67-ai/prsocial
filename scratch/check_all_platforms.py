import urllib.request
import json

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTE4MDE4LCJyb2xlIjoidXNlciIsInR2IjoxLCJpYXQiOjE3ODk4NDg3NzEsImV4cCI6MTc5MDQ1MzU3MX0.zV27CsLBx-UqibJT39Ez3Ztb_9BphNNm9kdn-5u_quc"
CF = "2WL4ST4VqBxvr4ty22McmC8JOA9TGYQ_7uxkas61KTU-1789848643-1.2.1.1-JmONcBboPPOl4VgDSNWs3UoRXdFg7z0DWDnxpD.xfpY8MkD57HvqM4raH4QokS8gEKiQCPhtEfY4ngg0LVpKBI2XhFB4VMpqOE8r4HxSWP9HvMKIvZ_pqupgn6c5.bzuW8y55rAzJznBZag.FwJD1wArqyiuyWaulCuiCsOWITdIfC3s7OvRhCDwCuKCMJAkND5Kcvojx_wFN359XUqDx3B.HKq5onCk6DZL82FKI24vKjgSQ0ps1KFcmfWKY9qpECQoTzrN_LULeG1ftq.EKyfo7poUSMFmz624.4P_QYFOmYJefJd0ALq8Juox8wHSX_6XKVsVy.xpIEire4bFF4lL.pIHp9RkbJT7URpMM20"

headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
    "Cookie": f"token={TOKEN}; cf_clearance={CF}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

platforms = ['instagram', 'youtube', 'tiktok', 'telegram', 'facebook']
for p in platforms:
    url = f"https://pr.social/api/tasks/available?platform={p}&sort=reward&limit=10"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            tasks = data.get('tasks', [])
            print(f"=== {p.upper()} ({len(tasks)} taches dispo) ===")
            for t in tasks[:3]:
                r = t.get('worker_reward') or t.get('cost_per_task')
                action = t.get('action')
                target = t.get('target_username') or t.get('target_url')
                print(f"  ID {t['id']}: {action} | ${r} | {target}")
    except Exception as e:
        print(f"Erreur {p}: {e}")
