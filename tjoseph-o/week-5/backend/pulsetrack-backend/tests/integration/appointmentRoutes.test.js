const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Appointment = require('../../src/models/Appointment');
const User = require('../../src/models/User');
const appointmentRoutes = require('../../src/routes/appointmentRoutes');
const dbHandler = require('../setup/db-handler');

const app = express();
app.use(express.json());
app.use('/api/appointments', appointmentRoutes);

describe('Appointment Routes', () => {
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

  describe('Route Mounting', () => {
    test('should mount routes at /api/appointments', async () => {
      const response = await request(app).get('/api/appointments');
      expect(response.status).not.toBe(404);
    });
  });

  describe('GET /api/appointments', () => {
    test('should be accessible', async () => {
      const response = await request(app).get('/api/appointments');
      expect(response.status).toBe(200);
    });

    test('should return appointments data', async () => {
      await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      const response = await request(app).get('/api/appointments');

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should support userId query parameter', async () => {
      await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      const response = await request(app).get(`/api/appointments?userId=${testUser._id}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });

    test('should support status query parameter', async () => {
      await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up',
        status: 'completed'
      });

      const response = await request(app).get('/api/appointments?status=completed');

      expect(response.status).toBe(200);
      expect(response.body.data[0].status).toBe('completed');
    });
  });

  describe('GET /api/appointments/:id', () => {
    test('should be accessible', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      const response = await request(app).get(`/api/appointments/${appointment._id}`);
      expect(response.status).toBe(200);
    });

    test('should return appointment with populated user', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      const response = await request(app).get(`/api/appointments/${appointment._id}`);

      expect(response.body.success).toBe(true);
      expect(response.body.data.userId.name).toBe('Test User');
    });
  });

  describe('POST /api/appointments', () => {
    test('should be accessible', async () => {
      const response = await request(app)
        .post('/api/appointments')
        .send({
          userId: testUser._id,
          doctorName: 'Dr. Smith',
          specialty: 'cardiology',
          appointmentDate: new Date(),
          reason: 'Check-up'
        });

      expect(response.status).toBe(201);
    });

    test('should create appointment through route', async () => {
      const appointmentData = {
        userId: testUser._id,
        doctorName: 'Dr. Johnson',
        specialty: 'dermatology',
        appointmentDate: new Date('2024-12-20'),
        reason: 'Skin consultation',
        location: 'City Hospital'
      };

      const response = await request(app)
        .post('/api/appointments')
        .send(appointmentData);

      expect(response.body.success).toBe(true);
      expect(response.body.data.doctorName).toBe('Dr. Johnson');
      expect(response.body.data.specialty).toBe('dermatology');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/appointments')
        .send({
          userId: testUser._id,
          doctorName: 'Dr. Smith'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/appointments/:id', () => {
    test('should be accessible', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      const response = await request(app)
        .put(`/api/appointments/${appointment._id}`)
        .send({ status: 'completed' });

      expect(response.status).toBe(200);
    });

    test('should update appointment through route', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      const response = await request(app)
        .put(`/api/appointments/${appointment._id}`)
        .send({ 
          status: 'rescheduled',
          notes: 'Rescheduled for next week'
        });

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('rescheduled');
      expect(response.body.data.notes).toBe('Rescheduled for next week');
    });

    test('should validate updated data', async () => {
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
  });

  describe('DELETE /api/appointments/:id', () => {
    test('should be accessible', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      const response = await request(app).delete(`/api/appointments/${appointment._id}`);
      expect(response.status).toBe(200);
    });

    test('should delete appointment through route', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      const response = await request(app).delete(`/api/appointments/${appointment._id}`);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Appointment deleted successfully');

      const deletedAppointment = await Appointment.findById(appointment._id);
      expect(deletedAppointment).toBeNull();
    });

    test('should return 404 for non-existent appointment', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/api/appointments/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Route Error Handling', () => {
    test('should handle non-existent routes', async () => {
      const response = await request(app).get('/api/appointments/nonexistent/route');
      expect(response.status).toBe(404);
    });
  });
});