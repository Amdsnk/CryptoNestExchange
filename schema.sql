-- Schema for CryptoNest Exchange Platform
-- Use this file to setup your database manually if needed

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL UNIQUE,
  wallet_address TEXT
);

-- Sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  currency TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL,
  tx_hash TEXT,
  to_address TEXT,
  from_address TEXT,
  address TEXT,
  network TEXT,
  timestamp TIMESTAMP DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS IDX_transactions_user_id ON transactions (user_id);

-- Balances table
CREATE TABLE IF NOT EXISTS balances (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  currency TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  address TEXT
);
CREATE INDEX IF NOT EXISTS IDX_balances_user_id ON balances (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS IDX_balances_user_currency ON balances (user_id, currency);

-- Add demo user if not exists (optional)
INSERT INTO users (username, password, first_name, last_name, email, wallet_address)
SELECT 'johndoe', '$2b$10$DEMO_PASSWORD_HASH', 'John', 'Doe', 'johndoe@example.com', '0x1234567890abcdef1234567890abcdef12345678'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'johndoe');