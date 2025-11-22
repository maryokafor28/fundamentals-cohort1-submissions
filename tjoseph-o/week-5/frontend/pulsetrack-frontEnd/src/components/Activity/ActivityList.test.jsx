import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivityList from './ActivityList';
import * as activityService from '../../services/activityService';

vi.mock('../../services/activityService');

describe('ActivityList Component', () => {
  const mockActivities = [
    {
      _id: '1',
      activityType: 'running',
      duration: 30,
      distance: 5,
      caloriesBurned: 300,
      date: '2024-12-01T10:00:00Z',
      userId: { _id: 'user1', name: 'John Doe', email: 'john@example.com' }
    },
    {
      _id: '2',
      activityType: 'cycling',
      duration: 45,
      distance: 10,
      caloriesBurned: 400,
      date: '2024-12-02T10:00:00Z',
      userId: { _id: 'user1', name: 'John Doe', email: 'john@example.com' }
    },
  ];

  const mockOnAddActivity = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.confirm = vi.fn(() => true);
  });

  it('should render loading state initially', () => {
    activityService.getActivities.mockImplementation(() => new Promise(() => {}));
    
    render(<ActivityList onAddActivity={mockOnAddActivity} />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render activities after loading', async () => {
    activityService.getActivities.mockResolvedValue({ data: mockActivities });

    render(<ActivityList onAddActivity={mockOnAddActivity} />);

    await waitFor(() => {
      expect(screen.getByText(/running/i)).toBeInTheDocument();
      expect(screen.getByText(/cycling/i)).toBeInTheDocument();
    });
  });

  it('should render empty state when no activities', async () => {
    activityService.getActivities.mockResolvedValue({ data: [] });

    render(<ActivityList onAddActivity={mockOnAddActivity} />);

    await waitFor(() => {
      expect(screen.getByText(/no activities found/i)).toBeInTheDocument();
    });
  });

  it('should render error message on failure', async () => {
    activityService.getActivities.mockRejectedValue(new Error('Failed to fetch'));

    render(<ActivityList onAddActivity={mockOnAddActivity} />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should call delete handler when delete button clicked', async () => {
    const user = userEvent.setup();
    activityService.getActivities.mockResolvedValue({ data: mockActivities });
    activityService.deleteActivity.mockResolvedValue({ success: true });

    render(<ActivityList onAddActivity={mockOnAddActivity} />);

    await waitFor(() => {
      expect(screen.getByText(/running/i)).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(activityService.deleteActivity).toHaveBeenCalledWith('1');
    });
  });

  it('should have add activity button', async () => {
    activityService.getActivities.mockResolvedValue({ data: mockActivities });

    render(<ActivityList onAddActivity={mockOnAddActivity} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add activity/i })).toBeInTheDocument();
    });
  });

  it('should call onAddActivity when add button clicked', async () => {
    const user = userEvent.setup();
    activityService.getActivities.mockResolvedValue({ data: mockActivities });

    render(<ActivityList onAddActivity={mockOnAddActivity} />);

    await waitFor(() => {
      expect(screen.getByText(/running/i)).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add activity/i });
    await user.click(addButton);

    expect(mockOnAddActivity).toHaveBeenCalled();
  });

  it('should display activity details', async () => {
    activityService.getActivities.mockResolvedValue({ data: mockActivities });

    render(<ActivityList onAddActivity={mockOnAddActivity} />);

    await waitFor(() => {
      expect(screen.getByText(/30 minutes/i)).toBeInTheDocument();
      expect(screen.getByText(/5 km/i)).toBeInTheDocument();
      expect(screen.getByText(/300 cal/i)).toBeInTheDocument();
    });
  });
});