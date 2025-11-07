import logger from '../middleware/logger.js';

export class VccRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async createVCC(VCCData) {
        try {
            if (!VCCData) {
                throw new Error('VCC data is required');
            }

            const vcc = await this.prisma.virtualCreditCard.create({
                data: VCCData,
                include: {
                    user: { select: { UID: true, username: true, firstName: true, LastName: true } }
                }
            });

            logger.info('Virtual credit card created successfully', { 
                vccId: vcc.id, 
                userId: vcc.userId,
                cardType: vcc.creditCardType,
                amount: vcc.amount
            });

            return vcc;
        } catch (error) {
            logger.error('Error creating VCC', { error: error.message });
            throw error;
        }
    }

    async getCreditCardByUser(userId) {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            const vcc = await this.prisma.virtualCreditCard.findUnique({
                where: { userId },
                include: {
                    user: { select: { UID: true, username: true, firstName: true, LastName: true } }
                }
            });

            if (vcc) {
                logger.info('VCC found by user ID', { userId, vccId: vcc.id });
            }

            return vcc;
        } catch (error) {
            logger.error('Error finding VCC by user ID', { userId, error: error.message });
            throw error;
        }
    }

    async getCreditCardByCCNumber(cardNumber) {
        try {
            if (!cardNumber) {
                throw new Error('Card number is required');
            }

            const vcc = await this.prisma.virtualCreditCard.findUnique({
                where: { cardNumber },
                include: {
                    user: { select: { UID: true, username: true, firstName: true, LastName: true } }
                }
            });

            if (vcc) {
                logger.info('VCC found by card number', { cardNumber: cardNumber.slice(-4), vccId: vcc.id });
            }

            return vcc;
        } catch (error) {
            logger.error('Error finding VCC by card number', { error: error.message });
            throw error;
        }
    }

    async updateCreditCard(id, amount, usedFlag) {
        try {
            if (!id) {
                throw new Error('VCC ID is required');
            }
            if (typeof amount !== 'number' || amount < 0) {
                throw new Error('Valid amount is required');
            }
            if (typeof usedFlag !== 'boolean') {
                throw new Error('Used flag must be boolean');
            }

            const vcc = await this.prisma.virtualCreditCard.update({
                where: { id },
                data: {
                    amount,
                    usedFlag
                }
            });

            logger.info('VCC updated successfully', { 
                vccId: id, 
                newAmount: amount, 
                usedFlag 
            });

            return vcc;
        } catch (error) {
            logger.error('Error updating VCC', { vccId: id, error: error.message });
            throw error;
        }
    }

    async deleteVCC(id) {
        try {
            if (!id) {
                throw new Error('VCC ID is required');
            }

            const vcc = await this.prisma.virtualCreditCard.delete({
                where: { id }
            });

            logger.warn('VCC deleted', { vccId: id });
            return vcc;
        } catch (error) {
            logger.error('Error deleting VCC', { vccId: id, error: error.message });
            throw error;
        }
    }

    async getExpiredVCCs() {
        try {
            const now = new Date();
            return await this.prisma.virtualCreditCard.findMany({
                where: {
                    expirationDate: {
                        lte: now
                    }
                }
            });
        } catch (error) {
            logger.error('Error finding expired VCCs', { error: error.message });
            throw error;
        }
    }

    async cleanupExpiredVCCs() {
        try {
            const now = new Date();
            const result = await this.prisma.virtualCreditCard.deleteMany({
                where: {
                    OR: [
                        { expirationDate: { lte: now } },
                        { usedFlag: true }
                    ]
                }
            });

            logger.info('Expired/used VCCs cleaned up', { deletedCount: result.count });
            return result;
        } catch (error) {
            logger.error('Error cleaning up expired VCCs', { error: error.message });
            throw error;
        }
    }
}