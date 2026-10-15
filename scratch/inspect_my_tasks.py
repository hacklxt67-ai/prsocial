with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\pages_my_tasks.js', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re
print('Length:', len(text))
for m in re.finditer(r'API\.request\([^\)]+\)', text):
    print('API call:', m.group(0))

for m in re.finditer(r'function\s+([a-zA-Z0-9_]+)', text):
    print('Function:', m.group(1))
