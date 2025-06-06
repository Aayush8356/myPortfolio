#!/bin/bash

echo "🚀 Starting Portfolio Application..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   brew services start mongodb/brew/mongodb-community"
    echo "   or"
    echo "   mongod --config /usr/local/etc/mongod.conf"
    exit 1
fi

# Start backend
echo "📡 Starting backend server..."
cd backend
npm run seed > /dev/null 2>&1
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Application started successfully!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5002"
echo ""
echo "🔑 Admin Access:"
echo "   • Click 'Admin' button in footer"
echo "   • Or press Ctrl+Alt+A"
echo "   • Email: admin@example.com"
echo "   • Password: admin123"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait