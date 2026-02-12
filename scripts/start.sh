#!/bin/bash
#
# PAWS-AGADIR Production Start Script
# Optimized for Hostinger Node.js hosting
# No external platform dependencies
#

set -e

echo "======================================"
echo "Starting PAWS-AGADIR"
echo "======================================"

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo "ERROR: .env file not found!"
  echo "Please create .env from .env.example"
  exit 1
fi

# Load environment variables
export NODE_ENV=production
export PORT=${PORT:-3000}

echo "Environment: $NODE_ENV"
echo "Port: $PORT"

# Check if PM2 is available
if command -v pm2 &> /dev/null; then
  echo ""
  echo "Starting with PM2..."
  pm2 start ecosystem.config.js
  pm2 logs paws-agadir
else
  echo ""
  echo "PM2 not found, starting with Node.js..."
  
  # Check for standalone build
  if [ -d ".next/standalone" ]; then
    echo "Using standalone build..."
    cd .next/standalone
    node server.js
  else
    echo "Using standard Next.js start..."
    npm run start
  fi
fi
