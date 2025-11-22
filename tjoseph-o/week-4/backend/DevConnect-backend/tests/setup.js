require('dotenv').config(); 
const mongoose = require('mongoose');

beforeAll(async () => {
  const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/devconnect_test';
  await mongoose.connect(mongoUri);
  console.log('✓ Connected to test database');
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  console.log('✓ Test database cleaned up');
});