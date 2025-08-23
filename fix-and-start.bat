@echo off
echo.
echo 🔧 FIXING DROPIFY PLATFORM
echo ================================
echo.

echo 📁 Navigating to platform directory...
cd /d "C:\Users\Administrator\Downloads\nextjs"

echo.
echo 🔄 Installing missing dependencies...
call npm install

echo.
echo 🚀 Starting platform in DEMO mode...
echo The Aptos blockchain integration is temporarily disabled
echo All features work in demo mode for testing
echo.
echo 🔗 Your platform will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

call npm run dev
