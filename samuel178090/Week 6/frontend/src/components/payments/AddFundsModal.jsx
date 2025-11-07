import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { CreditCardForm } from './CreditCardForm';
import { FawryInstructions } from './FawryInstructions';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function AddFundsModal({ isOpen, onClose, userPhoneNumber }) {
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [step, setStep] = useState('amount'); // 'amount', 'method', 'payment'

    const handleAmountSubmit = (e) => {
        e.preventDefault();
        if (parseFloat(amount) > 0) {
            setStep('method');
        }
    };

    const handleMethodSelect = (method) => {
        setPaymentMethod(method);
        setStep('payment');
    };

    const handlePaymentSuccess = (transactionId) => {
        alert('Payment successful! Your account will be credited shortly.');
        resetModal();
    };

    const handlePaymentError = (error) => {
        console.error('Payment error:', error);
    };

    const resetModal = () => {
        setAmount('');
        setPaymentMethod(null);
        setStep('amount');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Add Funds</h2>
                    <button
                        onClick={resetModal}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Step 1: Enter Amount */}
                    {step === 'amount' && (
                        <form onSubmit={handleAmountSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount to Add
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        ₦
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="1"
                                        max="100000"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Continue
                            </button>
                        </form>
                    )}

                    {/* Step 2: Select Payment Method */}
                    {step === 'method' && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <div className="text-sm text-gray-600">Amount to add</div>
                                <div className="text-2xl font-bold text-gray-900">₦{amount}</div>
                            </div>

                            <PaymentMethodSelector
                                selectedMethod={paymentMethod}
                                onSelectMethod={handleMethodSelect}
                            />

                            <button
                                onClick={() => setStep('amount')}
                                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            >
                                Back
                            </button>
                        </div>
                    )}

                    {/* Step 3: Payment Details */}
                    {step === 'payment' && paymentMethod === 'credit-card' && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <div className="text-sm text-gray-600">Amount to add</div>
                                <div className="text-2xl font-bold text-gray-900">₦{amount}</div>
                            </div>

                            <Elements stripe={stripePromise}>
                                <CreditCardForm
                                    amount={parseFloat(amount)}
                                    userPhoneNumber={userPhoneNumber}
                                    onSuccess={handlePaymentSuccess}
                                    onError={handlePaymentError}
                                />
                            </Elements>

                            <button
                                onClick={() => setStep('method')}
                                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            >
                                Back
                            </button>
                        </div>
                    )}

                    {step === 'payment' && paymentMethod === 'fawry' && (
                        <FawryInstructions
                            amount={parseFloat(amount)}
                            onClose={resetModal}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}