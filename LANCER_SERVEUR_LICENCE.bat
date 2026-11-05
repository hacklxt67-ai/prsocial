@echo off
chcp 65001 >nul
title PR.Social - Serveur de Licences et Administration Web

echo ============================================================
echo   [*] Demarrage du Serveur API et Administration PR.Social
echo ============================================================
echo.

cd /d "%~dp0server"
python run_server.py

pause
