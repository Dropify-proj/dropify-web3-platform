@echo off
echo 🚀 Starting Dropify Testnet Platform...

echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo 🔧 Installing additional packages...
call npm install framer-motion

echo.
echo 🔍 Checking Next.js configuration...
if not exist "next.config.js" (
    echo Creating basic Next.js config...
    echo module.exports = { experimental: { appDir: true } } > next.config.js
)

echo.
echo 🔧 Building project first...
call npm run build

echo.
echo ⚡ Starting development server...
start /B npm run dev

echo.
echo ⏳ Waiting for server to start...
timeout /t 5 /nobreak > nul

echo.
echo 🌐 Opening in browser...
start http://localhost:3000/testnet-live

echo.
echo 🎉 Platform should be running at http://localhost:3000
echo.
echo 📋 Available pages:
echo   • http://localhost:3000/testnet-live (Main testnet demo)
echo   • http://localhost:3000/userbase (User analytics dashboard)  
echo   • http://localhost:3000/share (Viral sharing tools)
echo   • http://localhost:3000 (Main platform)
echo.
echo 💡 While contacting attorneys, your testnet is building users!
pause
