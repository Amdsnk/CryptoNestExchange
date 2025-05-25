import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase, dbConnected, db } from "./db";
import { storage } from "./storage";
import session from "express-session";
import MemoryStore from "memorystore";

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Make sure we have a session secret
if (!process.env.SESSION_SECRET) {
  console.warn("SESSION_SECRET environment variable is not set!");
  process.env.SESSION_SECRET = "cryptonest_secure_session_" + Date.now();
  console.log("Using temporary session secret - DO NOT use in production!");
}

// Create memory store for sessions (better for serverless environments like Vercel)
const MemoryStoreSession = MemoryStore(session);
const memoryStore = new MemoryStoreSession({
  checkPeriod: 86400000 // prune expired entries every 24h
});

// Set up session middleware with memory store for better Vercel compatibility
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: memoryStore,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  }
}));

// Middleware for logging API requests
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Initialize database and routes
let appInitialized = false;
let appInstance: express.Express | null = null;

// Helper function to set up basic auth routes
function setupAuthRoutes(app: express.Express) {
  // Auth endpoints
  app.get('/api/auth/me', (req, res) => {
    res.json(req.session.user || null);
  });

  // Admin auth endpoints
  app.get('/api/auth/admin/me', (req, res) => {
    // Check if user is admin
    if (req.session.user?.isAdmin) {
      return res.json(req.session.user);
    }
    return res.status(401).json({ message: "Not authenticated as admin" });
  });

  // Admin login route removed - using the one in routes.ts to avoid conflicts

  app.post('/api/auth/admin/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Admin logged out successfully" });
    });
  });

  // Special endpoint just for admin login
  app.post('/api/auth/demo-login', async (req, res) => {
    try {
      console.log('Demo login attempt');
      
      // Create a demo user with fixed data
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
      
      // Save to session
      req.session.user = demoUser;
      
      // Force session save before responding
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: "Failed to save session" });
        }
        
        console.log('Demo login successful, session saved');
        return res.json(demoUser);
      });
    } catch (error) {
      console.error("Demo login error:", error);
      res.status(500).json({ message: "An error occurred during demo login" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // For demo accounts, hardcode the user
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
        
        // Always store in session
        req.session.user = demoUser;
        return res.json(demoUser);
      }
      
      // Authentication failed
      return res.status(401).json({ message: "Invalid username or password" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "An error occurred during login" });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, password, firstName, lastName, email } = req.body;
      
      // Create a simple user for demo purposes
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        firstName,
        lastName,
        profileImageUrl: null,
        walletAddress: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Store user in session
      req.session.user = newUser;
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "An error occurred during registration" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
}

async function getInitializedApp() {
  if (appInitialized && appInstance) {
    return appInstance;
  }

  try {
    // Initialize database
    await initializeDatabase();
    
    // Database connectivity is handled in the storage implementation
    if (dbConnected) {
      log("Using PostgreSQL database for storage");
    } else {
      log("Database not connected - using session-based authentication");
      
      // Set up direct auth routes that don't depend on database
      setupAuthRoutes(app);
    }
  } catch (error) {
    log(`Database initialization error: ${error instanceof Error ? error.message : String(error)}`);
    log("Continuing with session-based authentication");
    
    // Set up direct auth routes that don't depend on database
    setupAuthRoutes(app);
  }

  // Register all other routes
  await registerRoutes(app);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    serveStatic(app);
  }

  appInitialized = true;
  appInstance = app;
  return app;
}

// Export handler for Vercel
export default async function handler(req: any, res: any) {
  const app = await getInitializedApp();
  return app(req, res);
}