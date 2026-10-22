@echo off
title Installation des Dependances - PR.Social Bot PC
color 0b
cls

echo ==============================================================================
echo       INSTALLATEUR INDEPENDANT DE DEPENDANCES - PR.SOCIAL BOT (WINDOWS)
echo ==============================================================================
echo.
echo Ce script configure automatiquement votre PC avec toutes les dependances
echo necessaires pour executer le bot PR.Social.
echo.

:: 1. Verification de Python
echo [1/3] Verification de Python...
python --version >nul 2>&1
if errorlevel 1 (
    color 0c
    echo.
    echo ==============================================================================
    echo [ERREUR CRITIQUE] Python n'est pas installe ou n'est pas dans le PATH !
    echo ==============================================================================
    echo.
    echo 1. Rendez-vous sur : https://www.python.org/downloads/
    echo 2. Telechargez et lancez le programme d'installation.
    echo 3. IMPORTANT : Cochez imperativement la case "Add python.exe to PATH".
    echo 4. Relancez ensuite ce fichier .cmd.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set "PY_VER=%%i"
echo  - OK : %PY_VER% est pret.
echo.

:: 2. Installation directe de toutes les dependances Python
echo [2/3] Installation des bibliotheques requises en 1 clic...
echo.
echo   -^> requests       (Communication API PR.Social)
echo   -^> selenium       (Automatisation du navigateur Chrome)
echo   -^> customtkinter  (Interface Graphique Moderne)
echo   -^> Pillow         (Traitement et hachage unique des captures d'ecran)
echo.

python -m pip install --upgrade pip >nul 2>&1
python -m pip install requests selenium customtkinter Pillow

if errorlevel 1 (
    color 0c
    echo.
    echo [ERREUR] L'installation de certaines dependances a echoue.
    echo Verifiez votre connexion Internet et reessayez.
    echo.
    pause
    exit /b 1
)

echo.
echo  - OK : Toutes les dependances Python ont ete installees avec succes !
echo.

:: 3. Verification de Google Chrome
echo [3/3] Verification du navigateur Google Chrome...
set "CHROME_FOUND=0"
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set "CHROME_FOUND=1"
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" set "CHROME_FOUND=1"
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set "CHROME_FOUND=1"

if "%CHROME_FOUND%"=="1" (
    echo  - OK : Google Chrome est bien detecte.
) else (
    echo  - INFO : Google Chrome n'a pas ete trouve dans le repertoire par defaut.
    echo    Si vous prevoyez d'utiliser le mode navigateur ou l'interface graphique,
    echo    pensez a installer Chrome depuis : https://www.google.com/chrome/
)

echo.
color 0a
echo ==============================================================================
echo                 INSTALLATION TERMINEE AVEC SUCCES !
echo ==============================================================================
echo Votre PC est desormais 100%% configure et pret a executer le Bot PR.Social.
echo.
pause
