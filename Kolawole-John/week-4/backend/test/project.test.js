const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Project = require('../src/models/Project');

describe('Project Endpoints', () => {
  let token;
  let userId;

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
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Project.deleteMany({});
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Project.deleteMany({});
  });

  describe('GET /api/projects', () => {
    it('should get all projects', async () => {
      await Project.create([
        {
          title: 'Project 1',
          description: 'Description 1',
          author: userId
        },
        {
          title: 'Project 2',
          description: 'Description 2',
          author: userId
        }
      ]);

      const res = await request(app).get('/api/projects');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.projects).toHaveLength(2);
    });
  });

  describe('POST /api/projects', () => {
    it('should create a new project with authentication', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New Project',
          description: 'Project description',
          techStack: ['React', 'Node.js']
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.project).toHaveProperty('title', 'New Project');
    });

    it('should not create project without authentication', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({
          title: 'New Project',
          description: 'Project description'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe('error');
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update own project', async () => {
      const project = await Project.create({
        title: 'Original Title',
        description: 'Original description',
        author: userId
      });

      const res = await request(app)
        .put(`/api/projects/${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
          description: 'Updated description'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.project.title).toBe('Updated Title');
    });
  });
});