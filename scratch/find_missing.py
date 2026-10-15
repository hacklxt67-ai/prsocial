with open('scratch/bot_clean.js', 'r', encoding='utf-8') as f:
    js_clean = f.read()

with open('scratch/exact_smali_decoded.js', 'r', encoding='utf-8') as f:
    js_smali = f.read()

print("bot_clean.js: '(' count:", js_clean.count('('), "')' count:", js_clean.count(')'))
print("js_smali    : '(' count:", js_smali.count('('), "')' count:", js_smali.count(')'))

# Let's find diff between bot_clean.js and exact_smali_decoded.js
import difflib

# normalize whitespace
lines_clean = [l.strip() for l in js_clean.splitlines() if l.strip()]
# split smali on ';' or common statements
import re

# let's search line by line in bot_clean.js to see what is missing in smali
missing = []
for idx, l in enumerate(lines_clean):
    # take a unique substring from line
    test_sub = l
    if len(test_sub) > 10:
        test_sub = test_sub[:30]
    if test_sub not in js_smali:
        missing.append((idx+1, l))

print(f"Missing {len(missing)} lines from bot_clean:")
for idx, l in missing[:15]:
    print(f"  Line {idx}: {l}")
