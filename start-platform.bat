@echo off
echo.
echo 🚀 DROPIFY PLATFORM STARTUP
echo ================================
echo.

echo 📁 Navigating to platform directory...
cd /d "C:\Users\Administrator\Downloads\nextjs"

echo.
echo 🔍 Verifying platform components...
node verify-platform.js

echo.
echo 🌐 Starting development server...
echo Press Ctrl+C to stop the server
echo.
echo 🔗 Your platform will be available at: http://localhost:3000
echo.

npm run dev
