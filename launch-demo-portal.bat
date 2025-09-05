@echo off
echo.
echo =====================================================
echo            DROPIFY LIVE DEMO GENERATOR
echo =====================================================
echo.

REM Get local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "IP=%%a"
    goto :found
)
:found
set IP=%IP:~1%

echo Your Dropify Platform Demo Links:
echo.
echo LOCAL ACCESS (This Computer):
echo   http://localhost:3000
echo.
echo NETWORK ACCESS (Share with Others):
echo   http://%IP%:3000
echo.
echo DEMO PAGES TO SHARE:
echo   Main Dashboard:    http://%IP%:3000/dashboard
echo   Interactive Demo:  http://%IP%:3000/drop-tokens  
echo   Receipt Scanner:   http://%IP%:3000/scan
echo   Investor Pitch:    http://%IP%:3000/pitch-deck
echo   Technical Demo:    http://%IP%:3000/database-test
echo   Demo Portal:       http://%IP%:3000/demo-portal.html
echo.
echo PROFESSIONAL DEMO FLOW:
echo   1. Start with /dashboard for platform overview
echo   2. Show /drop-tokens for interactive experience
echo   3. Present /pitch-deck for investor presentation
echo   4. Demo /database-test for technical validation
echo.
echo Opening demo portal in your browser...
echo Share the Network Access link with demo participants!
echo.

REM Open demo portal in default browser
start http://localhost:3000/demo-portal.html

pause
