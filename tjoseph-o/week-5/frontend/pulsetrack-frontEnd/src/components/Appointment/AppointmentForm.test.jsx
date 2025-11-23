import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppointmentForm from './AppointmentForm';

describe('AppointmentForm Component', () => {
  const mockUsers = [
    { _id: 'user1', name: 'John Doe' },
    { _id: 'user2', name: 'Jane Smith' },
  ];

  it('should render form with all fields', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<AppointmentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} users={mockUsers} />);

    expect(screen.getByLabelText(/user/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/doctor name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/specialty/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/appointment date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reason/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('should call onSubmit with form data when submitted', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<AppointmentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} users={mockUsers} />);

    await user.selectOptions(screen.getByLabelText(/user/i), 'user1');
    await user.type(screen.getByLabelText(/doctor name/i), 'Dr. Smith');
    await user.selectOptions(screen.getByLabelText(/specialty/i), 'cardiology');
    await user.type(screen.getByLabelText(/reason/i), 'Annual check-up');

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user1',
          doctorName: 'Dr. Smith',
          specialty: 'cardiology',
          reason: 'Annual check-up',
        })
      );
    });
  });

  it('should show validation errors for required fields', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<AppointmentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} users={mockUsers} />);

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/user is required/i)).toBeInTheDocument();
      expect(screen.getByText(/doctor name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/specialty is required/i)).toBeInTheDocument();
      expect(screen.getByText(/reason is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onCancel when cancel button clicked', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<AppointmentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} users={mockUsers} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnCancel).toHaveBeenCalled();
  });
});