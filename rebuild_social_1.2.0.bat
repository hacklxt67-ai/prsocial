@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   RECONSTRUCTION ET SIGNATURE DE PR.SOCIAL 1.2.0 MODIFIE
echo ========================================================

set "BUILD_TOOLS=C:\Users\ponir\AppData\Local\Android\Sdk\build-tools\34.0.0"
set "KEYSTORE=%USERPROFILE%\.android\debug.keystore"
set "WORK_DIR=D:\social_build"
set "OUTPUT_APK=%WORK_DIR%\PR.Social_1.2.0_modified.apk"
set "SOURCE_DIR=%~dp0apk_mod_social_1.2.0"
set "UNSIGNED_APK=%WORK_DIR%\unsigned_social.apk"
set "TEMP_DIR=%WORK_DIR%\temp"

if not exist "%TEMP_DIR%" mkdir "%TEMP_DIR%"
set "TMP=%TEMP_DIR%"
set "TEMP=%TEMP_DIR%"

if not exist "%BUILD_TOOLS%\zipalign.exe" (
    echo [ERREUR] zipalign.exe introuvable dans %BUILD_TOOLS%
    exit /b 1
)

if not exist "%BUILD_TOOLS%\apksigner.bat" (
    echo [ERREUR] apksigner.bat introuvable dans %BUILD_TOOLS%
    exit /b 1
)

if not exist "%~dp0tools\apktool\apktool.bat" (
    echo [ERREUR] Apktool introuvable dans tools\apktool
    exit /b 1
)

if not exist "%SOURCE_DIR%" (
    echo [ERREUR] Le dossier %SOURCE_DIR% n'existe pas.
    exit /b 1
)

:: Preparation du dossier de travail sur D: (plus de 40 Go libres)
if not exist "%WORK_DIR%" mkdir "%WORK_DIR%"
if exist "%UNSIGNED_APK%" del /q /f "%UNSIGNED_APK%" 2>nul
if exist "%OUTPUT_APK%" del /q /f "%OUTPUT_APK%" 2>nul
if exist "%OUTPUT_APK%.idsig" del /q /f "%OUTPUT_APK%.idsig" 2>nul

echo [1/3] Recompilation avec Apktool...
call "%~dp0tools\apktool\apktool.bat" b -f "%SOURCE_DIR%" -o "%UNSIGNED_APK%"
if errorlevel 1 (
    echo [ERREUR] Echec lors de la recompilation avec Apktool.
    exit /b 1
)

echo [2/3] Alignement direct (zipalign vers %OUTPUT_APK%)...
"%BUILD_TOOLS%\zipalign.exe" -p -f -v 4 "%UNSIGNED_APK%" "%OUTPUT_APK%"
if errorlevel 1 (
    echo [ERREUR] Echec lors du zipalign.
    exit /b 1
)

:: Nettoyage de l'APK temporaire non aligne
del /q /f "%UNSIGNED_APK%" 2>nul

echo [3/3] Signature en place avec debug.keystore (apksigner v1/v2/v3)...
set "JAVA_TOOL_OPTIONS=-Djava.io.tmpdir=%TEMP_DIR%"
call "%BUILD_TOOLS%\apksigner.bat" sign --ks "%KEYSTORE%" --ks-pass pass:android --key-pass pass:android --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true "%OUTPUT_APK%"
if errorlevel 1 (
    echo [ERREUR] Echec de la signature.
    exit /b 1
)

:: Verification de la signature
echo Verification de la signature...
call "%BUILD_TOOLS%\apksigner.bat" verify --verbose "%OUTPUT_APK%"

echo.
echo ========================================================
echo [SUCCES] APK modifie et signe pret : %OUTPUT_APK%
echo ========================================================
