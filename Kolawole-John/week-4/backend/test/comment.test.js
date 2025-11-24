const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Project = require('../src/models/Project');
const Comment = require('../src/models/Comment');

describe('Comment Endpoints', () => {
  let token;
  let userId;
  let projectId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/devconnect-test');
    
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    userId = user._id;

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    token = res.body.token;

    const project = await Project.create({
      title: 'Test Project',
      description: 'Test description',
      author: userId
    });
    projectId = project._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Project.deleteMany({});
    await Comment.deleteMany({});
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Comment.deleteMany({});
  });

  describe('POST /api/projects/:id/comments', () => {
    it('should add comment to project', async () => {
      const res = await request(app)
        .post(`/api/projects/${projectId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Great project!'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.comment.content).toBe('Great project!');
    });

    it('should not add comment without authentication', async () => {
      const res = await request(app)
        .post(`/api/projects/${projectId}/comments`)
        .send({
          content: 'Great project!'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/projects/:id/comments', () => {
    it('should get project comments', async () => {
      await Comment.create([
        { content: 'Comment 1', author: userId, project: projectId },
        { content: 'Comment 2', author: userId, project: projectId }
      ]);

      const res = await request(app)
        .get(`/api/projects/${projectId}/comments`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.comments).toHaveLength(2);
    });
  });
});