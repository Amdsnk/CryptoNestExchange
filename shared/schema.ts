import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  walletAddress: text("wallet_address"),
  passwordHash: varchar("password_hash"),
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  lastLoginAt: timestamp("last_login_at"),
  loginAttempts: integer("login_attempts").default(0),
  lockUntil: timestamp("lock_until"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  passwordHash: true,
  walletAddress: true,
  isAdmin: true,
});

// Schema for user registration
export const registerUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().optional(),
});

// Schema for login
export const loginUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(), // Changed to varchar to match user id type
  type: text("type").notNull(), // 'deposit', 'withdrawal', 'exchange'
  currency: text("currency").notNull(), // 'BTC', 'ETH', 'USDT', etc.
  amount: numeric("amount").notNull(),
  status: text("status").notNull(), // 'pending', 'completed', 'failed'
  txHash: text("tx_hash"), // blockchain transaction hash
  to: text("to"), // destination address for withdrawals
  from: text("from"), // source address for deposits
  address: text("address"), // wallet address (for compatibility)
  network: text("network"), // 'ERC20', 'BEP20', 'TRC20', etc.
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  type: true,
  currency: true,
  amount: true,
  status: true,
  txHash: true,
  to: true,
  from: true,
  address: true,
  network: true,
});

export const balances = pgTable("balances", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(), // Changed to varchar to match user id type
  currency: text("currency").notNull(),
  amount: numeric("amount").notNull().default("0"),
  address: text("address"),
});

export const insertBalanceSchema = createInsertSchema(balances).pick({
  userId: true,
  currency: true,
  amount: true,
  address: true,
});

export const updateBalanceSchema = createInsertSchema(balances).pick({
  amount: true,
});

// Type definitions
export type User = typeof users.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertBalance = z.infer<typeof insertBalanceSchema>;
export type UpdateBalance = z.infer<typeof updateBalanceSchema>;
export type Balance = typeof balances.$inferSelect;
