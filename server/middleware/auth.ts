import { Request, Response, NextFunction } from "express";
import { User } from "@shared/schema";

/**
 * Authentication middleware to verify user is logged in
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.status(401).json({
      message: "Unauthorized - User must be logged in",
      code: "AUTH_REQUIRED"
    });
  }
  next();
};

/**
 * Authentication middleware to verify user is an admin
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.status(401).json({
      message: "Unauthorized - User must be logged in",
      code: "AUTH_REQUIRED"
    });
  }
  
  if (!req.session.user.isAdmin) {
    return res.status(403).json({
      message: "Forbidden - Admin access required",
      code: "ADMIN_REQUIRED"
    });
  }
  
  next();
};

/**
 * Middleware to log API access
 */
export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const path = req.path;
  const method = req.method;
  const userAgent = req.headers['user-agent'] || 'unknown';
  const userId = req.session.user?.id || 'unauthenticated';
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${method} ${path} - User: ${userId}`);
  
  // Add response listener to log the result
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    
    // For admin routes, add more detailed logging
    if (path.includes('/admin/')) {
      console.log(`[${new Date().toISOString()}] ${method} ${path} completed - Status: ${status}, Duration: ${duration}ms, User: ${userId}, UserAgent: ${userAgent}`);
    }
  });
  
  next();
};