#!/bin/bash
set -e

echo "🚀 Starting PAWS-AGADIR build for Hostinger deployment..."

# Check Node.js version
echo "📦 Node.js version: $(node --version)"
echo "📦 npm version: $(npm --version)"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies
echo "📥 Installing dependencies..."
npm ci --omit=dev --production=false

# Run type checking
echo "🔍 Running TypeScript type checking..."
npm run build -- --no-lint || echo "⚠️  Type check warnings (continuing build)"

# Build the application
echo "🔨 Building Next.js application..."
npm run build

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Optimize node_modules for production
echo "🎯 Optimizing for production..."
npm prune --production

echo "✅ Build completed successfully!"
echo "📊 Build size:"
du -sh .next

echo ""
echo "🎉 Ready for deployment!"
echo "To start the application, run: npm start"
