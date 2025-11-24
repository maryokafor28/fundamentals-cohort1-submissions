// Test setup file
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key';
process.env.JWT_EXPIRE = '7d';
process.env.PORT = 5001;

// Set test database
if (!process.env.MONGODB_URI_TEST) {
  process.env.MONGODB_URI = 'mongodb+srv://devconnect:kEDCMfsQYJcBUpvt@johnhub.v83kzkf.mongodb.net/devconnect?retryWrites=true&w=majority&appName=Johnhub';
}

// Increase test timeout for database operations
jest.setTimeout(10000);