const mongoose = require('mongoose');
const connectDB = require('../../../src/config/database');

describe('Database Connection', () => {
  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  describe('connectDB function', () => {
    test('should be defined', () => {
      expect(connectDB).toBeDefined();
      expect(typeof connectDB).toBe('function');
    });

    test('should connect to MongoDB successfully', async () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/pulsetrack_test';

      const connection = await connectDB();

      expect(mongoose.connection.readyState).toBe(1);
      expect(connection).toBeDefined();
      expect(connection.connection).toBeDefined();

      await mongoose.disconnect();
    });

    test('should use URI from environment variable', async () => {
      const testUri = 'mongodb://localhost:27017/pulsetrack_test_env';
      process.env.MONGODB_URI = testUri;

      await connectDB();

      expect(mongoose.connection.host).toBe('localhost');
      expect(mongoose.connection.port).toBe(27017);
      expect(mongoose.connection.name).toBe('pulsetrack_test_env');

      await mongoose.disconnect();
    });

    test('should handle connection errors gracefully', async () => {
      process.env.MONGODB_URI = 'mongodb://invalid:27017/test';

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const processExitSpy = jest.spyOn(process, 'exit').mockImplementation();

      await connectDB();

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(processExitSpy).toHaveBeenCalledWith(1);

      consoleErrorSpy.mockRestore();
      processExitSpy.mockRestore();
    }, 10000);

    test('should throw error when MONGODB_URI is not set', async () => {
      delete process.env.MONGODB_URI;

      const processExitSpy = jest.spyOn(process, 'exit').mockImplementation();

      await connectDB();

      expect(processExitSpy).toHaveBeenCalledWith(1);

      processExitSpy.mockRestore();
    });
  });
});