import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { VccRepository } from '../../../repositories/VirtualCreditCardRepository.js';

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);
const vccRepository = new VccRepository(prisma);

export async function useCreditCard(req, res) {
    try {
        const { creditCardNumber, cvc, amount } = req.body;

        // Input validation
        if (!creditCardNumber || !cvc || !amount) {
            return res.status(400).json({ 
                error: "Credit card number, CVC, and amount are required" 
            });
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ 
                error: "Amount must be a positive number" 
            });
        }

        const parsedCvc = parseInt(cvc);
        if (isNaN(parsedCvc)) {
            return res.status(400).json({ 
                error: "Invalid CVC format" 
            });
        }

        // Find the virtual credit card
        const creditCard = await vccRepository.getCreditCardByCCNumber(creditCardNumber);
        if (!creditCard) {
            return res.status(404).json({ 
                error: "Credit card not found" 
            });
        }

        // Verify CVC
        if (creditCard.verificationCode !== parsedCvc) {
            return res.status(401).json({ 
                error: "Invalid verification code" 
            });
        }

        // Check expiration
        const now = new Date();
        if (creditCard.expirationDate <= now) {
            return res.status(400).json({ 
                error: "Credit card has expired" 
            });
        }

        // Check if already used
        if (creditCard.usedFlag) {
            return res.status(400).json({ 
                error: "Credit card has already been used" 
            });
        }

        // Check credit card balance
        if (parsedAmount > creditCard.amount) {
            return res.status(400).json({ 
                error: `Insufficient credit card balance. Available: ${creditCard.amount}` 
            });
        }

        // Get linked user
        const user = await userRepository.findUserByID(creditCard.userId);
        if (!user) {
            return res.status(404).json({ 
                error: "Linked user account not found" 
            });
        }

        // Check user account balance
        if (parsedAmount > user.balance) {
            return res.status(400).json({ 
                error: "Insufficient balance in linked account" 
            });
        }

        // Process payment using database transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update user balance
            const newUserBalance = user.balance - parsedAmount;
            await userRepository.updateBalance(creditCard.userId, newUserBalance);

            // Update credit card (mark as used and reduce amount)
            const remainingAmount = creditCard.amount - parsedAmount;
            await vccRepository.updateCreditCard(creditCard.id, remainingAmount, true);

            // Create transaction record
            const transactionData = {
                sender_id: user.UID,
                amount: parsedAmount,
                status: "COMPLETED",
                paymentMethod: "VCC",
                transactionType: "ONLINE_PAYMENT"
            };
            
            return await transactionRepository.createTransaction(transactionData);
        });

        return res.status(200).json({ 
            success: true,
            message: "Payment completed successfully",
            transaction: result
        });
        
    } catch (error) {
        console.error('Error using credit card:', error);
        return res.status(500).json({ 
            error: "Payment processing failed. Please try again." 
        });
    }
}