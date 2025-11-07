import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const SubaccountsManager = () => {
  const [subaccounts, setSubaccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    initialBalance: ''
  });
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSubaccount, setSelectedSubaccount] = useState(null);
  const [transferData, setTransferData] = useState({ amount: '', direction: 'to' });
  const [editData, setEditData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchSubaccounts();
  }, []);

  const fetchSubaccounts = async () => {
    try {
      setLoading(true);
      // Mock subaccounts data
      setSubaccounts([
        {
          id: 'sub-1',
          name: 'Business Account',
          description: 'For business transactions',
          balance: 2500.00,
          status: 'active',
          createdAt: '2024-01-10'
        },
        {
          id: 'sub-2',
          name: 'Savings Account',
          description: 'Personal savings',
          balance: 1200.50,
          status: 'active',
          createdAt: '2024-01-05'
        }
      ]);
    } catch (error) {
      console.error('Error fetching subaccounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubaccount = async (e) => {
    e.preventDefault();
    try {
      // Mock API call
      const newSubaccount = {
        id: `sub-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        balance: parseFloat(formData.initialBalance) || 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setSubaccounts([...subaccounts, newSubaccount]);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', initialBalance: '' });
    } catch (error) {
      console.error('Error creating subaccount:', error);
    }
  };

  const handleDeleteSubaccount = async (id) => {
    if (window.confirm('Are you sure you want to delete this subaccount?')) {
      setSubaccounts(subaccounts.filter(sub => sub.id !== id));
    }
  };

  const handleTransfer = (subaccount) => {
    setSelectedSubaccount(subaccount);
    setTransferData({ amount: '', direction: 'to' });
    setShowTransferModal(true);
  };

  const handleEdit = (subaccount) => {
    setSelectedSubaccount(subaccount);
    setEditData({ name: subaccount.name, description: subaccount.description });
    setShowEditModal(true);
  };

  const submitTransfer = async (e) => {
    e.preventDefault();
    const amount = parseFloat(transferData.amount);
    if (amount <= 0) return;

    setSubaccounts(subaccounts.map(sub => {
      if (sub.id === selectedSubaccount.id) {
        return {
          ...sub,
          balance: transferData.direction === 'to' 
            ? sub.balance + amount 
            : sub.balance - amount
        };
      }
      return sub;
    }));
    
    setShowTransferModal(false);
    setSelectedSubaccount(null);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    
    setSubaccounts(subaccounts.map(sub => {
      if (sub.id === selectedSubaccount.id) {
        return {
          ...sub,
          name: editData.name,
          description: editData.description
        };
      }
      return sub;
    }));
    
    setShowEditModal(false);
    setSelectedSubaccount(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Subaccounts</h1>
            <p className="text-gray-600">Manage your sub-accounts and allocate funds</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Create Subaccount
          </button>
        </div>

        {/* Subaccounts Grid */}
        {subaccounts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Subaccounts</h3>
            <p className="text-gray-500 mb-6">Create your first subaccount to organize your funds</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Create Subaccount
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subaccounts.map((subaccount) => (
              <div key={subaccount.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{subaccount.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      subaccount.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subaccount.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{subaccount.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Balance</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₦{subaccount.balance.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-xs text-gray-400">Created {subaccount.createdAt}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleTransfer(subaccount)}
                      className="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                    >
                      Transfer
                    </button>
                    <button 
                      onClick={() => handleEdit(subaccount)}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSubaccount(subaccount.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transfer Modal */}
        {showTransferModal && selectedSubaccount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Transfer Funds</h3>
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={submitTransfer}>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Account: {selectedSubaccount.name}</p>
                  <p className="text-sm text-gray-600 mb-4">Current Balance: ₦{selectedSubaccount.balance.toLocaleString()}</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
                  <select
                    value={transferData.direction}
                    onChange={(e) => setTransferData({...transferData, direction: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="to">Transfer TO subaccount</option>
                    <option value="from">Transfer FROM subaccount</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
                  <input
                    type="number"
                    value={transferData.amount}
                    onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedSubaccount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Edit Subaccount</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={submitEdit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Subaccount Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Create Subaccount</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreateSubaccount}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Balance (₦)
                  </label>
                  <input
                    type="number"
                    value={formData.initialBalance}
                    onChange={(e) => setFormData({...formData, initialBalance: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Create Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubaccountsManager;