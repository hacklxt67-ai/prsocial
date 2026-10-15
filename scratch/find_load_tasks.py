import sys

with open('scratch/pages_tasks.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx = js.find('function loadTasks')
if idx == -1:
    idx = js.find('loadTasks =')
if idx != -1:
    with open('scratch/load_tasks_def.txt', 'w', encoding='utf-8') as out:
        out.write(js[idx:idx+2000])
    print('Wrote scratch/load_tasks_def.txt')
else:
    print('Not found')
