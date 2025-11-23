const request = require('supertest');
const app = require('../src/app');

describe('Projects API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    // Register and login user
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      });
    token = response.body.token;
    userId = response.body._id;
  });

  describe('POST /api/projects', () => {
    it('should create a new project with valid data', async () => {
      const projectData = {
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce solution',
        techStack: ['Node.js', 'React', 'MongoDB'],
        githubLink: 'https://github.com/user/ecommerce',
        liveLink: 'https://ecommerce.example.com'
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send(projectData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data).toHaveProperty('title', 'E-Commerce Platform');
      expect(response.body.data.techStack).toEqual(['Node.js', 'React', 'MongoDB']);
      expect(response.body.data).toHaveProperty('userId');
    });

    it('should not create project without authentication', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          title: 'Test Project',
          description: 'Test Description'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });



    it('should not create project with missing required fields', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Project'
            
        })
        .expect(400); 

      expect(response.body.success).toBe(false);
    });

    });

  describe('GET /api/projects', () => {
    beforeEach(async () => {
     
      await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Project 1',
          description: 'Description 1',
          techStack: ['Node.js']
        });

      await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Project 2',
          description: 'Description 2',
          techStack: ['React']
        });
    });

    it('should get all projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(2);
      expect(response.body).toHaveProperty('count', 2);
    });

    it('should populate user information in projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(response.body.data[0]).toHaveProperty('userId');
      expect(response.body.data[0].userId).toHaveProperty('username');
    });
  });

  describe('GET /api/projects/:id', () => {
    let projectId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Single Project',
          description: 'Single Project Description',
          techStack: ['Vue.js']
        });
      projectId = response.body.data._id;
    });

    it('should get a single project by id', async () => {
      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('title', 'Single Project');
    });

    it('should return 404 for non-existent project', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/projects/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Project not found');
    });
  });

  describe('PUT /api/projects/:id', () => {
    let projectId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Original Title',
          description: 'Original Description',
          techStack: ['Node.js']
        });
      projectId = response.body.data._id;
    });

    it('should update own project', async () => {
      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
          description: 'Updated Description'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
    });

    it('should not update project without authentication', async () => {
      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .send({ title: 'Updated Title' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not update another user\'s project', async () => {
      
      const anotherUser = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'janedoe',
          email: 'jane@example.com',
          password: 'password123'
        });

      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${anotherUser.body.token}`)
        .send({ title: 'Hacked Title' })
        .expect(403);

      expect(response.body).toHaveProperty('message', 'Not authorized to update this project');
    });
  });

  describe('DELETE /api/projects/:id', () => {
    let projectId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Project to Delete',
          description: 'Will be deleted',
          techStack: ['Node.js']
        });
      projectId = response.body.data._id;
    });

    it('should delete own project', async () => {
      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('message', 'Project removed');

      
      const getResponse = await request(app)
        .get(`/api/projects/${projectId}`)
        .expect(404);
    });

    it('should not delete without authentication', async () => {
      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not delete another user\'s project', async () => {
      const anotherUser = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'janedoe',
          email: 'jane@example.com',
          password: 'password123'
        });

      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${anotherUser.body.token}`)
        .expect(403);

      expect(response.body).toHaveProperty('message', 'Not authorized to delete this project');
    });
  });
});