import cors from 'cors';
import { ENV } from '../config/environment';

/**
 * Configure CORS for the application
 * In production, we restrict origins to known domains
 * In development, we allow all origins for easier testing
 */
export const configureCors = () => {
  return cors({
    origin: ENV.SECURITY.cors.origin,
    credentials: ENV.SECURITY.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 hours
  });
};