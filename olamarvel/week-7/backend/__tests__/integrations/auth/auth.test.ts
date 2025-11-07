import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import authRoutes from '../../../src/Routes/auth';
import { errorHandler } from '../../../src/Middlewares/error';
import User from '../../../src/Models/User';
import cookieParser from 'cookie-parser';


const app = express();
app.use(express.json());
app.use(cookieParser()); // Add cookie-parser here
app.use('/api/auth', authRoutes);
app.use(errorHandler);

const mongoUri = 'mongodb://127.0.0.1:27017/pulse_test';

beforeAll(async () => {
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
    await User.deleteMany({});
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
          age: 28,
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("success",true);
    });

    it('should return 400 if user already exists', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          password: 'aStrongPassword123',
          age: 28,
        });
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          password: 'aStrongPassword123',
          age: 28,
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
            password: 'aStrongPassword123',
            age: 28,
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

  describe('POST /api/auth/refresh', () => {
    let refreshToken = '';

    beforeEach(async () => {
        await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            password: 'aStrongPassword123',
            age: 28,
        });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'jane.doe@example.com',
          password: 'aStrongPassword123',
        });
        
      const cookie = loginRes.headers['set-cookie'][0];
      refreshToken = cookie.split(';')[0].split('=')[1];
    });

    it('should return a new access token if the refresh token is valid', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', `refreshToken=${refreshToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 if refresh token is invalid', async () => {
        const res = await request(app)
          .post('/api/auth/refresh')
          .set('Cookie', 'refreshToken=invalidtoken');
        expect(res.statusCode).toEqual(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    let refreshToken: string;

    beforeEach(async () => {
        // Register and login a user to get a valid refresh token
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Logout User',
                email: 'logout.user@example.com',
                password: 'logoutPassword123',
                age: 30,
            });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'logout.user@example.com',
                password: 'logoutPassword123',
            });
        
        const cookie = loginRes.headers['set-cookie'][0];
        refreshToken = cookie.split(';')[0].split('=')[1];
    });

    it('should clear the refresh token cookie when a valid token is present', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', `refreshToken=${refreshToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.headers['set-cookie'][0]).toContain('refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict');
    });

    it('should return 204 if no refresh token is provided', async () => {
        const res = await request(app).post('/api/auth/logout');
        expect(res.statusCode).toEqual(204);
        expect(res.headers['set-cookie']).toBeUndefined();
    });
  });
});


