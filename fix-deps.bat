@echo off
echo Starting dependency installation...

if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

npm install

echo Dependencies installed successfully
echo Running type check...

npm run type-check

echo Type check completed
