with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\pages_tasks.js', encoding='utf-8') as f:
    lines = f.readlines()

for idx, l in enumerate(lines):
    if 'apiCheckTask' in l:
        for j in range(max(0, idx-5), min(len(lines), idx+45)):
            safe_l = lines[j].encode('ascii', errors='replace').decode('ascii')
            print(f'{j+1}: {safe_l.rstrip()[:120]}')
        break
