@echo off
echo Starting build process...
echo Current directory: %cd%
echo Node version:
node --version
echo NPM version:
npm --version
echo.
echo Running npm install...
npm install
echo.
echo Running build...
npm run build
echo.
echo Build complete!
echo Checking for output...
if exist "out" (
    echo SUCCESS: out directory created
    dir out
) else if exist ".next" (
    echo SUCCESS: .next directory created
    dir .next
) else (
    echo ERROR: No build output found
)
pause
