#!/bin/bash

# LoveOS Setup Script
echo "🚀 Setting up LoveOS - The Compatibility Engine"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB or use MongoDB Atlas."
    echo "   For local installation: https://docs.mongodb.com/manual/installation/"
fi

echo "📦 Installing dependencies..."
npm run install-all

echo "🔧 Setting up environment variables..."
if [ ! -f "server/.env" ]; then
    cp server/env.example server/.env
    echo "✅ Created server/.env file. Please edit it with your configuration."
else
    echo "✅ server/.env already exists."
fi

echo "🌱 Seeding database with sample data..."
cd server
npm run seed
cd ..

echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "This will start:"
echo "  - Backend server on http://localhost:5000"
echo "  - Frontend app on http://localhost:5173"
echo ""
echo "Sample login credentials:"
echo "  Email: sarah.chen@example.com"
echo "  Password: password123"
echo ""
echo "Happy matching! 💕"
