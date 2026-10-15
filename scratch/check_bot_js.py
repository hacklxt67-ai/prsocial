import re
import subprocess

with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\src\social\pr\app\AutoTasksView.java', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'String js = "(.*?)";', content, re.DOTALL)
if m:
    raw = m.group(1)
    # reconstruct string
    parts = re.findall(r'"(.*?)"', raw)
    js = "".join(parts).replace('\\"', '"').replace('\\u00E0', 'à').replace('\\u25CF', '●')
    with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\bot.js', 'w', encoding='utf-8') as out:
        out.write(js)
    print("Bot JS saved, length:", len(js))
    
    # Validate with node
    r = subprocess.run(['node', '-c', r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\bot.js'], capture_output=True, text=True)
    print("Node check exit code:", r.returncode)
    if r.returncode != 0:
        print("Node error:", r.stderr)
    else:
        print("Bot JS is 100% valid JavaScript syntax!")
else:
    print("Pattern not found")
