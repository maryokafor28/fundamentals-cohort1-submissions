import request from 'supertest';
import app from '../src/index';
import mongoose from 'mongoose';
import User from '../src/models/userModel';
import Project from '../src/models/projectModel';

let token: string;
let userId: string;
let projectId: string;
const email = 'profileuser'+ Math.random()+'@example.com' ;
const username = 'profileuser' + Math.random();
const password = 'Password123!' + Math.random();

describe('Profile and Project API', () => {
  beforeAll(async () => {
    // Create a user and log in to get a token
    const user = {
      email ,
      username,
      password,
    };
    const registerRes = await request(app).post('/api/auth/register').send(user)
    const loginRes = await request(app).post('/api/auth/login').send(user)
    expect(registerRes.status).toBe(201);
    expect(loginRes.body.accessToken).toBeDefined()
    userId = loginRes.body.id;
    token = loginRes.body.accessToken;
  });

  // Profile tests
  it('should get a user profile', async () => {
    const res = await request(app)
      .get(`/api/profiles/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe(username);
  });

  it('should update a user profile', async () => {
    const res = await request(app)
      .put('/api/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        bio: 'This is a test bio.',
      });
    expect(res.status).toBe(200);
    expect(res.body.bio).toBe('This is a test bio.');
  });
  
  // Project tests
  it('should create a project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Project',
        description: 'This is a test project.',
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Project');
    projectId = res.body._id;
  });

  it('should get all projects', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a project by ID', async () => {
    const res = await request(app).get(`/api/projects/${projectId}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Test Project');
  });

  // Comment tests
  it('should add a comment to a project', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'This is a test comment.',
      });
    expect(res.status).toBe(201);
    expect(res.body.content).toBe('This is a test comment.');
  });
});
