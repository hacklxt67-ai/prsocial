import urllib.request

url = 'https://pr.social/js/pages/my-tasks.js?v=appsync20260811h'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode('utf-8', errors='ignore')
        with open(r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\pages_my_tasks.js', 'w', encoding='utf-8') as f:
            f.write(content)
        print('Saved pages_my_tasks.js, length:', len(content))
except Exception as e:
    print('Error:', e)
