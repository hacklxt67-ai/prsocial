with open('scratch/bot_clean.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

js_content = js_content.replace('window.__autoPlayActive = true;', 'window.__autoPlayActive = " + isAutoPlay + ";')

lines = js_content.splitlines()
escaped_lines = []
for idx, raw_line in enumerate(lines):
    line = raw_line.strip('\r\n')
    escaped = line.replace('\\', '\\\\').replace('"', '\\"')
    escaped = escaped.replace('\\" + isAutoPlay + \\"', '" + isAutoPlay + "')
    
    if idx == len(lines) - 1:
        escaped_lines.append('            "' + escaped + ' "')
    else:
        escaped_lines.append('            "' + escaped + ' " +')

simulated_js = []
for l in escaped_lines:
    content = l.strip()[1:]
    if content.endswith('" +'):
        content = content[:-3]
    elif content.endswith('"'):
        content = content[:-1]
    simulated_js.append(content)

full_sim = "".join(simulated_js)
full_sim = full_sim.replace('\\"', '"').replace('\\\\', '\\').replace('" + isAutoPlay + "', 'true')

with open('scratch/simulated_clean_in_java.js', 'w', encoding='utf-8') as f:
    f.write(full_sim)

import subprocess
r = subprocess.run(['node', '-c', 'scratch/simulated_clean_in_java.js'], capture_output=True, text=True, encoding='utf-8', errors='replace')
print('Node return code:', r.returncode)
print('Node stderr:')
print(r.stderr)
