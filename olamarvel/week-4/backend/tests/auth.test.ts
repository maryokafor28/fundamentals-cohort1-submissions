import request from 'supertest';
import app from '../src/index';
import mongoose from 'mongoose';
import User from '../src/models/userModel';

describe('Auth API', () => {
  // Test user registration
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'Password123!',
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('id');
  });

  it('should not register a user with an existing email or username', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        username: 'testuser2',
        password: 'Password123!',
      });
    expect(res.status).toBe(409);
  });

  // Test user login
  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'Password123!',
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('id');
  });

  it('should not login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'WrongPassword!',
      });
    expect(res.status).toBe(401);
  });
});
