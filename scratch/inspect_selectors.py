import re

with open('scratch/tasks_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('scratch/pages_tasks.js', 'r', encoding='utf-8') as f:
    js = f.read()

print('=== HTML SEARCH FOR CHIPS / PLATFORMS ===')
for line in html.splitlines():
    if 'platform' in line.lower() or 'chip' in line.lower():
        print(line[:120])

print('\n=== JS SEARCH FOR CHIPS / PLATFORMS ===')
for line in js.splitlines():
    if 'platformchips' in line.lower() or 'platform-chips' in line.lower() or 'platform_chip' in line.lower():
        print(line[:120])
