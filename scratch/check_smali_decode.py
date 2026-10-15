with open('apk_mod/smali/social/pr/app/AutoTasksView.smali', 'r', encoding='utf-8') as f:
    lines = f.readlines()

p1 = lines[841].strip() # line 842
p2 = lines[853].strip() # line 854

# extract exact content between first " and last "
s1 = p1[p1.find('"')+1:p1.rfind('"')]
s2 = p2[p2.find('"')+1:p2.rfind('"')]

# In smali, single quotes in string constants are escaped as \'
# Let's decode smali string literals according to smali specs:
# \' -> '
# \" -> "
# \\ -> \
def decode_smali_string(s):
    res = []
    i = 0
    n = len(s)
    while i < n:
        if s[i] == '\\' and i + 1 < n:
            nxt = s[i+1]
            if nxt == "'":
                res.append("'")
                i += 2
            elif nxt == '"':
                res.append('"')
                i += 2
            elif nxt == '\\':
                res.append('\\')
                i += 2
            elif nxt == 'n':
                res.append('\n')
                i += 2
            elif nxt == 't':
                res.append('\t')
                i += 2
            elif nxt == 'r':
                res.append('\r')
                i += 2
            elif nxt == 'u' and i + 5 <= n:
                res.append(chr(int(s[i+2:i+6], 16)))
                i += 6
            else:
                res.append(s[i:i+2])
                i += 2
        else:
            res.append(s[i])
            i += 1
    return "".join(res)

decoded1 = decode_smali_string(s1)
decoded2 = decode_smali_string(s2)

full_js = decoded1 + "true" + decoded2

with open('scratch/exact_smali_decoded.js', 'w', encoding='utf-8') as f:
    f.write(full_js)

print('Saved exact_smali_decoded.js, length:', len(full_js))

import subprocess
r = subprocess.run(['node', '-c', 'scratch/exact_smali_decoded.js'], capture_output=True, text=True)
print('Node syntax check return code:', r.returncode)
if r.returncode != 0:
    print('Node stderr:')
    print(r.stderr)
else:
    print('Syntax is completely valid in exact smali decoded!')
