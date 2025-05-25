import { Router, Request, Response } from 'express';
import { isAdmin } from '../middleware/auth';
import { mockUsers, mockTransactions, mockBalances, getAdminStats } from '../utils/adminMockData';

const router = Router();

// Middleware to ensure all routes in this file require admin access
router.use(isAdmin);

// Get summary dashboard statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // Return mock dashboard data
    res.json(getAdminStats());
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
    // Return safe mock user data without sensitive information
    const safeUsers = mockUsers.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      walletAddress: user.walletAddress,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
    
    res.json(safeUsers);
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

// Get specific user details including their transactions and balances
router.get('/users/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Find user in mock data
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          code: 'NOT_FOUND'
        }
      });
    }
    
    // Get user transactions
    const transactions = mockTransactions.filter(tx => tx.userId === userId);
    
    // Get user balances
    const balances = mockBalances.filter(bal => bal.userId === userId);
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        walletAddress: user.walletAddress,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      transactions,
      balances
    });
  } catch (error) {
    console.error('Admin user detail error:', error);
    res.status(500).json({ 
      error: {
        message: 'Failed to load user details',
        code: 'SERVER_ERROR'
      }
    });
  }
});

// Get all transactions
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    // Return all mock transactions
    res.json(mockTransactions);
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
    
    const transactionId = parseInt(id);
    
    // Find the transaction in mock data
    const transactionIndex = mockTransactions.findIndex(tx => tx.id === transactionId);
    
    if (transactionIndex === -1) {
      return res.status(404).json({
        error: {
          message: 'Transaction not found',
          code: 'NOT_FOUND'
        }
      });
    }
    
    // Update the transaction status
    mockTransactions[transactionIndex] = {
      ...mockTransactions[transactionIndex],
      status
    };
    
    // If completing a deposit, update the user's balance
    const transaction = mockTransactions[transactionIndex];
    if (status === 'completed' && transaction.type === 'deposit') {
      try {
        // Find the user's balance for this currency
        const balanceIndex = mockBalances.findIndex(
          bal => bal.userId === transaction.userId && bal.currency === transaction.currency
        );
        
        if (balanceIndex !== -1) {
          // Add the deposit amount to the balance
          const currentAmount = parseFloat(mockBalances[balanceIndex].amount.toString());
          const depositAmount = parseFloat(transaction.amount.toString());
          const newAmount = (currentAmount + depositAmount).toString();
          
          // Update the balance
          mockBalances[balanceIndex] = {
            ...mockBalances[balanceIndex],
            amount: newAmount
          };
        } else {
          // Create a new balance entry if one doesn't exist
          const newBalance = {
            id: mockBalances.length + 1,
            userId: transaction.userId,
            currency: transaction.currency,
            amount: transaction.amount.toString(),
            address: transaction.address || null
          };
          
          mockBalances.push(newBalance);
        }
      } catch (balanceError) {
        console.error('Failed to update balance after deposit approval:', balanceError);
        // Continue anyway, just log the error
      }
    }
    
    res.json(mockTransactions[transactionIndex]);
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
    
    // Find the transaction in mock data
    const transactionIndex = mockTransactions.findIndex(tx => tx.id === transactionId);
    
    if (transactionIndex === -1) {
      return res.status(404).json({
        error: {
          message: 'Transaction not found',
          code: 'TRANSACTION_NOT_FOUND'
        }
      });
    }
    
    const transaction = mockTransactions[transactionIndex];
    
    if (transaction.status !== 'pending') {
      return res.status(400).json({
        error: {
          message: 'Only pending transactions can be approved',
          code: 'INVALID_TRANSACTION_STATUS'
        }
      });
    }
    
    // Update the transaction status to completed
    mockTransactions[transactionIndex] = {
      ...transaction,
      status: 'completed',
      txHash: '0x' + Math.random().toString(16).substring(2) // Generate a random transaction hash
    };
    
    // If this is a deposit transaction, update the user's balance
    if (transaction.type === 'deposit') {
      try {
        // Find the user's balance for this currency
        const balanceIndex = mockBalances.findIndex(
          bal => bal.userId === transaction.userId && bal.currency === transaction.currency
        );
        
        if (balanceIndex !== -1) {
          // Add the deposit amount to the balance
          const currentAmount = parseFloat(mockBalances[balanceIndex].amount.toString());
          const depositAmount = parseFloat(transaction.amount.toString());
          const newAmount = (currentAmount + depositAmount).toString();
          
          // Update the balance
          mockBalances[balanceIndex] = {
            ...mockBalances[balanceIndex],
            amount: newAmount
          };
        } else {
          // Create a new balance entry if one doesn't exist
          const newBalance = {
            id: mockBalances.length + 1,
            userId: transaction.userId,
            currency: transaction.currency,
            amount: transaction.amount.toString(),
            address: transaction.address || null
          };
          
          mockBalances.push(newBalance);
        }
      } catch (balanceError) {
        console.error('Failed to update balance after deposit approval:', balanceError);
        // Continue anyway, just log the error
      }
    }
    
    // Return the updated transaction
    res.json(mockTransactions[transactionIndex]);
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