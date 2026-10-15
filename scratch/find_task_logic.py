with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\pages_tasks.js', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if '/tasks/' in line or 'available' in line or 'startTask' in line or 'verify' in line or 'checkTask' in line:
        print(f'{idx+1}: {line.strip()[:140]}')
