@echo off
echo 🔧 MANUAL STARTUP - If automated launcher fails
echo.

echo Step 1: Install dependencies
echo Run: npm install
echo.

echo Step 2: Install framer-motion
echo Run: npm install framer-motion
echo.

echo Step 3: Start server manually
echo Run: npm run dev
echo.

echo Step 4: Open browser to:
echo http://localhost:3000/testnet-live
echo.

echo If still having issues, try:
echo 1. npm run build (then npm run dev)
echo 2. Delete node_modules and run npm install
echo 3. Check if port 3000 is blocked by firewall
echo 4. Try different port: npm run dev -- -p 3001
echo.

echo Common solutions:
echo • Windows Defender blocking Node.js
echo • Another app using port 3000
echo • Missing Node.js installation
echo • Firewall blocking localhost connections
echo.

pause
