import os
import re
import json

endpoints = {}

# 1. Parse pages_autoearn.js
try:
    with open('scratch/pages_autoearn.js', 'r', encoding='utf-8') as f:
        content = f.read()
    # Matches: зов('GET', '/path'...) or зов('POST', '/path'...) or зовФайлы('/path'...)
    for m in re.finditer(r'зов\s*\(\s*[\'"`](GET|POST|DELETE|PUT)[\'"`]\s*,\s*[\'"`]([^\'"`]+)[\'"`]', content):
        method, path = m.group(1), m.group(2)
        ep = '/api' + path if not path.startswith('/api') else path
        ep = re.sub(r'(\$\{[^\}]+\}|\b\d+\b)', '{id}', ep)
        if ep not in endpoints:
            endpoints[ep] = {'methods': set(), 'files': set()}
        endpoints[ep]['methods'].add(method)
        endpoints[ep]['files'].add('scratch/pages_autoearn.js')
    
    for m in re.finditer(r'зовФайлы\s*\(\s*[\'"`]([^\'"`]+)[\'"`]', content):
        path = m.group(1)
        ep = '/api' + path if not path.startswith('/api') else path
        ep = re.sub(r'(\$\{[^\}]+\}|\b\d+\b)', '{id}', ep)
        if ep not in endpoints:
            endpoints[ep] = {'methods': set(), 'files': set()}
        endpoints[ep]['methods'].add('POST')
        endpoints[ep]['files'].add('scratch/pages_autoearn.js')
    
    # window.open(...)
    for m in re.finditer(r'window\.open\s*\(\s*[\'"`]([^\'"`]+)[\'"`]', content):
        path = m.group(1)
        if '/api/' in path:
            ep = re.sub(r'(\$\{[^\}]+\}|\b\d+\b)', '{id}', path)
            if ep not in endpoints:
                endpoints[ep] = {'methods': set(), 'files': set()}
            endpoints[ep]['methods'].add('GET')
            endpoints[ep]['files'].add('scratch/pages_autoearn.js')
except Exception as e:
    print("Error parsing pages_autoearn:", e)

# 2. Parse pages_tasks.js
try:
    with open('scratch/pages_tasks.js', 'r', encoding='utf-8') as f:
        content = f.read()
    for m in re.finditer(r'API\.request\s*\(\s*[\'"`]([A-Za-z]+)[\'"`]\s*,\s*[\'"`]([^\'"`\?]+)', content):
        method, path = m.group(1).upper(), m.group(2)
        ep = '/api' + path if not path.startswith('/api') else path
        ep = re.sub(r'(\$\{[^\}]+\}|\b\d+\b)', '{task_id}', ep)
        if ep not in endpoints:
            endpoints[ep] = {'methods': set(), 'files': set()}
        endpoints[ep]['methods'].add(method)
        endpoints[ep]['files'].add('scratch/pages_tasks.js')
    
    for m in re.finditer(r'fetch\s*\(\s*[\'"`](/api[^\'"`\?]+)', content):
        path = m.group(1)
        ep = re.sub(r'(\$\{[^\}]+\}|\b\d+\b)', '{task_id}', path)
        if ep not in endpoints:
            endpoints[ep] = {'methods': set(), 'files': set()}
        endpoints[ep]['methods'].add('POST')
        endpoints[ep]['files'].add('scratch/pages_tasks.js')

    for m in re.finditer(r'xhr\.open\s*\(\s*[\'"`]([A-Za-z]+)[\'"`]\s*,\s*[\'"`](/api[^\'"`\?]+)', content):
        method, path = m.group(1).upper(), m.group(2)
        ep = re.sub(r'(\$\{[^\}]+\}|\b\d+\b)', '{task_id}', path)
        if ep not in endpoints:
            endpoints[ep] = {'methods': set(), 'files': set()}
        endpoints[ep]['methods'].add(method)
        endpoints[ep]['files'].add('scratch/pages_tasks.js')
except Exception as e:
    print("Error parsing pages_tasks:", e)

# 3. Parse pages_my_tasks.js
try:
    with open('scratch/pages_my_tasks.js', 'r', encoding='utf-8') as f:
        content = f.read()
    for m in re.finditer(r'API\.request\s*\(\s*[\'"`]([A-Za-z]+)[\'"`]\s*,\s*[\'"`]([^\'"`\?]+)', content):
        method, path = m.group(1).upper(), m.group(2)
        ep = '/api' + path if not path.startswith('/api') else path
        ep = re.sub(r'(\$\{[^\}]+\}|\b\d+\b)', '{task_id}', ep)
        if ep not in endpoints:
            endpoints[ep] = {'methods': set(), 'files': set()}
        endpoints[ep]['methods'].add(method)
        endpoints[ep]['files'].add('scratch/pages_my_tasks.js')
except Exception as e:
    print("Error parsing pages_my_tasks:", e)

# 4. Parse components_platforms.js
try:
    with open('scratch/components_platforms.js', 'r', encoding='utf-8') as f:
        content = f.read()
    for m in re.finditer(r'fetch\s*\(\s*[\'"`](/api[^\'"`\?]+)', content):
        path = m.group(1)
        if path not in endpoints:
            endpoints[path] = {'methods': set(), 'files': set()}
        endpoints[path]['methods'].add('GET')
        endpoints[path]['files'].add('scratch/components_platforms.js')
except Exception as e:
    pass

# 5. Parse api.js
try:
    with open('scratch/api.js', 'r', encoding='utf-8') as f:
        content = f.read()
    for m in re.finditer(r'this\.request\s*\(\s*[\'"`]([A-Za-z]+)[\'"`]\s*,\s*[\'"`]([^\'"`\?]+)', content):
        method, path = m.group(1).upper(), m.group(2)
        ep = '/api' + path if not path.startswith('/api') else path
        if ep not in endpoints:
            endpoints[ep] = {'methods': set(), 'files': set()}
        endpoints[ep]['methods'].add(method)
        endpoints[ep]['files'].add('scratch/api.js')
except Exception as e:
    pass

# 6. Parse pc_bot/pr_api.py and http_action_engine.py
try:
    for pyf in ['pc_bot/pr_api.py', 'pc_bot/http_action_engine.py']:
        with open(pyf, 'r', encoding='utf-8') as f:
            content = f.read()
        for m in re.finditer(r'self\.request\s*\(\s*["\'](GET|POST|PUT|DELETE)["\']\s*,\s*(?:f?["\']([^"\'\?]+)["\'])', content):
            method, path = m.group(1).upper(), m.group(2)
            ep = '/api' + path if not path.startswith('/api') else path
            ep = re.sub(r'\{[a-zA-Z0-9_]+\}', '{task_id}', ep)
            if ep not in endpoints:
                endpoints[ep] = {'methods': set(), 'files': set()}
            endpoints[ep]['methods'].add(method)
            endpoints[ep]['files'].add(pyf)
        for m in re.finditer(r'requests\.post\s*\(\s*url\s*=', content):
            pass
        # Submit screenshot url
        if 'submit' in content:
            ep = '/api/tasks/{task_id}/submit'
            if ep not in endpoints:
                endpoints[ep] = {'methods': set(), 'files': set()}
            endpoints[ep]['methods'].add('POST')
            endpoints[ep]['files'].add(pyf)
except Exception as e:
    pass

print(f"=== TOTAL ENDPOINTS DISCOVERED: {len(endpoints)} ===\n")
final_list = []
for ep in sorted(endpoints.keys()):
    methods = sorted(list(endpoints[ep]['methods']))
    m_str = '/'.join(methods) if methods else 'GET'
    files_str = ', '.join(sorted(list(endpoints[ep]['files'])))
    print(f"[{m_str:<8}] {ep:<45} | {files_str}")
    final_list.append({
        'endpoint': ep,
        'methods': methods,
        'files': sorted(list(endpoints[ep]['files']))
    })

with open('scratch/all_pr_endpoints.json', 'w', encoding='utf-8') as f:
    json.dump(final_list, f, indent=2)
