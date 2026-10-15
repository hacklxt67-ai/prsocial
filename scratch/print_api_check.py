with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\pages_tasks.js', encoding='utf-8') as f:
    lines = f.readlines()

for idx in range(1080, min(1200, len(lines))):
    safe_l = lines[idx].encode('ascii', errors='replace').decode('ascii')
    print(f'{idx+1}: {safe_l.rstrip()[:120]}')
