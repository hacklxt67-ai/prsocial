import os
import subprocess
import shutil
import zipfile

work_dir = r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\java_build'
if os.path.exists(work_dir):
    shutil.rmtree(work_dir)
os.makedirs(work_dir, exist_ok=True)

src_dir = r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\src\social\pr\app'
java_files = [
    os.path.join(src_dir, 'AutoTasksView.java'),
    os.path.join(src_dir, 'MenuHelper.java')
]

android_jar = r'C:\Users\ponir\AppData\Local\Android\Sdk\platforms\android-34\android.jar'
javac_exe = r'C:\Program Files\Eclipse Adoptium\jdk-17.0.19.7-hotspot\bin\javac.exe'
if not os.path.exists(javac_exe):
    javac_exe = 'javac'

print('1. Compiling Java with javac (Java 8 compatibility)...')
cmd_javac = [javac_exe, '-encoding', 'UTF-8', '-source', '8', '-target', '8', '-cp', android_jar, '-d', work_dir] + java_files
r_javac = subprocess.run(cmd_javac, capture_output=True, text=True)
print('javac code:', r_javac.returncode)
if r_javac.returncode != 0:
    print('javac stderr:', r_javac.stderr)
    exit(1)

# Find all generated .class files
class_files = []
for root, dirs, files in os.walk(work_dir):
    for f in files:
        if f.endswith('.class'):
            class_files.append(os.path.join(root, f))

print(f'Compiled {len(class_files)} class files:')
for cf in class_files:
    print(' ', os.path.basename(cf))

print('2. Compiling to DEX with d8 (--min-api 26)...')
d8_bat = r'C:\Users\ponir\AppData\Local\Android\Sdk\build-tools\34.0.0\d8.bat'
cmd_d8 = [d8_bat, '--min-api', '26', '--output', work_dir] + class_files
r_d8 = subprocess.run(cmd_d8, capture_output=True, text=True, shell=True)
print('d8 code:', r_d8.returncode)
if r_d8.returncode != 0:
    print('d8 stderr:', r_d8.stderr)
    exit(1)

dex_file = os.path.join(work_dir, 'classes.dex')
if not os.path.exists(dex_file):
    print('DEX file missing!')
    exit(1)

print('3. Packaging classes.dex to dummy.apk for apktool...')
dummy_apk = os.path.join(work_dir, 'dummy.apk')
with zipfile.ZipFile(dummy_apk, 'w') as z:
    z.write(dex_file, 'classes.dex')

out_smali_dir = os.path.join(work_dir, 'out_smali')
apktool_bat = r'c:\Users\ponir\OneDrive\Desktop\social1\tools\apktool\apktool.bat'
cmd_apktool = [apktool_bat, 'd', '-f', dummy_apk, '-o', out_smali_dir]
r_apktool = subprocess.run(cmd_apktool, capture_output=True, text=True, shell=True)
print('apktool code:', r_apktool.returncode)

# Check smali output
smali_gen_dir = os.path.join(out_smali_dir, 'smali', 'social', 'pr', 'app')
dest_dir = r'c:\Users\ponir\OneDrive\Desktop\social1\apk_mod\smali\social\pr\app'

print('4. Copying generated smali files to apk_mod...')
count = 0
for f in os.listdir(smali_gen_dir):
    if f.endswith('.smali'):
        src_f = os.path.join(smali_gen_dir, f)
        dest_f = os.path.join(dest_dir, f)
        shutil.copy2(src_f, dest_f)
        print(' Copied:', f)
        count += 1

print(f'Successfully copied {count} smali files to {dest_dir}!')
