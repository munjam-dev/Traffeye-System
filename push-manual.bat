@echo off
echo 🚀 Push TraffEye to GitHub
echo ==========================
echo.

echo 📋 Repository: https://github.com/Soujanya-20-create/TraffEye-System.git
echo.

echo 🔧 Setting up remote...
git remote set-url origin https://github.com/Soujanya-20-create/TraffEye-System.git

echo 📦 Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ If successful, visit: https://github.com/Soujanya-20-create/TraffEye-System
echo.
echo ❌ If you get permission error:
echo    1. Go to https://github.com/settings/tokens
echo    2. Generate new token with 'repo' scope
echo    3. Run: node push-with-token.js
echo.

pause
