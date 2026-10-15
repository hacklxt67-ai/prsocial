import re

with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\pages_tasks.js', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'(\/api\/tasks\/[^\s\'"`]+)', text)
for m in set(matches):
    print(m)

matches2 = re.findall(r'(\/tasks\/[^\s\'"`]+)', text)
for m in set(matches2):
    print(m)
