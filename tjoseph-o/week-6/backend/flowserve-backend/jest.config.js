module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage/'],
  transform: {},
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!uuid)'],
  setupFiles: ['<rootDir>/jest.setup.js']
};