@echo off
title Dropify Testnet Platform
color 0A

echo.
echo ==========================================
echo   🚀 DROPIFY TESTNET PLATFORM LAUNCHER
echo ==========================================
echo.

echo [1/6] 📦 Installing dependencies...
call npm install --silent
if %ERRORLEVEL% NEQ 0 (
    echo ❌ NPM install failed. Trying with --force...
    call npm install --force --silent
)

echo [2/6] 🔧 Installing framer-motion...
call npm install framer-motion --silent

echo [3/6] 🔍 Checking ports...
netstat -an | find "3000" > nul
if %ERRORLEVEL% EQU 0 (
    echo ⚠️  Port 3000 is in use. Killing existing processes...
    taskkill /F /IM node.exe /T 2>nul
    timeout /t 2 /nobreak > nul
)

echo [4/6] 🏗️  Building project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Build had warnings but continuing...
)

echo [5/6] ⚡ Starting development server...
echo.
echo ┌─────────────────────────────────────────┐
echo │  📱 Your Testnet Platform URLs:         │
echo │                                         │
echo │  🎯 Main Demo: /testnet-live           │
echo │  📊 Analytics: /userbase               │
echo │  📢 Sharing:   /share                  │
echo │  🏠 Home:      /                       │
echo └─────────────────────────────────────────┘
echo.

start /B npm run dev

echo [6/6] ⏳ Waiting for server startup...
:wait_loop
timeout /t 2 /nobreak > nul
curl -s http://localhost:3000 > nul 2>&1
if %ERRORLEVEL% EQU 0 goto server_ready
echo   ... still starting ...
goto wait_loop

:server_ready
echo.
echo ✅ SERVER IS READY!
echo.
echo 🌐 Opening your testnet platform...
start http://localhost:3000/testnet-live

echo.
echo 💡 TIPS:
echo   • Use Ctrl+C in the terminal to stop the server
echo   • Refresh if pages don't load immediately
echo   • Check the terminal for any error messages
echo.
echo 🎯 Ready to build your user base while contacting attorneys!
echo.
pause
