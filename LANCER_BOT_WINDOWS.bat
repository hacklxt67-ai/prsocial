@echo off
chcp 65001 >nul
title PR.Social Bot v3.2 - Windows
echo ========================================================
echo   🚀 Demarrage de PR.Social Bot v3.2 (Mode Silencieux)
echo ========================================================
echo.
python run_bot.py
if %errorlevel% neq 0 (
    echo.
    echo Le bot s'est arrete avec le code %errorlevel%.
    pause
)
