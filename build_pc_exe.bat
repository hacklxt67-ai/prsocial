@echo off
setlocal

echo ========================================================
echo   COMPILATION DE L'APPLICATION PR.SOCIAL PC (WINDOWS EXE)
echo ========================================================

set "WORK_DIR=D:\social_pc_bot"
set "DIST_DIR=%WORK_DIR%\dist"
set "BUILD_DIR=%WORK_DIR%\build"

if not exist "%WORK_DIR%" mkdir "%WORK_DIR%"

echo [1/2] Lancement de PyInstaller...
python -m PyInstaller --noconfirm --onedir --windowed ^
    --name "PR_Social_PC" ^
    --distpath "%DIST_DIR%" ^
    --workpath "%BUILD_DIR%" ^
    --collect-all customtkinter ^
    pc_bot/main.py

if errorlevel 1 (
    echo [ERREUR] Echec lors de la compilation PyInstaller.
    exit /b 1
)

echo [2/2] Verification de l'executable...
if exist "%DIST_DIR%\PR_Social_PC\PR_Social_PC.exe" (
    echo.
    echo ========================================================
    echo [SUCCES] Application PC creee avec succes :
    echo %DIST_DIR%\PR_Social_PC\PR_Social_PC.exe
    echo ========================================================
) else (
    echo [ERREUR] Executable non genere.
    exit /b 1
)
