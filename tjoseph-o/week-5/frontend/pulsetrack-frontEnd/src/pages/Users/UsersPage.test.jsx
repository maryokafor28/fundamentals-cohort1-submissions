import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UsersPage from './UsersPage';
import * as userService from '../../services/userService';

vi.mock('../../services/userService');

describe('UsersPage Component', () => {
  const mockUsers = [
    { _id: '1', name: 'John Doe', email: 'john@example.com', age: 30 },
    { _id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render users page title', async () => {
    userService.getUsers.mockResolvedValue({ data: mockUsers });

    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('Users')).toBeInTheDocument();
    });
  });

  it('should show user list by default', async () => {
    userService.getUsers.mockResolvedValue({ data: mockUsers });

    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should show form when add user button clicked', async () => {
    const user = userEvent.setup();
    userService.getUsers.mockResolvedValue({ data: mockUsers });

    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add user/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
  });

  it('should create user and refresh list', async () => {
    const user = userEvent.setup();
    userService.getUsers.mockResolvedValue({ data: mockUsers });
    userService.createUser.mockResolvedValue({
      data: { _id: '3', name: 'New User', email: 'new@example.com' }
    });

    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add user/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/name/i), 'New User');
    await user.type(screen.getByLabelText(/email/i), 'new@example.com');
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(userService.createUser).toHaveBeenCalledWith({
        name: 'New User',
        email: 'new@example.com',
      });
    });
  });

  it('should cancel form and return to list', async () => {
    const user = userEvent.setup();
    userService.getUsers.mockResolvedValue({ data: mockUsers });

    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add user/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('should show error message on create failure', async () => {
    const user = userEvent.setup();
    userService.getUsers.mockResolvedValue({ data: mockUsers });
    userService.createUser.mockRejectedValue(new Error('Failed to create'));
    
    global.alert = vi.fn();

    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add user/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/name/i), 'New User');
    await user.type(screen.getByLabelText(/email/i), 'new@example.com');
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    });
  });
});