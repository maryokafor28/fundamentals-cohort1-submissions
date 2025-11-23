import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivitiesPage from './ActivitiesPage';
import * as activityService from '../../services/activityService';
import * as userService from '../../services/userService';

vi.mock('../../services/activityService');
vi.mock('../../services/userService');

describe('ActivitiesPage Component', () => {
  const mockActivities = [
    {
      _id: '1',
      activityType: 'running',
      duration: 30,
      distance: 5,
      date: '2024-12-01T10:00:00Z',
      userId: { _id: 'user1', name: 'John Doe' }
    },
    {
      _id: '2',
      activityType: 'cycling',
      duration: 45,
      date: '2024-12-02T10:00:00Z',
      userId: { _id: 'user1', name: 'John Doe' }
    },
  ];

  const mockUsers = [
    { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
    { _id: 'user2', name: 'Jane Smith', email: 'jane@example.com' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render activities page title', async () => {
    activityService.getActivities.mockResolvedValue({ data: mockActivities });
    userService.getUsers.mockResolvedValue({ data: mockUsers });

    render(<ActivitiesPage />);

    await waitFor(() => {
      expect(screen.getByText('Activities')).toBeInTheDocument();
    });
  });

  it('should show activity list by default', async () => {
    activityService.getActivities.mockResolvedValue({ data: mockActivities });
    userService.getUsers.mockResolvedValue({ data: mockUsers });

    render(<ActivitiesPage />);

    await waitFor(() => {
      expect(screen.getByText(/running/i)).toBeInTheDocument();
      expect(screen.getByText(/cycling/i)).toBeInTheDocument();
    });
  });

  it('should show form when add activity button clicked', async () => {
    const user = userEvent.setup();
    activityService.getActivities.mockResolvedValue({ data: mockActivities });
    userService.getUsers.mockResolvedValue({ data: mockUsers });

    render(<ActivitiesPage />);

    await waitFor(() => {
      expect(screen.getByText(/running/i)).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add activity/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/user/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/activity type/i)).toBeInTheDocument();
    });
  });

  it('should create activity and refresh list', async () => {
    const user = userEvent.setup();
    activityService.getActivities.mockResolvedValue({ data: mockActivities });
    userService.getUsers.mockResolvedValue({ data: mockUsers });
    activityService.createActivity.mockResolvedValue({
      data: { _id: '3', activityType: 'swimming', duration: 60 }
    });

    render(<ActivitiesPage />);

    await waitFor(() => {
      expect(screen.getByText(/running/i)).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add activity/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/user/i)).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByLabelText(/user/i), 'user1');
    await user.selectOptions(screen.getByLabelText(/activity type/i), 'swimming');
    await user.type(screen.getByLabelText(/duration/i), '60');
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(activityService.createActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user1',
          activityType: 'swimming',
          duration: 60,
        })
      );
    });
  });

  it('should cancel form and return to list', async () => {
    const user = userEvent.setup();
    activityService.getActivities.mockResolvedValue({ data: mockActivities });
    userService.getUsers.mockResolvedValue({ data: mockUsers });

    render(<ActivitiesPage />);

    await waitFor(() => {
      expect(screen.getByText(/running/i)).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add activity/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/user/i)).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText(/running/i)).toBeInTheDocument();
    });
  });

  it('should show error message on create failure', async () => {
    const user = userEvent.setup();
    activityService.getActivities.mockResolvedValue({ data: mockActivities });
    userService.getUsers.mockResolvedValue({ data: mockUsers });
    activityService.createActivity.mockRejectedValue(new Error('Failed to create'));
    
    global.alert = vi.fn();

    render(<ActivitiesPage />);

    await waitFor(() => {
      expect(screen.getByText(/running/i)).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add activity/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/user/i)).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByLabelText(/user/i), 'user1');
    await user.selectOptions(screen.getByLabelText(/activity type/i), 'running');
    await user.type(screen.getByLabelText(/duration/i), '30');
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    });
  });
});