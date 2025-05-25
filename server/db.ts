import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import fs from 'fs';
import path from 'path';
import { ENV } from './config/environment';

// Database connection flag
export let dbConnected = false;

// Initialize WebSocket constructor for Neon
neonConfig.webSocketConstructor = ws;

// Production-optimized database pool
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Drizzle ORM instance
export const db = drizzle(pool, { schema });

// Initialize database function
export async function initializeDatabase() {
  try {
    console.log("Checking database connectivity...");
    
    // Test connection
    const result = await pool.query('SELECT NOW()');
    // Check if we got a result
    if (result && result.rows && result.rows.length > 0) {
      console.log("Database connection successful");
      
      // Check if users table exists
      try {
        const tableCheck = await pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users'
          );
        `);
        
        const tablesExist = tableCheck.rows[0].exists;
        
        if (!tablesExist) {
          console.log("Creating database schema...");
          
          // Try to push the schema using drizzle-orm
          try {
            await pushSchema();
            console.log("Database schema created successfully");
            
            // Import the mock data module
            const { seedMockData } = await import('./utils/mockData');
            
            // Seed the mock data for testing
            console.log("Seeding mock data for testing...");
            await seedMockData();
            console.log("Mock data seeded successfully");
            
          } catch (migrationError) {
            console.error("Error pushing schema:", migrationError);
            throw migrationError;
          }
        } else {
          console.log("Database schema already exists");
          
          // Check if we have users in the database
          const userCount = await pool.query('SELECT COUNT(*) FROM users');
          
          if (parseInt(userCount.rows[0].count) === 0) {
            // Import the mock data module
            const { seedMockData } = await import('./utils/mockData');
            
            // Seed the mock data for testing if no users exist
            console.log("No users found. Seeding mock data for testing...");
            await seedMockData();
            console.log("Mock data seeded successfully");
          }
        }
      } catch (tableCheckError) {
        console.error("Error checking tables:", tableCheckError);
        throw tableCheckError;
      }
      
      dbConnected = true;
      return true;
    } else {
      console.error("Database query returned no results");
      dbConnected = false;
      return false;
    }
  } catch (error) {
    console.error("Database initialization error:", error);
    dbConnected = false;
    return false;
  }
}

// Helper function to push the schema to the database
async function pushSchema() {
  try {
    // Create sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR NOT NULL PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      );
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);
    `);
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR NOT NULL PRIMARY KEY,
        email VARCHAR UNIQUE,
        first_name VARCHAR,
        last_name VARCHAR,
        profile_image_url VARCHAR,
        wallet_address VARCHAR,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    // Create transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR NOT NULL,
        type TEXT NOT NULL,
        currency TEXT NOT NULL,
        amount NUMERIC NOT NULL,
        status TEXT NOT NULL,
        tx_hash TEXT,
        "to" TEXT,
        "from" TEXT,
        address TEXT,
        network TEXT,
        timestamp TIMESTAMP DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS IDX_transactions_user_id ON transactions (user_id);
    `);
    
    // Create balances table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS balances (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR NOT NULL,
        currency TEXT NOT NULL,
        amount NUMERIC NOT NULL DEFAULT 0,
        address TEXT
      );
      CREATE INDEX IF NOT EXISTS IDX_balances_user_id ON balances (user_id);
      CREATE UNIQUE INDEX IF NOT EXISTS IDX_balances_user_currency ON balances (user_id, currency);
    `);
    
    return true;
  } catch (error) {
    console.error("Error in pushSchema:", error);
    throw error;
  }
}