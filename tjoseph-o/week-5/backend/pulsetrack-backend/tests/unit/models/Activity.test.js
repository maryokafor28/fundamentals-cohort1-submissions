const mongoose = require('mongoose');
const Activity = require('../../../src/models/Activity');
const User = require('../../../src/models/User');
const dbHandler = require('../../setup/db-handler');

describe('Activity Model', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  describe('Model Definition', () => {
    test('should be defined', () => {
      expect(Activity).toBeDefined();
    });

    test('should be a Mongoose model', () => {
      expect(Activity.prototype).toBeInstanceOf(mongoose.Model);
    });
  });

  describe('Required Fields', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    test('should require userId field', async () => {
      const activity = new Activity({
        activityType: 'running',
        duration: 30
      });

      let error;
      try {
        await activity.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.userId).toBeDefined();
      expect(error.errors.userId.kind).toBe('required');
    });

    test('should require activityType field', async () => {
      const activity = new Activity({
        userId: testUser._id,
        duration: 30
      });

      let error;
      try {
        await activity.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.activityType).toBeDefined();
      expect(error.errors.activityType.kind).toBe('required');
    });

    test('should require duration field', async () => {
      const activity = new Activity({
        userId: testUser._id,
        activityType: 'running'
      });

      let error;
      try {
        await activity.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.duration).toBeDefined();
      expect(error.errors.duration.kind).toBe('required');
    });
  });

  describe('ActivityType Validation', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    test('should validate activityType enum', async () => {
      const activity = new Activity({
        userId: testUser._id,
        activityType: 'invalid_type',
        duration: 30
      });

      let error;
      try {
        await activity.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.activityType).toBeDefined();
    });

    test('should accept valid activityType values', async () => {
      const validTypes = ['running', 'walking', 'cycling', 'swimming', 'gym', 'yoga', 'other'];

      for (const type of validTypes) {
        const activity = await Activity.create({
          userId: testUser._id,
          activityType: type,
          duration: 30
        });

        expect(activity.activityType).toBe(type);
      }
    });
  });

  describe('Duration Validation', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    test('should reject duration less than 1', async () => {
      const activity = new Activity({
        userId: testUser._id,
        activityType: 'running',
        duration: 0
      });

      let error;
      try {
        await activity.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.duration).toBeDefined();
    });

    test('should accept valid duration', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 45
      });

      expect(activity.duration).toBe(45);
    });
  });

  describe('Optional Fields', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    test('should save activity without optional fields', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      expect(activity.distance).toBeUndefined();
      expect(activity.caloriesBurned).toBeUndefined();
      expect(activity.notes).toBeUndefined();
    });

    test('should save activity with all optional fields', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 45,
        distance: 5.5,
        caloriesBurned: 350,
        notes: 'Great morning run!'
      });

      expect(activity.distance).toBe(5.5);
      expect(activity.caloriesBurned).toBe(350);
      expect(activity.notes).toBe('Great morning run!');
    });

    test('should reject negative distance', async () => {
      const activity = new Activity({
        userId: testUser._id,
        activityType: 'running',
        duration: 30,
        distance: -5
      });

      let error;
      try {
        await activity.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.distance).toBeDefined();
    });

    test('should reject negative caloriesBurned', async () => {
      const activity = new Activity({
        userId: testUser._id,
        activityType: 'running',
        duration: 30,
        caloriesBurned: -100
      });

      let error;
      try {
        await activity.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.caloriesBurned).toBeDefined();
    });

    test('should reject notes longer than 500 characters', async () => {
      const longNotes = 'a'.repeat(501);
      const activity = new Activity({
        userId: testUser._id,
        activityType: 'running',
        duration: 30,
        notes: longNotes
      });

      let error;
      try {
        await activity.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.notes).toBeDefined();
    });
  });

  describe('Date Field', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    test('should default date to now', async () => {
      const beforeCreate = new Date();
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });
      const afterCreate = new Date();

      expect(activity.date).toBeDefined();
      expect(activity.date.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(activity.date.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });

    test('should accept custom date', async () => {
      const customDate = new Date('2024-01-15');
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30,
        date: customDate
      });

      expect(activity.date.toISOString()).toBe(customDate.toISOString());
    });
  });

  describe('Timestamps', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    test('should have createdAt timestamp', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      expect(activity.createdAt).toBeDefined();
      expect(activity.createdAt).toBeInstanceOf(Date);
    });

    test('should have updatedAt timestamp', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      expect(activity.updatedAt).toBeDefined();
      expect(activity.updatedAt).toBeInstanceOf(Date);
    });

    test('should update updatedAt on modification', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      const originalUpdatedAt = activity.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 100));

      activity.duration = 45;
      await activity.save();

      expect(activity.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('User Relationship', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    test('should reference User model', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      expect(activity.userId.toString()).toBe(testUser._id.toString());
    });

    test('should populate user information', async () => {
      const activity = await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      const populatedActivity = await Activity.findById(activity._id).populate('userId');

      expect(populatedActivity.userId.name).toBe('Test User');
      expect(populatedActivity.userId.email).toBe('test@example.com');
    });

    test('should allow multiple activities for one user', async () => {
      await Activity.create({
        userId: testUser._id,
        activityType: 'running',
        duration: 30
      });

      await Activity.create({
        userId: testUser._id,
        activityType: 'cycling',
        duration: 60
      });

      const userActivities = await Activity.find({ userId: testUser._id });
      expect(userActivities).toHaveLength(2);
    });
  });

  describe('Index', () => {
    test('should have index on userId and date', async () => {
      const indexes = Activity.schema.indexes();
      const hasIndex = indexes.some(index => 
        index[0].userId === 1 && index[0].date === -1
      );

      expect(hasIndex).toBe(true);
    });
  });
});