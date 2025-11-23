const request = require('supertest');
const app = require('../src/app');

describe('Authentication API - User Registration', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        bio: 'Software Developer'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('username', 'johndoe');
      expect(response.body).toHaveProperty('email', 'john@example.com');
      expect(response.body).toHaveProperty('token');
      expect(response.body).not.toHaveProperty('password');
    });

  


    it('should not register user with missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'johndoe'
            
        })
        .expect(400); 

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });



    

    it('should not register user with duplicate email', async () => {
      const userData = {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      };

      
      await request(app)
        .post('/api/auth/register')
        .send(userData);

     
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'janedoe',
          email: 'john@example.com', 
          password: 'password456'
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/already exists/i);
    });

    it('should not register user with duplicate username', async () => {
      const userData = {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'johndoe', 
          email: 'different@example.com',
          password: 'password456'
        })
        .expect(400);

      expect(response.body.message).toMatch(/already exists/i);
    });

    it('should hash password before saving', async () => {
      const User = require('../src/models/User');
      
      const userData = {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      const user = await User.findOne({ email: 'john@example.com' }).select('+password');
      expect(user.password).not.toBe('password123');
      expect(user.password).toMatch(/^\$2[aby]\$.{56}$/); 
    });
  });
});