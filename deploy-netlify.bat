@echo off
cls
echo.
echo ================================================================================
echo DROPIFY TECHNOLOGIES - NETLIFY DEPLOYMENT
echo Production Deployment for Web3 Platform
echo ================================================================================
echo.

REM Set production environment
set NODE_ENV=production
set NEXT_TELEMETRY_DISABLED=1

echo 🚀 PHASE 1: Environment Setup
echo ────────────────────────────────────────────────────────────────────────────────
echo   ✓ Environment: Production
echo   ✓ Platform: Netlify
echo   ✓ Build Type: Static Export
echo.

echo 🔧 PHASE 2: Dependencies
echo ────────────────────────────────────────────────────────────────────────────────
echo   Installing production dependencies...
call npm ci --production=false --prefer-offline --no-audit
if errorlevel 1 (
    echo   ❌ Dependency installation failed
    pause
    exit /b 1
)
echo   ✅ Dependencies installed successfully
echo.

echo 📋 PHASE 3: Environment Configuration
echo ────────────────────────────────────────────────────────────────────────────────
echo # Netlify Production Configuration > .env.local
echo NODE_ENV=production >> .env.local
echo NEXT_TELEMETRY_DISABLED=1 >> .env.local
echo NEXT_PUBLIC_ENV=production >> .env.local
echo NEXT_PUBLIC_SUPRA_CHAIN_ID=6 >> .env.local
echo NEXT_PUBLIC_SUPRA_RPC_URL=https://testnet-rpc.supra.com >> .env.local
echo NEXT_PUBLIC_SUPRA_NETWORK=testnet >> .env.local
echo NEXT_PUBLIC_SUPRA_EXPLORER_URL=https://testnet-explorer.supra.com >> .env.local
echo NEXT_PUBLIC_CONTRACT_ADDRESS=0x1::dropify_dual_token >> .env.local
echo   ✅ Environment variables configured
echo.

echo 🏗️ PHASE 4: Production Build
echo ────────────────────────────────────────────────────────────────────────────────
echo   Building Next.js application for static export...
call npm run build
if errorlevel 1 (
    echo   ❌ Build failed - check the errors above
    pause
    exit /b 1
)
echo   ✅ Build completed successfully
echo.

echo 📦 PHASE 5: Build Verification
echo ────────────────────────────────────────────────────────────────────────────────
if exist "out" (
    echo   ✅ Output directory 'out' created
    dir out /s | find /c "." > temp_count.txt
    set /p file_count=<temp_count.txt
    echo   ✅ Files generated: %file_count%
    del temp_count.txt
) else (
    echo   ❌ Output directory 'out' not found
    pause
    exit /b 1
)
echo.

echo 🌐 PHASE 6: Netlify Deployment
echo ────────────────────────────────────────────────────────────────────────────────
echo   Ready for Netlify deployment!
echo   
echo   📋 DEPLOYMENT SETTINGS:
echo   ├── Build Command: npm ci ^&^& npm run build
echo   ├── Publish Directory: out
echo   ├── Node Version: 20.18.0
echo   └── Environment: Production
echo.
echo   🚀 MANUAL DEPLOYMENT OPTIONS:
echo   1. Drag the 'out' folder to Netlify dashboard
echo   2. Use Git integration for automatic deployment
echo   3. Use Netlify CLI: netlify deploy --prod --dir=out
echo.
echo   📁 Your static files are ready in the 'out' directory
echo.

pause
echo 🎉 DEPLOYMENT PREPARATION COMPLETE!
echo Your Dropify Web3 platform is ready for Netlify!
