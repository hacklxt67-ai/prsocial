with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\pages_tasks.js', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re
routes = set(re.findall(r'["\'](/[^"\']+)["\']', text))
for r in sorted(routes):
    if 'task' in r.lower() or 'api' in r.lower():
        print(r)
