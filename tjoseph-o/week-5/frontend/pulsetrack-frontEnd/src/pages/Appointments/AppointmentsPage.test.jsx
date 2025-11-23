import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppointmentsPage from './AppointmentsPage';
import * as appointmentService from '../../services/appointmentService';
import * as userService from '../../services/userService';

vi.mock('../../services/appointmentService');
vi.mock('../../services/userService');

describe('AppointmentsPage Component', () => {
  const mockAppointments = [
    {
      _id: '1',
      doctorName: 'Dr. Smith',
      specialty: 'cardiology',
      appointmentDate: '2024-12-20T10:00:00Z',
      reason: 'Annual check-up',
      status: 'scheduled',
      userId: { _id: 'user1', name: 'John Doe' }
    },
    {
      _id: '2',
      doctorName: 'Dr. Johnson',
      specialty: 'dermatology',
      appointmentDate: '2024-12-25T14:00:00Z',
      reason: 'Skin consultation',
      status: 'scheduled',
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

  it('should render appointments page title', async () => {
    appointmentService.getAppointments.mockResolvedValue({ data: mockAppointments });
    userService.getUsers.mockResolvedValue({ data: mockUsers });

    render(<AppointmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Appointments')).toBeInTheDocument();
    });
  });

  it('should show appointment list by default', async () => {
    appointmentService.getAppointments.mockResolvedValue({ data: mockAppointments });
    userService.getUsers.mockResolvedValue({ data: mockUsers });

    render(<AppointmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
      expect(screen.getByText('Dr. Johnson')).toBeInTheDocument();
    });
  });

  it('should show form when add appointment button clicked', async () => {
    const user = userEvent.setup();
    appointmentService.getAppointments.mockResolvedValue({ data: mockAppointments });
    userService.getUsers.mockResolvedValue({ data: mockUsers });

    render(<AppointmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add appointment/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/user/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/doctor name/i)).toBeInTheDocument();
    });
  });

  it('should create appointment and refresh list', async () => {
    const user = userEvent.setup();
    appointmentService.getAppointments.mockResolvedValue({ data: mockAppointments });
    userService.getUsers.mockResolvedValue({ data: mockUsers });
    appointmentService.createAppointment.mockResolvedValue({
      data: {
        _id: '3',
        doctorName: 'Dr. Williams',
        specialty: 'orthopedics',
        appointmentDate: '2024-12-30T10:00:00Z',
        reason: 'Knee pain'
      }
    });

    render(<AppointmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add appointment/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/user/i)).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByLabelText(/user/i), 'user1');
    await user.type(screen.getByLabelText(/doctor name/i), 'Dr. Williams');
    await user.selectOptions(screen.getByLabelText(/specialty/i), 'orthopedics');
    await user.type(screen.getByLabelText(/reason/i), 'Knee pain');
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(appointmentService.createAppointment).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user1',
          doctorName: 'Dr. Williams',
          specialty: 'orthopedics',
          reason: 'Knee pain',
        })
      );
    });
  });

  it('should cancel form and return to list', async () => {
    const user = userEvent.setup();
    appointmentService.getAppointments.mockResolvedValue({ data: mockAppointments });
    userService.getUsers.mockResolvedValue({ data: mockUsers });

    render(<AppointmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add appointment/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/user/i)).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });
  });

  it('should show error message on create failure', async () => {
    const user = userEvent.setup();
    appointmentService.getAppointments.mockResolvedValue({ data: mockAppointments });
    userService.getUsers.mockResolvedValue({ data: mockUsers });
    appointmentService.createAppointment.mockRejectedValue(new Error('Failed to create'));
    
    global.alert = vi.fn();

    render(<AppointmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add appointment/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/user/i)).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByLabelText(/user/i), 'user1');
    await user.type(screen.getByLabelText(/doctor name/i), 'Dr. Test');
    await user.selectOptions(screen.getByLabelText(/specialty/i), 'general');
    await user.type(screen.getByLabelText(/reason/i), 'Test reason');
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    });
  });
});