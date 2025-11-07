import { PrismaClient } from "@prisma/client";
import Stripe from 'stripe';
import { UserRepository } from '../../../repositories/UserRepository.js'
import { TransactionRepository } from '../../../repositories/TransactionRepository.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);

// Step 1: Client-side creates payment intent (called from frontend)
export async function createPaymentIntent(req, res) {
    try {
        // TODO: Add authentication middleware
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const { amount, userPhoneNumber } = req.body;

        // Validate inputs
        if (!userPhoneNumber || !amount) {
            return res.status(400).json({ 
                message: 'Missing required fields: userPhoneNumber, amount' 
            });
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 100000) {
            return res.status(400).json({ 
                message: 'Invalid amount. Must be positive and below 100,000.' 
            });
        }

        // Verify user exists
        const user = await userRepository.findUserByPhone(userPhoneNumber);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify the authenticated user matches the phone number
        if (user.UID !== userId) {
            return res.status(403).json({ 
                message: 'Cannot add funds to another user\'s account' 
            });
        }

        // Create pending transaction record
        const pendingTransaction = await transactionRepository.createTransaction({
            sender_id: user.UID,
            amount: parsedAmount,
            status: "PENDING",
            paymentMethod: "CREDIT_CARD",
            transactionType: "ADDING_FUNDS"
        });

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(parsedAmount * 100), // Stripe uses cents
            currency: 'usd', // or your currency
            metadata: {
                userId: user.UID,
                transactionId: pendingTransaction.id,
                phoneNumber: userPhoneNumber
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            transactionId: pendingTransaction.id
        });

    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ 
            message: 'Failed to initialize payment. Please try again.' 
        });
    }
}

// Step 2: Webhook handler for Stripe events (called by Stripe)
export async function handleStripeWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            await handlePaymentSuccess(event.data.object);
            break;
        case 'payment_intent.payment_failed':
            await handlePaymentFailure(event.data.object);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
}

async function handlePaymentSuccess(paymentIntent) {
    try {
        const { userId, transactionId } = paymentIntent.metadata;
        const amount = paymentIntent.amount / 100; // Convert from cents

        // Check for duplicate processing
        const transaction = await transactionRepository.findById(transactionId);
        if (transaction.status === "COMPLETED") {
            console.log(`Transaction ${transactionId} already completed`);
            return;
        }

        // Use database transaction for atomicity
        await prisma.$transaction(async (tx) => {
            // Update user balance atomically
            await tx.user.update({
                where: { UID: userId },
                data: { balance: { increment: amount } }
            });

            // Update transaction status
            await tx.transaction.update({
                where: { id: transactionId },
                data: {
                    status: "COMPLETED",
                    externalTransactionId: paymentIntent.id,
                    completedAt: new Date()
                }
            });
        });

        console.log(`Payment successful: User ${userId}, Amount ${amount}`);

    } catch (error) {
        console.error('Error handling payment success:', error);
        // TODO: Implement retry logic or alert system
    }
}

async function handlePaymentFailure(paymentIntent) {
    try {
        const { transactionId } = paymentIntent.metadata;

        await transactionRepository.updateTransaction(transactionId, {
            status: "FAILED",
            failureReason: paymentIntent.last_payment_error?.message,
            externalTransactionId: paymentIntent.id
        });

        console.log(`Payment failed: Transaction ${transactionId}`);

    } catch (error) {
        console.error('Error handling payment failure:', error);
    }
}

// Optional: Get transaction status
export async function getTransactionStatus(req, res) {
    try {
        const userId = req.user?.id;
        const { transactionId } = req.params;

        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const transaction = await transactionRepository.findById(transactionId);
        
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Verify user owns this transaction
        if (transaction.sender_id !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({
            id: transaction.id,
            status: transaction.status,
            amount: transaction.amount,
            createdAt: transaction.createdAt,
            completedAt: transaction.completedAt
        });

    } catch (error) {
        console.error('Error getting transaction status:', error);
        res.status(500).json({ message: 'Failed to retrieve transaction status' });
    }
}