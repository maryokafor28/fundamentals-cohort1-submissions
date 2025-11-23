const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Appointment = require('../../src/models/Appointment');
const User = require('../../src/models/User');
const appointmentController = require('../../src/controllers/appointmentController');
const dbHandler = require('../setup/db-handler');

const app = express();
app.use(express.json());

app.get('/api/appointments', appointmentController.getAppointments);
app.get('/api/appointments/:id', appointmentController.getAppointment);
app.post('/api/appointments', appointmentController.createAppointment);
app.put('/api/appointments/:id', appointmentController.updateAppointment);
app.delete('/api/appointments/:id', appointmentController.deleteAppointment);

describe('Appointment Controller', () => {
  let testUser;

  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  beforeEach(async () => {
    await dbHandler.clearDatabase();
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com'
    });
  });

  describe('GET /api/appointments - getAppointments', () => {
    test('should return empty array when no appointments exist', async () => {
      const response = await request(app).get('/api/appointments');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    test('should return all appointments', async () => {
      await Appointment.create([
        {
          userId: testUser._id,
          doctorName: 'Dr. Smith',
          specialty: 'cardiology',
          appointmentDate: new Date(),
          reason: 'Check-up'
        },
        {
          userId: testUser._id,
          doctorName: 'Dr. Johnson',
          specialty: 'dermatology',
          appointmentDate: new Date(),
          reason: 'Skin consultation'
        },
        {
          userId: testUser._id,
          doctorName: 'Dr. Williams',
          specialty: 'orthopedics',
          appointmentDate: new Date(),
          reason: 'Knee pain'
        }
      ]);

      const response = await request(app).get('/api/appointments');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data).toHaveLength(3);
    });

    test('should populate user information', async () => {
      await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      const response = await request(app).get('/api/appointments');

      expect(response.body.data[0].userId).toBeDefined();
      expect(response.body.data[0].userId.name).toBe('Test User');
      expect(response.body.data[0].userId.email).toBe('test@example.com');
    });

    test('should sort appointments by appointmentDate ascending', async () => {
      const date1 = new Date('2024-12-01');
      const date2 = new Date('2024-12-15');
      const date3 = new Date('2024-12-30');

      const appt1 = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: date3,
        reason: 'Check-up'
      });

      const appt2 = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Johnson',
        specialty: 'dermatology',
        appointmentDate: date1,
        reason: 'Skin consultation'
      });

      const appt3 = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Williams',
        specialty: 'orthopedics',
        appointmentDate: date2,
        reason: 'Knee pain'
      });

      const response = await request(app).get('/api/appointments');

      expect(response.body.data[0]._id).toBe(appt2._id.toString());
      expect(response.body.data[1]._id).toBe(appt3._id.toString());
      expect(response.body.data[2]._id).toBe(appt1._id.toString());
    });

    test('should filter appointments by userId', async () => {
      const user2 = await User.create({
        name: 'User Two',
        email: 'user2@example.com'
      });

      await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      await Appointment.create({
        userId: user2._id,
        doctorName: 'Dr. Johnson',
        specialty: 'dermatology',
        appointmentDate: new Date(),
        reason: 'Skin consultation'
      });

      const response = await request(app).get(`/api/appointments?userId=${testUser._id}`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].userId._id).toBe(testUser._id.toString());
    });

    test('should filter appointments by status', async () => {
      await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up',
        status: 'scheduled'
      });

      await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Johnson',
        specialty: 'dermatology',
        appointmentDate: new Date(),
        reason: 'Skin consultation',
        status: 'completed'
      });

      const response = await request(app).get('/api/appointments?status=completed');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].status).toBe('completed');
    });

    test('should filter by both userId and status', async () => {
      const user2 = await User.create({
        name: 'User Two',
        email: 'user2@example.com'
      });

      await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up',
        status: 'scheduled'
      });

      await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Johnson',
        specialty: 'dermatology',
        appointmentDate: new Date(),
        reason: 'Skin consultation',
        status: 'completed'
      });

      await Appointment.create({
        userId: user2._id,
        doctorName: 'Dr. Williams',
        specialty: 'orthopedics',
        appointmentDate: new Date(),
        reason: 'Knee pain',
        status: 'completed'
      });

      const response = await request(app).get(`/api/appointments?userId=${testUser._id}&status=completed`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].userId._id).toBe(testUser._id.toString());
      expect(response.body.data[0].status).toBe('completed');
    });
  });

  describe('GET /api/appointments/:id - getAppointment', () => {
    test('should return appointment by ID', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date('2024-12-15'),
        reason: 'Annual check-up',
        notes: 'Bring previous records'
      });

      const response = await request(app).get(`/api/appointments/${appointment._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(appointment._id.toString());
      expect(response.body.data.doctorName).toBe('Dr. Smith');
      expect(response.body.data.specialty).toBe('cardiology');
    });

    test('should populate user information', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      const response = await request(app).get(`/api/appointments/${appointment._id}`);

      expect(response.body.data.userId.name).toBe('Test User');
      expect(response.body.data.userId.email).toBe('test@example.com');
    });

    test('should return 404 if appointment not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/appointments/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Appointment not found');
    });

    test('should return 500 for invalid ID format', async () => {
      const response = await request(app).get('/api/appointments/invalid-id');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/appointments - createAppointment', () => {
    test('should create appointment with valid data', async () => {
      const appointmentData = {
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date('2024-12-20'),
        reason: 'Annual check-up',
        notes: 'Bring previous records',
        location: 'City Hospital'
      };

      const response = await request(app)
        .post('/api/appointments')
        .send(appointmentData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.doctorName).toBe('Dr. Smith');
      expect(response.body.data.specialty).toBe('cardiology');
      expect(response.body.data.status).toBe('scheduled');
      expect(response.body.data._id).toBeDefined();

      const appointmentInDb = await Appointment.findById(response.body.data._id);
      expect(appointmentInDb).toBeDefined();
    });

    test('should create appointment with only required fields', async () => {
      const appointmentData = {
        userId: testUser._id,
        doctorName: 'Dr. Johnson',
        specialty: 'dermatology',
        appointmentDate: new Date('2024-12-25'),
        reason: 'Skin consultation'
      };

      const response = await request(app)
        .post('/api/appointments')
        .send(appointmentData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.doctorName).toBe('Dr. Johnson');
      expect(response.body.data.specialty).toBe('dermatology');
    });

    test('should return 404 if userId does not exist', async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      const appointmentData = {
        userId: fakeUserId,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      };

      const response = await request(app)
        .post('/api/appointments')
        .send(appointmentData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    test('should return 400 without userId', async () => {
      const appointmentData = {
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      };

      const response = await request(app)
        .post('/api/appointments')
        .send(appointmentData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 without doctorName', async () => {
      const appointmentData = {
        userId: testUser._id,
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      };

      const response = await request(app)
        .post('/api/appointments')
        .send(appointmentData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 without specialty', async () => {
      const appointmentData = {
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        appointmentDate: new Date(),
        reason: 'Check-up'
      };

      const response = await request(app)
        .post('/api/appointments')
        .send(appointmentData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 without appointmentDate', async () => {
      const appointmentData = {
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        reason: 'Check-up'
      };

      const response = await request(app)
        .post('/api/appointments')
        .send(appointmentData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 without reason', async () => {
      const appointmentData = {
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date()
      };

      const response = await request(app)
        .post('/api/appointments')
        .send(appointmentData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 with invalid specialty', async () => {
      const appointmentData = {
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'invalid_specialty',
        appointmentDate: new Date(),
        reason: 'Check-up'
      };

      const response = await request(app)
        .post('/api/appointments')
        .send(appointmentData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 with invalid status', async () => {
      const appointmentData = {
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up',
        status: 'invalid_status'
      };

      const response = await request(app)
        .post('/api/appointments')
        .send(appointmentData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/appointments/:id - updateAppointment', () => {
    test('should update appointment with valid data', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      const updateData = {
        status: 'completed',
        notes: 'Patient arrived on time'
      };

      const response = await request(app)
        .put(`/api/appointments/${appointment._id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('completed');
      expect(response.body.data.notes).toBe('Patient arrived on time');

      const updatedAppointment = await Appointment.findById(appointment._id);
      expect(updatedAppointment.status).toBe('completed');
    });

    test('should return 404 if appointment not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/appointments/${fakeId}`)
        .send({ status: 'completed' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Appointment not found');
    });

    test('should return 400 with invalid data', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      const response = await request(app)
        .put(`/api/appointments/${appointment._id}`)
        .send({ status: 'invalid_status' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should validate specialty on update', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      const response = await request(app)
        .put(`/api/appointments/${appointment._id}`)
        .send({ specialty: 'invalid_specialty' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/appointments/:id - deleteAppointment', () => {
    test('should delete appointment successfully', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      const response = await request(app).delete(`/api/appointments/${appointment._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Appointment deleted successfully');

      const deletedAppointment = await Appointment.findById(appointment._id);
      expect(deletedAppointment).toBeNull();
    });

    test('should return 404 if appointment not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/api/appointments/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Appointment not found');
    });

    test('should return 500 for invalid ID format', async () => {
      const response = await request(app).delete('/api/appointments/invalid-id');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });
});