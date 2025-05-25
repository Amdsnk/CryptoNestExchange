/**
 * Admin authentication and authorization utilities
 */
import { Request, Response, NextFunction } from "express";

// Hardcoded admin credentials for development/testing
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123"
};

/**
 * Verify if provided credentials match admin credentials
 */
export function verifyAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && 
         password === ADMIN_CREDENTIALS.password;
}

/**
 * Create admin user object
 */
export function createAdminUser() {
  return {
    id: "admin-user-1",
    email: "admin@cryptonest.com",
    firstName: "Admin",
    lastName: "User",
    profileImageUrl: null,
    walletAddress: null,
    isAdmin: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

/**
 * Middleware to check if user is authenticated as admin
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(401).json({
      error: {
        message: "Admin authentication required",
        code: "AUTH_REQUIRED"
      }
    });
  }
  next();
}