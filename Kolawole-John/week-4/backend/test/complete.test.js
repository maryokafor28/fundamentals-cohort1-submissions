const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Project = require('../src/models/Project');
const Comment = require('../src/models/Comment');

// Test database URI
const TEST_DB = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/devconnect-test';

describe('DevConnect API Tests', () => {
  let authToken;
  let userId;
  let projectId;
  let secondUserId;
  let secondToken;

  // Connect to test database
  beforeAll(async () => {
    await mongoose.connect(TEST_DB);
  });

  // Clean up after all tests
  afterAll(async () => {
    await User.deleteMany({});
    await Project.deleteMany({});
    await Comment.deleteMany({});
    await mongoose.connection.close();
  });

  // Clean up between test suites
  beforeEach(async () => {
    await User.deleteMany({});
    await Project.deleteMany({});
    await Comment.deleteMany({});
  });

  describe('Authentication Tests', () => {
    describe('POST /api/auth/signup', () => {
      it('should register a new user successfully', async () => {
        const res = await request(app)
          .post('/api/auth/signup')
          .send({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
          });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('success');
        expect(res.body.data.user).toHaveProperty('email', 'john@example.com');
        expect(res.body.data.user).toHaveProperty('name', 'John Doe');
        expect(res.body).toHaveProperty('token');
        expect(res.body.data.user).not.toHaveProperty('password');
      });

      it('should not register user with duplicate email', async () => {
        await User.create({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123'
        });

        const res = await request(app)
          .post('/api/auth/signup')
          .send({
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password456'
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('error');
        expect(res.body.message).toContain('Email already registered');
      });

      it('should not register user without required fields', async () => {
        const res = await request(app)
          .post('/api/auth/signup')
          .send({
            email: 'incomplete@example.com'
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('error');
      });

      it('should not register user with invalid email', async () => {
        const res = await request(app)
          .post('/api/auth/signup')
          .send({
            name: 'Test User',
            email: 'invalid-email',
            password: 'password123'
          });

        expect(res.statusCode).toBe(400);
      });
    });

    describe('POST /api/auth/login', () => {
      beforeEach(async () => {
        await User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
      });

      it('should login with valid credentials', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'password123'
          });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body).toHaveProperty('token');
        expect(res.body.data.user).toHaveProperty('email', 'test@example.com');
      });

      it('should not login with wrong password', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword'
          });

        expect(res.statusCode).toBe(401);
        expect(res.body.status).toBe('error');
        expect(res.body.message).toContain('Invalid credentials');
      });

      it('should not login with non-existent email', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'nonexistent@example.com',
            password: 'password123'
          });

        expect(res.statusCode).toBe(401);
        expect(res.body.status).toBe('error');
      });

      it('should not login without credentials', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('error');
      });
    });

    describe('GET /api/auth/me', () => {
      beforeEach(async () => {
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
        
        authToken = res.body.token;
      });

      it('should get current user with valid token', async () => {
        const res = await request(app)
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data.user).toHaveProperty('email', 'test@example.com');
      });

      it('should not get user without token', async () => {
        const res = await request(app)
          .get('/api/auth/me');

        expect(res.statusCode).toBe(401);
        expect(res.body.status).toBe('error');
      });

      it('should not get user with invalid token', async () => {
        const res = await request(app)
          .get('/api/auth/me')
          .set('Authorization', 'Bearer invalidtoken');

        expect(res.statusCode).toBe(401);
        expect(res.body.status).toBe('error');
      });
    });
  });

  describe('Project Tests', () => {
    beforeEach(async () => {
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
      
      authToken = res.body.token;
    });

    describe('POST /api/projects', () => {
      it('should create a new project with authentication', async () => {
        const res = await request(app)
          .post('/api/projects')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'My Awesome Project',
            description: 'This is a test project for DevConnect',
            techStack: ['React', 'Node.js', 'MongoDB'],
            githubUrl: 'https://github.com/user/project',
            status: 'in-progress'
          });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('success');
        expect(res.body.data.project).toHaveProperty('title', 'My Awesome Project');
        expect(res.body.data.project.techStack).toContain('React');
        expect(res.body.data.project.author).toHaveProperty('name', 'Test User');
      });

      it('should not create project without authentication', async () => {
        const res = await request(app)
          .post('/api/projects')
          .send({
            title: 'Unauthorized Project',
            description: 'This should fail'
          });

        expect(res.statusCode).toBe(401);
        expect(res.body.status).toBe('error');
      });

      it('should not create project without required fields', async () => {
        const res = await request(app)
          .post('/api/projects')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Incomplete Project'
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('error');
      });
    });

    describe('GET /api/projects', () => {
      beforeEach(async () => {
        await Project.create([
          {
            title: 'Project One',
            description: 'First test project',
            author: userId,
            techStack: ['React', 'Express'],
            status: 'completed'
          },
          {
            title: 'Project Two',
            description: 'Second test project',
            author: userId,
            techStack: ['Vue', 'Django'],
            status: 'in-progress'
          },
          {
            title: 'Project Three',
            description: 'Third test project',
            author: userId,
            status: 'idea'
          }
        ]);
      });

      it('should get all projects', async () => {
        const res = await request(app)
          .get('/api/projects');

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data.projects).toHaveLength(3);
        expect(res.body.data.pagination).toHaveProperty('total', 3);
      });

      it('should get projects with pagination', async () => {
        const res = await request(app)
          .get('/api/projects?page=1&limit=2');

        expect(res.statusCode).toBe(200);
        expect(res.body.data.projects).toHaveLength(2);
        expect(res.body.data.pagination.limit).toBe(2);
      });

      it('should filter projects by status', async () => {
        const res = await request(app)
          .get('/api/projects?status=completed');

        expect(res.statusCode).toBe(200);
        expect(res.body.data.projects).toHaveLength(1);
        expect(res.body.data.projects[0].status).toBe('completed');
      });
    });

    describe('GET /api/projects/:id', () => {
      beforeEach(async () => {
        const project = await Project.create({
          title: 'Single Project',
          description: 'Testing single project retrieval',
          author: userId,
          techStack: ['React']
        });
        projectId = project._id;
      });

      it('should get a single project by ID', async () => {
        const res = await request(app)
          .get(`/api/projects/${projectId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data.project).toHaveProperty('title', 'Single Project');
        expect(res.body.data.project.author).toHaveProperty('name', 'Test User');
      });

      it('should return 404 for non-existent project', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
          .get(`/api/projects/${fakeId}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.status).toBe('error');
      });

      it('should return 404 for invalid project ID', async () => {
        const res = await request(app)
          .get('/api/projects/invalidid');

        expect(res.statusCode).toBe(404);
        expect(res.body.status).toBe('error');
      });
    });

    describe('PUT /api/projects/:id', () => {
      beforeEach(async () => {
        const project = await Project.create({
          title: 'Original Title',
          description: 'Original description',
          author: userId
        });
        projectId = project._id;
      });

      it('should update own project', async () => {
        const res = await request(app)
          .put(`/api/projects/${projectId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Updated Title',
            description: 'Updated description',
            status: 'completed'
          });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.project.title).toBe('Updated Title');
        expect(res.body.data.project.status).toBe('completed');
      });

      it('should not update project without authentication', async () => {
        const res = await request(app)
          .put(`/api/projects/${projectId}`)
          .send({
            title: 'Unauthorized Update'
          });

        expect(res.statusCode).toBe(401);
        expect(res.body.status).toBe('error');
      });

      it('should not update other user\'s project', async () => {
        const anotherUser = await User.create({
          name: 'Another User',
          email: 'another@example.com',
          password: 'password123'
        });

        const loginRes = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'another@example.com',
            password: 'password123'
          });

        const res = await request(app)
          .put(`/api/projects/${projectId}`)
          .set('Authorization', `Bearer ${loginRes.body.token}`)
          .send({
            title: 'Unauthorized Update'
          });

        expect(res.statusCode).toBe(403);
        expect(res.body.status).toBe('error');
      });
    });

    describe('DELETE /api/projects/:id', () => {
      beforeEach(async () => {
        const project = await Project.create({
          title: 'Project to Delete',
          description: 'This will be deleted',
          author: userId
        });
        projectId = project._id;
      });

      it('should delete own project', async () => {
        const res = await request(app)
          .delete(`/api/projects/${projectId}`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toContain('deleted successfully');

        const deletedProject = await Project.findById(projectId);
        expect(deletedProject).toBeNull();
      });

      it('should not delete project without authentication', async () => {
        const res = await request(app)
          .delete(`/api/projects/${projectId}`);

        expect(res.statusCode).toBe(401);
      });

      it('should not delete other user\'s project', async () => {
        const anotherUser = await User.create({
          name: 'Another User',
          email: 'another@example.com',
          password: 'password123'
        });

        const loginRes = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'another@example.com',
            password: 'password123'
          });

        const res = await request(app)
          .delete(`/api/projects/${projectId}`)
          .set('Authorization', `Bearer ${loginRes.body.token}`);

        expect(res.statusCode).toBe(403);
      });
    });
  });

  describe('Comment Tests', () => {
    beforeEach(async () => {
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
      
      authToken = res.body.token;

      const project = await Project.create({
        title: 'Test Project',
        description: 'Project for comment testing',
        author: userId
      });
      projectId = project._id;
    });

    describe('POST /api/projects/:id/comments', () => {
      it('should add comment to project', async () => {
        const res = await request(app)
          .post(`/api/projects/${projectId}/comments`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            content: 'Great project! Looking forward to collaborating.'
          });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('success');
        expect(res.body.data.comment.content).toBe('Great project! Looking forward to collaborating.');
        expect(res.body.data.comment.author).toHaveProperty('name', 'Test User');
      });

      it('should not add comment without authentication', async () => {
        const res = await request(app)
          .post(`/api/projects/${projectId}/comments`)
          .send({
            content: 'Unauthorized comment'
          });

        expect(res.statusCode).toBe(401);
      });

      it('should not add empty comment', async () => {
        const res = await request(app)
          .post(`/api/projects/${projectId}/comments`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            content: ''
          });

        expect(res.statusCode).toBe(400);
      });

      it('should not add comment to non-existent project', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
          .post(`/api/projects/${fakeId}/comments`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            content: 'Comment on non-existent project'
          });

        expect(res.statusCode).toBe(404);
      });
    });

    describe('GET /api/projects/:id/comments', () => {
      beforeEach(async () => {
        await Comment.create([
          {
            content: 'First comment',
            author: userId,
            project: projectId
          },
          {
            content: 'Second comment',
            author: userId,
            project: projectId
          },
          {
            content: 'Third comment',
            author: userId,
            project: projectId
          }
        ]);
      });

      it('should get all comments for a project', async () => {
        const res = await request(app)
          .get(`/api/projects/${projectId}/comments`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.comments).toHaveLength(3);
      });

      it('should paginate comments', async () => {
        const res = await request(app)
          .get(`/api/projects/${projectId}/comments?page=1&limit=2`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.comments).toHaveLength(2);
        expect(res.body.data.pagination.limit).toBe(2);
      });
    });

    describe('DELETE /api/projects/:projectId/comments/:commentId', () => {
      let commentId;

      beforeEach(async () => {
        const comment = await Comment.create({
          content: 'Comment to delete',
          author: userId,
          project: projectId
        });
        commentId = comment._id;
      });

      it('should delete own comment', async () => {
        const res = await request(app)
          .delete(`/api/projects/${projectId}/comments/${commentId}`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toContain('deleted successfully');

        const deletedComment = await Comment.findById(commentId);
        expect(deletedComment).toBeNull();
      });

      it('should not delete comment without authentication', async () => {
        const res = await request(app)
          .delete(`/api/projects/${projectId}/comments/${commentId}`);

        expect(res.statusCode).toBe(401);
      });

      it('should not delete other user\'s comment', async () => {
        const anotherUser = await User.create({
          name: 'Another User',
          email: 'another@example.com',
          password: 'password123'
        });

        const loginRes = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'another@example.com',
            password: 'password123'
          });

        const res = await request(app)
          .delete(`/api/projects/${projectId}/comments/${commentId}`)
          .set('Authorization', `Bearer ${loginRes.body.token}`);

        expect(res.statusCode).toBe(403);
      });
    });
  });

  describe('Health Check', () => {
    it('should return server health status', async () => {
      const res = await request(app)
        .get('/health');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('timestamp');
    });
  });
});