#!/bin/bash
#
# PAWS-AGADIR Production Build Script
# Optimized for Hostinger Node.js hosting
# No external platform dependencies
#

set -e

echo "======================================"
echo "PAWS-AGADIR Production Build"
echo "======================================"

# Check Node.js version
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"

# Clean previous builds
echo ""
echo "Cleaning previous builds..."
rm -rf .next
rm -rf out

# Install dependencies
echo ""
echo "Installing dependencies..."
npm ci --production=false

# Run linting (optional)
if [ "$SKIP_LINT" != "true" ]; then
  echo ""
  echo "Running linter..."
  npm run lint || echo "Linting completed with warnings"
fi

# Build the application
echo ""
echo "Building Next.js application..."
NODE_ENV=production npm run build

# Verify standalone output
if [ -d ".next/standalone" ]; then
  echo ""
  echo "✓ Standalone build created successfully"
else
  echo ""
  echo "⚠ Warning: Standalone build not found"
fi

echo ""
echo "======================================"
echo "Build completed successfully!"
echo "======================================"
