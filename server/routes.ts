import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { User, Transaction, insertTransactionSchema, insertBalanceSchema, updateBalanceSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import { verifyAdminCredentials, createAdminUser } from "./admin";
import { dbConnected } from "./db";

// Import admin routes
import adminRoutes from './routes/admin';

// Security enhancements for admin login
const loginAttemptsByIp = new Map<string, number[]>();

// Cache for admin statistics to improve performance
interface CacheEntry<T> {
  timestamp: number;
  data: T;
}
const adminStatsCache = new Map<string, CacheEntry<any>>();

// Extend express-session types with our User type
declare module "express-session" {
  interface SessionData {
    user?: User;
    loginTime?: Date;
    loginIP?: string;
  }
}

import { isAuthenticated, isAdmin, apiLogger } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add API logging middleware to all routes
  app.use(apiLogger);
  
  // Mount admin routes
  app.use('/api/admin', adminRoutes);

  // Auth routes
  app.get('/api/auth/me', (req, res) => {
    res.json(req.session.user || null);
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Basic input validation
      if (!username || !password) {
        return res.status(400).json({ 
          error: {
            message: "Username and password are required",
            code: "VALIDATION_ERROR"
          }
        });
      }
      
      // Rate limiting for security (same as admin login)
      const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      const loginAttempts = loginAttemptsByIp.get(clientIp) || [];
      const recentAttempts = loginAttempts.filter(time => now - time < 15 * 60 * 1000);
      
      // Limit login attempts to prevent brute force attacks
      if (recentAttempts.length >= 5) {
        return res.status(429).json({ 
          error: {
            message: "Too many login attempts. Please try again later.",
            code: "RATE_LIMIT_EXCEEDED",
            retryAfter: Math.ceil((recentAttempts[0] + 15 * 60 * 1000 - now) / 1000)
          }
        });
      }
      
      // Track this attempt
      recentAttempts.push(now);
      loginAttemptsByIp.set(clientIp, recentAttempts);
      
      // For this demo, we're still using a hardcoded user
      // In production, you would look up the user in the database
      // and verify the password hash using bcrypt
      if (username === "demouser" && password === "demo123") {
        const demoUser = {
          id: "demo-user-123",
          email: "demo@example.com",
          firstName: "Demo",
          lastName: "User",
          profileImageUrl: null,
          walletAddress: null,
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Save the demo user in the database if it doesn't exist
        try {
          // Check if the user already exists
          const existingUser = await storage.getUserByEmail("demo@example.com");
          if (!existingUser) {
            // Try to create the user in storage
            await storage.upsertUser({
              id: "demo-user-123",
              email: "demo@example.com",
              firstName: "Demo",
              lastName: "User",
              isAdmin: false,
            });
          }
        } catch (dbError) {
          // If database operation fails, just continue with session login
          console.log("Note: Could not save demo user to database, using session only:", dbError);
        }
        
        // Always store in session regardless of database operation
        req.session.user = demoUser;
        return res.json(demoUser);
      }
      
      // For regular users, get by email
      try {
        const user = await storage.getUserByEmail(username);
        
        if (!user) {
          // Always use the same error message to prevent username enumeration
          return res.status(401).json({ 
            error: {
              message: "Invalid username or password",
              code: "AUTHENTICATION_FAILED"
            } 
          });
        }
        
        // Check for account lockout
        if (user.lockUntil && user.lockUntil > new Date()) {
          return res.status(429).json({
            error: {
              message: "Account temporarily locked due to too many failed attempts. Try again later.",
              code: "ACCOUNT_LOCKED",
              lockedUntil: user.lockUntil
            }
          });
        }

        // Get password hash from user record
        const storedHash = user.passwordHash;
        
        // For demo users without password hash, use hardcoded comparison
        let passwordMatch = false;
        
        if (storedHash) {
          // Use bcrypt to verify password against stored hash
          const { verifyPassword } = require('./utils/passwordManager');
          passwordMatch = await verifyPassword(password, storedHash);
        } else if (password === "demo123") {
          // Legacy fallback for demo accounts without hashed passwords
          passwordMatch = true;
        }
        
        if (!passwordMatch) {
          // Use a small delay to prevent timing attacks
          await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
          
          // Update failed login attempts
          try {
            // Calculate new login attempts and possible account lockout
            const loginAttempts = (user.loginAttempts || 0) + 1;
            let lockUntil = null;
            
            // Lock account after 5 failed attempts
            if (loginAttempts >= 5) {
              // Lock for 30 minutes
              lockUntil = new Date(Date.now() + 30 * 60 * 1000);
            }
            
            // Update user record with login attempts and possible lockout
            await storage.updateUser(user.id, {
              loginAttempts,
              lockUntil
            });
            
            // Add additional info to error message if account is locked
            if (lockUntil) {
              return res.status(429).json({
                error: {
                  message: "Account locked due to too many failed login attempts. Try again later.",
                  code: "ACCOUNT_LOCKED",
                  lockedUntil: lockUntil
                }
              });
            }
          } catch (updateError) {
            console.error("Failed to update login attempts:", updateError);
          }
          
          return res.status(401).json({ 
            error: {
              message: "Invalid username or password",
              code: "AUTHENTICATION_FAILED"
            } 
          });
        }
        
        // Reset login attempts and update last login time
        try {
          await storage.updateUser(user.id, {
            loginAttempts: 0,
            lockUntil: null,
            lastLoginAt: new Date()
          });
        } catch (updateError) {
          console.error("Failed to update login timestamp:", updateError);
          // Continue login process even if update fails
        }
        
        // Create session user object without sensitive data
        const sessionUser = {
          ...user,
          // Remove sensitive fields from session data
          passwordHash: undefined,
          passwordResetToken: undefined,
          passwordResetExpires: undefined,
          loginAttempts: undefined,
          lockUntil: undefined
        };
        
        // Store clean user data in session
        req.session.user = sessionUser;
        req.session.loginTime = new Date();
        req.session.loginIP = req.ip || req.socket.remoteAddress || 'unknown';
        
        // Use session.save to ensure data is written before response
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({ 
              error: {
                message: "Authentication succeeded but session could not be saved",
                code: "SESSION_ERROR"
              }
            });
          }
          
          // Return user (without sensitive data)
          res.json({
            ...sessionUser,
            loginTime: req.session.loginTime
          });
        });
      } catch (dbError) {
        console.error("Database error during login:", dbError);
        return res.status(500).json({ 
          error: {
            message: "Authentication service unavailable. Please try again later.",
            code: "DATABASE_ERROR"
          }
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        error: {
          message: "An error occurred during login",
          code: "SERVER_ERROR"
        }
      });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      // Validate input using zod schema
      const { registerUserSchema } = require('../shared/schema');
      
      try {
        registerUserSchema.parse(req.body);
      } catch (validationError) {
        return res.status(400).json({ 
          error: {
            message: "Validation failed",
            code: "VALIDATION_ERROR",
            details: validationError.errors
          }
        });
      }
      
      const { password, firstName, lastName, email } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          error: {
            message: "User already exists with this email address",
            code: "USER_EXISTS"
          }
        });
      }
      
      // Hash the password with bcrypt before storing
      const { hashPassword } = require('./utils/passwordManager');
      const passwordHash = await hashPassword(password);
      
      // Create new user with secure ID and hashed password
      const userId = require('crypto').randomUUID();
      
      const newUser = await storage.upsertUser({
        id: userId,
        email,
        firstName,
        lastName,
        profileImageUrl: null,
        passwordHash,
        lastLoginAt: new Date(), // Set initial login time
        loginAttempts: 0
      });
      
      // Create clean session user without sensitive data
      const sessionUser = {
        ...newUser,
        passwordHash: undefined
      };
      
      // Store clean user in session
      req.session.user = sessionUser;
      req.session.loginTime = new Date();
      req.session.loginIP = req.ip || req.socket.remoteAddress || 'unknown';
      
      // Force session save
      req.session.save((err) => {
        if (err) {
          console.error('Session save error during registration:', err);
          return res.status(500).json({ 
            error: {
              message: "Registration succeeded but session could not be saved",
              code: "SESSION_ERROR"
            }
          });
        }
        
        // Return user data without sensitive fields
        res.status(201).json({
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          createdAt: newUser.createdAt,
          profileImageUrl: newUser.profileImageUrl
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        error: {
          message: "An error occurred during registration",
          code: "SERVER_ERROR"
        }
      });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    // Capture userId for audit log before destroying session
    const userId = req.session.user?.id;
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    
    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ 
          error: {
            message: "Failed to complete logout process",
            code: "SESSION_ERROR"
          } 
        });
      }
      
      // Log successful logout for security auditing
      if (userId) {
        console.log(`[SECURITY] User ${userId} logged out from IP: ${clientIp} at ${new Date().toISOString()}`);
      }
      
      // Clear client-side cookie by setting an expired cookie header
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      res.json({ 
        message: "Logged out successfully", 
        timestamp: new Date().toISOString() 
      });
    });
  });

  // Use admin utilities

// Admin authentication routes
  app.post('/api/auth/admin-login', async (req, res) => {
    try {
      // Basic input validation
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ message: "Invalid request body" });
      }
      
      const { username, password } = req.body;
      
      // More detailed validation
      if (!username || typeof username !== 'string') {
        return res.status(400).json({ 
          error: {
            message: "Username is required",
            code: "VALIDATION_ERROR"
          }
        });
      }
      
      if (!password || typeof password !== 'string') {
        return res.status(400).json({ 
          error: {
            message: "Password is required",
            code: "VALIDATION_ERROR"
          }
        });
      }
      
      // Stricter rate limiting for admin access
      const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      const loginAttempts = loginAttemptsByIp.get(clientIp) || [];
      
      // Track attempts for 30 minutes (longer timeframe for admin)
      const recentAttempts = loginAttempts.filter(time => now - time < 30 * 60 * 1000);
      
      // More restrictive limit (3 attempts instead of 5)
      if (recentAttempts.length >= 3) {
        return res.status(429).json({ 
          error: {
            message: "Too many login attempts. Please try again later.",
            code: "RATE_LIMIT_EXCEEDED",
            retryAfter: Math.ceil((recentAttempts[0] + 30 * 60 * 1000 - now) / 1000)
          }
        });
      }
      
      // Log admin login attempts for security auditing
      console.log(`[SECURITY] Admin login attempt from IP: ${clientIp}`);

      // Simple hardcoded admin check - more reliable than database check
      // For a production environment, this would be replaced with proper authentication
      if (username === "admin" && password === "admin123") {
        // Create a secure admin user object
        const adminUser = {
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
        
        // Log successful admin authentication for security auditing
        console.log(`[SECURITY] Admin login successful: ${username} from IP: ${clientIp} at ${new Date().toISOString()}`);
        
        // Reset login attempts on successful login
        loginAttemptsByIp.set(clientIp, []);
        
        // Store admin session
        req.session.user = adminUser;
        req.session.lastLogin = new Date();
        req.session.loginIP = clientIp;
        
        return res.json({
          ...adminUser,
          loginTime: req.session.lastLogin
        });
      }
      
      // Track failed attempt
      loginAttemptsByIp.set(clientIp, [...recentAttempts, now]);
      
      // Add a delay to deter brute force attacks
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500));
      
      // Log the failed attempt for security auditing
      console.log(`[SECURITY] Failed admin login attempt for username: ${username} from IP: ${clientIp}`);
      
      // Authentication failed - use consistent error structure
      return res.status(401).json({ 
        error: {
          message: "Invalid admin credentials",
          code: "AUTHENTICATION_FAILED"
        } 
      });
    } catch (error) {
      console.error("Admin login error:", error);
      return res.status(500).json({ 
        error: {
          message: "An error occurred during admin login",
          code: "SERVER_ERROR"
        }
      });
    }
  });

  app.get('/api/auth/admin/me', isAdmin, (req, res) => {
    // User is already verified as admin by middleware
    return res.json(req.session.user);
  });

  // Admin routes for managing users
  app.get('/api/admin/users', isAdmin, async (req, res) => {
    try {
      // Get all users
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      res.status(500).json({ 
        message: "Failed to fetch users",
        error: process.env.NODE_ENV === 'production' ? undefined : error.message 
      });
    }
  });
  
  // User details route is now handled by admin routes with complete user profiles
  
  // Admin route to update user details
  app.put('/api/admin/users/:id', isAdmin, async (req, res) => {
    try {
      const userId = req.params.id;
      const userData = req.body;
      
      // Input validation
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ 
          message: "Invalid user ID",
          code: "INVALID_INPUT" 
        });
      }
      
      // Validate required fields
      if (!userData || typeof userData !== 'object') {
        return res.status(400).json({ 
          message: "No user data provided or invalid format",
          code: "INVALID_INPUT" 
        });
      }
      
      // Make sure the user exists before updating
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        return res.status(404).json({ 
          message: "User not found",
          code: "USER_NOT_FOUND" 
        });
      }
      
      // Update user
      const updatedUser = await storage.updateUser(userId, userData);
      
      res.json(updatedUser);
    } catch (error: any) {
      console.error("Error updating user:", error);
      res.status(500).json({ 
        message: "Failed to update user",
        error: process.env.NODE_ENV === 'production' ? undefined : error.message,
        code: "SERVER_ERROR"
      });
    }
  });
  
  // Admin routes for transactions
  app.get('/api/admin/transactions', isAdmin, async (req, res) => {
    try {
      // Optional pagination
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;
      
      // Input validation for pagination parameters
      if (isNaN(limit) || limit < 0 || limit > 1000) {
        return res.status(400).json({ 
          message: "Invalid limit parameter, must be between 0 and 1000",
          code: "INVALID_PAGINATION" 
        });
      }
      
      if (isNaN(offset) || offset < 0) {
        return res.status(400).json({ 
          message: "Invalid offset parameter, must be greater than or equal to 0",
          code: "INVALID_PAGINATION" 
        });
      }
      
      // Get all transactions with pagination
      const transactions = await storage.getAllTransactions();
      
      // Apply pagination in memory (ideally this would be done at the database level)
      const paginatedTransactions = transactions.slice(offset, offset + limit);
      
      res.json({
        data: paginatedTransactions,
        pagination: {
          total: transactions.length,
          limit,
          offset,
          hasMore: offset + limit < transactions.length
        }
      });
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ 
        message: "Failed to fetch transactions",
        error: process.env.NODE_ENV === 'production' ? undefined : error.message,
        code: "SERVER_ERROR"
      });
    }
  });
  
  // Admin route to approve pending transactions
  app.post('/api/admin/transactions/:id/approve', isAdmin, async (req, res) => {
    try {
      // Input validation for transaction ID
      const transactionId = parseInt(req.params.id);
      
      if (isNaN(transactionId) || transactionId <= 0) {
        return res.status(400).json({ 
          message: "Invalid transaction ID",
          code: "INVALID_INPUT" 
        });
      }
      
      // Get the transaction
      const transaction = await storage.getTransaction(transactionId);
      
      if (!transaction) {
        return res.status(404).json({ 
          message: "Transaction not found",
          code: "TRANSACTION_NOT_FOUND" 
        });
      }
      
      if (transaction.status !== "pending") {
        return res.status(400).json({ 
          message: "Transaction is not pending",
          code: "INVALID_TRANSACTION_STATUS" 
        });
      }
      
      // Log the transaction approval attempt
      console.log(`[ADMIN ACTION] Admin ${req.session.user?.id} approving transaction ${transactionId}`);
      
      // Use a database transaction for atomicity
      try {
        // First update the transaction status
        const updatedTransaction = await storage.updateTransactionStatus(transactionId, "completed");
        
        // If it's a deposit, update the user's balance
        if (transaction.type === "deposit") {
          const balance = await storage.getBalanceByCurrency(transaction.userId, transaction.currency);
          
          if (balance) {
            const newAmount = (parseFloat(balance.amount.toString()) + parseFloat(transaction.amount.toString())).toString();
            
            // Validate calculated amount to avoid potential issues
            if (isNaN(parseFloat(newAmount))) {
              throw new Error("Invalid calculated balance amount");
            }
            
            await storage.updateBalance(balance.id, { amount: newAmount });
          } else {
            await storage.createBalance({
              userId: transaction.userId,
              currency: transaction.currency,
              amount: transaction.amount.toString()
            });
          }
          
          console.log(`[ADMIN ACTION] Balance updated for user ${transaction.userId}, currency ${transaction.currency}`);
        }
        
        // Return the updated transaction
        res.json({
          transaction: updatedTransaction,
          message: "Transaction approved successfully",
          code: "TRANSACTION_APPROVED"
        });
      } catch (transactionError) {
        // Log the error and return a detailed error message
        console.error("Error in transaction approval logic:", transactionError);
        
        // Attempt to roll back - in a real production system, this would be handled by a proper DB transaction
        await storage.updateTransactionStatus(transactionId, "pending");
        
        throw new Error("Failed to complete transaction approval process");
      }
    } catch (error: any) {
      console.error("Error approving transaction:", error);
      res.status(500).json({ 
        message: "Failed to approve transaction",
        error: process.env.NODE_ENV === 'production' ? undefined : error.message,
        code: "SERVER_ERROR" 
      });
    }
  });
  
  // Admin route to get user statistics
  app.get('/api/admin/stats', isAdmin, async (req, res) => {
    try {
      // Cache mechanism for admin stats to improve performance
      const cacheKey = 'admin-stats';
      const cacheExpiry = 60 * 1000; // 1 minute in milliseconds
      const cachedStats = adminStatsCache.get(cacheKey);
      
      if (cachedStats && cachedStats.timestamp > (Date.now() - cacheExpiry)) {
        return res.json(cachedStats.data);
      }
      
      // Get all users count
      const users = await storage.getAllUsers();
      
      // Get all transactions
      const transactions = await storage.getAllTransactions();
      
      // Calculate total deposit volume with validation
      const depositVolume = transactions
        .filter(tx => tx.type === "deposit" && tx.status === "completed")
        .reduce((sum, tx) => {
          const amount = parseFloat(tx.amount.toString());
          return isNaN(amount) ? sum : sum + amount;
        }, 0);
      
      // Calculate total withdrawal volume with validation
      const withdrawalVolume = transactions
        .filter(tx => tx.type === "withdrawal" && tx.status === "completed")
        .reduce((sum, tx) => {
          const amount = parseFloat(tx.amount.toString());
          return isNaN(amount) ? sum : sum + amount;
        }, 0);
      
      // Count pending transactions
      const pendingTransactions = transactions.filter(tx => tx.status === "pending").length;
      
      // Additional useful analytics
      const userBalances: Record<string, number> = {};
      const activeUsers = new Set<string>();
      
      // Process transactions to build analytics
      transactions.forEach(tx => {
        // Track active users
        activeUsers.add(tx.userId);
        
        // Track balances by currency
        if (!userBalances[tx.currency]) {
          userBalances[tx.currency] = 0;
        }
        
        if (tx.status === "completed") {
          const amount = parseFloat(tx.amount.toString());
          if (!isNaN(amount)) {
            if (tx.type === "deposit") {
              userBalances[tx.currency] += amount;
            } else if (tx.type === "withdrawal") {
              userBalances[tx.currency] -= amount;
            }
          }
        }
      });
      
      const stats = {
        totalUsers: users.length,
        activeUsers: activeUsers.size,
        totalTransactions: transactions.length,
        depositVolume,
        withdrawalVolume,
        pendingTransactions,
        platformBalances: userBalances,
        updatedAt: new Date().toISOString()
      };
      
      // Cache the computed stats
      adminStatsCache.set(cacheKey, {
        timestamp: Date.now(),
        data: stats
      });
      
      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ 
        message: "Failed to fetch admin statistics",
        error: process.env.NODE_ENV === 'production' ? undefined : error.message,
        code: "SERVER_ERROR" 
      });
    }
  });

  // This endpoint is now replaced by /api/auth/user

  // Transaction routes
  app.get("/api/transactions", async (req: any, res: Response) => {
    try {
      // Check if user is logged in
      if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.session.user.id;
      const transactions = await storage.getUserTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req: any, res: Response) => {
    try {
      // Check if user is logged in
      if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.session.user.id;
      const transactionData = insertTransactionSchema.parse({
        ...req.body,
        userId,
      });
      
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Balance routes
  app.get("/api/balances", async (req: any, res: Response) => {
    try {
      // Check if user is logged in
      if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.session.user.id;
      const balances = await storage.getUserBalances(userId);
      res.json(balances);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch balances" });
    }
  });

  app.post("/api/balances", async (req: any, res: Response) => {
    try {
      // Check if user is logged in
      if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.session.user.id;
      const balanceData = insertBalanceSchema.parse({
        ...req.body,
        userId,
      });
      
      const balance = await storage.createBalance(balanceData);
      res.status(201).json(balance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create balance" });
    }
  });

  app.put("/api/balances/:id", async (req: any, res: Response) => {
    try {
      // Check if user is logged in
      if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.session.user.id;
      const balanceId = parseInt(req.params.id);
      
      // Ensure user owns this balance
      const balance = await storage.getBalance(balanceId);
      if (!balance || balance.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const updateData = updateBalanceSchema.parse(req.body);
      const updatedBalance = await storage.updateBalance(balanceId, updateData);
      
      res.json(updatedBalance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to update balance" });
    }
  });

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}