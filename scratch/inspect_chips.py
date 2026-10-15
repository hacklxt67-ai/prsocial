import re

with open('scratch/pages_tasks.js', 'r', encoding='utf-8') as f:
    js = f.read()

for m in re.finditer(r'<button[^>]*platform-chip[^>]*>', js):
    print('Chip button:', m.group(0))

for m in re.finditer(r'<div[^>]*platform-chip[^>]*>', js):
    print('Chip div:', m.group(0))

idx = js.find('platform-chip')
while idx != -1:
    print('Context around platform-chip:')
    print(js[max(0, idx-50):min(len(js), idx+150)])
    print('-'*40)
    idx = js.find('platform-chip', idx+1)
    if idx > 15000: # limit
        break
