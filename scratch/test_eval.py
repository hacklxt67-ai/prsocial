import subprocess

with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\src\social\pr\app\AutoTasksView.java', 'r', encoding='utf-8') as f:
    code = f.read()

start = code.find('String js =')
end = code.find('webView.evaluateJavascript(js,', start)

block = code[start:end].strip()

# Reconstruct the exact string Java evaluates:
# In Java: String js = "line1 " + "line2 " + ...;
js_lines = []
for line in block.splitlines():
    line = line.strip()
    if line.startswith('"'):
        # Strip leading quote
        line = line[1:]
        # Strip trailing quote and + or ;
        if line.endswith('";'):
            line = line[:-2]
        elif line.endswith('" +'):
            line = line[:-3]
        elif line.endswith('"'):
            line = line[:-1]
        
        # In Java: \n is newline, \\ is \, \" is "
        # But we want to simulate the evaluated Java string:
        # line was written in Java source. When Java compiles, \n -> newline, \" -> ", \\ -> \
        # Let's decode Java escapes:
        decoded = bytes(line, "utf-8").decode("unicode_escape")
        js_lines.append(decoded)

full_js = "".join(js_lines)

with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\eval_test.js', 'w', encoding='utf-8') as f:
    f.write(full_js)

print("Saved eval_test.js (length: " + str(len(full_js)) + ")")

# Run node -c on it!
r = subprocess.run(['node', '-c', r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\eval_test.js'], capture_output=True, text=True)
print("node -c return code:", r.returncode)
print("node -c stderr:", r.stderr)
