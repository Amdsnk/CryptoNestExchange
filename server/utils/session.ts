import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { ENV } from '../config/environment';
import { pool } from '../db';

/**
 * Configure secure session management
 * Uses PostgreSQL for session storage in production
 * Falls back to in-memory storage for development
 */
export function configureSession() {
  // Ensure we have a valid session secret for production
  if (ENV.isProd && !process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET environment variable is required in production");
  }
  
  // Set up PostgreSQL session store
  const PgStore = connectPg(session);
  const store = new PgStore({
    pool, // Uses the already configured database pool
    tableName: 'sessions',
    createTableIfMissing: true,
  });
  
  // Return session middleware configuration
  return session({
    secret: ENV.SECURITY.session.secret,
    resave: ENV.SECURITY.session.resave,
    saveUninitialized: ENV.SECURITY.session.saveUninitialized,
    cookie: {
      secure: ENV.SECURITY.session.cookie.secure,
      httpOnly: ENV.SECURITY.session.cookie.httpOnly,
      maxAge: ENV.SECURITY.session.cookie.maxAge,
      sameSite: ENV.SECURITY.session.cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
    },
    store,
  });
}