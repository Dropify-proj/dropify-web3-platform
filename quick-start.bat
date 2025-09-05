@echo off
title Dropify Testnet - Quick Start
echo 🚀 DROPIFY TESTNET - QUICK START
echo.

echo [1/3] Installing dependencies...
npm install

echo.
echo [2/3] Starting development server...
echo      Server will be available at: http://localhost:3000
echo.

start /B npm run dev

echo [3/3] Waiting for server to start...
timeout /t 8 /nobreak > nul

echo.
echo ✅ Opening your testnet platform...
start http://localhost:3000/testnet-simple

echo.
echo 📋 Available pages:
echo   • /testnet-simple (Working demo without animations)
echo   • /testnet-live   (Full featured - may need framer-motion)
echo   • /userbase       (Analytics dashboard)
echo   • /share          (Viral growth tools)
echo.
echo 💡 If pages don't load, wait 30 seconds for full startup
echo    and refresh your browser.
echo.
pause
