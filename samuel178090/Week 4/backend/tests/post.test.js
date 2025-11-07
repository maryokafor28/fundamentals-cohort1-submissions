const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../socket/socket');
const UserModel = require('../models/userModel');
const PostModel = require('../models/postModel');

describe('Posts API', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/devconnect-test');
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
    
    // Create test user and get token
    const userData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };
    
    const registerResponse = await request(app)
      .post('/api/users/register')
      .send(userData);
    
    userId = registerResponse.body._id;
    
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.headers['set-cookie'];
  });

  describe('POST /api/posts', () => {
    it('should create a new post successfully', async () => {
      const postData = {
        body: 'This is a test post about my new project!'
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Cookie', authToken)
        .send(postData)
        .expect(201);

      expect(response.body.body).toBe(postData.body);
      expect(response.body.creator).toBeDefined();
    });

    it('should return error for empty post body', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Cookie', authToken)
        .send({ body: '' })
        .expect(422);

      expect(response.body.message).toBe('Post content is required');
    });
  });

  describe('GET /api/posts', () => {
    it('should get all posts', async () => {
      // Create a test post first
      await request(app)
        .post('/api/posts')
        .set('Cookie', authToken)
        .send({ body: 'Test post' });

      const response = await request(app)
        .get('/api/posts')
        .set('Cookie', authToken)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});