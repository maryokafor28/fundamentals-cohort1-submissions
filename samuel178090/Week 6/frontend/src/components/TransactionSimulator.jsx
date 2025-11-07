import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

const TransactionSimulator = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("send"); // "send" or "request"
  const [formData, setFormData] = useState({
    senderId: "",
    recipientPhone: "",
    amount: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [loadingRecipient, setLoadingRecipient] = useState(false);

  // Auto-fill sender ID from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (!userId || !token) {
      navigate('/login');
      return;
    }
    
    setFormData(prev => ({ ...prev, senderId: userId }));
    fetchUserBalance(userId);
  }, [navigate]);

  // Fetch user balance
  const fetchUserBalance = async (userId) => {
    try {
      console.log('Fetching balance for userId:', userId);
      const response = await apiService.getCurrentUser();
      console.log('Balance response:', response);
      
      if (response && response.user && typeof response.user.balance === 'number') {
        setUserBalance(response.user.balance);
        console.log('Balance updated to:', response.user.balance);
      } else {
        console.warn('Invalid balance response format:', response);
        setUserBalance(1000); // Fallback balance
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
      setUserBalance(1000); // Fallback balance on error
    }
  };

  // Lookup recipient by phone
  const lookupRecipient = async (phone) => {
    if (phone.length !== 11) return;
    
    setLoadingRecipient(true);
    setRecipientInfo(null);
    
    try {
      // This would need to be implemented in your API
      // For now, we'll just validate the phone format
      setRecipientInfo({ phone, status: "valid" });
    } catch (err) {
      setRecipientInfo({ phone, status: "not_found" });
    } finally {
      setLoadingRecipient(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
    setSuccess(null);

    // Lookup recipient when phone is complete
    if (name === "recipientPhone" && value.length === 11) {
      lookupRecipient(value);
    }
  };

  const validateTransaction = () => {
    const amount = parseFloat(formData.amount);
    
    if (!formData.recipientPhone) {
      setError("Please enter recipient phone number");
      return false;
    }
    
    if (formData.recipientPhone.length !== 11) {
      setError("Phone number must be exactly 11 digits");
      return false;
    }
    
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return false;
    }
    
    if (activeTab === "send" && amount > userBalance) {
      setError("Insufficient balance");
      return false;
    }
    
    if (amount < 1) {
      setError("Minimum transaction amount is ₦1.00");
      return false;
    }
    
    if (amount > 10000) {
      setError("Maximum transaction amount is ₦10,000.00");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateTransaction()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (activeTab === "send") {
        await apiService.sendMoneyByPhone({
          recipientPhone: formData.recipientPhone,
          amount: parseFloat(formData.amount),
        });
        setSuccess(`Successfully sent ₦${parseFloat(formData.amount).toFixed(2)} to ${formData.recipientPhone}`);
      } else {
        await apiService.requestMoneyByPhone({
          recipientPhone: formData.recipientPhone,
          amount: parseFloat(formData.amount),
          message: formData.note || undefined,
        });
        setSuccess(`Request sent to ${formData.recipientPhone} for ₦${parseFloat(formData.amount).toFixed(2)}`);
      }
      
      // Refresh balance
      fetchUserBalance(formData.senderId);
      
      // Reset form (keep senderId)
      setFormData({ 
        senderId: formData.senderId, 
        recipientPhone: "", 
        amount: "",
        note: "" 
      });
      setRecipientInfo(null);
      
    } catch (err) {
      setError(err.message || "Transaction failed. Please try again.");
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

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Balance Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-sm opacity-75 mb-2">Available Balance</h3>
              <div className="text-3xl font-bold mb-4">
                {userBalance !== null ? formatCurrency(userBalance) : "Loading..."}
              </div>
              <div className="text-xs opacity-75">
                User ID: {formData.senderId.slice(0, 8)}...
              </div>
              <button
                onClick={() => {
                  console.log('Refresh balance clicked');
                  const userId = localStorage.getItem('userId');
                  console.log('UserId from localStorage:', userId);
                  if (userId) {
                    fetchUserBalance(userId);
                  } else {
                    console.error('No userId found in localStorage');
                  }
                }}
                className="mt-4 w-full bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded transition duration-300 text-sm"
              >
                Refresh Balance
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/history')}
                  className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded transition duration-300 text-sm"
                >
                  📋 Transaction History
                </button>
                <button
                  onClick={() => {
                    const userId = localStorage.getItem('userId');
                    if (userId) {
                      fetchUserBalance(userId);
                    }
                  }}
                  className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded transition duration-300 text-sm"
                >
                  🔄 Refresh Balance
                </button>
              </div>
            </div>
          </div>

          {/* Transaction Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
            
            {/* Tabs */}
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("send")}
                  className={`flex-1 px-6 py-4 font-semibold transition duration-300 ${
                    activeTab === "send"
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  💸 Send Money
                </button>
                <button
                  onClick={() => setActiveTab("request")}
                  className={`flex-1 px-6 py-4 font-semibold transition duration-300 ${
                    activeTab === "request"
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  💰 Request Money
                </button>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {activeTab === "send" ? "Send Money" : "Request Money"}
              </h2>

              {/* Success Alert */}
              {success && (
                <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                  <span className="block sm:inline">{success}</span>
                  <button
                    onClick={() => setSuccess(null)}
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  >
                    <span className="text-green-700 text-xl">&times;</span>
                  </button>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <span className="block sm:inline">{error}</span>
                  <button
                    onClick={() => setError(null)}
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  >
                    <span className="text-red-700 text-xl">&times;</span>
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                
                {/* Recipient Phone */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    {activeTab === "send" ? "Recipient" : "Request From"} Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="recipientPhone"
                      value={formData.recipientPhone}
                      onChange={handleChange}
                      placeholder="01234567890"
                      pattern="[0-9]{11}"
                      maxLength="11"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                      required
                    />
                    {loadingRecipient && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  {recipientInfo && (
                    <p className={`text-xs mt-1 ${
                      recipientInfo.status === "valid" ? "text-green-600" : "text-red-600"
                    }`}>
                      {recipientInfo.status === "valid" ? "✓ Phone number format is valid" : "✗ Recipient not found"}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Enter 11-digit phone number
                  </p>
                </div>

                {/* Amount */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Amount (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                      ₦
                    </span>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="1"
                      max="10000"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Minimum: ₦1.00</span>
                    <span>Maximum: ₦10,000.00</span>
                  </div>
                  
                  {/* Quick Amount Buttons */}
                  <div className="mt-3 flex gap-2">
                    {[10, 25, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setFormData({ ...formData, amount: amt.toString() })}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition duration-300"
                      >
                        ₦{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note (Optional) */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Note (Optional)
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Add a note..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
                  />
                </div>

                {/* Transaction Summary */}
                {formData.amount && parseFloat(formData.amount) > 0 && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold mb-3 text-gray-700">Transaction Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold">{formatCurrency(parseFloat(formData.amount))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fee:</span>
                        <span className="font-semibold text-green-600">₦0.00</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="text-gray-700 font-semibold">Total:</span>
                        <span className="font-bold text-lg">{formatCurrency(parseFloat(formData.amount))}</span>
                      </div>
                      {activeTab === "send" && userBalance !== null && (
                        <div className="flex justify-between text-xs pt-2 border-t">
                          <span className="text-gray-600">Balance after transaction:</span>
                          <span className={`font-semibold ${
                            (userBalance - parseFloat(formData.amount)) < 0 ? "text-red-600" : "text-green-600"
                          }`}>
                            {formatCurrency(userBalance - parseFloat(formData.amount))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || (activeTab === "send" && parseFloat(formData.amount) > userBalance)}
                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 font-semibold shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    activeTab === "send" ? "Send Money" : "Send Request"
                  )}
                </button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-xs text-gray-700">
                    <p className="font-semibold mb-1">Security Tips:</p>
                    <ul className="space-y-1">
                      <li>• Verify recipient phone number before sending</li>
                      <li>• Double-check the amount</li>
                      <li>• Transactions are instant and cannot be reversed</li>
                      <li>• Keep your account secure</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSimulator;