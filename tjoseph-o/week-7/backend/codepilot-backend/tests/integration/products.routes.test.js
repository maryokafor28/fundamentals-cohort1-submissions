const request = require('supertest');
const app = require('../../src/app');
const store = require('../../src/data/store');

beforeEach(() => store.reset());

describe('Products Routes', () => {
  test('GET /products should return empty list initially', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /products should create product', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Widget', price: 100 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Widget');
  });
});
