const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../socket/socket');
const UserModel = require('../models/userModel');
const PostModel = require('../models/postModel');
const CommentModel = require('../models/commentModel');

describe('Comments API', () => {
  let authToken;
  let postId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/devconnect-test');
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
    await CommentModel.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
    await CommentModel.deleteMany({});
    
    // Create test user and get token
    const userData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };
    
    await request(app).post('/api/users/register').send(userData);
    
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.headers['set-cookie'];
    
    // Create test post
    const postResponse = await request(app)
      .post('/api/posts')
      .set('Cookie', authToken)
      .send({ body: 'Test post for comments' });
    
    postId = postResponse.body._id;
  });

  describe('POST /api/comments/:postId', () => {
    it('should create a comment successfully', async () => {
      const commentData = {
        comment: 'Great project! Love the implementation 🚀'
      };

      const response = await request(app)
        .post(`/api/comments/${postId}`)
        .set('Cookie', authToken)
        .send(commentData)
        .expect(201);

      expect(response.body.comment).toBe(commentData.comment);
      expect(response.body.postId).toBe(postId);
    });

    it('should return error for empty comment', async () => {
      const response = await request(app)
        .post(`/api/comments/${postId}`)
        .set('Cookie', authToken)
        .send({ comment: '' })
        .expect(422);

      expect(response.body.message).toBe('Comment is required');
    });
  });

  describe('GET /api/comments/:postId', () => {
    it('should get all comments for a post', async () => {
      // Create a test comment first
      await request(app)
        .post(`/api/comments/${postId}`)
        .set('Cookie', authToken)
        .send({ comment: 'Test comment' });

      const response = await request(app)
        .get(`/api/comments/${postId}`)
        .set('Cookie', authToken)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});