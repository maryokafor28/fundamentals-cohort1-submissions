import logger from '../middleware/logger.js';

export class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async findUserByID(UID) {
        try {
            if (!UID) {
                throw new Error('User ID is required');
            }

            const user = await this.prisma.user.findUnique({
                where: { UID },
                select: {
                    UID: true,
                    firstName: true,
                    LastName: true,
                    phone: true,
                    email: true,
                    username: true,
                    birthdate: true,
                    balance: true,
                    nationalID: true,
                    nationalIdFileName: true,
                    password: true
                }
            });

            if (user) {
                logger.info('User found by ID', { userId: UID });
            }

            return user;
        } catch (error) {
            logger.error('Error finding user by ID', { userId: UID, error: error.message });
            throw error;
        }
    }

    async findUserByPhone(phone) {
        try {
            if (!phone) {
                throw new Error('Phone number is required');
            }

            const user = await this.prisma.user.findUnique({
                where: { phone }
            });

            if (user) {
                logger.info('User found by phone', { phone });
            }

            return user;
        } catch (error) {
            logger.error('Error finding user by phone', { phone, error: error.message });
            throw error;
        }
    }

    async findUserByUsername(username) {
        try {
            if (!username) {
                throw new Error('Username is required');
            }

            const user = await this.prisma.user.findUnique({
                where: { username }
            });

            if (user) {
                logger.info('User found by username', { username });
            }

            return user;
        } catch (error) {
            logger.error('Error finding user by username', { username, error: error.message });
            throw error;
        }
    }

    async findUserByEmail(email) {
        try {
            if (!email) {
                throw new Error('Email is required');
            }

            return await this.prisma.user.findUnique({
                where: { email }
            });
        } catch (error) {
            logger.error('Error finding user by email', { email, error: error.message });
            throw error;
        }
    }

    async findUserByNationalID(nationalID) {
        try {
            if (!nationalID) {
                throw new Error('National ID is required');
            }

            return await this.prisma.user.findUnique({
                where: { nationalID }
            });
        } catch (error) {
            logger.error('Error finding user by national ID', { nationalID, error: error.message });
            throw error;
        }
    }

    async createUser(userData) {
        try {
            if (!userData) {
                throw new Error('User data is required');
            }

            const user = await this.prisma.user.create({
                data: userData
            });

            logger.info('User created successfully', { userId: user.UID, username: user.username });
            return user;
        } catch (error) {
            logger.error('Error creating user', { error: error.message });
            throw error;
        }
    }

    async updateUser(UID, updateData) {
        try {
            if (!UID) {
                throw new Error('User ID is required');
            }
            if (!updateData) {
                throw new Error('Update data is required');
            }

            const user = await this.prisma.user.update({
                where: { UID },
                data: updateData
            });

            logger.info('User updated successfully', { userId: UID });
            return user;
        } catch (error) {
            logger.error('Error updating user', { userId: UID, error: error.message });
            throw error;
        }
    }

    async updateBalance(UID, balance) {
        try {
            if (!UID) {
                throw new Error('User ID is required');
            }
            if (typeof balance !== 'number' || balance < 0) {
                throw new Error('Valid balance amount is required');
            }

            const user = await this.prisma.user.update({
                where: { UID },
                data: { balance }
            });

            logger.info('User balance updated', { userId: UID, newBalance: balance });
            return user;
        } catch (error) {
            logger.error('Error updating user balance', { userId: UID, balance, error: error.message });
            throw error;
        }
    }

    async deleteUser(UID) {
        try {
            if (!UID) {
                throw new Error('User ID is required');
            }

            const user = await this.prisma.user.delete({
                where: { UID }
            });

            logger.warn('User deleted', { userId: UID });
            return user;
        } catch (error) {
            logger.error('Error deleting user', { userId: UID, error: error.message });
            throw error;
        }
    }

}
