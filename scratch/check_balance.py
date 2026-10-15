with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\eval_test2.js', 'r', encoding='utf-8') as f:
    code = f.read()

stack = []
pairs = {')': '(', '}': '{', ']': '['}
quotes = {'"': '"', "'": "'", '`': '`'}
in_quote = None
escaped = False

for idx, ch in enumerate(code):
    if escaped:
        escaped = False
        continue
    if ch == '\\':
        escaped = True
        continue
    if in_quote:
        if ch == in_quote:
            in_quote = None
        continue
    if ch in quotes:
        in_quote = ch
        continue
    if ch in '({[':
        stack.append((ch, idx))
    elif ch in ')}]':
        if not stack:
            print(f"Unmatched closing {ch} at index {idx}")
        else:
            top, top_idx = stack.pop()
            if top != pairs[ch]:
                print(f"Mismatched {ch} at {idx} (expected closing for {top} at {top_idx})")

if stack:
    print(f"Unclosed items remaining on stack ({len(stack)}):")
    for ch, idx in stack:
        context = code[max(0, idx-20):min(len(code), idx+40)]
        print(f"  Unclosed '{ch}' at index {idx}: ...{context}...")
if in_quote:
    print(f"Unclosed quote: {in_quote}")
if not stack and not in_quote:
    print("All brackets and quotes are balanced!")
