#!/bin/bash

echo "🔧 Building CryptoNest Exchange Platform for Vercel..."

# Make sure the dist directory exists
mkdir -p dist

# Build the client with Vite
echo "🏗️ Building client application..."
npx vite build

# Create Vercel serverless function structure
echo "🔄 Creating Vercel serverless API directory structure..."
mkdir -p dist/api

# Create Vercel serverless function
echo "🔄 Bundling server as Vercel serverless function..."
npx esbuild server/vercel.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/api/index.js

# Copy schema.sql for database initialization
echo "📝 Copying database schema..."
cp schema.sql dist/schema.sql

# Copy deployment instructions
echo "📝 Copying deployment guide..."
cp VERCEL-DEPLOYMENT.md dist/VERCEL-DEPLOYMENT.md

# Copy .env.example for reference
echo "📝 Copying environment variables template..."
cp .env.example dist/.env.example

# Ensure vercel.json is at the root for Vercel to detect it
echo "📝 Copying Vercel configuration..."
cp vercel.json dist/vercel.json

# Display completion message
echo "✅ Build completed successfully!"
echo "ℹ️ See VERCEL-DEPLOYMENT.md for Vercel deployment instructions"