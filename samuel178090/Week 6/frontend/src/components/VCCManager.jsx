import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const VCCManager = () => {
  const [currentVCC, setCurrentVCC] = useState(null);
  const [vccLimits, setVccLimits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVCCData();
  }, []);

  const fetchVCCData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Mock VCC data
      setCurrentVCC({
        cardNumber: '4532 1234 5678 9012',
        expiryMonth: '12',
        expiryYear: '25',
        cvv: '123',
        balance: 500.00
      });
      
      setVccLimits({
        maxAmount: 10000,
        maxPerHour: 3,
        validTypes: ['visa', 'mastercard', 'amex'],
        expirationHours: 24
      });
    } catch (error) {
      console.error('Error fetching VCC data:', error);
      setError('Failed to load VCC data');
    } finally {
      setLoading(false);
    }
  };

  const generateNewVCC = async () => {
    try {
      setGenerating(true);
      setError('');
      
      // Mock new VCC generation
      const newCard = {
        cardNumber: `4532 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
        expiryMonth: '12',
        expiryYear: '25',
        cvv: Math.floor(100 + Math.random() * 900).toString(),
        balance: 1000.00
      };
      
      setCurrentVCC(newCard);
    } catch (error) {
      setError('Failed to generate VCC');
    } finally {
      setGenerating(false);
    }
  };

  const deactivateVCC = async () => {
    if (window.confirm('Are you sure you want to deactivate this virtual card?')) {
      setCurrentVCC(null);
    }
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Virtual Credit Cards</h1>
          <p className="text-gray-600">Manage your temporary credit cards</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current VCC */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Current Virtual Card</h2>
            
            {currentVCC ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm opacity-80">Virtual Card</p>
                      <p className="text-lg font-semibold">FlowServe</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-80">Expires</p>
                      <p className="font-semibold">{currentVCC.expiryMonth}/{currentVCC.expiryYear}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-2xl font-mono tracking-wider">
                      {currentVCC.cardNumber}
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm opacity-80">CVV</p>
                      <p className="font-semibold">{currentVCC.cvv}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Balance</p>
                      <p className="font-semibold">₦{currentVCC.balance}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={generateNewVCC}
                    disabled={generating}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {generating ? 'Generating...' : 'Generate New'}
                  </button>
                  <button
                    onClick={deactivateVCC}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <p className="text-gray-500 mb-4">No active virtual card</p>
                <button
                  onClick={generateNewVCC}
                  disabled={generating}
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {generating ? 'Generating...' : 'Generate Virtual Card'}
                </button>
              </div>
            )}
          </div>

          {/* VCC Limits & Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Card Limits & Info</h2>
            
            {vccLimits && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600">Maximum Amount</p>
                  <p className="text-lg font-semibold">₦{vccLimits.maxAmount?.toLocaleString()}</p>
                </div>
                
                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600">Generation Limit</p>
                  <p className="text-lg font-semibold">{vccLimits.maxPerHour} per hour</p>
                </div>
                
                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600">Valid Duration</p>
                  <p className="text-lg font-semibold">{vccLimits.expirationHours} hours</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Supported Types</p>
                  <div className="flex flex-wrap gap-2">
                    {vccLimits.validTypes?.map((type) => (
                      <span key={type} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Important Notes</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Virtual cards expire automatically after 24 hours</li>
                <li>• Only use for online purchases</li>
                <li>• Cannot be used for recurring payments</li>
                <li>• Unused balance returns to your account</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VCCManager;