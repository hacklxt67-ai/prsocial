with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\pages_tasks.js', encoding='utf-8') as f:
    lines = f.readlines()

for idx in range(920, min(1080, len(lines))):
    # sanitize non-ascii for windows console
    safe_line = lines[idx].encode('ascii', errors='replace').decode('ascii')
    print(f'{idx+1}: {safe_line.strip()[:140]}')
