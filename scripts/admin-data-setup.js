// Script to set up admin data using direct SQL queries
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import pg from 'pg';
const { Pool } = pg;

// Initialize the database connection
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL
});

// Password hashing function
async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Main function to seed admin data
async function seedAdminData() {
  console.log('Starting admin data seeding process...');
  
  try {
    // Check if tables exist
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Database tables do not exist yet. Creating schema...');
      await createSchema();
    }
    
    // Seed users
    await seedUsers();
    
    // Seed balances
    await seedBalances();
    
    // Seed transactions
    await seedTransactions();
    
    console.log('Admin data seeding process completed successfully!');
  } catch (error) {
    console.error('Error in admin data seeding process:', error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Create database schema if it doesn't exist
async function createSchema() {
  try {
    // Create sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR NOT NULL PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      );
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);
    `);
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR NOT NULL PRIMARY KEY,
        email VARCHAR UNIQUE,
        first_name VARCHAR,
        last_name VARCHAR,
        profile_image_url VARCHAR,
        wallet_address VARCHAR,
        password_hash VARCHAR,
        password_reset_token VARCHAR,
        password_reset_expires TIMESTAMP,
        last_login_at TIMESTAMP,
        login_attempts INTEGER DEFAULT 0,
        lock_until TIMESTAMP,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    // Create transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR NOT NULL,
        type TEXT NOT NULL,
        currency TEXT NOT NULL,
        amount NUMERIC NOT NULL,
        status TEXT NOT NULL,
        tx_hash TEXT,
        "to" TEXT,
        "from" TEXT,
        address TEXT,
        network TEXT,
        timestamp TIMESTAMP DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS IDX_transactions_user_id ON transactions (user_id);
    `);
    
    // Create balances table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS balances (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR NOT NULL,
        currency TEXT NOT NULL,
        amount NUMERIC NOT NULL DEFAULT 0,
        address TEXT
      );
      CREATE INDEX IF NOT EXISTS IDX_balances_user_id ON balances (user_id);
      CREATE UNIQUE INDEX IF NOT EXISTS IDX_balances_user_currency ON balances (user_id, currency);
    `);
    
    console.log('Database schema created successfully');
    return true;
  } catch (error) {
    console.error('Error creating schema:', error);
    throw error;
  }
}

// Seed user data
async function seedUsers() {
  try {
    console.log('Seeding user data...');
    
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
    
    // Create regular users
    const users = [
      { id: uuid(), email: 'demo@example.com', firstName: 'Demo', lastName: 'User', walletAddress: '0x8902382083f98b93b42f498d2c2bb25c' },
      { id: uuid(), email: 'user@example.com', firstName: 'Regular', lastName: 'User', walletAddress: '0x74ff02935fb4ad6bd0c9cda1abefd3c2' }
    ];
    
    const userPasswordHash = await hashPassword('user123');
    
    for (const user of users) {
      // Check if user already exists
      const existingUser = await pool.query(`
        SELECT id FROM users WHERE email = $1 LIMIT 1
      `, [user.email]);
      
      if (existingUser.rows.length > 0) {
        console.log(`User ${user.email} already exists`);
        continue;
      }
      
      await pool.query(`
        INSERT INTO users (id, email, first_name, last_name, wallet_address, password_hash, is_admin, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        user.id,
        user.email,
        user.firstName,
        user.lastName,
        user.walletAddress,
        userPasswordHash,
        false,
        new Date(),
        new Date()
      ]);
      
      console.log(`Created user ${user.email}`);
    }
    
    // Create additional trader users for admin testing
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
    
    const traderPasswordHash = await hashPassword('password123');
    
    for (const trader of traders) {
      // Check if user already exists
      const existingUser = await pool.query(`
        SELECT id FROM users WHERE email = $1 LIMIT 1
      `, [trader.email]);
      
      if (existingUser.rows.length > 0) {
        console.log(`Trader ${trader.email} already exists`);
        continue;
      }
      
      const traderId = uuid();
      
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
        new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000)  // Random update within last 15 days
      ]);
      
      console.log(`Created trader ${trader.email}`);
    }
    
    console.log('User data seeding completed');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

// Seed balance data
async function seedBalances() {
  try {
    console.log('Seeding balance data...');
    
    // Get all users
    const usersResult = await pool.query(`
      SELECT id, email FROM users WHERE email != 'admin@example.com'
    `);
    
    const users = usersResult.rows;
    
    // Currencies supported by the exchange
    const currencies = [
      { symbol: 'BTC', name: 'Bitcoin', networkFee: 0.0001 },
      { symbol: 'ETH', name: 'Ethereum', networkFee: 0.002 },
      { symbol: 'USDT', name: 'Tether', networkFee: 1.5 },
      { symbol: 'BNB', name: 'Binance Coin', networkFee: 0.001 },
      { symbol: 'ADA', name: 'Cardano', networkFee: 0.5 },
      { symbol: 'SOL', name: 'Solana', networkFee: 0.01 }
    ];
    
    // Add predefined balances for demo@example.com and user@example.com
    const mainUsers = users.filter(u => u.email === 'demo@example.com' || u.email === 'user@example.com');
    
    for (const user of mainUsers) {
      // Base currencies every user should have
      const baseCurrencies = ['BTC', 'ETH', 'USDT'];
      
      for (const symbol of baseCurrencies) {
        // Check if balance already exists
        const existingBalance = await pool.query(`
          SELECT id FROM balances WHERE user_id = $1 AND currency = $2 LIMIT 1
        `, [user.id, symbol]);
        
        if (existingBalance.rows.length > 0) {
          console.log(`Balance for ${symbol} already exists for user ${user.email}`);
          continue;
        }
        
        let amount, address;
        
        if (user.email === 'demo@example.com') {
          switch (symbol) {
            case 'BTC':
              amount = '0.25';
              address = 'bc1q0sg9rdst6wdvka5c4swn0eydj3pva0yuxrlzf8';
              break;
            case 'ETH':
              amount = '4.75';
              address = '0x1234567890123456789012345678901234567890';
              break;
            case 'USDT':
              amount = '1250.50';
              address = '0xabcdef1234567890abcdef1234567890abcdef12';
              break;
          }
        } else { // user@example.com
          switch (symbol) {
            case 'BTC':
              amount = '0.1';
              address = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
              break;
            case 'ETH':
              amount = '2.1';
              address = '0x9876543210987654321098765432109876543210';
              break;
            case 'USDT':
              amount = '750.25';
              address = '0xfedcba0987654321fedcba0987654321fedcba09';
              break;
          }
        }
        
        await pool.query(`
          INSERT INTO balances (user_id, currency, amount, address)
          VALUES ($1, $2, $3, $4)
        `, [
          user.id,
          symbol,
          amount,
          address
        ]);
        
        console.log(`Added ${symbol} balance for user ${user.email}`);
      }
    }
    
    // Add random balances for the rest of the traders
    const traders = users.filter(u => u.email !== 'demo@example.com' && u.email !== 'user@example.com');
    
    for (const trader of traders) {
      // Give each trader 3-6 random currencies
      const traderCurrencies = [...currencies]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3 + Math.floor(Math.random() * 4));
      
      for (const currency of traderCurrencies) {
        // Check if balance already exists
        const existingBalance = await pool.query(`
          SELECT id FROM balances WHERE user_id = $1 AND currency = $2 LIMIT 1
        `, [trader.id, currency.symbol]);
        
        if (existingBalance.rows.length > 0) {
          console.log(`Balance for ${currency.symbol} already exists for trader ${trader.email}`);
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
          trader.id,
          currency.symbol,
          amount,
          address
        ]);
        
        console.log(`Added ${currency.symbol} balance for trader ${trader.email}`);
      }
    }
    
    console.log('Balance data seeding completed');
  } catch (error) {
    console.error('Error seeding balances:', error);
  }
}

// Seed transaction data
async function seedTransactions() {
  try {
    console.log('Seeding transaction data...');
    
    // Define time periods for transaction timestamps
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
    
    // Get all users except admin
    const usersResult = await pool.query(`
      SELECT id, email FROM users WHERE email != 'admin@example.com'
    `);
    
    const users = usersResult.rows;
    
    // Seed predefined transactions for main users
    const mainUsers = users.filter(u => u.email === 'demo@example.com' || u.email === 'user@example.com');
    
    for (const user of mainUsers) {
      // Get user's balances
      const balancesResult = await pool.query(`
        SELECT currency, address FROM balances WHERE user_id = $1
      `, [user.id]);
      
      const userBalances = balancesResult.rows;
      
      // Create some predefined transactions
      if (user.email === 'demo@example.com') {
        const btcBalance = userBalances.find(b => b.currency === 'BTC');
        const ethBalance = userBalances.find(b => b.currency === 'ETH');
        const usdtBalance = userBalances.find(b => b.currency === 'USDT');
        
        if (btcBalance) {
          // BTC deposit 1 week ago
          await pool.query(`
            INSERT INTO transactions (user_id, type, currency, amount, status, tx_hash, address, "to", "from", network, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, [
            user.id,
            'deposit',
            'BTC',
            '0.1',
            'completed',
            '0x8731f67ebd473cdf1b82c8e963d20f5aac3615adc14d2069f2d53cda9cefb0d2',
            btcBalance.address,
            btcBalance.address,
            'external',
            'Bitcoin',
            oneWeekAgo
          ]);
        }
        
        if (ethBalance) {
          // ETH deposit 3 days ago
          const threeDaysAgo = new Date();
          threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
          
          await pool.query(`
            INSERT INTO transactions (user_id, type, currency, amount, status, tx_hash, address, "to", "from", network, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, [
            user.id,
            'deposit',
            'ETH',
            '2.0',
            'completed',
            '0x2731f67ebd473cdf1b82c8e963d20f5aac3615adc14d2069f2d53cda9cefb0e3',
            ethBalance.address,
            ethBalance.address,
            'external',
            'Ethereum',
            threeDaysAgo
          ]);
          
          // ETH withdrawal 1 day ago
          const oneDayAgo = new Date();
          oneDayAgo.setDate(oneDayAgo.getDate() - 1);
          
          await pool.query(`
            INSERT INTO transactions (user_id, type, currency, amount, status, tx_hash, address, "to", "from", network, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, [
            user.id,
            'withdraw',
            'ETH',
            '0.5',
            'completed',
            '0x1731f67ebd473cdf1b82c8e963d20f5aac3615adc14d2069f2d53cda9cefb0f4',
            ethBalance.address,
            'external',
            ethBalance.address,
            'Ethereum',
            oneDayAgo
          ]);
        }
        
        if (usdtBalance) {
          // USDT pending deposit today
          await pool.query(`
            INSERT INTO transactions (user_id, type, currency, amount, status, tx_hash, address, "to", "from", network, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, [
            user.id,
            'deposit',
            'USDT',
            '500',
            'pending',
            null,
            usdtBalance.address,
            usdtBalance.address,
            'external',
            'Ethereum',
            new Date()
          ]);
        }
        
        // Add an exchange transaction
        if (btcBalance && ethBalance) {
          const twoDaysAgo = new Date();
          twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
          
          await pool.query(`
            INSERT INTO transactions (user_id, type, currency, amount, status, tx_hash, address, "to", "from", network, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, [
            user.id,
            'exchange',
            'BTC',
            '0.05',
            'completed',
            '0x4731f67ebd473cdf1b82c8e963d20f5aac3615adc14d2069f2d53cda9cefb0i7',
            null,
            'ETH',
            'BTC',
            'Internal',
            twoDaysAgo
          ]);
        }
      } else if (user.email === 'user@example.com') {
        const btcBalance = userBalances.find(b => b.currency === 'BTC');
        const ethBalance = userBalances.find(b => b.currency === 'ETH');
        
        if (btcBalance) {
          // BTC deposit 1 week ago
          await pool.query(`
            INSERT INTO transactions (user_id, type, currency, amount, status, tx_hash, address, "to", "from", network, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, [
            user.id,
            'deposit',
            'BTC',
            '0.05',
            'completed',
            '0x7731f67ebd473cdf1b82c8e963d20f5aac3615adc14d2069f2d53cda9cefb0g5',
            btcBalance.address,
            btcBalance.address,
            'external',
            'Bitcoin',
            oneWeekAgo
          ]);
        }
        
        if (ethBalance) {
          // ETH deposit 3 days ago
          const threeDaysAgo = new Date();
          threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
          
          await pool.query(`
            INSERT INTO transactions (user_id, type, currency, amount, status, tx_hash, address, "to", "from", network, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, [
            user.id,
            'deposit',
            'ETH',
            '1.5',
            'completed',
            '0x6731f67ebd473cdf1b82c8e963d20f5aac3615adc14d2069f2d53cda9cefb0h6',
            ethBalance.address,
            ethBalance.address,
            'external',
            'Ethereum',
            threeDaysAgo
          ]);
          
          // ETH exchange 4 days ago
          const fourDaysAgo = new Date();
          fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
          
          await pool.query(`
            INSERT INTO transactions (user_id, type, currency, amount, status, tx_hash, address, "to", "from", network, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, [
            user.id,
            'exchange',
            'ETH',
            '0.8',
            'completed',
            '0x5731f67ebd473cdf1b82c8e963d20f5aac3615adc14d2069f2d53cda9cefb0j8',
            null,
            'USDT',
            'ETH',
            'Internal',
            fourDaysAgo
          ]);
        }
      }
    }
    
    // Generate random transactions for other traders
    const traders = users.filter(u => u.email !== 'demo@example.com' && u.email !== 'user@example.com');
    
    for (const trader of traders) {
      // Get the currencies this trader has
      const balancesResult = await pool.query(`
        SELECT currency, address FROM balances WHERE user_id = $1
      `, [trader.id]);
      
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
            : 'USDT';
          
          to = toCurrency;
          from = currency;
          network = 'Internal';
        }
        
        await pool.query(`
          INSERT INTO transactions (user_id, type, currency, amount, status, tx_hash, address, "to", "from", network, timestamp)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          trader.id,
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
      
      console.log(`Generated transactions for trader ${trader.email}`);
    }
    
    // Add some pending transactions that need admin approval
    const pendingTransactionTypes = ['deposit', 'withdraw'];
    
    for (let i = 0; i < 8; i++) {
      const randUserIndex = Math.floor(Math.random() * traders.length);
      const trader = traders[randUserIndex];
      
      const userBalancesResult = await pool.query(`
        SELECT currency, address FROM balances WHERE user_id = $1
      `, [trader.id]);
      
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
        trader.id,
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
    console.log('Transaction data seeding completed');
  } catch (error) {
    console.error('Error seeding transactions:', error);
  }
}

// Execute the main function
seedAdminData();