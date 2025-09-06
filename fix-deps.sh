#!/bin/bash

echo "Starting dependency installation..."

# Remove existing node_modules and lock file
rm -rf node_modules
rm -f package-lock.json

# Install dependencies
npm install

echo "Dependencies installed successfully"
echo "Running type check..."

# Run type check
npm run type-check

echo "Type check completed"
