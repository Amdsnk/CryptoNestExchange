import bcrypt from 'bcrypt';

/**
 * Generate a password hash using bcrypt
 * @param plainPassword The plain text password to hash
 * @returns A promise resolving to the hashed password
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  // Higher salt rounds provide more security but take longer
  // 12 is recommended for production
  const saltRounds = process.env.NODE_ENV === 'production' ? 12 : 10;
  return bcrypt.hash(plainPassword, saltRounds);
}

/**
 * Verify a password against a stored hash
 * @param plainPassword The plain text password to verify
 * @param storedHash The stored password hash to compare against
 * @returns A promise resolving to true if the password matches, false otherwise
 */
export async function verifyPassword(plainPassword: string, storedHash: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, storedHash);
}

/**
 * Generate a secure random token (for password reset, etc.)
 * @param length Length of the token to generate
 * @returns A random secure token string
 */
export function generateSecureToken(length: number = 32): string {
  // Use Node.js crypto module for secure random generation
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Check if a password meets minimum security requirements
 * @param password The password to check
 * @returns True if password meets requirements, false otherwise
 */
export function isPasswordSecure(password: string): boolean {
  // Minimum length check
  if (password.length < 8) {
    return false;
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }
  
  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return false;
  }
  
  return true;
}

/**
 * Get password security issues as an array of messages
 * @param password The password to check
 * @returns Array of issue messages, empty if password is secure
 */
export function getPasswordIssues(password: string): string[] {
  const issues: string[] = [];
  
  if (password.length < 8) {
    issues.push("Password must be at least 8 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    issues.push("Password must include at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    issues.push("Password must include at least one lowercase letter");
  }
  
  if (!/[0-9]/.test(password)) {
    issues.push("Password must include at least one number");
  }
  
  return issues;
}