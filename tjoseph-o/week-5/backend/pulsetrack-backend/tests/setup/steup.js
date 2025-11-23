// tests/setup/setup.js

// Global test setup
// Increase timeout for database operations
jest.setTimeout(30000);

// Suppress console logs during tests (optional)
// Uncomment if you want cleaner test output
/*
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
*/