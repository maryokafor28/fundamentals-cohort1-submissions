import logger from '../middleware/logger.js';

export class TransactionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getTransactionByID(id) {
        try {
            if (!id) {
                throw new Error('Transaction ID is required');
            }

            const transaction = await this.prisma.transaction.findUnique({
                where: { id },
                include: {
                    sender: { select: { UID: true, username: true, firstName: true, LastName: true } },
                    recipient: { select: { UID: true, username: true, firstName: true, LastName: true } }
                }
            });

            if (transaction) {
                logger.info('Transaction found by ID', { transactionId: id });
            }

            return transaction;
        } catch (error) {
            logger.error('Error finding transaction by ID', { transactionId: id, error: error.message });
            throw error;
        }
    }

    async getTransactionBySenderID(sender_id) {
        try {
            if (!sender_id) {
                throw new Error('Sender ID is required');
            }

            return await this.prisma.transaction.findMany({
                where: { sender: { UID: sender_id } },
                include: {
                    recipient: { select: { UID: true, username: true, firstName: true, LastName: true } }
                },
                orderBy: { created_at: 'desc' }
            });
        } catch (error) {
            logger.error('Error finding transactions by sender ID', { senderId: sender_id, error: error.message });
            throw error;
        }
    }

    async getTransactionByRecipientID(recipient_id) {
        try {
            if (!recipient_id) {
                throw new Error('Recipient ID is required');
            }

            return await this.prisma.transaction.findMany({
                where: { recipient: { UID: recipient_id } },
                include: {
                    sender: { select: { UID: true, username: true, firstName: true, LastName: true } }
                },
                orderBy: { created_at: 'desc' }
            });
        } catch (error) {
            logger.error('Error finding transactions by recipient ID', { recipientId: recipient_id, error: error.message });
            throw error;
        }
    }

    async getTransactionByRequesterID(requester_id) {
        try {
            if (!requester_id) {
                throw new Error('Requester ID is required');
            }

            return await this.prisma.transaction.findMany({
                where: { requester: { UID: requester_id } },
                include: {
                    reciever: { select: { UID: true, username: true, firstName: true, LastName: true } }
                },
                orderBy: { created_at: 'desc' }
            });
        } catch (error) {
            logger.error('Error finding transactions by requester ID', { requesterId: requester_id, error: error.message });
            throw error;
        }
    }

    async getTransactionByRecieverID(reciever_id) {
        try {
            if (!reciever_id) {
                throw new Error('Receiver ID is required');
            }

            return await this.prisma.transaction.findMany({
                where: { reciever: { UID: reciever_id } },
                include: {
                    requester: { select: { UID: true, username: true, firstName: true, LastName: true } }
                },
                orderBy: { created_at: 'desc' }
            });
        } catch (error) {
            logger.error('Error finding transactions by receiver ID', { receiverId: reciever_id, error: error.message });
            throw error;
        }
    }

    async createTransaction(transactionData) {
        try {
            if (!transactionData) {
                throw new Error('Transaction data is required');
            }

            const transaction = await this.prisma.transaction.create({
                data: transactionData,
                include: {
                    sender: { select: { UID: true, username: true } },
                    recipient: { select: { UID: true, username: true } }
                }
            });

            logger.info('Transaction created successfully', { 
                transactionId: transaction.id, 
                type: transaction.transactionType,
                amount: transaction.amount
            });

            return transaction;
        } catch (error) {
            logger.error('Error creating transaction', { error: error.message });
            throw error;
        }
    }

    async updateTransactionStatus(id, status) {
        try {
            if (!id || !status) {
                throw new Error('Transaction ID and status are required');
            }

            const transaction = await this.prisma.transaction.update({
                where: { id },
                data: { status }
            });

            logger.info('Transaction status updated', { transactionId: id, newStatus: status });
            return transaction;
        } catch (error) {
            logger.error('Error updating transaction status', { transactionId: id, status, error: error.message });
            throw error;
        }
    }

    async getTransactionsByMonth(sender_id, year, month) {
        try {
            if (!sender_id || !year || !month) {
                throw new Error('Sender ID, year, and month are required');
            }

            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

            return await this.prisma.transaction.findMany({
                where: {
                    AND: [
                        { sender: { UID: sender_id } },
                        {
                            OR: [
                                { transactionType: 'TRANSFER' },
                                { transactionType: 'ONLINE_PAYMENT' }
                            ]
                        },
                        { created_at: { gte: startDate, lte: endDate } }
                    ]
                },
                orderBy: { created_at: 'desc' }
            });
        } catch (error) {
            logger.error('Error getting transactions by month', { senderId: sender_id, year, month, error: error.message });
            throw error;
        }
    }

    async getTransactionsInRange(userId, startDate, endDate) {
        try {
            if (!userId || !startDate || !endDate) {
                throw new Error('User ID, start date, and end date are required');
            }

            return await this.prisma.transaction.findMany({
                where: {
                    AND: [
                        { sender: { UID: userId } },
                        {
                            OR: [
                                { transactionType: 'TRANSFER' },
                                { transactionType: 'ONLINE_PAYMENT' }
                            ]
                        },
                        { created_at: { gte: startDate, lte: endDate } }
                    ]
                },
                orderBy: { created_at: 'desc' }
            });
        } catch (error) {
            logger.error('Error getting transactions in range', { userId, startDate, endDate, error: error.message });
            throw error;
        }
    }
}


