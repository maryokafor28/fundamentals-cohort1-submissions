const logger = require('../config/logger');

describe('Logger Configuration Tests', () => {

  describe('Logger Instance', () => {
    test('should have logger instance defined', () => {
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    test('should have correct log level', () => {
      const expectedLevel = process.env.LOG_LEVEL || 'info';
      expect(logger.level).toBe(expectedLevel);
    });
  });

  describe('Logging Methods', () => {
    // Mock console to prevent test output clutter
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('should log info messages', () => {
      expect(() => {
        logger.info('Test info message');
      }).not.toThrow();
    });

    test('should log error messages', () => {
      expect(() => {
        logger.error('Test error message');
      }).not.toThrow();
    });

    test('should log warning messages', () => {
      expect(() => {
        logger.warn('Test warning message');
      }).not.toThrow();
    });

    test('should log with metadata', () => {
      expect(() => {
        logger.info('Test message with metadata', { 
          userId: 123, 
          action: 'test' 
        });
      }).not.toThrow();
    });

    test('should handle error objects', () => {
      const error = new Error('Test error');
      expect(() => {
        logger.error('Error occurred', { error });
      }).not.toThrow();
    });
  });

});