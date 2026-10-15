import re, subprocess

with open('scratch/src/social/pr/app/AutoTasksView.java', 'r', encoding='utf-8') as f:
    c = f.read()

m = re.search(r'String js =\s*(.*?);\s*webView\.evaluateJavascript\(js', c, re.DOTALL)
if m:
    raw = m.group(1)
    lines = raw.splitlines()
    cleaned = []
    for l in lines:
        l = l.strip()
        if l.startswith('"'):
            content = re.sub(r'^\s*"', '', l)
            content = re.sub(r'"\s*\+?\s*$', '', content)
            cleaned.append(content)
    full_js = '\n'.join(cleaned)
    full_js = full_js.replace('\\"', '"').replace('\\\\', '\\').replace('" + isAutoPlay + "', 'true')
    with open('scratch/extracted_current_bot.js', 'w', encoding='utf-8') as out:
        out.write(full_js)
    print('Wrote scratch/extracted_current_bot.js, length:', len(full_js))
    
    r = subprocess.run(['node', '-c', 'scratch/extracted_current_bot.js'], capture_output=True, text=True)
    print('Node syntax check returncode:', r.returncode)
    if r.returncode != 0:
        print('Node stderr:', r.stderr)
    else:
        print('Syntax valid!')
else:
    print('Regex failed to find js')
