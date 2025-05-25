// Main API handler for Vercel deployment
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req;
  
  try {
    // Handle admin login specifically
    if (url === '/api/auth/admin-login' && req.method === 'POST') {
      const { username, password } = req.body || {};
      
      console.log(`Admin login attempt: ${username}`);
      
      // Check admin credentials
      if (username === "admin" && password === "admin123") {
        const adminUser = {
          id: "admin-user-1",
          email: "admin@cryptonest.com", 
          firstName: "Admin",
          lastName: "User",
          isAdmin: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        console.log("Admin login successful");
        return res.status(200).json(adminUser);
      } else {
        console.log("Invalid admin credentials");
        return res.status(401).json({ 
          message: "Invalid admin credentials"
        });
      }
    }

    // Handle auth/me endpoint
    if (url === '/api/auth/me' && req.method === 'GET') {
      // Return null for unauthenticated user (Vercel doesn't have session state)
      return res.status(200).json(null);
    }

    // Handle other auth endpoints
    if (url.startsWith('/api/auth/')) {
      return res.status(200).json({ message: "Auth endpoint not implemented" });
    }

    // Handle balance endpoints
    if (url.startsWith('/api/balances')) {
      if (req.method === 'GET') {
        return res.json([
          {
            id: 1,
            currency: "BTC",
            amount: "0.75000000",
            locked: "0.00000000"
          },
          {
            id: 2,
            currency: "ETH", 
            amount: "2.50000000",
            locked: "0.00000000"
          },
          {
            id: 3,
            currency: "USDT",
            amount: "1500.00000000", 
            locked: "0.00000000"
          }
        ]);
      }
      return res.status(405).json({ message: "Method not allowed" });
    }

    // Handle transaction endpoints
    if (url.startsWith('/api/transactions')) {
      if (req.method === 'GET') {
        return res.json([
          {
            id: 1,
            type: "deposit",
            currency: "BTC",
            amount: "0.75000000",
            status: "completed",
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            type: "deposit", 
            currency: "ETH",
            amount: "2.50000000",
            status: "completed",
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
      }
      return res.status(405).json({ message: "Method not allowed" });
    }

    // Default response for unmatched routes
    return res.status(404).json({ 
      message: "API endpoint not found",
      url: url,
      method: req.method
    });

  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ 
      message: "Internal server error"
    });
  }
}