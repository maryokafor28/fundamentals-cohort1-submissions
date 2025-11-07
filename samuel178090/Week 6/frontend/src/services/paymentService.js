// API service for payment operations
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const paymentService = {
    // Credit Card
    createPaymentIntent: async (amount, userPhoneNumber) => {
        const response = await fetch(`${API_BASE_URL}/payments/credit-card/create-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ amount, userPhoneNumber })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create payment intent');
        }
        
        return response.json();
    },

    getTransactionStatus: async (transactionId) => {
        const response = await fetch(`${API_BASE_URL}/payments/transactions/${transactionId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to get transaction status');
        return response.json();
    },

    // Fawry
    getServiceCode: async () => {
        const response = await fetch(`${API_BASE_URL}/funds/cash/service-code`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to get service code');
        return response.json();
    }
};