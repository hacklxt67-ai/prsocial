import urllib.request
import urllib.error
import json

TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTE4MDE4LCJyb2xlIjoidXNlciIsInR2IjoxLCJpYXQiOjE3ODk4NDg3NzEsImV4cCI6MTc5MDQ1MzU3MX0.zV27CsLBx-UqibJT39Ez3Ztb_9BphNNm9kdn-5u_quc'
CF = '2WL4ST4VqBxvr4ty22McmC8JOA9TGYQ_7uxkas61KTU-1789848643-1.2.1.1-JmONcBboPPOl4VgDSNWs3UoRXdFg7z0DWDnxpD.xfpY8MkD57HvqM4raH4QokS8gEKiQCPhtEfY4ngg0LVpKBI2XhFB4VMpqOE8r4HxSWP9HvMKIvZ_pqupgn6c5.bzuW8y55rAzJznBZag.FwJD1wArqyiuyWaulCuiCsOWITdIfC3s7OvRhCDwCuKCMJAkND5Kcvojx_wFN359XUqDx3B.HKq5onCk6DZL82FKI24vKjgSQ0ps1KFcmfWKY9qpECQoTzrN_LULeG1ftq.EKyfo7poUSMFmz624.4P_QYFOmYJefJd0ALq8Juox8wHSX_6XKVsVy.xpIEire4bFF4lL.pIHp9RkbJT7URpMM20'

headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile)',
    'Cookie': f'token={TOKEN}; cf_clearance={CF}',
    'Accept': 'application/json'
}

req = urllib.request.Request('https://pr.social/api/tasks/available?platform=instagram&limit=5', headers=headers)
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    tasks = data.get('tasks', [])
    print('Available instagram tasks:', len(tasks))
    if tasks:
        t0 = tasks[0]
        task_id = t0['id']
        print('First task:', task_id, t0.get('action'), t0.get('target_username'))
        try:
            req_start = urllib.request.Request(
                f'https://pr.social/api/tasks/{task_id}/start',
                headers={**headers, 'Content-Type': 'application/json'},
                data=b'{}'
            )
            with urllib.request.urlopen(req_start) as r_start:
                print('Start response:', r_start.status, r_start.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            print('Start HTTPError:', e.code, e.read().decode('utf-8'))
