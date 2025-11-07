
import request from 'supertest';
import express from 'express';
import authRoutes from '../../src/Routes/auth';
import { errorHandler } from '../../src/Middlewares/error';
import { prisma } from '../../src/config/db';



const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

beforeEach(async () => {
  await prisma.transaction.deleteMany({});
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.transaction.deleteMany({});
  await prisma.user.deleteMany({});
});

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user and return a success message', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          password: 'aStrongPassword123',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("success", true);
    });

    it('should return 400 if user already exists', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          password: 'aStrongPassword123',
        });
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          password: 'aStrongPassword123',
        });
      expect(res.statusCode).toEqual(400);
    });

    it('should return 400 on validation error', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'invalid-email',
          password: '123',
        });
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          password: 'aStrongPassword123'
        });
    });

    it('should login a registered user and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'jane.doe@example.com',
          password: 'aStrongPassword123',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'jane.doe@example.com',
          password: 'wrongPassword',
        });
      expect(res.statusCode).toEqual(401);
    });

    it('should return 404 if user not found', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'not.registered@example.com',
          password: 'aStrongPassword123',
        });
      expect(res.statusCode).toEqual(404);
    });
  });
});
