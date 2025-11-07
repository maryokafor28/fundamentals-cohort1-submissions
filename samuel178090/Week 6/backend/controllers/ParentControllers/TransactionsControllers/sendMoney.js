import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { TransactionRepository } from '../../../repositories/TransactionRepository.js'
import { MoneyTransferService } from "../../../services/MoneyTransferService.js";

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);
const moneyTransferService = new MoneyTransferService(userRepository, transactionRepository);


// send mpney by username
export async function sendMoneyByUsername(req, res) {
    try {
        // Authentication check
        const authenticatedUserId = req.user?.id;
        
        if (!authenticatedUserId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const { recipientUsername, amount } = req.body;

        // Input validation
        if (!recipientUsername || !amount) {
            return res.status(400).json({ 
                error: "Recipient username and amount are required" 
            });
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ 
                error: "Amount must be a positive number" 
            });
        }

        // Retrieve users from database
        const sender = await userRepository.findUserByID(authenticatedUserId);
        const recipient = await userRepository.findUserByUsername(recipientUsername);

        if (!sender) {
            return res.status(404).json({ error: 'Sender not found' });
        }
        
        if (!recipient) {
            return res.status(404).json({ error: 'Recipient username is not registered' });
        }
        
        if (sender.UID === recipient.UID) {
            return res.status(400).json({ error: 'Cannot send money to yourself' });
        }

        const result = await moneyTransferService.sendMoney(sender, recipient, parsedAmount);

        return res.status(201).json({ 
            success: true,
            message: 'Transaction completed successfully', 
            ...result 
        });
        
    } catch (error) {
        console.error('Error sending money by username:', error);
        return res.status(500).json({ 
            error: "Failed to send money. Please try again." 
        });
    }
}

export async function sendMoneyByPhoneNumber(req, res) {
    try {
        // Authentication check
        const authenticatedUserId = req.user?.id;
        
        if (!authenticatedUserId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const { recipientPhone, amount } = req.body;

        // Input validation
        if (!recipientPhone || !amount) {
            return res.status(400).json({ 
                error: "Recipient phone and amount are required" 
            });
        }

        if (!/^\d{11}$/.test(recipientPhone)) {
            return res.status(400).json({ 
                error: "Invalid phone number format" 
            });
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ 
                error: "Amount must be a positive number" 
            });
        }

        // Retrieve users from database
        const sender = await userRepository.findUserByID(authenticatedUserId);
        const recipient = await userRepository.findUserByPhone(recipientPhone);

        if (!sender) {
            return res.status(404).json({ error: 'Sender not found' });
        }
        
        if (!recipient) {
            return res.status(404).json({ error: 'Recipient phone number is not registered' });
        }
        
        if (sender.UID === recipient.UID) {
            return res.status(400).json({ error: 'Cannot send money to yourself' });
        }

        const result = await moneyTransferService.sendMoney(sender, recipient, parsedAmount);

        return res.status(201).json({ 
            success: true,
            message: 'Transaction completed successfully', 
            ...result 
        });
        
    } catch (error) {
        console.error('Error sending money by phone:', error);
        return res.status(500).json({ 
            error: "Failed to send money. Please try again." 
        });
    }
}

