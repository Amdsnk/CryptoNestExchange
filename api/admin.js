// Consolidated admin API for Vercel (single function for all admin operations)
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action, id } = req.query;

  try {
    // Handle consolidated dashboard endpoint (efficient for Vercel)
    if (action === 'dashboard' && req.method === 'GET') {
      const users = [
        {
          id: "user-1",
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
          profileImageUrl: null,
          walletAddress: "0x8912AE4d47288283f823E11D8c87C81a3829B303",
          isAdmin: false,
          lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: "user-2",
          email: "jane.smith@example.com",
          firstName: "Jane",
          lastName: "Smith",
          profileImageUrl: null,
          walletAddress: "0x7612BE4c47288283f823E11D8c87C81a3829B401",
          isAdmin: false,
          lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: "user-3",
          email: "robert.johnson@example.com",
          firstName: "Robert",
          lastName: "Johnson",
          profileImageUrl: null,
          walletAddress: "0x5512AB4d47288283f823E11D8c87C81a3829B505",
          isAdmin: false,
          lastLoginAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: "user-4",
          email: "sarah.williams@example.com",
          firstName: "Sarah",
          lastName: "Williams",
          profileImageUrl: null,
          walletAddress: "0x3312AE4d47288283f823E11D8c87C81a3829B707",
          isAdmin: false,
          lastLoginAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          id: "user-5",
          email: "michael.brown@example.com",
          firstName: "Michael",
          lastName: "Brown",
          profileImageUrl: null,
          walletAddress: "0x2212AE4d47288283f823E11D8c87C81a3829B909",
          isAdmin: false,
          lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ];

      const transactions = [
        {
          id: 14,
          userId: "user-4",
          type: "exchange",
          currency: "BNB",
          amount: "3.50000000",
          status: "completed",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          txHash: "0xfedcba9876543210fedcba9876543210fedcba98",
          network: "Binance Smart Chain"
        },
        {
          id: 13,
          userId: "user-5",
          type: "withdrawal",
          currency: "BTC",
          amount: "0.25000000",
          status: "completed",
          timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
          txHash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
          network: "Bitcoin"
        },
        {
          id: 12,
          userId: "user-3",
          type: "withdrawal",
          currency: "ETH",
          amount: "1.75000000",
          status: "failed",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          txHash: null,
          network: "Ethereum"
        },
        {
          id: 11,
          userId: "user-2",
          type: "deposit",
          currency: "USDT",
          amount: "5000.00",
          status: "completed",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          txHash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
          network: "Ethereum"
        },
        {
          id: 10,
          userId: "user-1",
          type: "deposit",
          currency: "BTC",
          amount: "0.75000000",
          status: "completed",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          txHash: "0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
          network: "Bitcoin"
        },
        {
          id: 9,
          userId: "user-4",
          type: "deposit",
          currency: "USDT",
          amount: "1500.00",
          status: "pending",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          txHash: null,
          network: "Ethereum"
        },
        {
          id: 8,
          userId: "user-5",
          type: "deposit",
          currency: "ETH",
          amount: "1.25000000",
          status: "pending",
          timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
          txHash: null,
          network: "Ethereum"
        }
      ];

      const stats = {
        totalUsers: users.length,
        totalTransactions: transactions.length,
        pendingTransactions: transactions.filter(t => t.status === 'pending').length,
        depositVolume: transactions
          .filter(t => t.type === 'deposit' && t.status === 'completed')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0),
        withdrawalVolume: transactions
          .filter(t => t.type === 'withdrawal' && t.status === 'completed')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      };

      return res.json({
        stats,
        users: users.slice(0, 50),
        transactions: transactions.slice(0, 100)
      });
    }

    // Handle admin stats
    if (action === 'stats' && req.method === 'GET') {
      return res.json({
        userStats: {
          totalUsers: 5,
          newUsers24h: 0,
          activeUsers: 3,
          verifiedUsers: 5
        },
        transactionStats: {
          totalTransactions: 15,
          pendingTransactions: 3,
          completedTransactions: 11,
          failedTransactions: 1,
          totalVolume: 15250.75,
          pendingVolume: 6500.00
        },
        volumeByAsset: {
          BTC: 2845.50,
          ETH: 8750.25,
          USDT: 3655.00
        }
      });
    }

    // Handle admin users list
    if (action === 'users' && req.method === 'GET') {
      return res.json([
        {
          id: "user-1",
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
          profileImageUrl: null,
          walletAddress: "0x8912AE4d47288283f823E11D8c87C81a3829B303",
          isAdmin: false,
          lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: "user-2",
          email: "jane.smith@example.com",
          firstName: "Jane",
          lastName: "Smith",
          profileImageUrl: null,
          walletAddress: "0x7612BE4c47288283f823E11D8c87C81a3829B401",
          isAdmin: false,
          lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: "user-3",
          email: "robert.johnson@example.com",
          firstName: "Robert",
          lastName: "Johnson",
          profileImageUrl: null,
          walletAddress: "0x5512AB4d47288283f823E11D8c87C81a3829B505",
          isAdmin: false,
          lastLoginAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: "user-4",
          email: "sarah.williams@example.com",
          firstName: "Sarah",
          lastName: "Williams",
          profileImageUrl: null,
          walletAddress: "0x3312AE4d47288283f823E11D8c87C81a3829B707",
          isAdmin: false,
          lastLoginAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          id: "user-5",
          email: "michael.brown@example.com",
          firstName: "Michael",
          lastName: "Brown",
          profileImageUrl: null,
          walletAddress: "0x2212AE4d47288283f823E11D8c87C81a3829B909",
          isAdmin: false,
          lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ]);
    }

    // Handle admin transactions
    if (action === 'transactions' && req.method === 'GET') {
      return res.json([
        {
          id: 14,
          userId: "user-4",
          type: "exchange",
          currency: "BNB",
          amount: "3.50000000",
          status: "completed",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          txHash: "0xfedcba9876543210fedcba9876543210fedcba98",
          network: "Binance Smart Chain"
        },
        {
          id: 13,
          userId: "user-5",
          type: "withdrawal",
          currency: "BTC",
          amount: "0.25000000",
          status: "completed",
          timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
          txHash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
          network: "Bitcoin"
        },
        {
          id: 12,
          userId: "user-3",
          type: "withdrawal",
          currency: "ETH",
          amount: "1.75000000",
          status: "failed",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          txHash: null,
          network: "Ethereum"
        },
        {
          id: 11,
          userId: "user-2",
          type: "deposit",
          currency: "USDT",
          amount: "5000.00",
          status: "completed",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          txHash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
          network: "Ethereum"
        },
        {
          id: 10,
          userId: "user-1",
          type: "deposit",
          currency: "BTC",
          amount: "0.75000000",
          status: "completed",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          txHash: "0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
          network: "Bitcoin"
        },
        {
          id: 9,
          userId: "user-4",
          type: "deposit",
          currency: "USDT",
          amount: "1500.00",
          status: "pending",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          txHash: null,
          network: "Ethereum"
        },
        {
          id: 8,
          userId: "user-5",
          type: "deposit",
          currency: "ETH",
          amount: "1.25000000",
          status: "pending",
          timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
          txHash: null,
          network: "Ethereum"
        }
      ]);
    }

    // Handle transaction approval
    if (action === 'approve' && req.method === 'POST') {
      const transactionId = parseInt(id);
      return res.json({
        id: transactionId,
        status: "completed",
        message: "Transaction approved successfully",
        approvedAt: new Date().toISOString()
      });
    }

    // Handle user details
    if (action === 'user-detail' && req.method === 'GET') {
      return res.json({
        user: {
          id: id || "user-1",
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
          profileImageUrl: null,
          walletAddress: "0x8912AE4d47288283f823E11D8c87C81a3829B303",
          isAdmin: false,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        transactions: [
          {
            id: 101,
            type: "deposit",
            currency: "BTC",
            amount: "0.75000000",
            status: "completed",
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          }
        ],
        balances: [
          {
            id: 1,
            currency: "BTC",
            amount: "0.75000000",
            locked: "0.00000000"
          }
        ]
      });
    }

    // Default response
    return res.status(404).json({ message: "Action not found" });

  } catch (error) {
    console.error("Admin API error:", error);
    return res.status(500).json({ 
      message: "Error processing admin request"
    });
  }
}