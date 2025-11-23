const request = require('supertest');
const app = require('../app');
const { User, Transaction } = require('../models');
const { sequelize } = require('../config/db');

describe('Transaction API', () => {
  let testUser, recipient, authToken;

  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset database
  });

  beforeEach(async () => {
    // Create recipient user for transfer tests
    recipient = await User.create({
      email: 'recipient@test.com',
      password: 'Password123',
      firstName: 'Test',
      lastName: 'Recipient',
      balance: 500
    });

    // Register a new test user and get token
    const registerResponse = await request(app)
      .post('/api/users/register')
      .send({
        email: `test-${Date.now()}@test.com`,
        password: 'Password123',
        firstName: 'Test',
        lastName: 'User'
      });

    testUser = registerResponse.body.data.user;
    authToken = registerResponse.body.data.token;

    // Add initial balance for the test user
    await User.update(
      { balance: 1000 },
      { where: { id: testUser.id } }
    );
  });

  afterEach(async () => {
    await Transaction.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/transactions', () => {
    test('should create a deposit transaction', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'deposit',
          amount: 100,
          description: 'Test deposit'
        });

      expect(response.status).toBe(201);
      expect(response.body.data.transaction).toHaveProperty('id');
      expect(response.body.data.transaction.amount).toBe('100.00');
      expect(response.body.data.transaction.type).toBe('deposit');
      
      // Check user balance is updated
      const updatedUser = await User.findByPk(testUser.id);
      expect(parseFloat(updatedUser.balance)).toBe(1100.00);
    });

    test('should create a withdrawal transaction', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'withdrawal',
          amount: 50,
          description: 'Test withdrawal'
        });

      expect(response.status).toBe(201);
      expect(response.body.data.transaction.amount).toBe('50.00');
      expect(response.body.data.transaction.type).toBe('withdrawal');
      
      // Check user balance is updated
      const updatedUser = await User.findByPk(testUser.id);
      expect(parseFloat(updatedUser.balance)).toBe(950.00);
    });

    test('should create a transfer transaction', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'transfer',
          amount: 200,
          recipientId: recipient.id,
          description: 'Test transfer'
        });

      expect(response.status).toBe(201);
      expect(response.body.data.transaction.amount).toBe('200.00');
      expect(response.body.data.transaction.type).toBe('transfer');
      
      // Check both users' balances are updated
      const sender = await User.findByPk(testUser.id);
      const updatedRecipient = await User.findByPk(recipient.id);
      expect(parseFloat(sender.balance)).toBe(800.00);
      expect(parseFloat(updatedRecipient.balance)).toBe(700.00);
    });

    test('should fail when insufficient balance', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'withdrawal',
          amount: 2000,
          description: 'Test insufficient funds'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Insufficient funds');
      
      // Check balance remains unchanged
      const user = await User.findByPk(testUser.id);
      expect(parseFloat(user.balance)).toBe(1000.00);
    });
  });

  describe('GET /api/transactions', () => {
    beforeEach(async () => {
      // Create some test transactions
      await Transaction.bulkCreate([
        {
          userId: testUser.id,
          type: 'deposit',
          amount: 100,
          status: 'completed',
          description: 'Test deposit 1'
        },
        {
          userId: testUser.id,
          type: 'withdrawal',
          amount: 50,
          status: 'completed',
          description: 'Test withdrawal 1'
        }
      ]);
    });

    test('should get user transactions with pagination', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.data.transactions).toHaveLength(2);
      expect(response.body.data.pagination).toHaveProperty('total', 2);
    });

    test('should filter transactions by type', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ type: 'deposit' });

      expect(response.status).toBe(200);
      expect(response.body.data.transactions).toHaveLength(1);
      expect(response.body.data.transactions[0].type).toBe('deposit');
    });
  });
});