with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\tasks_page.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re
print('Length:', len(text))
modals = re.findall(r'<div[^>]*id=["\'][^"\']*modal[^"\']*["\'][^>]*>', text, re.I)
for m in modals:
    print('Modal:', m)

# Look for error or toast or alert elements
alerts = re.findall(r'<div[^>]*class=["\'][^"\']*(?:alert|toast|error|notice|banner)[^"\']*["\'][^>]*>', text, re.I)
for a in alerts:
    print('Alert:', a)
