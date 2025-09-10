@echo off
echo 🚀 Starting Dropify Development Server with Error Debugging
echo ================================================================
echo.

echo 📋 Checking Node.js version...
node --version
echo.

echo 📋 Checking npm version...
npm --version
echo.

echo 🔧 Installing dependencies...
npm ci --prefer-offline
if errorlevel 1 (
    echo ❌ Dependency installation failed
    pause
    exit /b 1
)
echo ✅ Dependencies installed
echo.

echo 🏗️ Running type check...
npm run type-check
if errorlevel 1 (
    echo ⚠️ TypeScript errors found, but continuing...
) else (
    echo ✅ TypeScript check passed
)
echo.

echo 🌐 Starting development server...
echo   - Open http://localhost:3000 in your browser
echo   - Press Ctrl+C to stop the server
echo   - Check the console for any React Error #423 or import/export issues
echo.

npm run dev
