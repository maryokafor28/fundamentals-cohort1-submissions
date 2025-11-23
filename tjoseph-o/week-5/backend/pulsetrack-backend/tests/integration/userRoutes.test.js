const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../../src/models/User');
const userRoutes = require('../../src/routes/userRoutes');
const dbHandler = require('../setup/db-handler');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  describe('Route Mounting', () => {
    test('should mount routes at /api/users', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).not.toBe(404);
    });
  });

  describe('GET /api/users', () => {
    test('should be accessible', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
    });

    test('should return users data', async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });

      const response = await request(app).get('/api/users');

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/users/:id', () => {
    test('should be accessible', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });

      const response = await request(app).get(`/api/users/${user._id}`);
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/users', () => {
    test('should be accessible', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          name: 'New User',
          email: 'new@example.com'
        });

      expect(response.status).toBe(201);
    });

    test('should create user through route', async () => {
      const userData = {
        name: 'Route User',
        email: 'route@example.com',
        age: 25
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.email).toBe(userData.email);
    });
  });

  describe('PUT /api/users/:id', () => {
    test('should be accessible', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(200);
    });

    test('should update user through route', async () => {
      const user = await User.create({
        name: 'Original Name',
        email: 'original@example.com'
      });

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .send({ name: 'Updated Name' });

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Name');
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('should be accessible', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });

      const response = await request(app).delete(`/api/users/${user._id}`);
      expect(response.status).toBe(200);
    });

    test('should delete user through route', async () => {
      const user = await User.create({
        name: 'Delete User',
        email: 'delete@example.com'
      });

      const response = await request(app).delete(`/api/users/${user._id}`);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User deleted successfully');

      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });
  });

  describe('Route Error Handling', () => {
    test('should handle non-existent routes', async () => {
      const response = await request(app).get('/api/users/nonexistent/route');
      expect(response.status).toBe(404);
    });
  });
});