#!/bin/bash

# Make the build script executable for Vercel
echo "Starting Vercel build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the frontend with Vite
echo "Building frontend with Vite..."
npx vite build

# Create necessary directories
echo "Setting up API directory structure..."
mkdir -p dist/api

# Build the backend for Vercel
echo "Building backend for Vercel..."
npx esbuild server/vercel.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/api/index.js

# Ensure the index.html is at the root for static routing
echo "Finalizing build..."
if [ -f "./dist/public/index.html" ]; then
  cp ./dist/public/index.html ./dist/index.html
  echo "Copied index.html to root build directory"
fi

echo "Vercel build process completed successfully"