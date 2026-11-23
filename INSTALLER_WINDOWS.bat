@echo off
chcp 65001 >nul
title PR.Social Bot - Installation Windows
echo ========================================================
echo   🚀 PR.Social Bot v3.2 - Installation Rapide Windows
echo ========================================================
echo.
echo [1/3] Verification de Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Python n'est pas installe ou n'est pas dans le PATH.
    echo Telechargez et installez Python depuis : https://www.python.org/downloads/
    echo N'oubliez pas de cocher "Add Python to PATH" lors de l'installation.
    pause
    exit /b 1
)

echo [2/3] Installation des modules requis (requests, Pillow)...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ATTENTION] Erreur lors de l'installation des dependances.
    pause
    exit /b 1
)

echo [3/3] Preparation du fichier de configuration...
if not exist config.json (
    if exist config.example.json (
        copy config.example.json config.json >nul
        echo [OK] Fichier config.json initialise depuis config.example.json.
    )
)

echo.
echo ========================================================
echo   ✓ Installation terminee avec succes !
echo   Lancez le bot avec : LANCER_BOT_WINDOWS.bat
echo ========================================================
echo.
pause
