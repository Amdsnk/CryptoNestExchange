import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase, dbConnected } from "./db";
import { storage } from "./storage";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import adminMockRoutes from './routes/adminMock';

// Check for critical environment variables
if (!process.env.SESSION_SECRET && process.env.NODE_ENV === 'production') {
  log("ERROR: SESSION_SECRET environment variable is required in production");
  throw new Error("SESSION_SECRET environment variable is required in production");
} else if (!process.env.SESSION_SECRET) {
  log("WARNING: SESSION_SECRET environment variable is not set");
  process.env.SESSION_SECRET = "cryptonest_secure_session_" + Date.now();
  log("Using temporary session secret - DO NOT use in production!");
}

const app = express();

// Security headers middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.coingecko.com", "wss://stream.binance.com"],
    }
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' }
}));

// CORS configuration - restrict in production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://cryptonest.com', 'https://www.cryptonest.com', 'https://cryptonest.replit.app'] 
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers with size limits for security
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  }
}));

// Request logging middleware
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

(async () => {
  // Initialize database (important for Vercel deployment)
  try {
    log("Initializing database...");
    await initializeDatabase();
    
    // Database storage is now the default implementation
    if (dbConnected) {
      log("Using PostgreSQL database for storage");
      
      // Seed mock data for admin dashboard demonstrations
      try {
        const { seedMockData } = require('./utils/mockData');
        await seedMockData();
        log("Mock data seeded successfully");
      } catch (seedError) {
        log(`Error seeding mock data: ${seedError instanceof Error ? seedError.message : String(seedError)}`);
        log("Continuing without mock data");
      }
    } else {
      log("Database not connected - continuing with in-memory mock data for demo");
    }
    
    log("Database initialization completed");
  } catch (error) {
    log(`Database initialization error: ${error instanceof Error ? error.message : String(error)}`);
    log("Falling back to in-memory storage");
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    // Log the error for internal tracking but don't expose details to client
    console.error("Server error:", err);
    
    // Determine the status code
    const status = err.status || err.statusCode || 500;
    
    // Create a user-friendly error message
    const message = err.message || "Internal Server Error";
    
    // Only include detailed error info in development
    const errorResponse = {
      message: message,
      code: err.code || 'SERVER_ERROR',
      ...(process.env.NODE_ENV !== 'production' ? { 
        stack: err.stack,
        details: err.details || err
      } : {})
    };

    // Send the response
    res.status(status).json({ error: errorResponse });
  });
  
  // 404 handler for API routes
  app.use('/api/*', (req: Request, res: Response) => {
    res.status(404).json({
      error: {
        message: `Route not found: ${req.method} ${req.path}`,
        code: 'ROUTE_NOT_FOUND'
      }
    });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
