import { v4 as uuid } from 'uuid';
import { User, Transaction, Balance } from '@shared/schema';

// Mock user data for admin dashboard
export const mockUsers: User[] = [
  {
    id: 'u1-' + uuid(),
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    profileImageUrl: null,
    walletAddress: '0x8912AE4d47288283f823E11D8c87C81a3829B303',
    isAdmin: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)   // 2 days ago
  },
  {
    id: 'u2-' + uuid(),
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    profileImageUrl: null,
    walletAddress: '0x7612BE4c47288283f823E11D8c87C81a3829B401',
    isAdmin: false,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)   // 1 day ago
  },
  {
    id: 'u3-' + uuid(),
    email: 'robert.johnson@example.com',
    firstName: 'Robert',
    lastName: 'Johnson',
    profileImageUrl: null,
    walletAddress: '0x5512AB4d47288283f823E11D8c87C81a3829B505',
    isAdmin: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)  // 10 days ago
  },
  {
    id: 'u4-' + uuid(),
    email: 'sarah.williams@example.com',
    firstName: 'Sarah',
    lastName: 'Williams',
    profileImageUrl: null,
    walletAddress: '0x3312AE4d47288283f823E11D8c87C81a3829B707',
    isAdmin: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)   // 5 days ago
  },
  {
    id: 'u5-' + uuid(),
    email: 'michael.brown@example.com',
    firstName: 'Michael',
    lastName: 'Brown',
    profileImageUrl: null,
    walletAddress: '0x2212AE4d47288283f823E11D8c87C81a3829B909',
    isAdmin: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),  // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)   // 1 day ago
  }
];

// Transaction types
const transactionTypes = ['deposit', 'withdrawal', 'exchange'];
const transactionStatuses = ['pending', 'completed', 'failed'];
const currencies = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL'];
const networks = ['Bitcoin', 'Ethereum', 'Binance Smart Chain', 'Solana'];

// Create mock transactions
export const mockTransactions: Transaction[] = [];

// Generate transactions for each user
for (let i = 0; i < mockUsers.length; i++) {
  const user = mockUsers[i];
  
  // Generate 3-5 transactions per user
  const numTransactions = 3 + Math.floor(Math.random() * 3);
  
  for (let j = 0; j < numTransactions; j++) {
    const typeIndex = Math.floor(Math.random() * transactionTypes.length);
    const type = transactionTypes[typeIndex];
    
    const currencyIndex = Math.floor(Math.random() * currencies.length);
    const currency = currencies[currencyIndex];
    
    const statusIndex = Math.floor(Math.random() * transactionStatuses.length);
    const status = transactionStatuses[statusIndex];
    
    const networkIndex = Math.floor(Math.random() * networks.length);
    const network = networks[networkIndex];
    
    // Random amount between 0.1 and 5 for crypto, or 100-5000 for stablecoins
    let amount;
    if (currency === 'USDT') {
      amount = (100 + Math.random() * 4900).toFixed(2);
    } else {
      amount = (0.1 + Math.random() * 4.9).toFixed(8);
    }
    
    // Calculate a random transaction timestamp in the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000));
    
    // Generate random addresses
    const randomAddress = () => '0x' + Math.random().toString(16).substring(2, 14) + Math.random().toString(16).substring(2, 14);
    
    // Transaction hash for completed transactions
    const txHash = status === 'completed' ? '0x' + Math.random().toString(16).substring(2) : null;
    
    // Create transaction object
    const transaction: Transaction = {
      id: i * 10 + j + 1, // Ensure unique IDs
      userId: user.id,
      type,
      currency,
      amount,
      status,
      timestamp,
      txHash,
      to: type === 'withdrawal' ? randomAddress() : null,
      from: type === 'deposit' ? randomAddress() : null,
      address: type === 'deposit' ? randomAddress() : null,
      network
    };
    
    mockTransactions.push(transaction);
  }
}

// Create mock balances
export const mockBalances: Balance[] = [];

// Create balances for each user
for (let i = 0; i < mockUsers.length; i++) {
  const user = mockUsers[i];
  
  // Each user has 2-4 different currency balances
  const numCurrencies = 2 + Math.floor(Math.random() * 3);
  const userCurrencies = [...currencies].sort(() => 0.5 - Math.random()).slice(0, numCurrencies);
  
  for (let j = 0; j < userCurrencies.length; j++) {
    const currency = userCurrencies[j];
    
    // Random balance amount
    let amount;
    if (currency === 'USDT') {
      amount = (500 + Math.random() * 9500).toFixed(2);
    } else {
      amount = (0.5 + Math.random() * 9.5).toFixed(8);
    }
    
    // Create balance object
    const balance: Balance = {
      id: i * 10 + j + 1, // Ensure unique IDs
      userId: user.id,
      currency,
      amount,
      address: '0x' + Math.random().toString(16).substring(2, 14) + Math.random().toString(16).substring(2, 14)
    };
    
    mockBalances.push(balance);
  }
}

// Function to generate recent transaction stats
export function getAdminStats() {
  // Calculate user stats
  const totalUsers = mockUsers.length;
  const lastDay = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const newUsers24h = mockUsers.filter(user => user.createdAt > lastDay).length;
  
  // Calculate transaction stats
  const totalTransactions = mockTransactions.length;
  
  // Count different transaction types
  const depositCount = mockTransactions.filter(tx => tx.type === 'deposit').length;
  const withdrawalCount = mockTransactions.filter(tx => tx.type === 'withdrawal').length;
  const exchangeCount = mockTransactions.filter(tx => tx.type === 'exchange').length;
  
  // Count transaction statuses
  const pendingCount = mockTransactions.filter(tx => tx.status === 'pending').length;
  const completedCount = mockTransactions.filter(tx => tx.status === 'completed').length;
  const failedCount = mockTransactions.filter(tx => tx.status === 'failed').length;
  
  // Calculate total volume by currency
  const volumeByCurrency: Record<string, string> = {};
  mockTransactions.forEach(tx => {
    if (tx.status === 'completed') {
      const currency = tx.currency;
      const currentAmount = parseFloat(volumeByCurrency[currency] || '0');
      const txAmount = parseFloat(tx.amount.toString());
      volumeByCurrency[currency] = (currentAmount + txAmount).toFixed(
        currency === 'USDT' ? 2 : 8
      );
    }
  });
  
  // Get recent transactions
  const recentTransactions = [...mockTransactions]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);
  
  // Return stats object
  return {
    userStats: {
      totalUsers,
      newUsers24h,
      activeUsers: Math.floor(totalUsers * 0.7) // assume 70% are active
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
    recentTransactions
  };
}