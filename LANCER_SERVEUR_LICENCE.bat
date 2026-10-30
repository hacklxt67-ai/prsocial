@echo off
chcp 65001 >nul
title PR.Social - Serveur de Licences & Administration Web

echo ============================================================
echo   🚀 Démarrage du Serveur API & Administration PR.Social
echo ============================================================
echo.

cd /d "%~dp0server"
python run_server.py

pause
