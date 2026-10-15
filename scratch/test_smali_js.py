with open('apk_mod/smali/social/pr/app/AutoTasksView.smali', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, l in enumerate(lines):
    if 'const-string v1, "(function()' in l:
        print('Found start at line', idx+1)
        # The string is in this line or next lines
        print(l[:200])
