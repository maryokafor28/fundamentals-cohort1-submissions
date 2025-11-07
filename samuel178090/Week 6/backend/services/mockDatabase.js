// Mock database service for development when Prisma is not available
import logger from '../middleware/logger.js';

class MockDatabase {
    constructor() {
        this.users = new Map();
        this.transactions = new Map();
        this.vccs = new Map();
        this.subaccounts = new Map();
        
        // Add sample data
        this.initSampleData();
    }

    initSampleData() {
        // Sample user
        const sampleUser = {
            UID: 'user-123',
            firstName: 'John',
            LastName: 'Doe',
            phone: '01234567890',
            email: 'john@example.com',
            username: 'johndoe',
            password: '$2b$12$hashedpassword',
            nationalID: '12345678901234',
            birthdate: new Date('1990-01-01'),
            balance: 1000.0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.users.set(sampleUser.UID, sampleUser);
        this.users.set(sampleUser.phone, sampleUser);
        this.users.set(sampleUser.username, sampleUser);
        this.users.set(sampleUser.email, sampleUser);
    }

    // User operations
    async findUserByID(id) {
        return this.users.get(id) || null;
    }

    async findUserByPhone(phone) {
        return this.users.get(phone) || null;
    }

    async findUserByUsername(username) {
        return this.users.get(username) || null;
    }

    async findUserByEmail(email) {
        return this.users.get(email) || null;
    }

    async createUser(userData) {
        const user = {
            UID: `user-${Date.now()}`,
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.users.set(user.UID, user);
        this.users.set(user.phone, user);
        this.users.set(user.username, user);
        this.users.set(user.email, user);
        
        return user;
    }

    async updateBalance(userId, balance) {
        const user = this.users.get(userId);
        if (user) {
            user.balance = balance;
            user.updatedAt = new Date();
            return user;
        }
        return null;
    }

    // Transaction operations
    async createTransaction(transactionData) {
        const transaction = {
            id: `tx-${Date.now()}`,
            ...transactionData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.transactions.set(transaction.id, transaction);
        return transaction;
    }

    async getTransactionBySenderID(senderId) {
        return Array.from(this.transactions.values())
            .filter(tx => tx.sender_id === senderId);
    }

    async getTransactionByRecipientID(recipientId) {
        return Array.from(this.transactions.values())
            .filter(tx => tx.recipient_id === recipientId);
    }

    async getTransactionsByMonth(userId, year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        
        return Array.from(this.transactions.values())
            .filter(tx => 
                tx.sender_id === userId &&
                tx.createdAt >= startDate &&
                tx.createdAt <= endDate
            );
    }

    // VCC operations
    async getCreditCardByUser(userId) {
        return Array.from(this.vccs.values())
            .find(vcc => vcc.userId === userId) || null;
    }

    async createVCC(vccData) {
        const vcc = {
            id: `vcc-${Date.now()}`,
            ...vccData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.vccs.set(vcc.id, vcc);
        return vcc;
    }
}

// Create singleton instance
const mockDb = new MockDatabase();

// Mock repositories
export class MockUserRepository {
    constructor() {
        this.db = mockDb;
    }

    async findUserByID(id) {
        return this.db.findUserByID(id);
    }

    async findUserByPhone(phone) {
        return this.db.findUserByPhone(phone);
    }

    async findUserByUsername(username) {
        return this.db.findUserByUsername(username);
    }

    async findUserByEmail(email) {
        return this.db.findUserByEmail(email);
    }

    async createUser(userData) {
        return this.db.createUser(userData);
    }

    async updateBalance(userId, balance) {
        return this.db.updateBalance(userId, balance);
    }
}

export class MockTransactionRepository {
    constructor() {
        this.db = mockDb;
    }

    async createTransaction(transactionData) {
        return this.db.createTransaction(transactionData);
    }

    async getTransactionBySenderID(senderId) {
        return this.db.getTransactionBySenderID(senderId);
    }

    async getTransactionByRecipientID(recipientId) {
        return this.db.getTransactionByRecipientID(recipientId);
    }

    async getTransactionByRequesterID(requesterId) {
        return [];
    }

    async getTransactionByRecieverID(receiverId) {
        return [];
    }

    async getTransactionsByMonth(userId, year, month) {
        return this.db.getTransactionsByMonth(userId, year, month);
    }

    async getTransactionsInRange(userId, startDate, endDate) {
        return [];
    }
}

export class MockVccRepository {
    constructor() {
        this.db = mockDb;
    }

    async getCreditCardByUser(userId) {
        return this.db.getCreditCardByUser(userId);
    }

    async createVCC(vccData) {
        return this.db.createVCC(vccData);
    }

    async updateCreditCard(id, amount, usedFlag) {
        const vcc = Array.from(this.db.vccs.values()).find(v => v.id === id);
        if (vcc) {
            vcc.amount = amount;
            vcc.usedFlag = usedFlag;
            vcc.updatedAt = new Date();
            return vcc;
        }
        return null;
    }

    async deleteVCC(id) {
        return this.db.vccs.delete(id);
    }
}

logger.info('Using mock database for development');

export default mockDb;