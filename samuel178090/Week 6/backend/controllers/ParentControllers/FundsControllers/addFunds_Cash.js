import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { TransactionRepository } from '../../../repositories/TransactionRepository.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);

const serviceCode = 700750;

// Middleware to verify Fawry webhook signature
function verifyFawrySignature(req, res, next) {
    // TODO: Implement signature verification using Fawry's webhook secret
    const signature = req.headers['x-fawry-signature'];
    // Verify signature matches expected value
    // if (!isValidSignature(signature, req.body)) {
    //     return res.status(401).json({ message: 'Invalid signature' });
    // }
    next();
}

// Initiated by the user to get their unique service reference
export async function getServiceCode(req, res) {
    try {
        // TODO: Add authentication middleware to identify the user
        const userId = req.user?.id; // Assuming auth middleware sets req.user
        
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Generate a unique reference for this user/request
        const uniqueReference = `${serviceCode}-${userId}-${Date.now()}`;
        
        return res.json({ 
            serviceCode: serviceCode,
            reference: uniqueReference,
            instructions: 'Use this reference when making payment through Fawry'
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate service code' });
    }
}

// Webhook endpoint called by Fawry to add funds
export async function addFundToUser(req, res) {
    try {
        const { userPhoneNumber, amount, referenceNumber, fawryTransactionId } = req.body;

        // Input validation
        if (!userPhoneNumber || !amount || !referenceNumber) {
            return res.status(400).json({ 
                message: 'Missing required fields: userPhoneNumber, amount, referenceNumber' 
            });
        }

        // Validate phone number format (adjust regex based on your requirements)
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(userPhoneNumber)) {
            return res.status(400).json({ message: 'Invalid phone number format' });
        }

        // Validate amount
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 100000) {
            return res.status(400).json({ 
                message: 'Invalid amount. Must be positive and below limit.' 
            });
        }

        // Check for duplicate transaction using Fawry's transaction ID
        if (fawryTransactionId) {
            const existingTransaction = await transactionRepository.findByExternalId(fawryTransactionId);
            if (existingTransaction) {
                return res.status(409).json({ 
                    message: 'Transaction already processed',
                    transaction: existingTransaction 
                });
            }
        }

        // Find user
        const user = await userRepository.findUserByPhone(userPhoneNumber);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Use a database transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx) => {
            // Update balance atomically using increment
            const updatedUser = await tx.user.update({
                where: { UID: user.UID },
                data: { balance: { increment: parsedAmount } }
            });

            // Create transaction record
            const transactionData = {
                sender_id: user.UID,
                amount: parsedAmount,
                status: "COMPLETED",
                paymentMethod: "CASH",
                transactionType: "ADDING_FUNDS",
                externalTransactionId: fawryTransactionId,
                reference: referenceNumber,
                metadata: {
                    provider: "FAWRY",
                    timestamp: new Date().toISOString()
                }
            };

            const transaction = await transactionRepository.createTransaction(transactionData, tx);
            
            return { updatedUser, transaction };
        });

        // Log successful transaction
        console.log(`Funds added: User ${user.UID}, Amount ${parsedAmount}, Fawry ID ${fawryTransactionId}`);

        res.status(200).json({ 
            message: 'Funds added successfully',
            newBalance: result.updatedUser.balance,
            transaction: result.transaction
        });

    } catch (error) {
        console.error('Error adding funds:', error);
        
        // Don't expose internal errors to external API
        if (error.message.includes("doesn't exist")) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(500).json({ 
            message: 'Failed to process transaction. Please contact support.' 
        });
    }
}