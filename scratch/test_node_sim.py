with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\extracted.js', 'r', encoding='utf-8') as f:
    js_code = f.read()

# Let's create a test runner script in node
test_runner = f"""
const window = {{}};
const document = {{
    querySelector: function(s) {{ console.log('querySelector called with:', s); return null; }},
    querySelectorAll: function(s) {{ console.log('querySelectorAll called with:', s); return []; }}
}};
const localStorage = {{
    setItem: function(k, v) {{ console.log('localStorage.setItem', k); }}
}};
const fetch = function(url, opts) {{
    console.log('fetch called with:', url);
    return Promise.resolve({{
        ok: true,
        json: function() {{ return Promise.resolve({{ items: [] }}); }}
    }});
}};
const setInterval = function(fn, ms) {{
    console.log('setInterval registered with ms:', ms);
    // Run the function once immediately!
    console.log('--- EXECUTING INTERVAL CALLBACK ONCE ---');
    try {{
        fn();
        console.log('--- INTERVAL CALLBACK FINISHED SUCCESSFULLY ---');
    }} catch(e) {{
        console.error('--- ERROR IN INTERVAL CALLBACK ---', e);
    }}
    return 123;
}};
const clearInterval = function(id) {{ console.log('clearInterval', id); }};
const setTimeout = function(fn, ms) {{ console.log('setTimeout', ms); return 456; }};
const clearTimeout = function(id) {{ console.log('clearTimeout', id); }};
const console = global.console;

{js_code}
"""

with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\run_test_node.js', 'w', encoding='utf-8') as f:
    f.write(test_runner)

print("Saved run_test_node.js")
