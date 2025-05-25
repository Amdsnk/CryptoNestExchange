// This script is used for building the application for Vercel deployment
import { execSync } from 'child_process';
import fs from 'fs';

console.log('Starting Vercel build process...');

try {
  // Build the client application with Vite
  console.log('Building frontend with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Ensure the API directory exists
  console.log('Creating API directory...');
  if (!fs.existsSync('./dist/api')) {
    fs.mkdirSync('./dist/api', { recursive: true });
  }
  
  // Build the server for Vercel
  console.log('Building backend for Vercel...');
  execSync('npx esbuild server/vercel.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/api/index.js', { stdio: 'inherit' });
  
  // Copy index.html to dist root for Vercel routes
  console.log('Finalizing build for Vercel...');
  try {
    fs.copyFileSync('./dist/public/index.html', './dist/index.html');
    console.log('Copied index.html to root of build directory');
  } catch (err) {
    console.error('Warning: Could not copy index.html to root directory', err);
  }
  
  console.log('Vercel build completed successfully');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}