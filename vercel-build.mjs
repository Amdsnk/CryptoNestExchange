// Special build script for Vercel deployment
import { execSync } from 'child_process';
import fs from 'fs';

console.log('Running Vercel specialized build...');

// Run the Vite build
console.log('Building frontend with Vite...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Create a simple HTML test file to verify file serving
const testHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CryptoNest Deployment Test</title>
</head>
<body>
  <h1>CryptoNest Deployment Test</h1>
  <p>If you can see this page, static file serving is working correctly.</p>
  <p>Please check the main application at the root URL.</p>
</body>
</html>
`;

// Write the test file to the output directory
fs.writeFileSync('dist/public/test.html', testHtml);
console.log('Test file created for verification purposes.');

console.log('Vercel build process completed.');