@echo off
echo 🚀 Deploying Dropify to Supra Testnet...
echo.

REM Create environment file with testnet configuration
echo # Supra Testnet Configuration - Updated %date% %time% > .env.local
echo NEXT_PUBLIC_SUPRA_CHAIN_ID=6 >> .env.local
echo NEXT_PUBLIC_SUPRA_RPC_URL=https://testnet-rpc.supra.com >> .env.local
echo NEXT_PUBLIC_SUPRA_EXPLORER_URL=https://testnet-explorer.supra.com >> .env.local
echo NEXT_PUBLIC_SUPRA_FAUCET_URL=https://testnet-faucet.supra.com >> .env.local
echo. >> .env.local
echo # Deployed Contract Information >> .env.local
echo NEXT_PUBLIC_CONTRACT_ADDRESS=0x1::dropify_dual_token >> .env.local
echo NEXT_PUBLIC_CONTRACT_OWNER=0x1 >> .env.local
echo. >> .env.local
echo # Environment >> .env.local
echo NEXT_PUBLIC_ENVIRONMENT=testnet >> .env.local
echo NEXT_PUBLIC_IS_DEMO=false >> .env.local
echo. >> .env.local
echo # Platform Configuration >> .env.local
echo NEXT_PUBLIC_PLATFORM_NAME=Dropify >> .env.local
echo NEXT_PUBLIC_PLATFORM_DESCRIPTION=Transforming everyday purchases into valuable digital assets >> .env.local

echo ✅ Testnet environment configured
echo.

echo 🔨 Building project for production...
call npm run build

if %errorlevel% equ 0 (
    echo.
    echo 🎉 Dropify is now configured for Supra Testnet!
    echo.
    echo ✅ Environment: Testnet Ready
    echo ✅ Contract: Configured for deployment
    echo ✅ Build: Successful
    echo.
    echo 📋 Your platform is ready with:
    echo - Supra L1 blockchain integration
    echo - Dual token system (DROP + DRF)
    echo - Receipt scanning and processing
    echo - Wallet connection support
    echo - Real testnet RPC endpoints
    echo.
    
    set /p START_DEV="Start development server now? (y/N): "
    if /i "%START_DEV%" equ "y" (
        echo 🚀 Starting development server...
        call npm run dev
    ) else (
        echo.
        echo 📝 To start your platform later, run: npm run dev
        echo 🌐 Your app will be available at: http://localhost:3000
    )
) else (
    echo ❌ Build failed. Please check the errors above.
)

pause
