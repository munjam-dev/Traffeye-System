#!/bin/bash

echo "🚦 TraffEye - Complete Full-Stack Setup"
echo "========================================"

echo ""
echo "📋 Prerequisites Check..."

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed"
    echo "Please install Python 3.8+ from https://python.org"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Python and Node.js are installed"

echo ""
echo "🐍 Setting up Backend..."
cd backend
python3 setup.py
if [ $? -ne 0 ]; then
    echo "❌ Backend setup failed"
    exit 1
fi

echo ""
echo "🌐 Setting up Frontend..."
cd ../frontend
node setup.js
if [ $? -ne 0 ]; then
    echo "❌ Frontend setup failed"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📝 Next Steps:"
echo "1. Edit backend/.env with your configuration"
echo "2. Edit frontend/.env.local with your configuration"
echo "3. Start MongoDB (or use MongoDB Atlas)"
echo "4. Run the following commands in separate terminals:"
echo "   - Backend: cd backend && python main.py"
echo "   - Frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Access Points:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo ""
echo "Press any key to continue..."
read -n 1 -s
