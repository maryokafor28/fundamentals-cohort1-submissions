const mongoose = require('mongoose');
const Appointment = require('../../../src/models/Appointment');
const User = require('../../../src/models/User');
const dbHandler = require('../../setup/db-handler');

describe('Appointment Model', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  describe('Model Definition', () => {
    test('should be defined', () => {
      expect(Appointment).toBeDefined();
    });

    test('should be a Mongoose model', () => {
      expect(Appointment.prototype).toBeInstanceOf(mongoose.Model);
    });
  });

  describe('Required Fields', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    test('should require userId field', async () => {
      const appointment = new Appointment({
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      let error;
      try {
        await appointment.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.userId).toBeDefined();
      expect(error.errors.userId.kind).toBe('required');
    });

    test('should require doctorName field', async () => {
      const appointment = new Appointment({
        userId: testUser._id,
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      let error;
      try {
        await appointment.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.doctorName).toBeDefined();
      expect(error.errors.doctorName.kind).toBe('required');
    });

    test('should require specialty field', async () => {
      const appointment = new Appointment({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      let error;
      try {
        await appointment.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.specialty).toBeDefined();
      expect(error.errors.specialty.kind).toBe('required');
    });

    test('should require appointmentDate field', async () => {
      const appointment = new Appointment({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        reason: 'Check-up'
      });

      let error;
      try {
        await appointment.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.appointmentDate).toBeDefined();
      expect(error.errors.appointmentDate.kind).toBe('required');
    });

    test('should require reason field', async () => {
      const appointment = new Appointment({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date()
      });

      let error;
      try {
        await appointment.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.reason).toBeDefined();
      expect(error.errors.reason.kind).toBe('required');
    });
  });

  describe('Specialty Validation', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    test('should validate specialty enum', async () => {
      const appointment = new Appointment({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'invalid_specialty',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      let error;
      try {
        await appointment.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.specialty).toBeDefined();
    });

    test('should accept valid specialty values', async () => {
      const validSpecialties = ['general', 'cardiology', 'dermatology', 'orthopedics', 'pediatrics', 'psychiatry', 'other'];

      for (const specialty of validSpecialties) {
        const appointment = await Appointment.create({
          userId: testUser._id,
          doctorName: 'Dr. Smith',
          specialty,
          appointmentDate: new Date(),
          reason: 'Check-up'
        });

        expect(appointment.specialty).toBe(specialty);
      }
    });
  });

  describe('Status Field', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    test('should default status to scheduled', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      expect(appointment.status).toBe('scheduled');
    });

    test('should validate status enum', async () => {
      const appointment = new Appointment({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up',
        status: 'invalid_status'
      });

      let error;
      try {
        await appointment.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.status).toBeDefined();
    });

    test('should accept valid status values', async () => {
      const validStatuses = ['scheduled', 'completed', 'cancelled', 'rescheduled'];

      for (const status of validStatuses) {
        const appointment = await Appointment.create({
          userId: testUser._id,
          doctorName: 'Dr. Smith',
          specialty: 'cardiology',
          appointmentDate: new Date(),
          reason: 'Check-up',
          status
        });

        expect(appointment.status).toBe(status);
      }
    });
  });

  describe('Optional Fields', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    test('should save appointment without optional fields', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      expect(appointment.notes).toBeUndefined();
      expect(appointment.location).toBeUndefined();
    });

    test('should save appointment with all optional fields', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up',
        notes: 'Bring previous test results',
        location: 'City Hospital, Room 301'
      });

      expect(appointment.notes).toBe('Bring previous test results');
      expect(appointment.location).toBe('City Hospital, Room 301');
    });

    test('should reject reason longer than 500 characters', async () => {
      const longReason = 'a'.repeat(501);
      const appointment = new Appointment({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: longReason
      });

      let error;
      try {
        await appointment.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.reason).toBeDefined();
    });

    test('should reject notes longer than 1000 characters', async () => {
      const longNotes = 'a'.repeat(1001);
      const appointment = new Appointment({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up',
        notes: longNotes
      });

      let error;
      try {
        await appointment.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.notes).toBeDefined();
    });
  });

  describe('DoctorName Field', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    test('should trim whitespace from doctorName', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: '  Dr. Smith  ',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      expect(appointment.doctorName).toBe('Dr. Smith');
    });
  });

  describe('Location Field', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    test('should trim whitespace from location', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up',
        location: '  City Hospital  '
      });

      expect(appointment.location).toBe('City Hospital');
    });
  });

  describe('Timestamps', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    test('should have createdAt timestamp', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      expect(appointment.createdAt).toBeDefined();
      expect(appointment.createdAt).toBeInstanceOf(Date);
    });

    test('should have updatedAt timestamp', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      expect(appointment.updatedAt).toBeDefined();
      expect(appointment.updatedAt).toBeInstanceOf(Date);
    });

    test('should update updatedAt on modification', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      const originalUpdatedAt = appointment.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 100));

      appointment.status = 'completed';
      await appointment.save();

      expect(appointment.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('User Relationship', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    test('should reference User model', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      expect(appointment.userId.toString()).toBe(testUser._id.toString());
    });

    test('should populate user information', async () => {
      const appointment = await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      const populatedAppointment = await Appointment.findById(appointment._id).populate('userId');

      expect(populatedAppointment.userId.name).toBe('Test User');
      expect(populatedAppointment.userId.email).toBe('test@example.com');
    });

    test('should allow multiple appointments for one user', async () => {
      await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up'
      });

      await Appointment.create({
        userId: testUser._id,
        doctorName: 'Dr. Johnson',
        specialty: 'dermatology',
        appointmentDate: new Date(),
        reason: 'Skin consultation'
      });

      const userAppointments = await Appointment.find({ userId: testUser._id });
      expect(userAppointments).toHaveLength(2);
    });
  });

  describe('Indexes', () => {
    test('should have index on userId and appointmentDate', async () => {
      const indexes = Appointment.schema.indexes();
      const hasUserDateIndex = indexes.some(index => 
        index[0].userId === 1 && index[0].appointmentDate === 1
      );

      expect(hasUserDateIndex).toBe(true);
    });

    test('should have index on status', async () => {
      const indexes = Appointment.schema.indexes();
      const hasStatusIndex = indexes.some(index => 
        index[0].status === 1
      );

      expect(hasStatusIndex).toBe(true);
    });
  });
});