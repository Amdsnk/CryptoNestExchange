import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/environment';

// Define error types for consistent handling
export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: any;

  constructor(message: string, statusCode: number, code: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific application error types
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details?: any) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required', details?: any) {
    super(message, 401, 'AUTHENTICATION_REQUIRED', details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Permission denied', details?: any) {
    super(message, 403, 'PERMISSION_DENIED', details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', details?: any) {
    super(message, 409, 'RESOURCE_CONFLICT', details);
  }
}

export class ServerError extends AppError {
  constructor(message = 'Internal server error', details?: any) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', details);
  }
}

// Global error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);
  
  // Default error response
  let statusCode = 500;
  let errorMessage = 'An unexpected error occurred';
  let errorCode = 'SERVER_ERROR';
  let errorDetails: any = undefined;
  
  // Handle our custom AppError types
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
    errorCode = err.code;
    errorDetails = err.details;
  } 
  // Handle validation errors (e.g., from Zod)
  else if (err.name === 'ZodError') {
    statusCode = 400;
    errorMessage = 'Validation failed';
    errorCode = 'VALIDATION_ERROR';
    errorDetails = err;
  }
  // If database error
  else if (err.name === 'DrizzleError' || (err.message && err.message.includes('database'))) {
    statusCode = 500;
    errorMessage = 'Database error';
    errorCode = 'DATABASE_ERROR';
    // Don't expose internal database errors in production
    errorDetails = ENV.isProd ? undefined : err;
  }
  
  // Send the error response
  res.status(statusCode).json({
    error: {
      message: errorMessage,
      code: errorCode,
      ...(errorDetails && !ENV.isProd ? { details: errorDetails } : {})
    }
  });
};

// 404 handler for routes that don't exist
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.path}`,
      code: 'ROUTE_NOT_FOUND'
    }
  });
};