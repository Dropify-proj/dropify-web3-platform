@echo off
title DROPIFY INVESTOR DEMO
color 0A

echo.
echo ======================================
echo      DROPIFY INVESTOR DEMO LAUNCHER
echo ======================================
echo.
echo 🚀 Professional Demo Environment
echo 💼 Ready for Investor Presentations
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 20+
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.
echo 🔄 Initializing demo environment...
echo.

REM Launch the demo
node start-investor-demo.js

echo.
echo 👋 Demo session completed
pause
