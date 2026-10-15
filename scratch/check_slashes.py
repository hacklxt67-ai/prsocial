with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\bot_improved.js', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if '\\' in line:
            print(f"{i}: {line.strip()}")
