import request from 'supertest';
import { app } from '../../src/index'; // Assuming your express app is exported from src/app.ts
import { prisma } from '../../src/config/db';

describe('Transaction API', () => {
    let senderToken: string;
    let senderId: string;
    let receiverId: string;
    const senderEmail = 'sender@example.com';
    const receiverEmail = 'receiver@example.com';
    const password = 'password123';

    beforeAll(async () => {
        // Clear the database and create two users for testing
        await prisma.transaction.deleteMany({});
        await prisma.user.deleteMany({});

        // Create sender and receiver
        const sender = await prisma.user.create({
            data: {
                email: senderEmail,
                name: 'Test Sender',
                password: await require('bcryptjs').hash(password, 10),
                balance: 1000, // Start sender with a balance
            },
        });
        senderId = sender.id;

        const receiver = await prisma.user.create({
            data: {
                email: receiverEmail,
                name: 'Test Receiver',
                password: await require('bcryptjs').hash(password, 10),
                balance: 50,
            },
        });
        receiverId = receiver.id;

        // Log in the sender to get a token for authenticated requests
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: senderEmail, password });
        senderToken = res.body.token;
    });

    afterAll(async () => {
        // Clean up the database after all tests are done
        await prisma.transaction.deleteMany({});
        await prisma.user.deleteMany({});
    });

    beforeEach(async () => {
        // Reset balances before each test to ensure isolation, but don't delete users
        await prisma.user.update({ where: { id: senderId }, data: { balance: 1000 } });
        await prisma.user.update({ where: { id: receiverId }, data: { balance: 50 } });
        await prisma.transaction.deleteMany({});
    });

    // Test Suite for GET /api/transactions/balance
    describe('GET /balance', () => {
        it('should return the correct balance for the authenticated user', async () => {
            const res = await request(app)
                .get('/api/transactions/balance')
                .set('Authorization', `Bearer ${senderToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.balance).toEqual(1000);
        });

        it('should return 401 for an unauthenticated request', async () => {
            const res = await request(app).get('/api/transactions/balance');
            expect(res.statusCode).toEqual(401);
        });
    });

    // Test Suite for POST /api/transactions/deposit
    describe('POST /deposit', () => {
        it('should deposit funds and update the user balance', async () => {
            const depositAmount = 200;
            const res = await request(app)
                .post('/api/transactions/deposit')
                .set('Authorization', `Bearer ${senderToken}`)
                .send({ amount: depositAmount });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.newBalance).toEqual(1200);

            const userInDb = await prisma.user.findUnique({ where: { id: senderId } });
            expect(userInDb?.balance).toEqual(1200);

            const transaction = await prisma.transaction.findFirst();
            expect(transaction?.amount).toEqual(depositAmount);
            expect(transaction?.type).toEqual('DEPOSIT');
        });

        it('should return a 400 error for a non-positive amount', async () => {
            const res = await request(app)
                .post('/api/transactions/deposit')
                .set('Authorization', `Bearer ${senderToken}`)
                .send({ amount: -50 });

            expect(res.statusCode).toEqual(400);
        });
    });

    // Test Suite for POST /api/transactions/send
    describe('POST /send', () => {
        it('should send funds, update both balances, and create a transaction record', async () => {
            const amountToSend = 150;
            const res = await request(app)
                .post('/api/transactions/send')
                .set('Authorization', `Bearer ${senderToken}`)
                .send({ recipientEmail: receiverEmail, amount: amountToSend });

            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);

            const senderInDb = await prisma.user.findUnique({ where: { id: senderId } });
            const receiverInDb = await prisma.user.findUnique({ where: { id: receiverId } });
            expect(senderInDb?.balance).toEqual(850);
            expect(receiverInDb?.balance).toEqual(200);

            const transaction = await prisma.transaction.findFirst();
            expect(transaction?.amount).toEqual(amountToSend);
            expect(transaction?.type).toEqual('WITHDRAWAL');
            expect(transaction?.senderId).toEqual(senderId);
            expect(transaction?.receiverId).toEqual(receiverId);
        });

        it('should return a 400 error for insufficient balance', async () => {
            const res = await request(app)
                .post('/api/transactions/send')
                .set('Authorization', `Bearer ${senderToken}`)
                .send({ recipientEmail: receiverEmail, amount: 2000 }); // More than the balance

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('Insufficient balance');
        });

        it('should return a 400 error when sending funds to oneself', async () => {
            const res = await request(app)
                .post('/api/transactions/send')
                .set('Authorization', `Bearer ${senderToken}`)
                .send({ recipientEmail: senderEmail, amount: 100 });

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('Cannot send funds to yourself');
        });

        it('should return a 404 error for a non-existent recipient', async () => {
            const res = await request(app)
                .post('/api/transactions/send')
                .set('Authorization', `Bearer ${senderToken}`)
                .send({ recipientEmail: 'nobody@example.com', amount: 100 });

            expect(res.statusCode).toEqual(404);
        });
    });

    // Test Suite for GET /api/transactions/statement
    describe('GET /statement', () => {
        beforeEach(async () => {
            // Create some transactions for the sender to have a history
            await prisma.transaction.create({
                data: { amount: 10, type: 'DEPOSIT', senderId, receiverId: senderId }
            });
            await prisma.transaction.create({
                data: { amount: 20, type: 'WITHDRAWAL', senderId, receiverId }
            });
        });

        it('should return a paginated list of transactions', async () => {
            const res = await request(app)
                .get('/api/transactions/statement?page=1&pagesize=5')
                .set('Authorization', `Bearer ${senderToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBe(2);
            expect(res.body.pagination.totalTransactions).toBe(2);
            expect(res.body.pagination.currentPage).toEqual(1);
        });
    });
});
