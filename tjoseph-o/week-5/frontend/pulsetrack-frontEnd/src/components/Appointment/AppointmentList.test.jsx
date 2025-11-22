import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppointmentList from './AppointmentList';
import * as appointmentService from '../../services/appointmentService';

vi.mock('../../services/appointmentService');

describe('AppointmentList Component', () => {
  const mockAppointments = [
    {
      _id: '1',
      doctorName: 'Dr. Smith',
      specialty: 'cardiology',
      appointmentDate: '2024-12-20T10:00:00Z',
      reason: 'Annual check-up',
      status: 'scheduled',
      location: 'City Hospital',
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

  const mockOnAddAppointment = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.confirm = vi.fn(() => true);
  });

  it('should render loading state initially', () => {
    appointmentService.getAppointments.mockImplementation(() => new Promise(() => {}));
    
    render(<AppointmentList onAddAppointment={mockOnAddAppointment} />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render appointments after loading', async () => {
    appointmentService.getAppointments.mockResolvedValue({ data: mockAppointments });

    render(<AppointmentList onAddAppointment={mockOnAddAppointment} />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
      expect(screen.getByText('Dr. Johnson')).toBeInTheDocument();
    });
  });

  it('should render empty state when no appointments', async () => {
    appointmentService.getAppointments.mockResolvedValue({ data: [] });

    render(<AppointmentList onAddAppointment={mockOnAddAppointment} />);

    await waitFor(() => {
      expect(screen.getByText(/no appointments found/i)).toBeInTheDocument();
    });
  });

  it('should render error message on failure', async () => {
    appointmentService.getAppointments.mockRejectedValue(new Error('Failed to fetch'));

    render(<AppointmentList onAddAppointment={mockOnAddAppointment} />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should call delete handler when delete button clicked', async () => {
    const user = userEvent.setup();
    appointmentService.getAppointments.mockResolvedValue({ data: mockAppointments });
    appointmentService.deleteAppointment.mockResolvedValue({ success: true });

    render(<AppointmentList onAddAppointment={mockOnAddAppointment} />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(appointmentService.deleteAppointment).toHaveBeenCalledWith('1');
    });
  });

  it('should have add appointment button', async () => {
    appointmentService.getAppointments.mockResolvedValue({ data: mockAppointments });

    render(<AppointmentList onAddAppointment={mockOnAddAppointment} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add appointment/i })).toBeInTheDocument();
    });
  });

  it('should call onAddAppointment when add button clicked', async () => {
    const user = userEvent.setup();
    appointmentService.getAppointments.mockResolvedValue({ data: mockAppointments });

    render(<AppointmentList onAddAppointment={mockOnAddAppointment} />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add appointment/i });
    await user.click(addButton);

    expect(mockOnAddAppointment).toHaveBeenCalled();
  });

  it('should display appointment details', async () => {
    appointmentService.getAppointments.mockResolvedValue({ data: mockAppointments });

    render(<AppointmentList onAddAppointment={mockOnAddAppointment} />);

    await waitFor(() => {
      expect(screen.getByText('cardiology')).toBeInTheDocument();
      expect(screen.getByText(/Annual check-up/i)).toBeInTheDocument();
      expect(screen.getByText(/City Hospital/i)).toBeInTheDocument();
    });
  });

  it('should update appointment status', async () => {
    const user = userEvent.setup();
    appointmentService.getAppointments.mockResolvedValue({ data: mockAppointments });
    appointmentService.updateAppointment.mockResolvedValue({
      data: { ...mockAppointments[0], status: 'completed' }
    });

    render(<AppointmentList onAddAppointment={mockOnAddAppointment} />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    const completeButtons = screen.getAllByRole('button', { name: /complete/i });
    await user.click(completeButtons[0]);

    await waitFor(() => {
      expect(appointmentService.updateAppointment).toHaveBeenCalledWith('1', { status: 'completed' });
    });
  });
});