import os
import re

urls = set()
api_keys = set()
strings_of_interest = set()

ignore_domains = [
    'schemas.android.com',
    'www.w3.org',
    'xmlpull.org',
    'apache.org',
    'developer.android.com',
    'plus.google.com',
    'github.com/skylot/jadx'
]

for root, dirs, files in os.walk('decompiled_source'):
    for f in files:
        if f.endswith(('.java', '.xml', '.properties', '.txt', '.json')):
            p = os.path.join(root, f)
            try:
                with open(p, 'r', encoding='utf-8', errors='ignore') as fh:
                    content = fh.read()
                    
                    # URLs
                    found_urls = re.findall(r'https?://[^\s"\'<>]+', content)
                    for u in found_urls:
                        if not any(ign in u for ign in ignore_domains):
                            urls.add((f, u))
                            
                    # Telegram bot / api hashes / domains
                    if 'social.pr.app' in root or f in ['MainActivity.java', 'WorkerService.java', 'App.java']:
                        # look for strings like ip, domain, token, bot, ws, git, etc.
                        lines = content.split('\n')
                        for idx, line in enumerate(lines, 1):
                            if any(k in line.lower() for k in ['http', 'api', 'token', 'server', 'url', 'host', 'endpoint', 'base_url', 'git', 'socket', 'bot']):
                                if len(line.strip()) < 200:
                                    strings_of_interest.add((f, idx, line.strip()))
            except Exception as e:
                pass

print('=== URLS FOUND ===')
for f, u in sorted(urls):
    print(f'{f}: {u}')

print('\n=== KEY STRINGS IN APP CODE ===')
for f, idx, line in sorted(strings_of_interest):
    print(f'{f}:{idx}: {line}')
