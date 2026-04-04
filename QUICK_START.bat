@echo off
echo 🚦 TraffEye - Complete Full-Stack Setup
echo ========================================

echo.
echo 📋 Prerequisites Check...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Python and Node.js are installed

echo.
echo 🐍 Setting up Backend...
cd backend
python setup.py
if %errorlevel% neq 0 (
    echo ❌ Backend setup failed
    pause
    exit /b 1
)

echo.
echo 🌐 Setting up Frontend...
cd ../frontend
node setup.js
if %errorlevel% neq 0 (
    echo ❌ Frontend setup failed
    pause
    exit /b 1
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📝 Next Steps:
echo 1. Edit backend\.env with your configuration
echo 2. Edit frontend\.env.local with your configuration
echo 3. Start MongoDB (or use MongoDB Atlas)
echo 4. Run the following commands in separate terminals:
echo    - Backend: cd backend && python main.py
echo    - Frontend: cd frontend && npm run dev
echo.
echo 🌐 Access Points:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:8000
echo    - API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit...
pause >nul
