import os, subprocess, shutil

work_dir = r'c:\Users\ponir\OneDrive\Desktop\social1\scratch\java_to_smali'
if os.path.exists(work_dir):
    shutil.rmtree(work_dir)
os.makedirs(work_dir, exist_ok=True)

# Write test java file
java_src = """package social.pr.app;
public class MyHelper {
    public static String getVersion() {
        return "1.0";
    }
}
"""
src_file = os.path.join(work_dir, 'MyHelper.java')
with open(src_file, 'w', encoding='utf-8') as f:
    f.write(java_src)

# 1. Compile with javac
android_jar = r'C:\Users\ponir\AppData\Local\Android\Sdk\platforms\android-34\android.jar'
r1 = subprocess.run(['javac', '-cp', android_jar, '-d', work_dir, src_file], capture_output=True, text=True)
print('javac:', r1.returncode, r1.stderr)

# 2. Compile to dex with d8
class_file = os.path.join(work_dir, 'social', 'pr', 'app', 'MyHelper.class')
d8_bat = r'C:\Users\ponir\AppData\Local\Android\Sdk\build-tools\34.0.0\d8.bat'
r2 = subprocess.run([d8_bat, class_file, '--output', work_dir], capture_output=True, text=True, shell=True)
print('d8:', r2.returncode, r2.stderr)

dex_file = os.path.join(work_dir, 'classes.dex')
print('classes.dex exists:', os.path.exists(dex_file))

# 3. Disassemble to smali with apktool
apktool_bat = r'c:\Users\ponir\OneDrive\Desktop\social1\tools\apktool\apktool.bat'
# Package classes.dex into a dummy zip/apk
import zipfile
dummy_apk = os.path.join(work_dir, 'dummy.apk')
with zipfile.ZipFile(dummy_apk, 'w') as z:
    z.write(dex_file, 'classes.dex')

out_smali = os.path.join(work_dir, 'out')
r3 = subprocess.run([apktool_bat, 'd', '-f', dummy_apk, '-o', out_smali], capture_output=True, text=True, shell=True)
print('apktool d:', r3.returncode)

# Check generated smali files
for root, dirs, files in os.walk(os.path.join(out_smali, 'smali')):
    for file in files:
        print('Smali output:', os.path.join(root, file))
