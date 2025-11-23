import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserList from './UserList';
import * as userService from '../../services/userService';

vi.mock('../../services/userService');

describe('UserList Component', () => {
  const mockUsers = [
    { _id: '1', name: 'John Doe', email: 'john@example.com', age: 30 },
    { _id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  ];

  const mockOnAddUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.confirm = vi.fn(() => true);
  });

  it('should render loading state initially', () => {
    userService.getUsers.mockImplementation(() => new Promise(() => {}));
    
    render(<UserList onAddUser={mockOnAddUser} />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render users after loading', async () => {
    userService.getUsers.mockResolvedValue({ data: mockUsers });

    render(<UserList onAddUser={mockOnAddUser} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should render empty state when no users', async () => {
    userService.getUsers.mockResolvedValue({ data: [] });

    render(<UserList onAddUser={mockOnAddUser} />);

    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeInTheDocument();
    });
  });

  it('should render error message on failure', async () => {
    userService.getUsers.mockRejectedValue(new Error('Failed to fetch'));

    render(<UserList onAddUser={mockOnAddUser} />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should call delete handler when delete button clicked', async () => {
    const user = userEvent.setup();
    userService.getUsers.mockResolvedValue({ data: mockUsers });
    userService.deleteUser.mockResolvedValue({ success: true });

    render(<UserList onAddUser={mockOnAddUser} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(userService.deleteUser).toHaveBeenCalledWith('1');
    });
  });

  it('should have add user button', async () => {
    userService.getUsers.mockResolvedValue({ data: mockUsers });

    render(<UserList onAddUser={mockOnAddUser} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument();
    });
  });

  it('should call onAddUser when add button clicked', async () => {
    const user = userEvent.setup();
    userService.getUsers.mockResolvedValue({ data: mockUsers });

    render(<UserList onAddUser={mockOnAddUser} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add user/i });
    await user.click(addButton);

    expect(mockOnAddUser).toHaveBeenCalled();
  });
});