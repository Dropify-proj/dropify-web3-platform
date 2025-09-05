@echo off
echo 🔧 Setting up Dropify for Supra Testnet...
echo.

REM Copy testnet environment
if exist .env.testnet (
    copy .env.testnet .env.local
    echo ✅ Testnet environment configured
) else (
    echo ❌ .env.testnet file not found
    goto error
)

REM Install dependencies if needed
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 goto error
)

REM Build the project
echo 🔨 Building project...
npm run build
if %errorlevel% neq 0 goto error

echo.
echo ✅ Testnet setup complete!
echo.
echo 📋 Ready for testnet:
echo - Environment: Testnet
echo - Contract: Ready for deployment
echo - Dependencies: Installed
echo - Build: Successful
echo.
echo 🚀 Next steps:
echo 1. Run: deploy-testnet.bat (to deploy contract)
echo 2. Run: npm run dev (to start development server)
echo 3. Connect your Supra wallet
echo 4. Test receipt scanning
echo.

set /p START_DEV="Start development server now? (y/N): "
if /i "%START_DEV%" equ "y" (
    echo 🚀 Starting development server...
    npm run dev
)

goto end

:error
echo ❌ Setup failed. Please check the errors above.
pause
exit /b 1

:end
pause
