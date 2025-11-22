const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Activity = require('../../src/models/Activity');
const User = require('../../src/models/User');
const activityRoutes = require('../../src/routes/activityRoutes');
const dbHandler = require('../setup/db-handler');

const app = express();
app.use(express.json());
app.use('/api/activities', activityRoutes);

describe('Activity Routes', () => {
  let testUser;

  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  beforeEach(async () => {
    await dbHandler.clearDatabase();
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com'
    });
  });

  describe('Route Mounting', () => {
    test('should mount routes at /api/activities', async () => {
      const response = await request(app).get('/api/activities');
      expect(response.status).not.toBe(404);
    });
  });

  describe('GET /api/activities', () => {
    test('should be accessible', async () => {
      const response = await request(app).get('/api/activities');
      expect(response.status).toBe(200);
    });

    test('should return activities data', async () => {
      await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      const response = await request(app).get('/api/activities');

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should support userId query parameter', async () => {
      await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      const response = await request(app).get(`/api/activities?userId=${testUser._id}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/activities/:id', () => {
    test('should be accessible', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      const response = await request(app).get(`/api/activities/${activity._id}`);
      expect(response.status).toBe(200);
    });

    test('should return activity with populated user', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      const response = await request(app).get(`/api/activities/${activity._id}`);

      expect(response.body.success).toBe(true);
      expect(response.body.data.userId.name).toBe('Test User');
    });
  });

  describe('POST /api/activities', () => {
    test('should be accessible', async () => {
      const response = await request(app)
        .post('/api/activities')
        .send({
          userId: testUser._id,
          activityType: 'running',
          duration: 30
        });

      expect(response.status).toBe(201);
    });

    test('should create activity through route', async () => {
      const activityData = {
        userId: testUser._id,
        activityType: 'cycling',
        duration: 45,
        distance: 10
      };

      const response = await request(app)
        .post('/api/activities')
        .send(activityData);

      expect(response.body.success).toBe(true);
      expect(response.body.data.activityType).toBe('cycling');
      expect(response.body.data.duration).toBe(45);
      expect(response.body.data.distance).toBe(10);
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/activities')
        .send({
          userId: testUser._id,
          activityType: 'running'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/activities/:id', () => {
    test('should be accessible', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      const response = await request(app)
        .put(`/api/activities/${activity._id}`)
        .send({ duration: 45 });

      expect(response.status).toBe(200);
    });

    test('should update activity through route', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      const response = await request(app)
        .put(`/api/activities/${activity._id}`)
        .send({ 
          duration: 60,
          distance: 8
        });

      expect(response.body.success).toBe(true);
      expect(response.body.data.duration).toBe(60);
      expect(response.body.data.distance).toBe(8);
    });

    test('should validate updated data', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      const response = await request(app)
        .put(`/api/activities/${activity._id}`)
        .send({ duration: -10 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/activities/:id', () => {
    test('should be accessible', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      const response = await request(app).delete(`/api/activities/${activity._id}`);
      expect(response.status).toBe(200);
    });

    test('should delete activity through route', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      const response = await request(app).delete(`/api/activities/${activity._id}`);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Activity deleted successfully');

      const deletedActivity = await Activity.findById(activity._id);
      expect(deletedActivity).toBeNull();
    });

    test('should return 404 for non-existent activity', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/api/activities/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Route Error Handling', () => {
    test('should handle non-existent routes', async () => {
      const response = await request(app).get('/api/activities/nonexistent/route');
      expect(response.status).toBe(404);
    });
  });
});