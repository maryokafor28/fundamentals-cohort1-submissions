const request = require('supertest');
const app = require('../../src/app');
const UserModel = require('../../src/modules/users/users.model');

describe('Users API (integration)', () => {
  beforeEach(() => UserModel.clear());

  test('POST /api/users - should create a user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({email: 'new@example.com', name: 'Tolu'});

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe('new@example.com');
  });

  test('GET /api/users - should list users', async () => {
    await UserModel.create({email: 'a@b.com', name: 'Bala'});
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
