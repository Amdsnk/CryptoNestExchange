// Simple script for Vercel to recognize static files
import fs from 'fs';

// This file just needs to exist for Vercel builds
console.log('Static build file detected.');

// Force Vercel to include the static files
export default function handler(req, res) {
  res.status(200).json({ message: 'Static files builder' });
}