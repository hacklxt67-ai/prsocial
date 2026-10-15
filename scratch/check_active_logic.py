with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\pages_tasks.js', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re
lines = text.split('\n')
for idx, l in enumerate(lines, 1):
    if any(k in l.lower() for k in ['active', 'in_progress', 'already', 'cancel', 'toast']):
        print(f'{idx}: {l[:110]}')
