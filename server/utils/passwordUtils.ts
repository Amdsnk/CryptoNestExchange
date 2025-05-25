import bcrypt from 'bcrypt';

/**
 * Hash a password using bcrypt
 * @param plainPassword The plain text password to hash
 * @returns A promise that resolves to the hashed password
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  // Use a higher salt rounds value in production for better security
  const saltRounds = process.env.NODE_ENV === 'production' ? 12 : 10;
  return bcrypt.hash(plainPassword, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 * @param plainPassword The plain text password to check
 * @param hashedPassword The hashed password to compare against
 * @returns A promise that resolves to true if the passwords match, false otherwise
 */
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generate a secure random token
 * @param length The length of the token to generate (default: 32)
 * @returns A random string token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  
  // Use crypto.getRandomValues in the browser or crypto in Node.js
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(randomValues);
  } else {
    // Node.js environment
    const crypto = require('crypto');
    randomValues.set(crypto.randomBytes(length));
  }
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomValues[i] % chars.length);
  }
  
  return result;
}