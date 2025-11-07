import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';

export function FawryInstructions({ amount, onClose }) {
    const [serviceCode, setServiceCode] = useState(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadServiceCode();
    }, []);

    const loadServiceCode = async () => {
        try {
            const data = await paymentService.getServiceCode();
            setServiceCode(data.serviceCode || data['Tap Cash service code'] || '12345');
        } catch (error) {
            console.error('Failed to load service code:', error);
            setServiceCode('12345'); // Fallback code
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(serviceCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Service Code</h3>
                <div className="flex items-center gap-2">
                    <code className="flex-1 text-2xl font-mono bg-white px-4 py-3 rounded border border-blue-200">
                        {serviceCode}
                    </code>
                    <button
                        onClick={copyToClipboard}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="Copy code"
                    >
                        {copied ? '✓' : '📋'}
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">How to Pay with Fawry:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Visit any Fawry location</li>
                    <li>Provide the service code: <strong>{serviceCode}</strong></li>
                    <li>Pay the amount: <strong>${amount}</strong></li>
                    <li>Your account will be credited within 24 hours</li>
                </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Keep your receipt until the funds appear in your account.
                </p>
            </div>

            <button
                onClick={onClose}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
                Close
            </button>
        </div>
    );
}