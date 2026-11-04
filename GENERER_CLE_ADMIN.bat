@echo off
chcp 65001 >nul
title PR.Social - Générateur de Clés Admin
cd /d "%~dp0"
python GENERER_CLE_ADMIN.py
pause

