
import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import appointmentsRoutes from '../../src/Routes/appointments';
import authRoutes from '../../src/Routes/auth';
import { errorHandler } from '../../src/Middlewares/error';
import { protect } from '../../src/Middlewares/protect';
import User from '../../src/Models/User';
import Doctor from '../../src/Models/Doctor';
import Appointment from '../../src/Models/Appointments';


const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/appointments', protect, appointmentsRoutes);
app.use(errorHandler);

const mongoUri = 'mongodb://127.0.0.1:27017/pulse_test';
let authToken: string;
let userId: string;
let doctorId: string;

beforeAll(async () => {
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Doctor.deleteMany({});
  await Appointment.deleteMany({});

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

  const doctor = await Doctor.create({
    name: 'Dr. Smith',
    specialty: 'Cardiology'
  })
  doctorId = doctor._id.toString();
});

describe('Appointments API', () => {
  describe('POST /api/appointments', () => {
    it('should create a new appointment', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          doctor: doctorId,
          time: '2023-12-10T14:00:00.000Z',
          status: "scheduled"
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty('doctor', doctorId);
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send({
            doctor: doctorId,
            time: '2023-12-10T14:00:00.000Z',
        });
      expect(res.statusCode).toEqual(401);
    });

    it('should return 400 on validation error', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
            time: '2023-12-10T14:00:00.000Z',
        });
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/appointments', () => {
    it('should get all appointments for the user', async () => {
        await Appointment.create({
            user: userId,
            doctor: doctorId,
            time: new Date('2023-12-10T14:00:00.000Z'),
          });

      const res = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveLength(1);
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get('/api/appointments');
      expect(res.statusCode).toEqual(401);
    });
  });
});