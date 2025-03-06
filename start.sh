#!/bin/bash

# Start the backend
echo "Starting backend server..."
cd "$(dirname "$0")/backend"
python -m uvicorn main:app --reload &
BACKEND_PID=$!

# Start the frontend
echo "Starting frontend server..."
cd "$(dirname "$0")/frontend"
npm start &
FRONTEND_PID=$!

# Function to handle script termination
function cleanup {
  echo "Shutting down servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

# Keep script running
echo "Both servers are running. Press Ctrl+C to stop."
wait 