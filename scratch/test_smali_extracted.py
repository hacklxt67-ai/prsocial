import subprocess

with open('apk_mod/smali/social/pr/app/AutoTasksView.smali', 'r', encoding='utf-8') as f:
    lines = f.readlines()

p1 = lines[841].strip() # 842 is 1-indexed, so 841
p2 = lines[853].strip() # 854 is 1-indexed, so 853

# extract between quotes
str1 = p1[p1.find('"')+1:p1.rfind('"')]
str2 = p2[p2.find('"')+1:p2.rfind('"')]

full = str1 + 'true' + str2
# unescape smali escapes: \' -> ' and \" -> "
full = full.replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')

with open('scratch/smali_extracted.js', 'w', encoding='utf-8') as out:
    out.write(full)

print('Extracted length:', len(full))
r = subprocess.run(['node', '-c', 'scratch/smali_extracted.js'], capture_output=True, text=True)
print('Node check code:', r.returncode)
if r.returncode != 0:
    print('Node stderr:', r.stderr)
else:
    print('Node syntax OK!')
