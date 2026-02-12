#!/bin/bash
#
# Clean AI Platform Artifacts Script
# Removes any remaining v0, bolt.new, Vercel tracking
#

set -e

echo "======================================"
echo "Cleaning AI Platform Artifacts"
echo "======================================"

# Function to clean files
clean_artifacts() {
  local pattern=$1
  local description=$2
  
  echo ""
  echo "Searching for $description..."
  
  # Find and report matches (excluding node_modules, .next, .git)
  matches=$(grep -r "$pattern" \
    --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json" \
    --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git \
    . 2>/dev/null || true)
  
  if [ -n "$matches" ]; then
    echo "Found matches:"
    echo "$matches"
  else
    echo "✓ No $description found"
  fi
}

# Check for various AI platform markers
clean_artifacts "@v0\|@bolt\|generated-by-v0" "v0/bolt generation markers"
clean_artifacts "bolt-generated\|ai-generated" "AI generation markers"
clean_artifacts "x-v0-\|bolt\.new\|v0\.com" "platform tracking URLs"
clean_artifacts "vercel-analytics\|vercel-insights" "Vercel telemetry"

# Check for tracking in package.json
echo ""
echo "Checking package.json for tracking dependencies..."
if grep -q "vercel-analytics\|@vercel/analytics\|@vercel/speed-insights" package.json; then
  echo "⚠ Warning: Vercel tracking dependencies found in package.json"
else
  echo "✓ No Vercel tracking dependencies found"
fi

# Check for .vercel directory
if [ -d ".vercel" ]; then
  echo ""
  echo "Found .vercel directory - consider adding to .gitignore"
else
  echo ""
  echo "✓ No .vercel directory found"
fi

echo ""
echo "======================================"
echo "Artifact scan completed"
echo "======================================"
