@echo off
echo ========================================
echo BUILDING DROPIFY FOR NETLIFY DEPLOYMENT
echo ========================================

echo.
echo 🏗️  Installing dependencies...
call npm install

echo.
echo 🔧 Building production application...
call npm run build

echo.
echo 📦 Build complete! Files are in the 'out' directory
echo.
echo ✅ Ready for Netlify deployment!
echo.
echo Next steps:
echo 1. Commit and push all changes to git
echo 2. Connect your GitHub repo to Netlify
echo 3. Set build command: npm run build
echo 4. Set publish directory: out
echo 5. Add environment variables in Netlify dashboard
echo.
pause
