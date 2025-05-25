import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import pkg from '@neondatabase/serverless';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the database connection
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10
});

// Password hashing function
async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function seedAdminData() {
  try {
    console.log('Seeding admin mock data...');
    
    // Create admin user if not exists
    const adminCheck = await pool.query(`
      SELECT * FROM users WHERE email = 'admin@example.com' LIMIT 1
    `);
    
    let adminId;
    
    if (adminCheck.rows.length === 0) {
      adminId = uuid();
      const adminPasswordHash = await hashPassword('admin123');
      
      await pool.query(`
        INSERT INTO users (id, email, first_name, last_name, wallet_address, password_hash, is_admin, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        adminId,
        'admin@example.com',
        'Admin',
        'User',
        null,
        adminPasswordHash,
        true,
        new Date(),
        new Date()
      ]);
      
      console.log('Created admin user');
    } else {
      adminId = adminCheck.rows[0].id;
      console.log('Admin user already exists');
    }
    
    // Create additional trader users for testing
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
    const traderPasswordHash = await hashPassword('password123');
    
    // Add traders one by one
    for (const trader of traders) {
      // Check if user already exists
      const existingUser = await pool.query(`
        SELECT id FROM users WHERE email = $1 LIMIT 1
      `, [trader.email]);
      
      if (existingUser.rows.length > 0) {
        traderIds.push(existingUser.rows[0].id);
        console.log(`Trader ${trader.email} already exists`);
        continue;
      }
      
      const traderId = uuid();
      traderIds.push(traderId);
      
      await pool.query(`
        INSERT INTO users (id, email, first_name, last_name, wallet_address, password_hash, is_admin, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        traderId,
        trader.email,
        trader.firstName,
        trader.lastName,
        `0x${traderId.replace(/-/g, '').substring(0, 30)}`,
        traderPasswordHash,
        false,
        new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random creation within last 90 days
        new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000) // Random update within last 15 days
      ]);
      
      console.log(`Created trader ${trader.email}`);
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
    
    // Add balances for all traders
    for (const traderId of traderIds) {
      // Give each trader 3-6 random currencies
      const traderCurrencies = [...currencies]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3 + Math.floor(Math.random() * 4));
      
      for (const currency of traderCurrencies) {
        // Check if balance already exists
        const existingBalance = await pool.query(`
          SELECT id FROM balances WHERE user_id = $1 AND currency = $2 LIMIT 1
        `, [traderId, currency.symbol]);
        
        if (existingBalance.rows.length > 0) {
          console.log(`Balance for ${currency.symbol} already exists for trader ${traderId}`);
          continue;
        }
        
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
        
        await pool.query(`
          INSERT INTO balances (user_id, currency, amount, address)
          VALUES ($1, $2, $3, $4)
        `, [
          traderId,
          currency.symbol,
          amount,
          address
        ]);
        
        console.log(`Added ${currency.symbol} balance for trader ${traderId}`);
      }
    }
    
    // Define time periods for transaction timestamps
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
    
    // Generate a mix of transaction types for all traders
    for (const traderId of traderIds) {
      // Get the currencies this trader has
      const balancesResult = await pool.query(`
        SELECT currency, address FROM balances WHERE user_id = $1
      `, [traderId]);
      
      const traderBalances = balancesResult.rows;
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
        let txHash, to, from, network, address;
        
        if (transactionType === 'deposit') {
          txHash = status === 'pending' ? null : `0x${uuid().replace(/-/g, '')}`;
          address = randomBalance.address;
          to = randomBalance.address;
          from = 'external';
          network = currency === 'BTC' ? 'Bitcoin' : currency === 'ETH' || currency === 'USDT' ? 'Ethereum' : 'BSC';
        } else if (transactionType === 'withdraw') {
          txHash = status === 'pending' ? null : `0x${uuid().replace(/-/g, '')}`;
          address = randomBalance.address;
          to = 'external';
          from = randomBalance.address;
          network = currency === 'BTC' ? 'Bitcoin' : currency === 'ETH' || currency === 'USDT' ? 'Ethereum' : 'BSC';
        } else {
          // Exchange transaction
          txHash = `0x${uuid().replace(/-/g, '')}`;
          address = null;
          
          // Find another currency this user has for the exchange
          const otherBalances = traderBalances.filter(b => b.currency !== currency);
          const toCurrency = otherBalances.length > 0 
            ? otherBalances[Math.floor(Math.random() * otherBalances.length)].currency 
            : currencies.find(c => c.symbol !== currency)?.symbol || 'USDT';
          
          to = toCurrency;
          from = currency;
          network = 'Internal';
        }
        
        await pool.query(`
          INSERT INTO transactions (user_id, type, currency, amount, status, tx_hash, address, "to", "from", network, timestamp)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          traderId,
          transactionType,
          currency,
          amount,
          status,
          txHash,
          address,
          to,
          from,
          network,
          randomTime
        ]);
      }
      
      console.log(`Generated transactions for trader ${traderId}`);
    }
    
    // Add some pending transactions that need admin approval
    const pendingTransactionTypes = ['deposit', 'withdraw'];
    
    for (let i = 0; i < 8; i++) {
      const randUserIndex = Math.floor(Math.random() * traderIds.length);
      const userId = traderIds[randUserIndex];
      
      const userBalancesResult = await pool.query(`
        SELECT currency, address FROM balances WHERE user_id = $1
      `, [userId]);
      
      const userBalances = userBalancesResult.rows;
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
      
      let txHash, to, from, network, address;
      
      if (transactionType === 'deposit') {
        txHash = null;
        address = randomBalance.address;
        to = randomBalance.address;
        from = 'external';
        network = currency === 'BTC' ? 'Bitcoin' : currency === 'ETH' || currency === 'USDT' ? 'Ethereum' : 'BSC';
      } else {
        txHash = null;
        address = randomBalance.address;
        to = 'external';
        from = randomBalance.address;
        network = currency === 'BTC' ? 'Bitcoin' : currency === 'ETH' || currency === 'USDT' ? 'Ethereum' : 'BSC';
      }
      
      await pool.query(`
        INSERT INTO transactions (user_id, type, currency, amount, status, tx_hash, address, "to", "from", network, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        userId,
        transactionType,
        currency,
        amount,
        'pending',
        txHash,
        address,
        to,
        from,
        network,
        randomTime
      ]);
    }
    
    console.log('Added pending transactions for admin approval');
    console.log('Admin mock data seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding admin mock data:', error);
    return false;
  } finally {
    // Close the database pool
    await pool.end();
  }
}

// Execute the seeding function
seedAdminData()
  .then(() => {
    console.log('Admin data seeding completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Admin data seeding failed:', error);
    process.exit(1);
  });