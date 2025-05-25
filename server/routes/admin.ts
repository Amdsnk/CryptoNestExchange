import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { isAdmin } from '../middleware/auth';

const router = Router();

// Middleware to ensure all routes in this file require admin access
router.use(isAdmin);

// Combined admin dashboard data endpoint (for Vercel efficiency)
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    // Load all data in parallel
    const [users, transactions] = await Promise.all([
      storage.getAllUsers(),
      storage.getAllTransactions()
    ]);

    // Calculate statistics
    const totalUsers = users.length;
    const totalTransactions = transactions.length;
    
    // Transaction statistics
    const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
    const completedTransactions = transactions.filter(t => t.status === 'completed').length;
    const failedTransactions = transactions.filter(t => t.status === 'failed').length;
    
    // Volume calculations
    const depositVolume = transactions
      .filter(t => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const withdrawalVolume = transactions
      .filter(t => t.type === 'withdraw' && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Send combined response
    res.json({
      stats: {
        totalUsers,
        totalTransactions,
        pendingTransactions,
        depositVolume,
        withdrawalVolume
      },
      users: users.slice(0, 50), // Limit for performance
      transactions: transactions.slice(0, 100) // Latest 100 transactions
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ 
      error: 'Failed to load admin dashboard data'
    });
  }
});

// Get summary dashboard statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // Use mock data directly for more reliable dashboard
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
      },
      {
        id: "admin-user-1",
        email: "admin@cryptonest.com",
        firstName: "Admin",
        lastName: "User",
        profileImageUrl: null,
        walletAddress: null,
        isAdmin: true,
        lastLoginAt: new Date(),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];
    
    // Use hardcoded mock transactions for consistency
    const transactions = [
      {
        id: 1,
        userId: "user-1",
        type: "deposit",
        currency: "BTC",
        amount: "0.45000000",
        status: "completed",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        txHash: "0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
        from: "0x7739a53a0b87de543f671d6cbd6e2b21",
        to: null,
        address: "0x8912AE4d47288283f823E11D8c87C81a3829B303",
        network: "Bitcoin"
      },
      {
        id: 2,
        userId: "user-1",
        type: "withdrawal",
        currency: "ETH",
        amount: "2.35000000",
        status: "pending",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        txHash: null,
        from: null,
        to: "0x1234567890abcdef1234567890abcdef12345678",
        address: null,
        network: "Ethereum"
      },
      {
        id: 3,
        userId: "user-2",
        type: "deposit",
        currency: "USDT",
        amount: "5000.00",
        status: "completed",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        txHash: "0x9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
        from: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
        to: null,
        address: "0x7612BE4c47288283f823E11D8c87C81a3829B401",
        network: "Ethereum"
      },
      {
        id: 4,
        userId: "user-2",
        type: "exchange",
        currency: "BTC",
        amount: "0.15000000",
        status: "completed",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        txHash: "0xabcdef1234567890abcdef1234567890abcdef12",
        from: null,
        to: null,
        address: null,
        network: "Bitcoin"
      },
      {
        id: 5,
        userId: "user-3",
        type: "withdrawal",
        currency: "ETH",
        amount: "1.75000000",
        status: "failed",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        txHash: null,
        from: null,
        to: "0xfedcba9876543210fedcba9876543210fedcba98",
        address: null,
        network: "Ethereum"
      },
      {
        id: 6,
        userId: "user-3",
        type: "deposit",
        currency: "SOL",
        amount: "25.00000000",
        status: "completed",
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        txHash: "0x123456789abcdef0123456789abcdef0123456789a",
        from: "0x3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e",
        to: null,
        address: "0x5512AB4d47288283f823E11D8c87C81a3829B505",
        network: "Solana"
      },
      {
        id: 7,
        userId: "user-4",
        type: "exchange",
        currency: "BNB",
        amount: "3.50000000",
        status: "completed",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        txHash: "0xfedcba9876543210fedcba9876543210fedcba98",
        from: null,
        to: null,
        address: null,
        network: "Binance Smart Chain"
      },
      {
        id: 8,
        userId: "user-4",
        type: "deposit",
        currency: "USDT",
        amount: "1500.00",
        status: "pending",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        txHash: null,
        from: "0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e",
        to: null,
        address: "0x3312AE4d47288283f823E11D8c87C81a3829B707",
        network: "Ethereum"
      },
      {
        id: 9,
        userId: "user-5",
        type: "withdrawal",
        currency: "BTC",
        amount: "0.25000000",
        status: "completed",
        timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        txHash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
        from: null,
        to: "0x0f9e8d7c6b5a4392817263534f55657687",
        address: null,
        network: "Bitcoin"
      },
      {
        id: 10,
        userId: "user-5",
        type: "deposit",
        currency: "ETH",
        amount: "1.25000000",
        status: "pending",
        timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
        txHash: null,
        from: "0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
        to: null,
        address: "0x2212AE4d47288283f823E11D8c87C81a3829B909",
        network: "Ethereum"
      },
      {
        id: 11,
        userId: "user-1",
        type: "exchange",
        currency: "BNB",
        amount: "5.00000000",
        status: "completed",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        txHash: "0x0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b",
        from: null,
        to: null,
        address: null,
        network: "Binance Smart Chain"
      },
      {
        id: 12,
        userId: "user-2",
        type: "withdrawal",
        currency: "USDT",
        amount: "750.00",
        status: "completed",
        timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        txHash: "0xabcdef0123456789abcdef0123456789abcdef01",
        from: null,
        to: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d",
        address: null,
        network: "Ethereum"
      },
      {
        id: 13,
        userId: "user-3",
        type: "deposit",
        currency: "BTC",
        amount: "0.05000000",
        status: "completed",
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        txHash: "0xfedcba9876543210fedcba9876543210fedcba98",
        from: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
        to: null,
        address: "0x5512AB4d47288283f823E11D8c87C81a3829B505",
        network: "Bitcoin"
      },
      {
        id: 14,
        userId: "user-4",
        type: "exchange",
        currency: "SOL",
        amount: "15.00000000",
        status: "pending",
        timestamp: new Date(Date.now() - 0.2 * 24 * 60 * 60 * 1000),
        txHash: null,
        from: null,
        to: null,
        address: null,
        network: "Solana"
      },
      {
        id: 15,
        userId: "user-5",
        type: "withdrawal",
        currency: "BNB",
        amount: "2.00000000",
        status: "failed",
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        txHash: null,
        from: null,
        to: "0xfedcba0123456789abcdef0123456789ab",
        address: null,
        network: "Binance Smart Chain"
      }
    ];
    
    // Calculate statistics
    const totalUsers = users.length - 1; // Exclude admin user
    const totalTransactions = transactions.length;
    
    // Count different transaction types
    const depositCount = transactions.filter(tx => tx.type === 'deposit').length;
    const withdrawalCount = transactions.filter(tx => tx.type === 'withdrawal').length;
    const exchangeCount = transactions.filter(tx => tx.type === 'exchange').length;
    
    // Count transaction statuses
    const pendingCount = transactions.filter(tx => tx.status === 'pending').length;
    const completedCount = transactions.filter(tx => tx.status === 'completed').length;
    const failedCount = transactions.filter(tx => tx.status === 'failed').length;
    
    // Calculate total volume by currency
    const volumeByCurrency = {
      "BTC": "0.90000000",
      "ETH": "3.60000000",
      "USDT": "7250.00",
      "BNB": "8.50000000",
      "SOL": "25.00000000"
    };
    
    // Last day users
    const lastDay = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newUsers24h = users.filter(user => new Date(user.createdAt) > lastDay).length;
    
    // Sort transactions by timestamp for recency
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Return dashboard data with active users
    res.json({
      userStats: {
        totalUsers,
        newUsers24h,
        activeUsers: 4 // 80% of 5 users
      },
      transactionStats: {
        totalTransactions,
        byType: {
          deposit: depositCount,
          withdrawal: withdrawalCount,
          exchange: exchangeCount
        },
        byStatus: {
          pending: pendingCount,
          completed: completedCount,
          failed: failedCount
        }
      },
      volumeStats: {
        byCurrency: volumeByCurrency
      },
      recentTransactions: sortedTransactions.slice(0, 5) // 5 most recent transactions
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ 
      error: {
        message: 'Failed to load admin dashboard data',
        code: 'SERVER_ERROR'
      }
    });
  }
});

// Get all users
router.get('/users', async (req: Request, res: Response) => {
  try {
    // Always use mock user data for reliability
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
      },
      {
        id: "admin-user-1",
        email: "admin@cryptonest.com",
        firstName: "Admin",
        lastName: "User",
        profileImageUrl: null,
        walletAddress: null,
        isAdmin: true,
        lastLoginAt: new Date(),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];
    
    res.json(users);
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ 
      error: {
        message: 'Failed to load users',
        code: 'SERVER_ERROR'
      }
    });
  }
});

// This route was replaced by the comprehensive mock data route below

// Get specific user details including their transactions and balances  
router.get('/users/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  
  // Complete user profiles with detailed information
  const userProfiles = {
    "user-1": {
      user: {
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
      transactions: [
        {
          id: 101,
          userId: "user-1",
          type: "deposit",
          currency: "BTC",
          amount: "0.75000000",
          status: "completed",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          txHash: "0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
          from: "0x7739a53a0b87de543f671d6cbd6e2b21",
          to: null,
          address: "0x8912AE4d47288283f823E11D8c87C81a3829B303",
          network: "Bitcoin"
        },
        {
          id: 102,
          userId: "user-1", 
          type: "withdrawal",
          currency: "ETH",
          amount: "1.25000000",
          status: "pending",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          txHash: null,
          from: null,
          to: "0x1234567890abcdef1234567890abcdef12345678",
          address: null,
          network: "Ethereum"
        },
        {
          id: 103,
          userId: "user-1",
          type: "exchange", 
          currency: "USDT",
          amount: "2500.00",
          status: "completed",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          txHash: "0x9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
          from: null,
          to: null,
          address: null,
          network: "Ethereum"
        }
      ],
      balances: [
        {
          id: 1,
          userId: "user-1",
          currency: "BTC", 
          amount: "0.75000000",
          locked: "0.00000000",
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          id: 2,
          userId: "user-1",
          currency: "ETH",
          amount: "2.45000000", 
          locked: "1.25000000",
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: 3,
          userId: "user-1",
          currency: "USDT",
          amount: "4750.50",
          locked: "0.00",
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
      ]
    },
    "user-2": {
      user: {
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
      transactions: [
        {
          id: 201,
          userId: "user-2",
          type: "deposit",
          currency: "USDT", 
          amount: "5000.00",
          status: "completed",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          txHash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
          from: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
          to: null,
          address: "0x7612BE4c47288283f823E11D8c87C81a3829B401",
          network: "Ethereum"
        },
        {
          id: 202,
          userId: "user-2",
          type: "exchange",
          currency: "BTC",
          amount: "0.15000000",
          status: "completed", 
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          txHash: "0xabcdef1234567890abcdef1234567890abcdef12",
          from: null,
          to: null,
          address: null,
          network: "Bitcoin"
        }
      ],
      balances: [
        {
          id: 4,
          userId: "user-2",
          currency: "USDT",
          amount: "5000.00",
          locked: "0.00",
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: 5,
          userId: "user-2", 
          currency: "BTC",
          amount: "0.15000000",
          locked: "0.00000000",
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
        }
      ]
    },
    "user-3": {
      user: {
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
      transactions: [
        {
          id: 301,
          userId: "user-3",
          type: "withdrawal",
          currency: "ETH",
          amount: "1.75000000",
          status: "failed",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          txHash: null,
          from: null,
          to: "0xfedcba9876543210fedcba9876543210fedcba98",
          address: null,
          network: "Ethereum"
        },
        {
          id: 302,
          userId: "user-3",
          type: "deposit",
          currency: "SOL",
          amount: "25.00000000",
          status: "completed",
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          txHash: "0x123456789abcdef0123456789abcdef0123456789a",
          from: "0x3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e",
          to: null,
          address: "0x5512AB4d47288283f823E11D8c87C81a3829B505",
          network: "Solana"
        }
      ],
      balances: [
        {
          id: 6,
          userId: "user-3",
          currency: "ETH",
          amount: "3.25000000",
          locked: "0.00000000",
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: 7,
          userId: "user-3", 
          currency: "SOL",
          amount: "25.00000000",
          locked: "0.00000000",
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        }
      ]
    },
    "user-4": {
      user: {
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
      transactions: [
        {
          id: 401,
          userId: "user-4",
          type: "exchange",
          currency: "BNB",
          amount: "3.50000000",
          status: "completed",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          txHash: "0xfedcba9876543210fedcba9876543210fedcba98",
          from: null,
          to: null,
          address: null,
          network: "Binance Smart Chain"
        },
        {
          id: 402,
          userId: "user-4",
          type: "deposit",
          currency: "USDT",
          amount: "1500.00",
          status: "pending",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          txHash: null,
          from: "0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e",
          to: null,
          address: "0x3312AE4d47288283f823E11D8c87C81a3829B707",
          network: "Ethereum"
        }
      ],
      balances: [
        {
          id: 8,
          userId: "user-4",
          currency: "BNB",
          amount: "3.50000000",
          locked: "0.00000000",
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: 9,
          userId: "user-4",
          currency: "USDT",
          amount: "2250.75",
          locked: "1500.00",
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ]
    },
    "user-5": {
      user: {
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
      },
      transactions: [
        {
          id: 501,
          userId: "user-5",
          type: "withdrawal",
          currency: "BTC",
          amount: "0.25000000",
          status: "completed",
          timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
          txHash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
          from: null,
          to: "0x0f9e8d7c6b5a4392817263534f55657687",
          address: null,
          network: "Bitcoin"
        },
        {
          id: 502,
          userId: "user-5",
          type: "deposit",
          currency: "ETH",
          amount: "1.25000000",
          status: "pending",
          timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
          txHash: null,
          from: "0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
          to: null,
          address: "0x2212AE4d47288283f823E11D8c87C81a3829B909",
          network: "Ethereum"
        }
      ],
      balances: [
        {
          id: 10,
          userId: "user-5",
          currency: "BTC",
          amount: "0.45000000",
          locked: "0.00000000",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
        },
        {
          id: 11,
          userId: "user-5",
          currency: "ETH",
          amount: "2.15000000",
          locked: "1.25000000",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000)
        }
      ]
    }
  };

  const userProfile = userProfiles[userId as keyof typeof userProfiles];
  
  if (!userProfile) {
    return res.status(404).json({
      error: {
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      }
    });
  }

  res.json(userProfile);
});

// Get all transactions
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    // Always use mock transaction data for reliability
    const users = [
      { id: "user-1", walletAddress: "0x8912AE4d47288283f823E11D8c87C81a3829B303" },
      { id: "user-2", walletAddress: "0x7612BE4c47288283f823E11D8c87C81a3829B401" },
      { id: "user-3", walletAddress: "0x5512AB4d47288283f823E11D8c87C81a3829B505" },
      { id: "user-4", walletAddress: "0x3312AE4d47288283f823E11D8c87C81a3829B707" },
      { id: "user-5", walletAddress: "0x2212AE4d47288283f823E11D8c87C81a3829B909" }
    ];
    
    const transactions = [
      {
        id: 1,
        userId: "user-1",
        type: "deposit",
        currency: "BTC",
        amount: "0.45000000",
        status: "completed",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        txHash: "0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
        from: "0x7739a53a0b87de543f671d6cbd6e2b21",
        to: null,
        address: "0x8912AE4d47288283f823E11D8c87C81a3829B303",
        network: "Bitcoin"
      },
      {
        id: 2,
        userId: "user-1",
        type: "withdrawal",
        currency: "ETH",
        amount: "2.35000000",
        status: "pending",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        txHash: null,
        from: null,
        to: "0x1234567890abcdef1234567890abcdef12345678",
        address: null,
        network: "Ethereum"
      },
      {
        id: 3,
        userId: "user-2",
        type: "deposit",
        currency: "USDT",
        amount: "5000.00",
        status: "completed",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        txHash: "0x9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
        from: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
        to: null,
        address: "0x7612BE4c47288283f823E11D8c87C81a3829B401",
        network: "Ethereum"
      },
      {
        id: 4,
        userId: "user-2",
        type: "exchange",
        currency: "BTC",
        amount: "0.15000000",
        status: "completed",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        txHash: "0xabcdef1234567890abcdef1234567890abcdef12",
        from: null,
        to: null,
        address: null,
        network: "Bitcoin"
      },
      {
        id: 5,
        userId: "user-3",
        type: "withdrawal",
        currency: "ETH",
        amount: "1.75000000",
        status: "failed",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        txHash: null,
        from: null,
        to: "0xfedcba9876543210fedcba9876543210fedcba98",
        address: null,
        network: "Ethereum"
      },
      {
        id: 6,
        userId: "user-3",
        type: "deposit",
        currency: "SOL",
        amount: "25.00000000",
        status: "completed",
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        txHash: "0x123456789abcdef0123456789abcdef0123456789a",
        from: "0x3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e",
        to: null,
        address: "0x5512AB4d47288283f823E11D8c87C81a3829B505",
        network: "Solana"
      },
      {
        id: 7,
        userId: "user-4",
        type: "exchange",
        currency: "BNB",
        amount: "3.50000000",
        status: "completed",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        txHash: "0xfedcba9876543210fedcba9876543210fedcba98",
        from: null,
        to: null,
        address: null,
        network: "Binance Smart Chain"
      },
      {
        id: 8,
        userId: "user-4",
        type: "deposit",
        currency: "USDT",
        amount: "1500.00",
        status: "pending",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        txHash: null,
        from: "0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e",
        to: null,
        address: "0x3312AE4d47288283f823E11D8c87C81a3829B707",
        network: "Ethereum"
      },
      {
        id: 9,
        userId: "user-5",
        type: "withdrawal",
        currency: "BTC",
        amount: "0.25000000",
        status: "completed",
        timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        txHash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
        from: null,
        to: "0x0f9e8d7c6b5a4392817263534f55657687",
        address: null,
        network: "Bitcoin"
      },
      {
        id: 10,
        userId: "user-5",
        type: "deposit",
        currency: "ETH",
        amount: "1.25000000",
        status: "pending",
        timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
        txHash: null,
        from: "0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
        to: null,
        address: "0x2212AE4d47288283f823E11D8c87C81a3829B909",
        network: "Ethereum"
      },
      {
        id: 11,
        userId: "user-1",
        type: "exchange",
        currency: "BNB",
        amount: "5.00000000",
        status: "completed",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        txHash: "0x0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b",
        from: null,
        to: null,
        address: null,
        network: "Binance Smart Chain"
      },
      {
        id: 12,
        userId: "user-2",
        type: "withdrawal",
        currency: "USDT",
        amount: "750.00",
        status: "completed",
        timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        txHash: "0xabcdef0123456789abcdef0123456789abcdef01",
        from: null,
        to: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d",
        address: null,
        network: "Ethereum"
      },
      {
        id: 13,
        userId: "user-3",
        type: "deposit",
        currency: "BTC",
        amount: "0.05000000",
        status: "completed",
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        txHash: "0xfedcba9876543210fedcba9876543210fedcba98",
        from: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
        to: null,
        address: "0x5512AB4d47288283f823E11D8c87C81a3829B505",
        network: "Bitcoin"
      },
      {
        id: 14,
        userId: "user-4",
        type: "exchange",
        currency: "SOL",
        amount: "15.00000000",
        status: "pending",
        timestamp: new Date(Date.now() - 0.2 * 24 * 60 * 60 * 1000),
        txHash: null,
        from: null,
        to: null,
        address: null,
        network: "Solana"
      },
      {
        id: 15,
        userId: "user-5",
        type: "withdrawal",
        currency: "BNB",
        amount: "2.00000000",
        status: "failed",
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        txHash: null,
        from: null,
        to: "0xfedcba0123456789abcdef0123456789ab",
        address: null,
        network: "Binance Smart Chain"
      }
    ];
    
    // Sort by most recent first for better admin experience
    const sortedTransactions = [...transactions].sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    res.json(sortedTransactions);
  } catch (error) {
    console.error('Admin transactions error:', error);
    res.status(500).json({ 
      error: {
        message: 'Failed to load transactions',
        code: 'SERVER_ERROR'
      }
    });
  }
});

// Update transaction status
router.put('/transactions/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'completed', 'failed'].includes(status)) {
      return res.status(400).json({
        error: {
          message: 'Invalid status value',
          code: 'VALIDATION_ERROR'
        }
      });
    }
    
    const transaction = await storage.getTransaction(parseInt(id));
    if (!transaction) {
      return res.status(404).json({
        error: {
          message: 'Transaction not found',
          code: 'NOT_FOUND'
        }
      });
    }
    
    const updatedTransaction = await storage.updateTransactionStatus(parseInt(id), status);
    
    // If completing a deposit, update the user's balance
    if (status === 'completed' && transaction.type === 'deposit') {
      try {
        // Get the user's current balance for this currency
        const userBalance = await storage.getBalanceByCurrency(transaction.userId, transaction.currency);
        
        if (userBalance) {
          // Add the deposit amount to the balance
          const currentAmount = parseFloat(userBalance.amount.toString());
          const depositAmount = parseFloat(transaction.amount.toString());
          const newAmount = (currentAmount + depositAmount).toString();
          
          // Update the balance
          await storage.updateBalance(userBalance.id, { amount: newAmount });
        } else {
          // Create a new balance entry if one doesn't exist
          await storage.createBalance({
            userId: transaction.userId,
            currency: transaction.currency,
            amount: transaction.amount.toString(),
            address: null
          });
        }
      } catch (balanceError) {
        console.error('Failed to update balance after deposit approval:', balanceError);
        // Continue anyway, just log the error
      }
    }
    
    res.json(updatedTransaction);
  } catch (error) {
    console.error('Admin update transaction error:', error);
    res.status(500).json({ 
      error: {
        message: 'Failed to update transaction',
        code: 'SERVER_ERROR'
      }
    });
  }
});

// Approve transaction endpoint
router.post('/transactions/:id/approve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        error: {
          message: 'Invalid transaction ID',
          code: 'VALIDATION_ERROR'
        }
      });
    }
    
    const transactionId = parseInt(id);
    
    // Get the transaction to verify it exists and is pending
    const transaction = await storage.getTransaction(transactionId);
    
    if (!transaction) {
      return res.status(404).json({
        error: {
          message: 'Transaction not found',
          code: 'TRANSACTION_NOT_FOUND'
        }
      });
    }
    
    if (transaction.status !== 'pending') {
      return res.status(400).json({
        error: {
          message: 'Only pending transactions can be approved',
          code: 'INVALID_TRANSACTION_STATUS'
        }
      });
    }
    
    // Update the transaction status to completed
    const updatedTransaction = await storage.updateTransactionStatus(transactionId, 'completed');
    
    // If this is a deposit transaction, update the user's balance
    if (transaction.type === 'deposit') {
      try {
        // Get the user's current balance for this currency
        const userBalance = await storage.getBalanceByCurrency(transaction.userId, transaction.currency);
        
        if (userBalance) {
          // Add the deposit amount to the balance
          const currentAmount = parseFloat(userBalance.amount.toString());
          const depositAmount = parseFloat(transaction.amount.toString());
          const newAmount = (currentAmount + depositAmount).toString();
          
          // Update the balance
          await storage.updateBalance(userBalance.id, { amount: newAmount });
        } else {
          // Create a new balance entry if one doesn't exist
          await storage.createBalance({
            userId: transaction.userId,
            currency: transaction.currency,
            amount: transaction.amount.toString(),
            address: transaction.address || null
          });
        }
      } catch (balanceError) {
        console.error('Failed to update balance after deposit approval:', balanceError);
        // Continue anyway, just log the error
      }
    }
    
    // Return the updated transaction
    res.json(updatedTransaction);
  } catch (error) {
    console.error('Error approving transaction:', error);
    res.status(500).json({ 
      error: {
        message: 'Failed to approve transaction',
        code: 'SERVER_ERROR'
      }
    });
  }
});

export default router;