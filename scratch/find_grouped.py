with open('scratch/pages_tasks.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx = js.find('function renderGroupedTasks')
if idx != -1:
    with open('scratch/render_grouped_def.txt', 'w', encoding='utf-8') as out:
        out.write(js[idx:idx+2500])
    print('Wrote scratch/render_grouped_def.txt')
else:
    print('Not found')
