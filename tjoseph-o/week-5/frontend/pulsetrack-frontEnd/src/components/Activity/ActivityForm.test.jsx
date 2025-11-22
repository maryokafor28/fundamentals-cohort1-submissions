import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivityForm from './ActivityForm';

describe('ActivityForm Component', () => {
  const mockUsers = [
    { _id: 'user1', name: 'John Doe' },
    { _id: 'user2', name: 'Jane Smith' },
  ];

  it('should render form with all fields', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ActivityForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} users={mockUsers} />);

    expect(screen.getByLabelText(/user/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/activity type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/distance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/calories/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('should call onSubmit with form data when submitted', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ActivityForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} users={mockUsers} />);

    await user.selectOptions(screen.getByLabelText(/user/i), 'user1');
    await user.selectOptions(screen.getByLabelText(/activity type/i), 'running');
    await user.type(screen.getByLabelText(/duration/i), '30');

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user1',
          activityType: 'running',
          duration: 30,
        })
      );
    });
  });

  it('should show validation error for empty userId', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ActivityForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} users={mockUsers} />);

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/user is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show validation error for empty activityType', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ActivityForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} users={mockUsers} />);

    await user.selectOptions(screen.getByLabelText(/user/i), 'user1');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/activity type is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show validation error for empty duration', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ActivityForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} users={mockUsers} />);

    await user.selectOptions(screen.getByLabelText(/user/i), 'user1');
    await user.selectOptions(screen.getByLabelText(/activity type/i), 'running');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/duration is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onCancel when cancel button clicked', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ActivityForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} users={mockUsers} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnCancel).toHaveBeenCalled();
  });
});