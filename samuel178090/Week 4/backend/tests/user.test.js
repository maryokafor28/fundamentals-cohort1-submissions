const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../socket/socket');
const UserModel = require('../models/userModel');

describe('User Authentication', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/devconnect-test');
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      expect(response.body.fullName).toBe(userData.fullName);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.password).toBeUndefined();
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };

      await request(app).post('/api/users/register').send(userData);
      
      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(422);

      expect(response.body.message).toBe('Email already exist');
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/users/register')
        .send({
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        });
    });

    it('should login user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(422);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});