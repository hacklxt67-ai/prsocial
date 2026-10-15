with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\tasks_page.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re
scripts = re.findall(r'src=["\']([^"\']+)["\']', text)
for s in scripts:
    print('Script:', s)
