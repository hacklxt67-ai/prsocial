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
            print(f"\n=== {p.upper()} ({len(tasks)} taches) ===")
            for t in tasks[:5]:
                tid = t['id']
                det_url = f"https://pr.social/api/tasks/{tid}"
                try:
                    with urllib.request.urlopen(urllib.request.Request(det_url, headers=headers)) as d_resp:
                        d = json.loads(d_resp.read().decode('utf-8'))
                        api_check = d.get('api_check_enabled')
                        pool = d.get('task', {}).get('pool')
                        action = t.get('action')
                        print(f"  Task {tid} ({action}): api_check_enabled={api_check}, pool={pool}")
                except Exception as e:
                    print(f"  Task {tid}: err {e}")
    except Exception as e:
        print(f"Error {p}: {e}")
