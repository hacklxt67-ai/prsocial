import re

with open('scratch/pages_tasks.js', 'r', encoding='utf-8') as f:
    js = f.read()

for m in re.finditer(r'<button[^>]*sort[^>]*>', js, re.IGNORECASE):
    print('Button:', m.group(0))

for m in re.finditer(r'data-sort=[\'"][^\'"]*[\'"]', js):
    print('data-sort:', m.group(0))

for m in re.finditer(r'class=[\'"][^\'"]*sort[^\'"]*[\'"]', js):
    print('class sort:', m.group(0))
