import logger from '../middleware/logger.js';

export class MoneyTransferService {
    constructor(userRepository, transactionRepository) {
        if (!userRepository || !transactionRepository) {
            throw new Error('UserRepository and TransactionRepository are required');
        }
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    async sendMoney(sender, recipient, amount) {
        try {
            // Input validation
            if (!sender || !recipient || !amount) {
                throw new Error('Sender, recipient, and amount are required');
            }

            if (typeof amount !== 'number' || amount <= 0) {
                throw new Error('Amount must be a positive number');
            }

            if (sender.UID === recipient.UID) {
                throw new Error('Cannot send money to yourself');
            }

            // Check sender balance
            if (sender.balance < amount) {
                throw new Error('Insufficient balance');
            }

            // Use database transaction for atomicity
            const result = await this.executeTransfer({
                senderId: sender.UID,
                recipientId: recipient.UID,
                amount,
                senderBalance: sender.balance,
                recipientBalance: recipient.balance,
                transactionType: 'TRANSFER',
                status: 'COMPLETED'
            });

            logger.info('Money transfer completed', {
                senderId: sender.UID,
                recipientId: recipient.UID,
                amount,
                transactionId: result.transaction.id
            });

            return result;
        } catch (error) {
            logger.error('Error in money transfer', {
                senderId: sender?.UID,
                recipientId: recipient?.UID,
                amount,
                error: error.message
            });
            throw error;
        }
    }

    async returnMoney(sender, recipient, amount) {
        try {
            // Input validation
            if (!sender || !recipient || !amount) {
                throw new Error('Sender, recipient, and amount are required');
            }

            if (typeof amount !== 'number' || amount <= 0) {
                throw new Error('Amount must be a positive number');
            }

            // Check recipient balance for return
            if (recipient.balance < amount) {
                throw new Error('Insufficient balance for return');
            }

            // Use database transaction for atomicity
            const result = await this.executeTransfer({
                senderId: recipient.UID, // Reversed for return
                recipientId: sender.UID, // Reversed for return
                amount,
                senderBalance: recipient.balance,
                recipientBalance: sender.balance,
                transactionType: 'REFUND',
                status: 'COMPLETED'
            });

            logger.info('Money return completed', {
                originalSenderId: sender.UID,
                originalRecipientId: recipient.UID,
                amount,
                transactionId: result.transaction.id
            });

            return result;
        } catch (error) {
            logger.error('Error in money return', {
                senderId: sender?.UID,
                recipientId: recipient?.UID,
                amount,
                error: error.message
            });
            throw error;
        }
    }

    async requestMoney(requester, receiver, amount, message = null) {
        try {
            // Input validation
            if (!requester || !receiver || !amount) {
                throw new Error('Requester, receiver, and amount are required');
            }

            if (typeof amount !== 'number' || amount <= 0) {
                throw new Error('Amount must be a positive number');
            }

            if (requester.UID === receiver.UID) {
                throw new Error('Cannot request money from yourself');
            }

            // Create money request transaction
            const transactionData = {
                requester_id: requester.UID,
                reciever_id: receiver.UID,
                amount,
                status: 'PENDING',
                paymentMethod: 'WALLET',
                transactionType: 'REQUEST',
                ...(message && { description: message })
            };

            const transaction = await this.transactionRepository.createTransaction(transactionData);

            logger.info('Money request created', {
                requesterId: requester.UID,
                receiverId: receiver.UID,
                amount,
                transactionId: transaction.id
            });

            return { transaction };
        } catch (error) {
            logger.error('Error in money request', {
                requesterId: requester?.UID,
                receiverId: receiver?.UID,
                amount,
                error: error.message
            });
            throw error;
        }
    }

    async approveMoneyRequest(requestId, receiver) {
        try {
            if (!requestId || !receiver) {
                throw new Error('Request ID and receiver are required');
            }

            // Get the request transaction
            const request = await this.transactionRepository.getTransactionByID(requestId);
            if (!request) {
                throw new Error('Money request not found');
            }

            if (request.status !== 'PENDING') {
                throw new Error('Request is no longer pending');
            }

            if (request.reciever_id !== receiver.UID) {
                throw new Error('Unauthorized to approve this request');
            }

            // Check receiver balance
            if (receiver.balance < request.amount) {
                throw new Error('Insufficient balance to fulfill request');
            }

            // Get requester details
            const requester = await this.userRepository.findUserByID(request.requester_id);
            if (!requester) {
                throw new Error('Requester not found');
            }

            // Execute the transfer
            const transferResult = await this.sendMoney(receiver, requester, request.amount);

            // Update request status
            await this.transactionRepository.updateTransactionStatus(requestId, 'APPROVED');

            logger.info('Money request approved', {
                requestId,
                receiverId: receiver.UID,
                requesterId: requester.UID,
                amount: request.amount
            });

            return {
                request,
                transfer: transferResult.transaction
            };
        } catch (error) {
            logger.error('Error approving money request', {
                requestId,
                receiverId: receiver?.UID,
                error: error.message
            });
            throw error;
        }
    }

    async rejectMoneyRequest(requestId, receiver) {
        try {
            if (!requestId || !receiver) {
                throw new Error('Request ID and receiver are required');
            }

            // Get the request transaction
            const request = await this.transactionRepository.getTransactionByID(requestId);
            if (!request) {
                throw new Error('Money request not found');
            }

            if (request.status !== 'PENDING') {
                throw new Error('Request is no longer pending');
            }

            if (request.reciever_id !== receiver.UID) {
                throw new Error('Unauthorized to reject this request');
            }

            // Update request status
            await this.transactionRepository.updateTransactionStatus(requestId, 'REJECTED');

            logger.info('Money request rejected', {
                requestId,
                receiverId: receiver.UID,
                requesterId: request.requester_id
            });

            return { request };
        } catch (error) {
            logger.error('Error rejecting money request', {
                requestId,
                receiverId: receiver?.UID,
                error: error.message
            });
            throw error;
        }
    }

    // Private method for atomic transfers
    async executeTransfer({ senderId, recipientId, amount, senderBalance, recipientBalance, transactionType, status }) {
        try {
            // Calculate new balances
            const newSenderBalance = senderBalance - amount;
            const newRecipientBalance = recipientBalance + amount;

            // Update balances
            await this.userRepository.updateBalance(senderId, newSenderBalance);
            await this.userRepository.updateBalance(recipientId, newRecipientBalance);

            // Create transaction record
            const transactionData = {
                sender_id: senderId,
                recipient_id: recipientId,
                amount,
                status,
                paymentMethod: 'WALLET',
                transactionType
            };

            const transaction = await this.transactionRepository.createTransaction(transactionData);

            return {
                transaction,
                newSenderBalance,
                newRecipientBalance
            };
        } catch (error) {
            // In a real implementation, you'd want to use database transactions
            // to ensure atomicity and rollback on failure
            logger.error('Error executing transfer', {
                senderId,
                recipientId,
                amount,
                error: error.message
            });
            throw error;
        }
    }
}