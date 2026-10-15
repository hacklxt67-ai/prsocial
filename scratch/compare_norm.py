import re

with open('scratch/extracted_current_bot.js', 'r', encoding='utf-8') as f:
    js_java = f.read()

with open('scratch/smali_extracted.js', 'r', encoding='utf-8') as f:
    js_smali = f.read()

norm_java = re.sub(r'\s+', ' ', js_java).strip()
norm_smali = re.sub(r'\s+', ' ', js_smali).strip()

print('Norm Java length :', len(norm_java))
print('Norm Smali length:', len(norm_smali))

min_len = min(len(norm_java), len(norm_smali))
first_diff = -1
for i in range(min_len):
    if norm_java[i] != norm_smali[i]:
        first_diff = i
        break

if first_diff != -1:
    print(f'First diff at index {first_diff}:')
    print('Java :', repr(norm_java[max(0, first_diff-30):first_diff+40]))
    print('Smali:', repr(norm_smali[max(0, first_diff-30):first_diff+40]))
else:
    print('Identical up to min_len')
