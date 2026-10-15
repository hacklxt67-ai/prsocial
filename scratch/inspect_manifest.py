import re

with open('apk_mod_social_1.2.0/AndroidManifest.xml', 'r', encoding='utf-8') as f:
    manifest = f.read()

for attr in ['package', 'versionCode', 'versionName', 'testOnly', 'debuggable', 'extractNativeLibs', 'minSdkVersion', 'targetSdkVersion']:
    m = re.findall(attr + r'="([^"]+)"', manifest)
    print(f'{attr}: {m}')
