const mongoose = require('mongoose');
const User = require('../../../src/models/User');
const dbHandler = require('../../setup/db-handler');

describe('User Model', () => {
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
      expect(User).toBeDefined();
    });

    test('should be a Mongoose model', () => {
      expect(User.prototype).toBeInstanceOf(mongoose.Model);
    });
  });

  describe('Required Fields', () => {
    test('should require name field', async () => {
      const user = new User({
        email: 'test@example.com'
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
      expect(error.errors.name.kind).toBe('required');
    });

    test('should require email field', async () => {
      const user = new User({
        name: 'Test User'
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.email.kind).toBe('required');
    });
  });

  describe('Email Validation', () => {
    test('should reject invalid email format', async () => {
      const user = new User({
        name: 'Test User',
        email: 'invalid-email'
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

    test('should accept valid email format', async () => {
      const user = new User({
        name: 'Test User',
        email: 'valid@example.com'
      });

      const savedUser = await user.save();
      expect(savedUser.email).toBe('valid@example.com');
    });

    test('should convert email to lowercase', async () => {
      const user = new User({
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM'
      });

      const savedUser = await user.save();
      expect(savedUser.email).toBe('test@example.com');
    });

    test('should enforce unique email', async () => {
      await User.create({
        name: 'User One',
        email: 'duplicate@example.com'
      });

      let error;
      try {
        await User.create({
          name: 'User Two',
          email: 'duplicate@example.com'
        });
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000);
    });
  });

  describe('Optional Fields', () => {
    test('should save user without optional fields', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com'
      });

      const savedUser = await user.save();
      expect(savedUser.name).toBe('Test User');
      expect(savedUser.email).toBe('test@example.com');
      expect(savedUser.age).toBeUndefined();
      expect(savedUser.weight).toBeUndefined();
      expect(savedUser.height).toBeUndefined();
      expect(savedUser.gender).toBeUndefined();
      expect(savedUser.phone).toBeUndefined();
    });

    test('should save user with all optional fields', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        age: 30,
        weight: 70,
        height: 175,
        gender: 'male',
        phone: '+1234567890'
      });

      const savedUser = await user.save();
      expect(savedUser.age).toBe(30);
      expect(savedUser.weight).toBe(70);
      expect(savedUser.height).toBe(175);
      expect(savedUser.gender).toBe('male');
      expect(savedUser.phone).toBe('+1234567890');
    });
  });

  describe('Field Validation', () => {
    test('should reject negative age', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        age: -5
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.age).toBeDefined();
    });

    test('should reject negative weight', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        weight: -10
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.weight).toBeDefined();
    });

    test('should reject negative height', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        height: -150
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.height).toBeDefined();
    });

    test('should validate gender enum', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        gender: 'invalid'
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.gender).toBeDefined();
    });

    test('should accept valid gender values', async () => {
      const genders = ['male', 'female', 'other'];

      for (const gender of genders) {
        const user = await User.create({
          name: 'Test User',
          email: `test-${gender}@example.com`,
          gender
        });

        expect(user.gender).toBe(gender);
      }
    });
  });

  describe('Timestamps', () => {
    test('should have createdAt timestamp', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });

      expect(user.createdAt).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    test('should have updatedAt timestamp', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });

      expect(user.updatedAt).toBeDefined();
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    test('should update updatedAt on modification', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });

      const originalUpdatedAt = user.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 100));

      user.name = 'Updated Name';
      await user.save();

      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Name Field', () => {
    test('should trim whitespace from name', async () => {
      const user = await User.create({
        name: '  Test User  ',
        email: 'test@example.com'
      });

      expect(user.name).toBe('Test User');
    });
  });
});