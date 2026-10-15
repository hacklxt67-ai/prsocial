import os
import re
import json

files_to_check = []
for root, _, files in os.walk('pc_bot'):
    for f in files:
        if f.endswith('.py'):
            files_to_check.append(os.path.join(root, f))

for root, _, files in os.walk('scratch'):
    for f in files:
        if f.endswith(('.js', '.py', '.html')):
            files_to_check.append(os.path.join(root, f))

findings = []

# Pattern 1: self.request("METHOD", "PATH", ...)
p1 = re.compile(r'self\.request\(\s*["\'](GET|POST|PUT|DELETE|PATCH)["\']\s*,\s*["\']([^"\']+)["\']', re.IGNORECASE)

# Pattern 2: API.request('METHOD', 'PATH', ...)
p2 = re.compile(r'API\.request\(\s*[\'"`](GET|POST|PUT|DELETE|PATCH)[\'"`]\s*,\s*[\'"`]([^\'"`]+)[\'"`]', re.IGNORECASE)

# Pattern 3: fetch('/api/...' or fetch('/api' + ...)
p3 = re.compile(r'fetch\(\s*[\'"`](/api[^\'"`\?]+)', re.IGNORECASE)
p3_concat = re.compile(r'fetch\(\s*[\'"`](/api)?[\'"`]\s*\+\s*[\'"`]([^\'"`\?]+)', re.IGNORECASE)

# Pattern 4: requests.post/get/put/...("https://pr.social/api/..." or BASE_URL + "...")
p4 = re.compile(r'requests\.(get|post|put|delete)\(\s*(?:url|f?["\']https?://pr\.social/api([^"\'\?]+)["\'])', re.IGNORECASE)

# Pattern 5: template literals with `/api/tasks/${...}` or `f"/tasks/{...}"`
p5 = re.compile(r'[`"\'](/api/tasks/[^`"\'\?]+)[`"\']')
p5_py = re.compile(r'f["\'](/tasks/[^"\'\?]+)["\']')

# Pattern 6: general /api/... string occurrences
p6 = re.compile(r'["\'](/api/[a-zA-Z0-9_\-\/\{\}\:\.\+]+)["\']')

# Pattern 7: any API call in JS pages
p7 = re.compile(r'(?:get|post|put|delete)\([\'"`](/api/[^\'"`\?]+)[\'"`]', re.IGNORECASE)

all_calls = []

for filepath in files_to_check:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        for idx, line in enumerate(lines, 1):
            for m, path in p1.findall(line):
                all_calls.append({'method': m.upper(), 'endpoint': '/api' + path if not path.startswith('/api') else path, 'file': filepath, 'line': idx, 'raw': line.strip()})
            for m, path in p2.findall(line):
                all_calls.append({'method': m.upper(), 'endpoint': '/api' + path if not path.startswith('/api') else path, 'file': filepath, 'line': idx, 'raw': line.strip()})
            for path in p3.findall(line):
                m = 'POST' if 'POST' in line.upper() else 'GET'
                all_calls.append({'method': m, 'endpoint': path, 'file': filepath, 'line': idx, 'raw': line.strip()})
            for ep in p5.findall(line):
                all_calls.append({'method': 'VARIOUS', 'endpoint': ep, 'file': filepath, 'line': idx, 'raw': line.strip()})
            for ep in p5_py.findall(line):
                all_calls.append({'method': 'VARIOUS', 'endpoint': '/api' + ep, 'file': filepath, 'line': idx, 'raw': line.strip()})
            for ep in p6.findall(line):
                all_calls.append({'method': 'VARIOUS', 'endpoint': ep, 'file': filepath, 'line': idx, 'raw': line.strip()})

# Deduplicate by endpoint
summary = {}
for c in all_calls:
    ep = c['endpoint']
    # normalise variable templates
    ep_norm = re.sub(r'(\$\{[^\}]+\}|\{\w+\}|\d+)', '{id}', ep)
    # clean trailing punctuation
    ep_norm = ep_norm.rstrip('/')
    if not ep_norm:
        continue
    if ep_norm not in summary:
        summary[ep_norm] = {'methods': set(), 'files': set(), 'examples': []}
    if c['method'] != 'VARIOUS':
        summary[ep_norm]['methods'].add(c['method'])
    rel = os.path.relpath(c['file'], '.')
    summary[ep_norm]['files'].add(rel)
    if len(summary[ep_norm]['examples']) < 2:
        summary[ep_norm]['examples'].append(f"{rel}:{c['line']} -> {c['raw'][:90]}")

print(f"Total Unique Normalized Endpoints: {len(summary)}\n")
for ep, d in sorted(summary.items()):
    m = '/'.join(sorted(d['methods'])) if d['methods'] else 'GET/POST'
    files_str = ', '.join(list(d['files'])[:2])
    print(f"[{m:<10}] {ep:<45} | Files: {files_str}")
