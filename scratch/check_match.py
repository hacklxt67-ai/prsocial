with open('scratch/src/social/pr/app/AutoTasksView.java', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, l in enumerate(lines):
    if 'match' in l:
        print(f"Line {idx+1}: {repr(l)}")
