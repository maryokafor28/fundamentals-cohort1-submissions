const request = require('supertest');
const app = require('../../src/app');
const store = require('../../src/data/store');

beforeEach(() => store.reset());

describe('Auth Routes', () => {
  test('POST /auth/register should create a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'alice', password: 'password' });
    expect(res.status).toBe(201);
  });

  test('POST /auth/login should return token', async () => {
    await request(app).post('/auth/register').send({ username: 'bob', password: 'pass' });
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'bob', password: 'pass' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
