#!/bin/bash

# Dropify Technologies - Netlify Deployment Script
# Fixes common @netlify/plugin-nextjs issues

echo "🚀 Starting Dropify deployment process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies with clean cache
echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit

# Run build
echo "🔨 Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
echo "🌐 Ready for Netlify deployment!"

# Additional verification
if [ -d ".next" ]; then
  echo "✅ .next directory exists"
  echo "📊 Build size: $(du -sh .next | cut -f1)"
else
  echo "❌ .next directory not found"
  exit 1
fi
