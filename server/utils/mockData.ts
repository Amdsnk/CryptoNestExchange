import { db } from '../db';
import { users, transactions, balances } from '@shared/schema';
import { v4 as uuid } from 'uuid';
import { hashPassword } from './passwordUtils';

/**
 * Seeds the database with mock data for testing
 * This adds users, transactions, and balances
 */
export async function seedMockData() {
  try {
    console.log('Seeding mock data...');
    
    // Create admin user
    const adminId = uuid();
    const adminPasswordHash = await hashPassword('admin123');
    
    await db.insert(users).values({
      id: adminId,
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      profileImageUrl: null,
      walletAddress: null,
      passwordHash: adminPasswordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
      lastLoginAt: null,
      loginAttempts: 0,
      lockUntil: null,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create regular users
    const users1Id = uuid();
    const user1PasswordHash = await hashPassword('demo123');
    
    await db.insert(users).values({
      id: users1Id,
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      profileImageUrl: null,
      walletAddress: '0x8902382083f98b93b42f498d2c2bb25c',
      passwordHash: user1PasswordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
      lastLoginAt: null,
      loginAttempts: 0,
      lockUntil: null,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const users2Id = uuid();
    const user2PasswordHash = await hashPassword('user123');
    
    await db.insert(users).values({
      id: users2Id,
      email: 'user@example.com',
      firstName: 'Regular',
      lastName: 'User',
      profileImageUrl: null,
      walletAddress: '0x74ff02935fb4ad6bd0c9cda1abefd3c2',
      passwordHash: user2PasswordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
      lastLoginAt: null,
      loginAttempts: 0,
      lockUntil: null,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Add balances for users
    await db.insert(balances).values({
      userId: users1Id,
      currency: 'BTC',
      amount: "0.25",
      address: 'bc1q0sg9rdst6wdvka5c4swn0eydj3pva0yuxrlzf8'
    });
    
    await db.insert(balances).values({
      userId: users1Id,
      currency: 'ETH',
      amount: "4.75",
      address: '0x1234567890123456789012345678901234567890'
    });
    
    await db.insert(balances).values({
      userId: users1Id,
      currency: 'USDT',
      amount: "1250.50",
      address: '0xabcdef1234567890abcdef1234567890abcdef12'
    });
    
    await db.insert(balances).values({
      userId: users2Id,
      currency: 'BTC',
      amount: "0.1",
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    });
    
    await db.insert(balances).values({
      userId: users2Id,
      currency: 'ETH',
      amount: "2.1",
      address: '0x9876543210987654321098765432109876543210'
    });
    
    // Add some transaction history
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const today = new Date();
    
    // Add transactions one by one
    await db.insert(transactions).values({
      userId: users1Id,
      type: 'deposit',
      currency: 'BTC',
      amount: "0.1",
      status: 'completed',
      txHash: '0x8731f67ebd473cdf1b82c8e963d20f5aac3615adc14d2069f2d53cda9cefb0d2',
      address: 'bc1q0sg9rdst6wdvka5c4swn0eydj3pva0yuxrlzf8',
      to: 'bc1q0sg9rdst6wdvka5c4swn0eydj3pva0yuxrlzf8',
      from: 'external',
      network: 'Bitcoin',
      timestamp: oneWeekAgo
    });
    
    await db.insert(transactions).values({
      userId: users1Id,
      type: 'deposit',
      currency: 'ETH',
      amount: "2.0",
      status: 'completed',
      txHash: '0x2731f67ebd473cdf1b82c8e963d20f5aac3615adc14d2069f2d53cda9cefb0e3',
      address: '0x1234567890123456789012345678901234567890',
      to: '0x1234567890123456789012345678901234567890',
      from: 'external',
      network: 'Ethereum',
      timestamp: threeDaysAgo
    });
    
    await db.insert(transactions).values({
      userId: users1Id,
      type: 'withdraw',
      currency: 'ETH',
      amount: "0.5",
      status: 'completed',
      txHash: '0x1731f67ebd473cdf1b82c8e963d20f5aac3615adc14d2069f2d53cda9cefb0f4',
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      to: 'external',
      from: '0x1234567890123456789012345678901234567890',
      network: 'Ethereum',
      timestamp: oneDayAgo
    });
    
    await db.insert(transactions).values({
      userId: users2Id,
      type: 'deposit',
      currency: 'BTC',
      amount: "0.05",
      status: 'completed',
      txHash: '0x7731f67ebd473cdf1b82c8e963d20f5aac3615adc14d2069f2d53cda9cefb0g5',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      to: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      from: 'external',
      network: 'Bitcoin',
      timestamp: oneWeekAgo
    });
    
    await db.insert(transactions).values({
      userId: users2Id,
      type: 'deposit',
      currency: 'ETH',
      amount: "1.5",
      status: 'completed',
      txHash: '0x6731f67ebd473cdf1b82c8e963d20f5aac3615adc14d2069f2d53cda9cefb0h6',
      address: '0x9876543210987654321098765432109876543210',
      to: '0x9876543210987654321098765432109876543210',
      from: 'external',
      network: 'Ethereum',
      timestamp: threeDaysAgo
    });
    
    await db.insert(transactions).values({
      userId: users1Id,
      type: 'deposit',
      currency: 'USDT',
      amount: "500",
      status: 'pending',
      txHash: null,
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      to: '0xabcdef1234567890abcdef1234567890abcdef12',
      from: 'external',
      network: 'Ethereum',
      timestamp: today
    });
    
    console.log('Mock data seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding mock data:', error);
    return false;
  }
}