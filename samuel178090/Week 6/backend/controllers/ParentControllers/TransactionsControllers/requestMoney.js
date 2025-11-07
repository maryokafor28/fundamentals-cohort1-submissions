import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { TransactionRepository } from '../../../repositories/TransactionRepository.js'
import { MoneyTransferService } from "../../../services/MoneyTransferService.js";

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);
const moneyTransferService = new MoneyTransferService(userRepository, transactionRepository)

export async function requestMoneyByPhoneNumber(req, res) {
    try {
        // Authentication check
        const authenticatedUserId = req.user?.id;
        
        if (!authenticatedUserId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const { receiverPhone, amount } = req.body;

        // Input validation
        if (!receiverPhone || !amount) {
            return res.status(400).json({ 
                error: "Receiver phone and amount are required" 
            });
        }

        if (!/^\d{11}$/.test(receiverPhone)) {
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
        const requester = await userRepository.findUserByID(authenticatedUserId);
        const receiver = await userRepository.findUserByPhone(receiverPhone);

        if (!requester) {
            return res.status(404).json({ error: 'Requester not found' });
        }
        
        if (!receiver) {
            return res.status(404).json({ error: 'Receiver phone number is not registered' });
        }
        
        if (requester.UID === receiver.UID) {
            return res.status(400).json({ error: 'Cannot request money from yourself' });
        }

        const result = await moneyTransferService.requestMoney(requester, receiver, parsedAmount);

        return res.status(201).json({ 
            success: true,
            message: 'Money request sent successfully', 
            ...result 
        });
        
    } catch (error) {
        console.error('Error requesting money:', error);
        return res.status(500).json({ 
            error: "Failed to send money request. Please try again." 
        });
    }
}