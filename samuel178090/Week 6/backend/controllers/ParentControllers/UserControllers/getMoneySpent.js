import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { TransactionRepository } from '../../../repositories/TransactionRepository.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma)

export async function getMoneySpent(req, res) {
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

        // Get the current date
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        // Get money spent in this month
        const transactionsOfThisMonth = await transactionRepository.getTransactionsByMonth(authenticatedUserId, year, month);
        const moneySpentThisMonth = calculateMoneySpent(transactionsOfThisMonth);

        // Calculate the start and end dates of the current week
        const today = now.getDay();
        const thisWeekStart = new Date(now.setDate(now.getDate() - today));
        const thisWeekEnd = new Date(now.setDate(now.getDate() - today + 6));

        // Get the money spent on this week
        const transactionsOfThisWeek = await transactionRepository.getTransactionsInRange(authenticatedUserId, thisWeekStart, thisWeekEnd);
        const moneySpentThisWeek = calculateMoneySpent(transactionsOfThisWeek);

        // Get money spent in the last month
        const transactionsOfLastMonth = await transactionRepository.getTransactionsByMonth(authenticatedUserId, year, month - 1);
        const moneySpentLastMonth = calculateMoneySpent(transactionsOfLastMonth);

        // Construct money spent data object
        const moneySpentData = {
            thisWeek: moneySpentThisWeek,
            thisMonth: moneySpentThisMonth,
            lastMonth: moneySpentLastMonth
        };

        return res.status(200).json({ 
            success: true,
            moneySpent: moneySpentData 
        });
        
    } catch (error) {
        console.error('Error getting money spent:', error);
        return res.status(500).json({ 
            error: 'Failed to retrieve spending data. Please try again.' 
        });
    }
}

function calculateMoneySpent(transactions) {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
}