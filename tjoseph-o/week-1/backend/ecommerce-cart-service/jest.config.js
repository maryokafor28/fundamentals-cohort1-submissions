module.exports = {
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/tests/**',
      '!src/config/**',
      '!**/node_modules/**'
    ],
    testMatch: [
      '**/src/tests/**/*.test.js',
      '**/src/tests/**/*.spec.js'
    ],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
    testTimeout: 10000,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true
  };