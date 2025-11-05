import React, { useEffect, useState } from 'react';
import { Plus, RefreshCw, Filter, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useStore from '../store/useStore';
import TransactionList from '../components/TransactionList';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { CreateTransactionDto } from '../types';

const TransactionsPage: React.FC = () => {
  const {
    users,
    transactions,
    totalTransactions,
    isLoadingTransactions,
    transactionError,
    fetchTransactions,
    fetchUsers,
    createTransaction,
    clearErrors,
  } = useStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterUserId, setFilterUserId] = useState<string>('');
  const [filterType, setFilterType] = useState<'' | 'credit' | 'debit'>('');
  const [filterStatus, setFilterStatus] = useState<'' | 'pending' | 'successful' | 'failed'>('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [formData, setFormData] = useState<CreateTransactionDto>({
    userId: '',
    type: 'credit',
    amount: 0,
  });

  useEffect(() => {
    fetchUsers();
    fetchTransactions(currentPage, 10, filterUserId || undefined);
  }, [currentPage, filterUserId]);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTransaction(formData);
      toast.success('Transaction created successfully!');
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to create transaction');
    }
  };

  const handleSimulateTransactions = async () => {
    if (users.length === 0) {
      toast.error('Please create users first before simulating transactions');
      return;
    }

    setIsSimulating(true);
    const transactionTypes: Array<'credit' | 'debit'> = ['credit', 'debit'];
    const amounts = [10, 25, 50, 100, 250, 500, 1000];
    
    try {
      // Simulate 5 random transactions
      for (let i = 0; i < 5; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
        const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
        
        await createTransaction({
          userId: randomUser.id,
          type: randomType,
          amount: randomAmount,
        });
        
        // Small delay between transactions
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      toast.success('Successfully simulated 5 transactions!');
      fetchTransactions(currentPage);
    } catch (error) {
      toast.error('Failed to simulate transactions');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleRefresh = () => {
    fetchTransactions(currentPage, 10, filterUserId || undefined);
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      type: 'credit',
      amount: 0,
    });
  };

  const handleApplyFilters = () => {
    fetchTransactions(1, 10, filterUserId || undefined);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterUserId('');
    setFilterType('');
    setFilterStatus('');
    fetchTransactions(1);
    setCurrentPage(1);
  };

  const handleExportTransactions = () => {
    const csv = [
      ['ID', 'User', 'Type', 'Amount', 'Status', 'Timestamp'],
      ...transactions.map(t => [
        t.id,
        t.user?.name || 'Unknown',
        t.type,
        t.amount.toString(),
        t.status,
        t.timestamp,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Transactions exported successfully!');
  };

  const getTransactionSummary = () => {
    const credits = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
    const debits = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
    const net = credits - debits;
    
    return {
      credits: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(credits),
      debits: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(debits),
      net: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(net),
      netColor: net >= 0 ? 'text-green-600' : 'text-red-600',
    };
  };

  const summary = getTransactionSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="mt-2 text-gray-600">
            Monitor and simulate financial transactions ({totalTransactions} total)
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={handleExportTransactions}
            className="btn btn-secondary flex items-center space-x-2"
            disabled={transactions.length === 0}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={handleRefresh}
            className="btn btn-secondary flex items-center space-x-2"
            disabled={isLoadingTransactions}
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingTransactions ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-medium text-green-600">Total Credits</p>
          <p className="mt-1 text-2xl font-bold text-green-700">{summary.credits}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-medium text-red-600">Total Debits</p>
          <p className="mt-1 text-2xl font-bold text-red-700">{summary.debits}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-600">Net Balance</p>
          <p className={`mt-1 text-2xl font-bold ${summary.netColor}`}>{summary.net}</p>
        </div>
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <button
            onClick={handleSimulateTransactions}
            disabled={isSimulating || users.length === 0}
            className="w-full btn btn-primary"
          >
            {isSimulating ? 'Simulating...' : 'Simulate 5 Transactions'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
            <select
              value={filterUserId}
              onChange={(e) => setFilterUserId(e.target.value)}
              className="input"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="input"
            >
              <option value="">All Types</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="input"
            >
              <option value="">All Statuses</option>
              <option value="successful">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <button onClick={handleApplyFilters} className="btn btn-primary flex-1">
              Apply
            </button>
            <button onClick={handleClearFilters} className="btn btn-secondary flex-1">
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {transactionError && (
        <ErrorMessage
          message={transactionError}
          onClose={clearErrors}
          type="error"
        />
      )}

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {isLoadingTransactions ? (
          <Loader size="medium" message="Loading transactions..." />
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>

      {/* Pagination */}
      {totalTransactions > 10 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {Math.ceil(totalTransactions / 10)}
          </span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage >= Math.ceil(totalTransactions / 10)}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Transaction Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create New Transaction"
      >
        <form onSubmit={handleCreateTransaction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User *
            </label>
            <select
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="input"
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} (Balance: ${user.balance})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'credit' | 'debit' })}
              className="input"
              required
            >
              <option value="credit">Credit (Add Funds)</option>
              <option value="debit">Debit (Withdraw Funds)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              className="input"
              required
              min="0.01"
              step="0.01"
              placeholder="100.00"
            />
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              This will {formData.type === 'credit' ? 'add' : 'subtract'}{' '}
              <span className="font-semibold">
                ${formData.amount || 0}
              </span>{' '}
              {formData.type === 'credit' ? 'to' : 'from'} the selected user's balance.
            </p>
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
              Create Transaction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TransactionsPage;
