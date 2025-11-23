const request = require('supertest');
const app = require('../src/app');

describe('Comments API', () => {
  let token;
  let projectId;

  beforeEach(async () => {
    
    const authRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      });
    token = authRes.body.token;

   
    const projectRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Project',
        description: 'Test Description',
        techStack: ['Node.js']
      });
    projectId = projectRes.body.data._id;
  });

  describe('POST /api/comments/project/:projectId', () => {
    it('should create a comment on a project', async () => {
      const response = await request(app)
        .post(`/api/comments/project/${projectId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'This is a great project!'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data).toHaveProperty('content', 'This is a great project!');
      expect(response.body.data).toHaveProperty('projectId', projectId);
      expect(response.body.data).toHaveProperty('userId');
    });

    it('should not create comment without authentication', async () => {
      const response = await request(app)
        .post(`/api/comments/project/${projectId}`)
        .send({
          content: 'Test comment'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not create comment with missing content', async () => {
      const response = await request(app)
        .post(`/api/comments/project/${projectId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should not create comment on non-existent project', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .post(`/api/comments/project/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Test comment'
        })
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Project not found');
    });
  });

  describe('GET /api/comments/project/:projectId', () => {
    beforeEach(async () => {
      
      await request(app)
        .post(`/api/comments/project/${projectId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'First comment' });

      await request(app)
        .post(`/api/comments/project/${projectId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Second comment' });
    });

    it('should get all comments for a project', async () => {
      const response = await request(app)
        .get(`/api/comments/project/${projectId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(2);
      expect(response.body).toHaveProperty('count', 2);
    });

    it('should populate user information in comments', async () => {
      const response = await request(app)
        .get(`/api/comments/project/${projectId}`)
        .expect(200);

      expect(response.body.data[0]).toHaveProperty('userId');
      expect(response.body.data[0].userId).toHaveProperty('username');
    });
  });

  describe('DELETE /api/comments/:id', () => {
    let commentId;

    beforeEach(async () => {
      const response = await request(app)
        .post(`/api/comments/project/${projectId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Comment to delete' });
      commentId = response.body.data._id;
    });

    it('should delete own comment', async () => {
      const response = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('message', 'Comment removed');
    });

    it('should not delete without authentication', async () => {
      const response = await request(app)
        .delete(`/api/comments/${commentId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not delete another user\'s comment', async () => {
     
      const anotherUser = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'janedoe',
          email: 'jane@example.com',
          password: 'password123'
        });

      const response = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${anotherUser.body.token}`)
        .expect(403);

      expect(response.body).toHaveProperty('message', 'Not authorized to delete this comment');
    });
  });
});