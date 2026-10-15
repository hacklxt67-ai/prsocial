with open('scratch/extracted_current_bot.js', 'r', encoding='utf-8') as f:
    js_java = f.read()

with open('scratch/smali_extracted.js', 'r', encoding='utf-8') as f:
    js_smali = f.read()

print('Length in Java:', len(js_java))
print('Length in Smali:', len(js_smali))

# Let's compare characters
min_len = min(len(js_java), len(js_smali))
first_diff = -1
for i in range(min_len):
    if js_java[i] != js_smali[i]:
        first_diff = i
        break

if first_diff != -1:
    print(f'First diff at index {first_diff}:')
    print('Java :', repr(js_java[max(0, first_diff-30):first_diff+40]))
    print('Smali:', repr(js_smali[max(0, first_diff-30):first_diff+40]))
else:
    print('Identical up to min_len')
