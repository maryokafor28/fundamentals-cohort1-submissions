const request = require('supertest');
const app = require('../../src/app');
const UserModel = require('../../src/modules/users/users.model');
const ProductModel = require('../../../src/modules/products/products.model');
const OrderModel = require('../../src/modules/orders/orders.model');

describe('E2E - User, Auth, Products, Orders', () => {
  beforeEach(() => {
    UserModel.clear();
    ProductModel.clear();
    OrderModel.clear();
  });

  test('register → login → create product → create order → get order', async () => {
    
    const reg = await request(app).post('/api/auth/register').send({
      email: 'john@example.com',
      password: '123456'
    });
    expect(reg.statusCode).toBe(201);

    
    const login = await request(app).post('/api/auth/login').send({
      email: 'john@example.com',
      password: '123456'
    });
    expect(login.statusCode).toBe(200);
    const token = login.body.token;
    expect(token).toBeDefined();

    // Create product
    const prod = await request(app)
      .post('/api/products')
      .send({ name: 'Laptop', price: 1000 });
    expect(prod.statusCode).toBe(201);
    const productId = prod.body.id;

    // Create order (authentication required)
    const order = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId, qty: 2 }] });
    expect(order.statusCode).toBe(201);
    expect(order.body.total).toBe(2000);

    // Fetch order
    const getOrder = await request(app)
      .get(`/api/orders/${order.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getOrder.statusCode).toBe(200);
    expect(getOrder.body.total).toBe(2000);
  });
});
