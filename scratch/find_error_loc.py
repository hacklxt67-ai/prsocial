with open('scratch/exact_smali_decoded.js', 'r', encoding='utf-8') as f:
    js = f.read()

print('Total chars:', len(js))
print('End of file (last 300 chars):')
print(repr(js[-300:]))

# Let's count parentheses, braces, brackets
for pair in [('(', ')'), ('{', '}'), ('[', ']')]:
    opened = js.count(pair[0])
    closed = js.count(pair[1])
    print(f"'{pair[0]}' count: {opened}, '{pair[1]}' count: {closed} (diff: {opened - closed})")
