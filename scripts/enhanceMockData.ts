import { db } from '../server/db';
import { users, transactions, balances } from '@shared/schema';
import { v4 as uuid } from 'uuid';
import { hashPassword } from '../server/utils/passwordUtils';

/**
 * Seeds the database with comprehensive mock data for admin testing
 */
export async function enhanceMockData() {
  try {
    console.log('Enhancing mock data for admin dashboard...');
    
    // Create more users for better admin testing
    const traders = [
      { firstName: 'John', lastName: 'Smith', email: 'john@example.com' },
      { firstName: 'Maria', lastName: 'Johnson', email: 'maria@example.com' },
      { firstName: 'Robert', lastName: 'Williams', email: 'robert@example.com' },
      { firstName: 'Sarah', lastName: 'Brown', email: 'sarah@example.com' },
      { firstName: 'Michael', lastName: 'Davis', email: 'michael@example.com' },
      { firstName: 'Emily', lastName: 'Miller', email: 'emily@example.com' },
      { firstName: 'David', lastName: 'Wilson', email: 'david@example.com' },
      { firstName: 'Jessica', lastName: 'Moore', email: 'jessica@example.com' }
    ];
    
    const traderIds = [];
    
    for (const trader of traders) {
      const traderId = uuid();
      traderIds.push(traderId);
      const traderPasswordHash = await hashPassword('password123');
      
      await db.insert(users).values({
        id: traderId,
        email: trader.email,
        firstName: trader.firstName,
        lastName: trader.lastName,
        profileImageUrl: null,
        walletAddress: `0x${traderId.replace(/-/g, '').substring(0, 30)}`,
        passwordHash: traderPasswordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
        lastLoginAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random login within last 30 days
        loginAttempts: 0,
        lockUntil: null,
        isAdmin: false,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random creation within last 90 days
        updatedAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000) // Random update within last 15 days
      });
    }
    
    // Currencies supported by the exchange
    const currencies = [
      { symbol: 'BTC', name: 'Bitcoin', networkFee: 0.0001 },
      { symbol: 'ETH', name: 'Ethereum', networkFee: 0.002 },
      { symbol: 'USDT', name: 'Tether', networkFee: 1.5 },
      { symbol: 'BNB', name: 'Binance Coin', networkFee: 0.001 },
      { symbol: 'ADA', name: 'Cardano', networkFee: 0.5 },
      { symbol: 'SOL', name: 'Solana', networkFee: 0.01 }
    ];
    
    // Add balances for all new trader users
    for (const traderId of traderIds) {
      // Give each trader 3-6 random currencies
      const traderCurrencies = [...currencies]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3 + Math.floor(Math.random() * 4));
      
      for (const currency of traderCurrencies) {
        let amount;
        
        switch (currency.symbol) {
          case 'BTC':
            amount = (0.05 + Math.random() * 2).toFixed(6);
            break;
          case 'ETH':
            amount = (0.1 + Math.random() * 10).toFixed(4);
            break;
          case 'USDT':
            amount = (100 + Math.random() * 5000).toFixed(2);
            break;
          case 'BNB':
            amount = (0.5 + Math.random() * 20).toFixed(3);
            break;
          case 'ADA':
            amount = (100 + Math.random() * 5000).toFixed(2);
            break;
          case 'SOL':
            amount = (2 + Math.random() * 100).toFixed(2);
            break;
          default:
            amount = (10 + Math.random() * 100).toFixed(2);
        }
        
        const address = currency.symbol === 'BTC' 
          ? `bc1${uuid().replace(/-/g, '').substring(0, 38)}`
          : `0x${uuid().replace(/-/g, '').substring(0, 38)}`;
        
        await db.insert(balances).values({
          userId: traderId,
          currency: currency.symbol,
          amount: amount,
          address: address
        });
      }
    }
    
    // Define time periods for transaction timestamps
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
    
    // Generate a mix of transaction types for all traders
    for (const traderId of traderIds) {
      // Get the currencies this trader has
      const traderBalances = await db.select().from(balances).where({ userId: traderId });
      
      if (traderBalances.length === 0) continue;
      
      // Generate 5-15 random transactions per trader
      const numTransactions = 5 + Math.floor(Math.random() * 11);
      
      for (let i = 0; i < numTransactions; i++) {
        const randomBalance = traderBalances[Math.floor(Math.random() * traderBalances.length)];
        const currency = randomBalance.currency;
        
        // Determine transaction type with distribution: 50% deposit, 30% withdrawal, 20% exchange
        const transactionTypeRand = Math.random();
        let transactionType;
        
        if (transactionTypeRand < 0.5) {
          transactionType = 'deposit';
        } else if (transactionTypeRand < 0.8) {
          transactionType = 'withdraw';
        } else {
          transactionType = 'exchange';
        }
        
        // Determine status with distribution: 70% completed, 20% pending, 10% failed
        const statusRand = Math.random();
        let status;
        
        if (statusRand < 0.7) {
          status = 'completed';
        } else if (statusRand < 0.9) {
          status = 'pending';
        } else {
          status = 'failed';
        }
        
        // Generate random amount based on currency
        let amount;
        switch (currency) {
          case 'BTC':
            amount = (0.001 + Math.random() * 0.2).toFixed(6);
            break;
          case 'ETH':
            amount = (0.01 + Math.random() * 2).toFixed(4);
            break;
          case 'USDT':
            amount = (10 + Math.random() * 1000).toFixed(2);
            break;
          case 'BNB':
            amount = (0.1 + Math.random() * 5).toFixed(3);
            break;
          case 'ADA':
            amount = (20 + Math.random() * 1000).toFixed(2);
            break;
          case 'SOL':
            amount = (0.5 + Math.random() * 20).toFixed(2);
            break;
          default:
            amount = (1 + Math.random() * 10).toFixed(2);
        }
        
        // Generate random timestamp between 3 months ago and now
        const randomTime = new Date(
          threeMonthsAgo.getTime() + Math.random() * (Date.now() - threeMonthsAgo.getTime())
        );
        
        // Transaction details based on type
        let txDetails: any = {
          userId: traderId,
          type: transactionType,
          currency: currency,
          amount: amount,
          status: status,
          timestamp: randomTime
        };
        
        if (transactionType === 'deposit') {
          txDetails.txHash = status === 'pending' ? null : `0x${uuid().replace(/-/g, '')}`;
          txDetails.address = randomBalance.address;
          txDetails.to = randomBalance.address;
          txDetails.from = 'external';
          txDetails.network = currency === 'BTC' ? 'Bitcoin' : currency === 'ETH' || currency === 'USDT' ? 'Ethereum' : 'BSC';
        } else if (transactionType === 'withdraw') {
          txDetails.txHash = status === 'pending' ? null : `0x${uuid().replace(/-/g, '')}`;
          txDetails.address = randomBalance.address;
          txDetails.to = 'external';
          txDetails.from = randomBalance.address;
          txDetails.network = currency === 'BTC' ? 'Bitcoin' : currency === 'ETH' || currency === 'USDT' ? 'Ethereum' : 'BSC';
        } else {
          // Exchange transaction
          txDetails.txHash = `0x${uuid().replace(/-/g, '')}`;
          txDetails.address = null;
          
          // Find another currency this user has for the exchange
          const otherBalances = traderBalances.filter(b => b.currency !== currency);
          const toCurrency = otherBalances.length > 0 
            ? otherBalances[Math.floor(Math.random() * otherBalances.length)].currency 
            : currencies.find(c => c.symbol !== currency)?.symbol || 'USDT';
          
          txDetails.to = toCurrency;
          txDetails.from = currency;
          txDetails.network = 'Internal';
        }
        
        await db.insert(transactions).values(txDetails);
      }
    }
    
    // Add some pending transactions that need admin approval
    const pendingTransactionTypes = ['deposit', 'withdraw'];
    
    for (let i = 0; i < 8; i++) {
      const randUserIndex = Math.floor(Math.random() * traderIds.length);
      const userId = traderIds[randUserIndex];
      
      const userBalances = await db.select().from(balances).where({ userId });
      if (userBalances.length === 0) continue;
      
      const randomBalance = userBalances[Math.floor(Math.random() * userBalances.length)];
      const currency = randomBalance.currency;
      
      const transactionType = pendingTransactionTypes[Math.floor(Math.random() * pendingTransactionTypes.length)];
      
      // Generate random amount based on currency
      let amount;
      switch (currency) {
        case 'BTC':
          amount = (0.01 + Math.random() * 0.5).toFixed(6);
          break;
        case 'ETH':
          amount = (0.1 + Math.random() * 5).toFixed(4);
          break;
        case 'USDT':
          amount = (100 + Math.random() * 2000).toFixed(2);
          break;
        default:
          amount = (10 + Math.random() * 100).toFixed(2);
      }
      
      // Random timestamp in the last 48 hours
      const randomTime = new Date(
        Date.now() - Math.random() * 48 * 60 * 60 * 1000
      );
      
      let txDetails: any = {
        userId: userId,
        type: transactionType,
        currency: currency,
        amount: amount,
        status: 'pending',
        timestamp: randomTime
      };
      
      if (transactionType === 'deposit') {
        txDetails.txHash = null;
        txDetails.address = randomBalance.address;
        txDetails.to = randomBalance.address;
        txDetails.from = 'external';
        txDetails.network = currency === 'BTC' ? 'Bitcoin' : currency === 'ETH' || currency === 'USDT' ? 'Ethereum' : 'BSC';
      } else {
        txDetails.txHash = null;
        txDetails.address = randomBalance.address;
        txDetails.to = 'external';
        txDetails.from = randomBalance.address;
        txDetails.network = currency === 'BTC' ? 'Bitcoin' : currency === 'ETH' || currency === 'USDT' ? 'Ethereum' : 'BSC';
      }
      
      await db.insert(transactions).values(txDetails);
    }
    
    console.log('Mock data enhanced successfully!');
    return true;
  } catch (error) {
    console.error('Error enhancing mock data:', error);
    return false;
  }
}

// For ES modules, we don't need the require.main check