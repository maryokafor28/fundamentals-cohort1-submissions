import React, { useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useStore from '../store/useStore';
import UserList from '../components/UserList';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { User, CreateUserDto, UpdateUserDto } from '../types';

const UsersPage: React.FC = () => {
  const {
    users,
    totalUsers,
    isLoadingUsers,
    userError,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    clearErrors,
  } = useStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<CreateUserDto>({
    name: '',
    email: '',
    balance: 0,
  });

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      toast.success('User created successfully!');
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    try {
      await updateUser(selectedUser.id, formData as UpdateUserDto);
      toast.success('User updated successfully!');
      setIsEditModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        toast.success('User deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      balance: user.balance,
    });
    setIsEditModalOpen(true);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      balance: 0,
    });
    setSelectedUser(null);
  };

  const handleRefresh = () => {
    fetchUsers(currentPage);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="mt-2 text-gray-600">
            Manage user accounts and balances ({totalUsers} total users)
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="btn btn-secondary flex items-center space-x-2"
            disabled={isLoadingUsers}
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingUsers ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {userError && (
        <ErrorMessage
          message={userError}
          onClose={clearErrors}
          type="error"
        />
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {isLoadingUsers ? (
          <div className="p-8">
            <Loader size="medium" message="Loading users..." />
          </div>
        ) : (
          <UserList
            users={users}
            onEdit={handleEdit}
            onDelete={handleDeleteUser}
            onView={handleView}
          />
        )}
      </div>

      {/* Pagination */}
      {totalUsers > 10 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {Math.ceil(totalUsers / 10)}
          </span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage >= Math.ceil(totalUsers / 10)}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create New User"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              required
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Balance
            </label>
            <input
              type="number"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
              className="input"
              step="0.01"
              placeholder="1000.00"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create User
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Edit User"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Balance
            </label>
            <input
              type="number"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
              className="input"
              step="0.01"
              placeholder="1000.00"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update User
            </button>
          </div>
        </form>
      </Modal>

      {/* View User Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">ID</p>
              <p className="mt-1 text-sm text-gray-900">{selectedUser.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="mt-1 text-sm text-gray-900">{selectedUser.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Balance</p>
              <p className={`mt-1 text-lg font-semibold ${
                selectedUser.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(selectedUser.balance)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Updated At</p>
              <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.updatedAt)}</p>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedUser(null);
                }}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UsersPage;
