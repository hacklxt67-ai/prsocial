import re

with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\src\social\pr\app\AutoTasksView.java', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find('String js =')
end = content.find('webView.evaluateJavascript(js,', start)

js_block = content[start:end].strip()

# Let's extract all string literals concatenated in this block
parts = []
for line in js_block.splitlines():
    line = line.strip()
    m = re.match(r'^"(.*)"(?:\s*\+|\s*;)?$', line)
    if m:
        val = m.group(1)
        # Java unescape: \\ -> \, \" -> ", \n -> \n, \t -> \t
        # But in Java source: "\\" is two backslashes.
        # Let's replace:
        val = val.replace('\\"', '"').replace('\\\\', '\\')
        parts.append(val)
    elif 'isAutoPlay' in line:
        parts.append('true')

full_js = "\n".join(parts)

with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\extracted.js', 'w', encoding='utf-8') as out:
    out.write(full_js)

print("Wrote extracted.js, length:", len(full_js))
