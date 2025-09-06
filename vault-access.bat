@echo off
REM DROPIFY VAULT MANAGER - Quick Access
REM Use this to quickly manage your vault contents

echo ================================
echo    DROPIFY VAULT QUICK ACCESS
echo ================================
echo.

REM Check if PowerShell is available
powershell -Command "Get-Host" >nul 2>&1
if errorlevel 1 (
    echo ERROR: PowerShell is required but not available
    pause
    exit /b 1
)

REM Run the vault manager
powershell -ExecutionPolicy Bypass -File "vault-manager.ps1"

echo.
echo Vault session ended.
pause
