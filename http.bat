@echo off
chcp 65001 >nul
title PR.Social Bot - Mode Pur HTTP (Menu et Taches Rejetees)
cd /d "%~dp0"
cls
python pc_bot/http_action_engine.py
pause
