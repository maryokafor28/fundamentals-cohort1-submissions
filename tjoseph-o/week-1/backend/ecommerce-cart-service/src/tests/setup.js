const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});


global.testUtils = {
  createTestUser: () => ({
    username: 'testuser',
    email: 'test@example.com',
    password: 'TestPassword123!'
  }),
  
  createTestProduct: () => ({
    _id: new mongoose.Types.ObjectId(),
    name: 'Test Product',
    price: 29.99,
    description: 'A test product'
  })
};