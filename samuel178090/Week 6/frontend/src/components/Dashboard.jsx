import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddFundsModal } from './payments/AddFundsModal';
import apiService from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showVCCModal, setShowVCCModal] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.request('/dashboard/data');
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md border">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="max-w-4xl mx-auto mt-10 p-6">No data available</div>;
  }

  const { user, recentTransactions, statistics, vcc } = dashboardData;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user.firstName}!</h1>
        <p className="text-gray-600">@{user.username}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-2">Account Balance</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(user.balance)}
          </p>
          <button
            onClick={() => setShowAddFunds(true)}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Funds
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/transactions')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Money
            </button>
            <button 
              onClick={() => navigate('/transactions', { state: { activeTab: 'request' } })}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Request Money
            </button>
            <button 
              onClick={() => setShowVCCModal(true)}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Generate VCC
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">This Month</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Spent:</span>
              <span className="font-semibold">{formatCurrency(statistics.thisMonthSpent)}</span>
            </div>
            <div className="flex justify-between">
              <span>Sent:</span>
              <span className="font-semibold">{statistics.totalSent} transactions</span>
            </div>
            <div className="flex justify-between">
              <span>Received:</span>
              <span className="font-semibold">{statistics.totalReceived} transactions</span>
            </div>
            {statistics.hasActiveVCC && (
              <div className="flex justify-between text-green-600">
                <span>Active VCC:</span>
                <span className="font-semibold">Yes</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium">
                    {transaction.type === 'sent' ? 'Sent to' : 'Received from'} {transaction.counterparty}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.created_at)} • {transaction.status}
                  </p>
                </div>
                <span className={`font-semibold ${
                  transaction.type === 'sent' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {transaction.type === 'sent' ? '-' : '+'}{formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent transactions</p>
        )}
      </div>

      {/* VCC Status */}
      {vcc && (
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Active Virtual Credit Card</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">**** **** **** {vcc.lastFourDigits}</p>
              <p className="text-sm opacity-90">{vcc.cardType.toUpperCase()} • Balance: {formatCurrency(vcc.amount)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Expires</p>
              <p className="font-semibold">{formatDate(vcc.expirationDate)}</p>
            </div>
          </div>
        </div>
      )}

      <AddFundsModal
        isOpen={showAddFunds}
        onClose={() => setShowAddFunds(false)}
        userPhoneNumber={user.phone}
        onSuccess={fetchDashboardData}
      />

      {/* Simple VCC Modal */}
      {showVCCModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Generate Virtual Credit Card</h3>
              <button
                onClick={() => setShowVCCModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Generate a virtual credit card for secure online payments.
            </p>

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  try {
                    const response = await apiService.generateVCC({
                      visa_type: 'visa',
                      amount: 100
                    });
                    alert('VCC Generated: ' + response.virtualCreditCard.cardNumber);
                    setShowVCCModal(false);
                    fetchDashboardData();
                  } catch (error) {
                    alert('Error: ' + error.message);
                  }
                }}
                className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Generate VCC (₦100)
              </button>
              <button
                onClick={() => setShowVCCModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;