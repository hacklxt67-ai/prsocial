@echo off
chcp 65001 >nul
title PR.Social Bot - Recuperation des 209 Taches Rejetees
cd /d "%~dp0"
cls
python lancer_recuperation_complete.py
pause
