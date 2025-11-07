
import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import activitiesRoutes from '../../src/Routes/activities';
import authRoutes from '../../src/Routes/auth';
import { errorHandler } from '../../src/Middlewares/error';
import { protect } from '../../src/Middlewares/protect';
import User from '../../src/Models/User';
import Activity from '../../src/Models/Activity';


const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/activities', protect, activitiesRoutes);
app.use(errorHandler);

const mongoUri = 'mongodb://127.0.0.1:27017/pulse_test';
let authToken: string;
let userId: string;

beforeAll(async () => {
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Activity.deleteMany({});


    await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            age: 30,
        });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    authToken = res.body.token;

    const user = await User.findOne({ email: 'test@example.com' });
    if (user) {
        userId = user._id.toString();
    }
});


describe('Activities API', () => {
  describe('POST /api/activities', () => {
    it('should create a new activity', async () => {
      const res = await request(app)
        .post('/api/activities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'Running',
          description: 'A 5k run in the morning.',
          date: '2023-11-21T08:30:00.000Z',
          durationMinutes: 30,
          caloriesBurned: 350,
        });
        console.log(res.body)
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty('type', 'Running');
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app)
        .post('/api/activities')
        .send({
          type: 'Running',
        });
      expect(res.statusCode).toEqual(401);
    });

    it('should return 400 on validation error', async () => {
      const res = await request(app)
        .post('/api/activities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'A 5k run in the morning.',
        });
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/activities', () => {
    it('should get all activities for the user', async () => {
        await Activity.create({
            user: userId,
            type: 'Swimming',
            description: 'A 1k swim.',
            date: new Date(),
            durationMinutes: 45,
            caloriesBurned: 400,
          });

      const res = await request(app)
        .get('/api/activities')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toHaveProperty('type', 'Swimming');
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get('/api/activities');
      expect(res.statusCode).toEqual(401);
    });
  });
});
