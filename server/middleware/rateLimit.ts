import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/environment';

// Simple in-memory rate limiter storage
// In production, consider using Redis or another distributed storage
const ipRequests = new Map<string, number[]>();

/**
 * Rate limiting middleware to prevent abuse
 * @param options Custom options to override defaults
 */
export function rateLimit(options?: { 
  windowMs?: number; 
  max?: number;
  message?: string;
}) {
  const windowMs = options?.windowMs || ENV.SECURITY.rateLimit.windowMs;
  const maxRequests = options?.max || ENV.SECURITY.rateLimit.max;
  const message = options?.message || 'Too many requests, please try again later.';

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    
    // Get existing requests for this IP
    const requests = ipRequests.get(ip) || [];
    
    // Filter requests within the current window
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    // Check if too many requests
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        message,
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
      });
    }
    
    // Add this request to the list
    recentRequests.push(now);
    ipRequests.set(ip, recentRequests);
    
    next();
  };
}

/**
 * Stricter rate limiting for sensitive routes (login, registration)
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: ENV.isProd ? 5 : 20, // 5 attempts in production, 20 in development
  message: 'Too many authentication attempts. Please try again later.'
});

/**
 * Periodic cleanup function to prevent memory leaks
 * Removes old IP records
 */
export function startRateLimitCleanup(intervalMs = 60 * 60 * 1000) { // Default: every hour
  setInterval(() => {
    const now = Date.now();
    const windowMs = ENV.SECURITY.rateLimit.windowMs;
    
    // Use Array.from to avoid TypeScript iteration issues
    Array.from(ipRequests.entries()).forEach(([ip, requests]) => {
      // Keep only requests within the current window
      const recentRequests = requests.filter((time: number) => now - time < windowMs);
      
      if (recentRequests.length === 0) {
        ipRequests.delete(ip); // Remove entries with no recent requests
      } else {
        ipRequests.set(ip, recentRequests);
      }
    });
  }, intervalMs);
}