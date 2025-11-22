import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as activityService from './activityService';
import api from '../utils/api';

vi.mock('../utils/api');

describe('Activity Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getActivities', () => {
    it('should fetch all activities', async () => {
      const mockActivities = {
        data: {
          success: true,
          data: [
            { _id: '1', activityType: 'running', duration: 30 },
            { _id: '2', activityType: 'cycling', duration: 45 },
          ],
        },
      };

      api.get.mockResolvedValue(mockActivities);

      const result = await activityService.getActivities();

      expect(api.get).toHaveBeenCalledWith('/activities');
      expect(result.data).toEqual(mockActivities.data.data);
    });

    it('should fetch activities by userId', async () => {
      const mockActivities = {
        data: {
          success: true,
          data: [{ _id: '1', activityType: 'running', duration: 30 }],
        },
      };

      api.get.mockResolvedValue(mockActivities);

      const result = await activityService.getActivities('user123');

      expect(api.get).toHaveBeenCalledWith('/activities?userId=user123');
      expect(result.data).toEqual(mockActivities.data.data);
    });
  });

  describe('createActivity', () => {
    it('should create a new activity', async () => {
      const newActivity = {
        userId: 'user123',
        activityType: 'running',
        duration: 30,
      };
      const mockResponse = {
        data: {
          success: true,
          data: { _id: '3', ...newActivity },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await activityService.createActivity(newActivity);

      expect(api.post).toHaveBeenCalledWith('/activities', newActivity);
      expect(result.data).toEqual(mockResponse.data.data);
    });
  });



  describe('deleteActivity', () => {
  it('should delete an activity', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'Activity deleted successfully',
      },
    };

    api.delete.mockResolvedValue(mockResponse);

    const result = await activityService.deleteActivity('1');

    expect(api.delete).toHaveBeenCalledWith('/activities/1');
    expect(result.success).toBe(true);
  });
});
});