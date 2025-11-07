import logger from '../middleware/logger.js';

export class SubaccountRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async createSubaccount(subaccountData) {
        try {
            if (!subaccountData) {
                throw new Error('Subaccount data is required');
            }

            const subaccount = await this.prisma.subaccount.create({
                data: subaccountData,
                include: {
                    owner: { select: { UID: true, username: true, firstName: true, LastName: true } }
                }
            });

            logger.info('Subaccount created successfully', { 
                subaccountId: subaccount.id, 
                username: subaccount.username,
                ownerId: subaccount.ownerId
            });

            return subaccount;
        } catch (error) {
            logger.error('Error creating subaccount', { error: error.message });
            throw error;
        }
    }

    async getSubaccountByID(id) {
        try {
            if (!id) {
                throw new Error('Subaccount ID is required');
            }

            const subaccount = await this.prisma.subaccount.findUnique({
                where: { id },
                include: {
                    owner: { select: { UID: true, username: true, firstName: true, LastName: true } },
                    _count: {
                        select: {
                            sentTransactions: true,
                            receivedTransactions: true
                        }
                    }
                }
            });

            if (subaccount) {
                logger.info('Subaccount found by ID', { subaccountId: id });
            }

            return subaccount;
        } catch (error) {
            logger.error('Error finding subaccount by ID', { subaccountId: id, error: error.message });
            throw error;
        }
    }

    async getSubaccountByPhone(phone) {
        try {
            if (!phone) {
                throw new Error('Phone number is required');
            }

            const subaccount = await this.prisma.subaccount.findUnique({
                where: { phone },
                include: {
                    owner: { select: { UID: true, username: true, firstName: true, LastName: true } }
                }
            });

            if (subaccount) {
                logger.info('Subaccount found by phone', { phone });
            }

            return subaccount;
        } catch (error) {
            logger.error('Error finding subaccount by phone', { phone, error: error.message });
            throw error;
        }
    }

    async getSubaccountByUsername(username) {
        try {
            if (!username) {
                throw new Error('Username is required');
            }

            const subaccount = await this.prisma.subaccount.findUnique({
                where: { username },
                include: {
                    owner: { select: { UID: true, username: true, firstName: true, LastName: true } }
                }
            });

            if (subaccount) {
                logger.info('Subaccount found by username', { username });
            }

            return subaccount;
        } catch (error) {
            logger.error('Error finding subaccount by username', { username, error: error.message });
            throw error;
        }
    }

    async getSubaccountsByOwner(ownerId) {
        try {
            if (!ownerId) {
                throw new Error('Owner ID is required');
            }

            return await this.prisma.subaccount.findMany({
                where: { ownerId },
                orderBy: { createdAt: 'desc' }
            });
        } catch (error) {
            logger.error('Error finding subaccounts by owner', { ownerId, error: error.message });
            throw error;
        }
    }

    async updateSubaccount(subaccountID, updates) {
        try {
            if (!subaccountID) {
                throw new Error('Subaccount ID is required');
            }
            if (!updates) {
                throw new Error('Update data is required');
            }

            const subaccount = await this.prisma.subaccount.update({
                where: { id: subaccountID },
                data: updates
            });

            logger.info('Subaccount updated successfully', { subaccountId: subaccountID });
            return subaccount;
        } catch (error) {
            logger.error('Error updating subaccount', { subaccountId: subaccountID, error: error.message });
            throw error;
        }
    }

    async deleteSubaccount(subaccountID) {
        try {
            if (!subaccountID) {
                throw new Error('Subaccount ID is required');
            }

            const subaccount = await this.prisma.subaccount.delete({
                where: { id: subaccountID }
            });

            logger.warn('Subaccount deleted', { subaccountId: subaccountID });
            return subaccount;
        } catch (error) {
            logger.error('Error deleting subaccount', { subaccountId: subaccountID, error: error.message });
            throw error;
        }
    }

    async updateSubaccountBalance(subaccountID, balance) {
        try {
            if (!subaccountID) {
                throw new Error('Subaccount ID is required');
            }
            if (typeof balance !== 'number' || balance < 0) {
                throw new Error('Valid balance amount is required');
            }

            const subaccount = await this.prisma.subaccount.update({
                where: { id: subaccountID },
                data: { balance }
            });

            logger.info('Subaccount balance updated', { subaccountId: subaccountID, newBalance: balance });
            return subaccount;
        } catch (error) {
            logger.error('Error updating subaccount balance', { subaccountId: subaccountID, balance, error: error.message });
            throw error;
        }
    }
}












