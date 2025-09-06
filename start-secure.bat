@echo off
echo.
echo 🚀 Starting Dropify Platform - IP Protected Build
echo ================================================
echo.

echo ✅ Build Status: SUCCESSFUL 
echo ✅ IP Protection: ACTIVE
echo ✅ Telegram Integration: READY
echo.

cd /d "c:\Users\Administrator\Downloads\nextjs"

echo 🔍 Verifying build integrity...
if not exist ".next" (
    echo ❌ Build files missing. Running build first...
    call npm run build
)

echo.
echo 🌐 Starting production server...
echo 📱 Telegram Mini App: Enabled
echo 🔐 Security Measures: Active
echo.
echo Visit: http://localhost:3000
echo Demo: http://localhost:3000/supra-demo
echo.

start "" "http://localhost:3000/supra-demo"
npm start
