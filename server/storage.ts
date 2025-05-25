import { 
  users, 
  type User, 
  type UpsertUser, 
  transactions, 
  type Transaction, 
  type InsertTransaction, 
  balances, 
  type Balance, 
  type InsertBalance, 
  type UpdateBalance 
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";

// Storage interface for database operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserWalletAddress(userId: string, walletAddress: string): Promise<User>;
  updateUser(userId: string, userData: Partial<UpsertUser>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Transaction operations
  getUserTransactions(userId: string): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getAllTransactions(): Promise<Transaction[]>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction>;
  
  // Balance operations
  getUserBalances(userId: string): Promise<Balance[]>;
  getBalance(id: number): Promise<Balance | undefined>;
  getBalanceByCurrency(userId: string, currency: string): Promise<Balance | undefined>;
  createBalance(balance: InsertBalance): Promise<Balance>;
  updateBalance(id: number, update: UpdateBalance): Promise<Balance>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("DbStorage getUser error:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      console.error("DbStorage getUserByEmail error:", error);
      return undefined;
    }
  }
  
  async getAllUsers(): Promise<User[]> {
    try {
      return await db.select().from(users);
    } catch (error) {
      console.error("DbStorage getAllUsers error:", error);
      return [];
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values({
          ...userData,
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();
      return user;
    } catch (error) {
      console.error("DbStorage upsertUser error:", error);
      throw error;
    }
  }

  async updateUserWalletAddress(userId: string, walletAddress: string): Promise<User> {
    try {
      const [user] = await db
        .update(users)
        .set({ walletAddress, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
      return user;
    } catch (error) {
      console.error("DbStorage updateUserWalletAddress error:", error);
      throw error;
    }
  }
  
  async updateUser(userId: string, userData: Partial<UpsertUser>): Promise<User> {
    try {
      const [user] = await db
        .update(users)
        .set({ 
          ...userData,
          updatedAt: new Date() 
        })
        .where(eq(users.id, userId))
        .returning();
      return user;
    } catch (error) {
      console.error("DbStorage updateUser error:", error);
      throw error;
    }
  }

  // Transaction operations
  async getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      return await db
        .select()
        .from(transactions)
        .where(eq(transactions.userId, userId));
      // For now, let's remove the ordering as it's causing issues
      // We'll sort client-side if needed
    } catch (error) {
      console.error("DbStorage getUserTransactions error:", error);
      return [];
    }
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    try {
      const [transaction] = await db
        .select()
        .from(transactions)
        .where(eq(transactions.id, id));
      return transaction;
    } catch (error) {
      console.error("DbStorage getTransaction error:", error);
      return undefined;
    }
  }

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    try {
      const [transaction] = await db
        .insert(transactions)
        .values(transactionData)
        .returning();
      
      // Update user balance based on transaction type
      const { userId, type, currency, amount } = transaction;
      
      // Find or create balance for this currency
      let balance = await this.getBalanceByCurrency(userId, currency);
      if (!balance) {
        balance = await this.createBalance({ userId, currency, amount: "0" });
      }
      
      // Update balance based on transaction type
      if (type === "deposit") {
        await this.updateBalance(balance.id, { 
          amount: (parseFloat(balance.amount.toString()) + parseFloat(amount.toString())).toString() 
        });
      } else if (type === "withdrawal") {
        await this.updateBalance(balance.id, { 
          amount: (parseFloat(balance.amount.toString()) - parseFloat(amount.toString())).toString() 
        });
      }
      
      return transaction;
    } catch (error) {
      console.error("DbStorage createTransaction error:", error);
      throw error;
    }
  }
  
  async getAllTransactions(): Promise<Transaction[]> {
    try {
      return await db.select().from(transactions);
    } catch (error) {
      console.error("DbStorage getAllTransactions error:", error);
      return [];
    }
  }
  
  async updateTransactionStatus(id: number, status: string): Promise<Transaction> {
    try {
      const [transaction] = await db
        .update(transactions)
        .set({ status })
        .where(eq(transactions.id, id))
        .returning();
      return transaction;
    } catch (error) {
      console.error("DbStorage updateTransactionStatus error:", error);
      throw error;
    }
  }

  // Balance operations
  async getUserBalances(userId: string): Promise<Balance[]> {
    try {
      return await db
        .select()
        .from(balances)
        .where(eq(balances.userId, userId));
    } catch (error) {
      console.error("DbStorage getUserBalances error:", error);
      return [];
    }
  }

  async getBalance(id: number): Promise<Balance | undefined> {
    try {
      const [balance] = await db
        .select()
        .from(balances)
        .where(eq(balances.id, id));
      return balance;
    } catch (error) {
      console.error("DbStorage getBalance error:", error);
      return undefined;
    }
  }

  async getBalanceByCurrency(userId: string, currency: string): Promise<Balance | undefined> {
    try {
      const [balance] = await db
        .select()
        .from(balances)
        .where(and(
          eq(balances.userId, userId),
          eq(balances.currency, currency)
        ));
      return balance;
    } catch (error) {
      console.error("DbStorage getBalanceByCurrency error:", error);
      return undefined;
    }
  }

  async createBalance(balanceData: InsertBalance): Promise<Balance> {
    try {
      const [balance] = await db
        .insert(balances)
        .values(balanceData)
        .returning();
      return balance;
    } catch (error) {
      console.error("DbStorage createBalance error:", error);
      throw error;
    }
  }

  async updateBalance(id: number, update: UpdateBalance): Promise<Balance> {
    try {
      const [balance] = await db
        .update(balances)
        .set(update)
        .where(eq(balances.id, id))
        .returning();
      return balance;
    } catch (error) {
      console.error("DbStorage updateBalance error:", error);
      throw error;
    }
  }
}

// Export the storage instance
export const storage: IStorage = new DatabaseStorage();
