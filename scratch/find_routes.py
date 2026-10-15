import os, re

for root, dirs, files in os.walk('scratch'):
    for f in files:
        if f.endswith('.js'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fh:
                c = fh.read()
                matches = re.findall(r"Router\.register\(['\"]([^'\"]+)['\"]", c)
                if matches:
                    print(f, matches)
