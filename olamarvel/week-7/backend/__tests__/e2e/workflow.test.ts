
import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import authRoutes from '../../src/Routes/auth';
import appointmentsRoutes from '../../src/Routes/appointments';
import { errorHandler } from '../../src/Middlewares/error';
import { protect } from '../../src/Middlewares/protect';
import User from '../../src/Models/User';
import Doctor from '../../src/Models/Doctor';
import Appointment from '../../src/Models/Appointments';

// Setup a complete express app for the test
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/appointments', protect, appointmentsRoutes);
app.use(errorHandler);

const mongoUri = 'mongodb://127.0.0.1:27017/pulse_test_workflow';
let doctorId: string;

beforeAll(async () => {
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
  // Clean up database before each test
  await User.deleteMany({});
  await Doctor.deleteMany({});
  await Appointment.deleteMany({});

  // Seed the database with a necessary doctor
  const doctor = await Doctor.create({
    name: 'Dr. House',
    specialty: 'Diagnostician',
  });
  doctorId = doctor._id.toString();
});

describe('User Workflow E2E Test', () => {
  it('should allow a user to register, login, create an appointment, and then view it', async () => {
    // 1. Register a new user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'john.doe.workflow@example.com',
        password: 'aSecurePassword123',
        age: 35,
      });
    expect(registerRes.statusCode).toEqual(201);
    expect(registerRes.body.success).toBe(true);

    // 2. Login with the new user credentials
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john.doe.workflow@example.com',
        password: 'aSecurePassword123',
      });
    expect(loginRes.statusCode).toEqual(200);
    const authToken = loginRes.body.token;
    expect(authToken).toBeDefined();

    // 3. Create a new appointment using the auth token
    const appointmentTime = new Date();
    const createAppointmentRes = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        doctor: doctorId,
        time: appointmentTime.toISOString(),
        status: 'scheduled',
      });
    expect(createAppointmentRes.statusCode).toEqual(201);
    const newAppointmentId = createAppointmentRes.body.data._id;
    expect(newAppointmentId).toBeDefined();

    // 4. Get the list of appointments for the user and verify the new appointment is present
    const getAppointmentsRes = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${authToken}`);
      
    expect(getAppointmentsRes.statusCode).toEqual(200);
    expect(getAppointmentsRes.body.data).toBeInstanceOf(Array);
    expect(getAppointmentsRes.body.data.length).toBe(1);
    expect(getAppointmentsRes.body.data[0]._id).toBe(newAppointmentId);
    expect(getAppointmentsRes.body.data[0].doctor._id).toBe(doctorId);
  });
});
