@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   RECONSTRUCTION ET SIGNATURE DE L'APK MODIFIE
echo ========================================================

set "BUILD_TOOLS=C:\Users\ponir\AppData\Local\Android\Sdk\build-tools\34.0.0"
set "KEYSTORE=%USERPROFILE%\.android\debug.keystore"
set "OUTPUT_APK=pr-worker-telegram-modified.apk"

if not exist "%BUILD_TOOLS%\zipalign.exe" (
    echo [ERREUR] zipalign.exe introuvable dans %BUILD_TOOLS%
    exit /b 1
)

if not exist "tools\apktool\apktool.bat" (
    echo [ERREUR] Apktool introuvable dans tools\apktool
    exit /b 1
)

if not exist "apk_mod" (
    echo [ERREUR] Le dossier apk_mod n'existe pas.
    exit /b 1
)

if not exist "dist" mkdir "dist"

echo [1/3] Recompilation avec Apktool...
call "tools\apktool\apktool.bat" b apk_mod -o "dist\unsigned.apk"
if errorlevel 1 (
    echo [ERREUR] Echec lors de la recompilation avec Apktool.
    exit /b 1
)

echo [2/3] Alignement (zipalign)...
"%BUILD_TOOLS%\zipalign.exe" -p -f -v 4 "dist\unsigned.apk" "dist\aligned.apk" > nul
if errorlevel 1 (
    echo [ERREUR] Echec lors du zipalign.
    exit /b 1
)

echo [3/3] Signature avec debug.keystore (apksigner)...
call "%BUILD_TOOLS%\apksigner.bat" sign --ks "%KEYSTORE%" --ks-pass pass:android --key-pass pass:android --out "%OUTPUT_APK%" "dist\aligned.apk"
if errorlevel 1 (
    echo [ERREUR] Echec de la signature.
    exit /b 1
)

echo.
echo [SUCCES] APK modifie et pret a etre installe : %OUTPUT_APK%
echo ========================================================
