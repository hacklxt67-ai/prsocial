import subprocess

with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\eval_test.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace the java placeholder
js = js.replace('" + isAutoPlay + "', 'true')

with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\eval_test2.js', 'w', encoding='utf-8') as f:
    f.write(js)

r = subprocess.run(['node', '-c', r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\eval_test2.js'], capture_output=True, text=True)
print("node -c code:", r.returncode)
print("node -c stderr:", r.stderr)
