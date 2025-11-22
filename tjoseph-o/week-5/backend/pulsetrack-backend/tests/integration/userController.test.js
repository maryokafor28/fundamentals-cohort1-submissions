const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../../src/models/User');
const userController = require('../../src/controllers/userController');
const dbHandler = require('../setup/db-handler');

const app = express();
app.use(express.json());

app.get('/api/users', userController.getUsers);
app.get('/api/users/:id', userController.getUser);
app.post('/api/users', userController.createUser);
app.put('/api/users/:id', userController.updateUser);
app.delete('/api/users/:id', userController.deleteUser);

describe('User Controller', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  describe('GET /api/users - getUsers', () => {
    test('should return empty array when no users exist', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    test('should return all users', async () => {
      await User.create([
        { name: 'User One', email: 'user1@example.com' },
        { name: 'User Two', email: 'user2@example.com' },
        { name: 'User Three', email: 'user3@example.com' }
      ]);

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0].name).toBeDefined();
      expect(response.body.data[0].email).toBeDefined();
    });

    test('should return users sorted by newest first', async () => {
      const user1 = await User.create({ name: 'User One', email: 'user1@example.com' });
      await new Promise(resolve => setTimeout(resolve, 100));
      const user2 = await User.create({ name: 'User Two', email: 'user2@example.com' });

      const response = await request(app).get('/api/users');

      expect(response.body.data[0]._id.toString()).toBe(user2._id.toString());
      expect(response.body.data[1]._id.toString()).toBe(user1._id.toString());
    });
  });

  describe('GET /api/users/:id - getUser', () => {
    test('should return user by ID', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        age: 25
      });

      const response = await request(app).get(`/api/users/${user._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(user._id.toString());
      expect(response.body.data.name).toBe('Test User');
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.age).toBe(25);
    });

    test('should return 404 if user not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/users/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    test('should return 500 for invalid ID format', async () => {
      const response = await request(app).get('/api/users/invalid-id');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/users - createUser', () => {
    test('should create user with valid data', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        age: 30,
        weight: 75,
        height: 180,
        gender: 'male'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.age).toBe(userData.age);
      expect(response.body.data._id).toBeDefined();

      const userInDb = await User.findById(response.body.data._id);
      expect(userInDb).toBeDefined();
      expect(userInDb.name).toBe(userData.name);
    });

    test('should create user with only required fields', async () => {
      const userData = {
        name: 'Minimal User',
        email: 'minimal@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.email).toBe(userData.email);
    });

    test('should return 400 without name', async () => {
      const userData = {
        email: 'noname@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid data provided');
    });

    test('should return 400 without email', async () => {
      const userData = {
        name: 'No Email User'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid data provided');
    });

    test('should return 400 with invalid email', async () => {
      const userData = {
        name: 'Invalid Email',
        email: 'not-an-email'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 with duplicate email', async () => {
      await User.create({
        name: 'Existing User',
        email: 'duplicate@example.com'
      });

      const userData = {
        name: 'New User',
        email: 'duplicate@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email already exists');
    });
  });

  describe('PUT /api/users/:id - updateUser', () => {
    test('should update user with valid data', async () => {
      const user = await User.create({
        name: 'Original Name',
        email: 'original@example.com',
        age: 25
      });

      const updateData = {
        name: 'Updated Name',
        age: 30,
        weight: 70
      };

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Name');
      expect(response.body.data.age).toBe(30);
      expect(response.body.data.weight).toBe(70);

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.email).toBe('original@example.com');
    });

    test('should return 404 if user not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/users/${fakeId}`)
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    test('should return 400 with invalid data', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .send({ age: -5 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should validate updated email format', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/users/:id - deleteUser', () => {
    test('should delete user successfully', async () => {
      const user = await User.create({
        name: 'To Delete',
        email: 'delete@example.com'
      });

      const response = await request(app).delete(`/api/users/${user._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User deleted successfully');

      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    test('should return 404 if user not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/api/users/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    test('should return 500 for invalid ID format', async () => {
      const response = await request(app).delete('/api/users/invalid-id');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });
});