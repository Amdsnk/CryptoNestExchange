import bcrypt from 'bcrypt';

/**
 * Hash a password with bcrypt
 * @param password The plain text password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Industry standard for production
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 * @param plainPassword The plain text password to check
 * @param hashedPassword The hashed password to compare against
 * @returns True if the passwords match, false otherwise
 */
export async function comparePassword(
  plainPassword: string, 
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generate a secure random token
 * @param length The length of the token to generate
 * @returns A random token string
 */
export function generateSecureToken(length: number = 32): string {
  return Array.from(
    { length }, 
    () => Math.floor(Math.random() * 36).toString(36)
  ).join('');
}