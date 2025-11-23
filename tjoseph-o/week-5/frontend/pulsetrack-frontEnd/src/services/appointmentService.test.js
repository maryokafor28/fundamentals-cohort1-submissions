import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as appointmentService from './appointmentService';
import api from '../utils/api';

vi.mock('../utils/api');

describe('Appointment Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAppointments', () => {
    it('should fetch all appointments', async () => {
      const mockAppointments = {
        data: {
          success: true,
          data: [
            { _id: '1', doctorName: 'Dr. Smith', specialty: 'cardiology' },
            { _id: '2', doctorName: 'Dr. Johnson', specialty: 'dermatology' },
          ],
        },
      };

      api.get.mockResolvedValue(mockAppointments);

      const result = await appointmentService.getAppointments();

      expect(api.get).toHaveBeenCalledWith('/appointments');
      expect(result.data).toEqual(mockAppointments.data.data);
    });

    it('should fetch appointments by userId', async () => {
      const mockAppointments = {
        data: {
          success: true,
          data: [{ _id: '1', doctorName: 'Dr. Smith' }],
        },
      };

      api.get.mockResolvedValue(mockAppointments);

      const result = await appointmentService.getAppointments('user123');

      expect(api.get).toHaveBeenCalledWith('/appointments?userId=user123');
      expect(result.data).toEqual(mockAppointments.data.data);
    });
  });

  describe('createAppointment', () => {
    it('should create a new appointment', async () => {
      const newAppointment = {
        userId: 'user123',
        doctorName: 'Dr. Smith',
        specialty: 'cardiology',
        appointmentDate: new Date(),
        reason: 'Check-up',
      };
      const mockResponse = {
        data: {
          success: true,
          data: { _id: '3', ...newAppointment },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await appointmentService.createAppointment(newAppointment);

      expect(api.post).toHaveBeenCalledWith('/appointments', newAppointment);
      expect(result.data).toEqual(mockResponse.data.data);
    });
  });

  describe('updateAppointment', () => {
    it('should update an appointment', async () => {
      const updateData = { status: 'completed' };
      const mockResponse = {
        data: {
          success: true,
          data: { _id: '1', status: 'completed' },
        },
      };

      api.put.mockResolvedValue(mockResponse);

      const result = await appointmentService.updateAppointment('1', updateData);

      expect(api.put).toHaveBeenCalledWith('/appointments/1', updateData);
      expect(result.data).toEqual(mockResponse.data.data);
    });
  });
});