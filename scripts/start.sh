#!/bin/bash
set -e

echo "🚀 Starting PAWS-AGADIR application..."

# Check if .env file exists
if [ ! -f .env ]; then
  echo "⚠️  Warning: .env file not found. Using environment variables from system."
  echo "Create a .env file based on .env.example for local configuration."
fi

# Check if build exists
if [ ! -d .next ]; then
  echo "❌ Error: Build not found. Please run 'npm run build' first."
  exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Set default port if not specified
PORT=${PORT:-3000}
HOSTNAME=${HOSTNAME:-0.0.0.0}

echo "🌐 Starting server on http://$HOSTNAME:$PORT"
echo "📝 Logs will be saved to ./logs/"

# Start the application
NODE_ENV=production \
PORT=$PORT \
HOSTNAME=$HOSTNAME \
node node_modules/next/dist/bin/next start
