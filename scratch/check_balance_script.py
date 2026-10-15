with open('scratch/smali_extracted.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's check brackets / parentheses / braces balance
stack = []
pairs = {')': '(', ']': '[', '}': '{'}
in_string = False
string_char = None
escape = False

for idx, ch in enumerate(code):
    if escape:
        escape = False
        continue
    if ch == '\\':
        escape = True
        continue
    if in_string:
        if ch == string_char:
            in_string = False
        continue
    else:
        if ch in ("'", '"', '`'):
            in_string = True
            string_char = ch
            continue
        if ch in ('(', '[', '{'):
            stack.append((ch, idx))
        elif ch in (')', ']', '}'):
            if not stack:
                print(f"Extra closing {ch} at {idx}")
            else:
                top, top_idx = stack.pop()
                if top != pairs[ch]:
                    print(f"Mismatched {ch} at {idx} for {top} at {top_idx}")

if in_string:
    print(f"Unclosed string of type {string_char}")
if stack:
    print(f"Unclosed items in stack ({len(stack)}):")
    for s, i in stack:
        print(f"  Unclosed '{s}' opened at {i}: {repr(code[max(0, i-20):i+50])}")
