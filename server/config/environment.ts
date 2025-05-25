/**
 * Environment configuration for the application
 * Centralizes all environment variable access and provides defaults
 */

// Determine the current environment
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';
const isDev = NODE_ENV === 'development';
const isTest = NODE_ENV === 'test';

// Database configuration
const DB_CONFIG = {
  connectionString: process.env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: true } : false,
  // Production-optimized pool settings
  max: isProd ? 20 : 10, // Max connections in pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
};

// Security settings
const SECURITY = {
  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || '',
    cookie: {
      secure: isProd,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      sameSite: isProd ? 'strict' : 'lax', 
    },
    resave: false,
    saveUninitialized: false,
  },
  // CORS configuration
  cors: {
    origin: isProd ? [
      'https://cryptonest.com', 
      'https://www.cryptonest.com',
      // Add other allowed domains here
    ] : '*',
    credentials: true,
  },
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isProd ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
    standardHeaders: true,
    legacyHeaders: false,
  },
};

// Application settings
const APP = {
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: '/api',
  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL || 'admin@cryptonest.com',
};

// All environment variables bundled together
export const ENV = {
  NODE_ENV,
  isProd,
  isDev,
  isTest,
  DB: DB_CONFIG,
  SECURITY,
  APP,
};

// Export a function to validate environment variables
export function validateEnv(): string[] {
  const missingVars = [];
  
  // Critical environment variables for production
  if (isProd) {
    if (!process.env.SESSION_SECRET) missingVars.push('SESSION_SECRET');
    if (!process.env.DATABASE_URL) missingVars.push('DATABASE_URL');
  }
  
  return missingVars;
}