import os

js_path = r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\bot_improved.js'
java_path = r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\src\social\pr\app\AutoTasksView.java'

with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Replace hardcoded window.__autoPlayActive = true; with dynamic java isAutoPlay
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

java_code = "        String js = \n" + "\n".join(escaped_lines) + ";"

with open(java_path, 'r', encoding='utf-8') as f:
    orig_java = f.read()

start_marker = "    private void injectAutomationBot() {"
end_marker = "        webView.evaluateJavascript(js, null);\n    }"

start_pos = orig_java.find(start_marker)
if start_pos == -1:
    print("Error: start_marker not found!")
    exit(1)

end_pos = orig_java.find(end_marker, start_pos)
if end_pos == -1:
    print("Error: end_marker not found!")
    exit(1)

end_pos += len(end_marker)

new_method = (
    "    private void injectAutomationBot() {\n"
    "        if (webView == null) return;\n"
    + java_code + "\n"
    "        webView.evaluateJavascript(js, null);\n"
    "    }"
)

modified_java = orig_java[:start_pos] + new_method + orig_java[end_pos:]

with open(java_path, 'w', encoding='utf-8') as f:
    f.write(modified_java)

print("Successfully replaced injectAutomationBot without regex unescaping!")
