// tests/unit/setup/db-handler.test.js

const mongoose = require('mongoose');
const dbHandler = require('../../setup/db-handler');

describe('Database Handler', () => {
  describe('connect', () => {
    test('should connect to in-memory database', async () => {
      await dbHandler.connect();

      expect(mongoose.connection.readyState).toBe(1); // connected
      expect(mongoose.connection.name).toContain('test');

      await dbHandler.closeDatabase();
    });
  });

  describe('clearDatabase', () => {
    beforeAll(async () => {
      await dbHandler.connect();
    });

    afterAll(async () => {
      await dbHandler.closeDatabase();
    });

    test('should clear all collections', async () => {
      // Create a test collection
      const TestModel = mongoose.model('Test', new mongoose.Schema({ name: String }));
      await TestModel.create({ name: 'test' });

      expect(await TestModel.countDocuments()).toBe(1);

      // Clear database
      await dbHandler.clearDatabase();

      expect(await TestModel.countDocuments()).toBe(0);
    });
  });

  describe('closeDatabase', () => {
    test('should close database connection', async () => {
      await dbHandler.connect();
      expect(mongoose.connection.readyState).toBe(1);

      await dbHandler.closeDatabase();
      expect(mongoose.connection.readyState).toBe(0); // disconnected
    });
  });
});