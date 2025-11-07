import logger from '../../../middleware/logger.js';

// Try to use Prisma, fallback to mock database
let userRepository, transactionRepository, vccRepository;

try {
    const { PrismaClient } = await import('@prisma/client');
    const { UserRepository } = await import('../../../repositories/UserRepository.js');
    const { TransactionRepository } = await import('../../../repositories/TransactionRepository.js');
    const { VccRepository } = await import('../../../repositories/VirtualCreditCardRepository.js');
    
    const prisma = new PrismaClient();
    userRepository = new UserRepository(prisma);
    transactionRepository = new TransactionRepository(prisma);
    vccRepository = new VccRepository(prisma);
    
    logger.info('Using Prisma database');
} catch (error) {
    logger.warn('Prisma not available, using mock database', { error: error.message });
    
    const { MockUserRepository, MockTransactionRepository, MockVccRepository } = await import('../../../services/mockDatabase.js');
    
    userRepository = new MockUserRepository();
    transactionRepository = new MockTransactionRepository();
    vccRepository = new MockVccRepository();
}

export async function getDashboardData(req, res) {
    try {
        const authenticatedUserId = req.user?.id;
        
        if (!authenticatedUserId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const user = await userRepository.findUserByID(authenticatedUserId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const sentTransactions = await transactionRepository.getTransactionBySenderID(authenticatedUserId);
        const receivedTransactions = await transactionRepository.getTransactionByRecipientID(authenticatedUserId);
        
        const allTransactions = [...sentTransactions, ...receivedTransactions]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const thisMonthTransactions = await transactionRepository.getTransactionsByMonth(authenticatedUserId, year, month);
        const thisMonthSpent = thisMonthTransactions.reduce((total, tx) => total + tx.amount, 0);

        const vcc = await vccRepository.getCreditCardByUser(authenticatedUserId);
        const hasActiveVCC = vcc && vcc.expirationDate > now && !vcc.usedFlag;

        const dashboardData = {
            user: {
                UID: user.UID,
                firstName: user.firstName,
                lastName: user.LastName,
                username: user.username,
                phone: user.phone,
                email: user.email,
                balance: user.balance
            },
            recentTransactions: allTransactions.map(tx => ({
                id: tx.id,
                type: tx.sender_id === authenticatedUserId ? 'sent' : 'received',
                amount: tx.amount,
                status: tx.status,
                transactionType: tx.transactionType,
                created_at: tx.created_at,
                counterparty: tx.sender_id === authenticatedUserId 
                    ? tx.recipient?.username || tx.recipient?.phone
                    : tx.sender?.username || tx.sender?.phone
            })),
            statistics: {
                thisMonthSpent,
                totalSent: sentTransactions.length,
                totalReceived: receivedTransactions.length,
                hasActiveVCC
            },
            vcc: hasActiveVCC ? {
                cardType: vcc.creditCardType,
                amount: vcc.amount,
                expirationDate: vcc.expirationDate,
                lastFourDigits: vcc.cardNumber.slice(-4)
            } : null
        };

        return res.status(200).json({
            success: true,
            data: dashboardData
        });

    } catch (error) {
        logger.error('Error getting dashboard data', { 
            userId: req.user?.id, 
            error: error.message 
        });
        return res.status(500).json({ 
            error: 'Failed to retrieve dashboard data. Please try again.' 
        });
    }
}