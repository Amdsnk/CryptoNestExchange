import { Request, Response } from 'express';
import { storage } from '../../storage';

/**
 * Approve a pending transaction
 * This route handles admin approval of pending transactions
 */
export async function approveTransaction(req: Request, res: Response) {
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
}