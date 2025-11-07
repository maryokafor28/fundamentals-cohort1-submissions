import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { TransactionRepository } from '../../../repositories/TransactionRepository.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma)

export async function getTransactions(req, res) {
    try {
        // Authentication check
        const authenticatedUserId = req.user?.id;
        
        if (!authenticatedUserId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        // Use authenticated user ID
        const user = await userRepository.findUserByID(authenticatedUserId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const sent = await transactionRepository.getTransactionBySenderID(authenticatedUserId);
        const received = await transactionRepository.getTransactionByRecipientID(authenticatedUserId);
        const requested = await transactionRepository.getTransactionByRequesterID(authenticatedUserId);
        const receivedRequests = await transactionRepository.getTransactionByRecieverID(authenticatedUserId);

        const transactionsData = {
            sentMoneyTransactions: sent,
            receivedMoneyTransactions: received,
            sentRequests: requested,
            receivedRequests: receivedRequests
        };

        return res.status(200).json({ 
            success: true,
            transactions: transactionsData 
        });
        
    } catch (error) {
        console.error('Error getting transactions:', error);
        return res.status(500).json({ 
            error: 'Failed to retrieve transactions. Please try again.' 
        });
    }
}