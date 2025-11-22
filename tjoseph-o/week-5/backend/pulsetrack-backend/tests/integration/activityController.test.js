const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Activity = require('../../src/models/Activity');
const User = require('../../src/models/User');
const activityController = require('../../src/controllers/activityController');
const dbHandler = require('../setup/db-handler');

const app = express();
app.use(express.json());

app.get('/api/activities', activityController.getActivities);
app.get('/api/activities/:id', activityController.getActivity);
app.post('/api/activities', activityController.createActivity);
app.put('/api/activities/:id', activityController.updateActivity);
app.delete('/api/activities/:id', activityController.deleteActivity);

describe('Activity Controller', () => {
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

  describe('GET /api/activities - getActivities', () => {
    test('should return empty array when no activities exist', async () => {
      const response = await request(app).get('/api/activities');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    test('should return all activities', async () => {
      await Activity.create([
        {
          userId: testUser._id,
          activityType: 'running',
          duration: 30
        },
        {
          userId: testUser._id,
          activityType: 'cycling',
          duration: 45
        },
        {
          userId: testUser._id,
          activityType: 'swimming',
          duration: 60
        }
      ]);

      const response = await request(app).get('/api/activities');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data).toHaveLength(3);
    });

    test('should populate user information', async () => {
      await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      const response = await request(app).get('/api/activities');

      expect(response.body.data[0].userId).toBeDefined();
      expect(response.body.data[0].userId.name).toBe('Test User');
      expect(response.body.data[0].userId.email).toBe('test@example.com');
    });

    test('should sort activities by date descending', async () => {
      const activity1 = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30,
        date: new Date('2024-01-01')
      });

      const activity2 = await Activity.create({
        userId: testUser._id,
        activityType: 'cycling',
        duration: 45,
        date: new Date('2024-01-15')
      });

      const response = await request(app).get('/api/activities');

      expect(response.body.data[0]._id).toBe(activity2._id.toString());
      expect(response.body.data[1]._id).toBe(activity1._id.toString());
    });

    test('should filter activities by userId', async () => {
      const user2 = await User.create({
        name: 'User Two',
        email: 'user2@example.com'
      });

      await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      await Activity.create({
        userId: user2._id,
        activityType: 'cycling',
        duration: 45
      });

      const response = await request(app).get(`/api/activities?userId=${testUser._id}`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].userId._id).toBe(testUser._id.toString());
    });
  });

  describe('GET /api/activities/:id - getActivity', () => {
    test('should return activity by ID', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30,
        distance: 5,
        caloriesBurned: 300
      });

      const response = await request(app).get(`/api/activities/${activity._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(activity._id.toString());
      expect(response.body.data.activityType).toBe('running');
      expect(response.body.data.duration).toBe(30);
    });

    test('should populate user information', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      const response = await request(app).get(`/api/activities/${activity._id}`);

      expect(response.body.data.userId.name).toBe('Test User');
      expect(response.body.data.userId.email).toBe('test@example.com');
    });

    test('should return 404 if activity not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/activities/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Activity not found');
    });

    test('should return 500 for invalid ID format', async () => {
      const response = await request(app).get('/api/activities/invalid-id');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/activities - createActivity', () => {
    test('should create activity with valid data', async () => {
      const activityData = {
        userId: testUser._id,
        activityType: 'running',
        duration: 45,
        distance: 6,
        caloriesBurned: 400,
        notes: 'Great run!'
      };

      const response = await request(app)
        .post('/api/activities')
        .send(activityData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.activityType).toBe('running');
      expect(response.body.data.duration).toBe(45);
      expect(response.body.data.distance).toBe(6);
      expect(response.body.data._id).toBeDefined();

      const activityInDb = await Activity.findById(response.body.data._id);
      expect(activityInDb).toBeDefined();
    });

    test('should create activity with only required fields', async () => {
      const activityData = {
        userId: testUser._id,
        activityType: 'yoga',
        duration: 30
      };

      const response = await request(app)
        .post('/api/activities')
        .send(activityData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.activityType).toBe('yoga');
      expect(response.body.data.duration).toBe(30);
    });

    test('should return 404 if userId does not exist', async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      const activityData = {
        userId: fakeUserId,
        activityType: 'running',
        duration: 30
      };

      const response = await request(app)
        .post('/api/activities')
        .send(activityData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    test('should return 400 without userId', async () => {
      const activityData = {
        activityType: 'running',
        duration: 30
      };

      const response = await request(app)
        .post('/api/activities')
        .send(activityData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 without activityType', async () => {
      const activityData = {
        userId: testUser._id,
        duration: 30
      };

      const response = await request(app)
        .post('/api/activities')
        .send(activityData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 without duration', async () => {
      const activityData = {
        userId: testUser._id,
        activityType: 'running'
      };

      const response = await request(app)
        .post('/api/activities')
        .send(activityData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 with invalid activityType', async () => {
      const activityData = {
        userId: testUser._id,
        activityType: 'invalid_type',
        duration: 30
      };

      const response = await request(app)
        .post('/api/activities')
        .send(activityData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 with negative duration', async () => {
      const activityData = {
        userId: testUser._id,
        activityType: 'running',
        duration: -10
      };

      const response = await request(app)
        .post('/api/activities')
        .send(activityData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/activities/:id - updateActivity', () => {
    test('should update activity with valid data', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      const updateData = {
        duration: 45,
        distance: 6,
        caloriesBurned: 400
      };

      const response = await request(app)
        .put(`/api/activities/${activity._id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.duration).toBe(45);
      expect(response.body.data.distance).toBe(6);
      expect(response.body.data.caloriesBurned).toBe(400);

      const updatedActivity = await Activity.findById(activity._id);
      expect(updatedActivity.duration).toBe(45);
    });

    test('should return 404 if activity not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/activities/${fakeId}`)
        .send({ duration: 45 });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Activity not found');
    });

    test('should return 400 with invalid data', async () => {
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

    test('should validate activityType on update', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      const response = await request(app)
        .put(`/api/activities/${activity._id}`)
        .send({ activityType: 'invalid_type' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/activities/:id - deleteActivity', () => {
    test('should delete activity successfully', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      const response = await request(app).delete(`/api/activities/${activity._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Activity deleted successfully');

      const deletedActivity = await Activity.findById(activity._id);
      expect(deletedActivity).toBeNull();
    });

    test('should return 404 if activity not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/api/activities/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Activity not found');
    });

    test('should return 500 for invalid ID format', async () => {
      const response = await request(app).delete('/api/activities/invalid-id');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });
});