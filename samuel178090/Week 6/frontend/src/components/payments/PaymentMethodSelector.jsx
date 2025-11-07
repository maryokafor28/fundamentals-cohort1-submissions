import React from 'react';

export function PaymentMethodSelector({ selectedMethod, onSelectMethod }) {
    const methods = [
        {
            id: 'credit-card',
            name: 'Credit/Debit Card',
            description: 'Instant processing'
        },
        {
            id: 'fawry',
            name: 'Fawry',
            description: 'Pay at any Fawry location'
        }
    ];

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Payment Method
            </label>
            {methods.map((method) => {
                return (
                    <button
                        key={method.id}
                        onClick={() => onSelectMethod(method.id)}
                        className={`w-full p-4 border-2 rounded-lg flex items-center gap-4 transition-all ${
                            selectedMethod === method.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="text-left flex-1">
                            <div className="font-medium text-gray-900">{method.name}</div>
                            <div className="text-sm text-gray-500">{method.description}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedMethod === method.id
                                ? 'border-blue-500'
                                : 'border-gray-300'
                        }`}>
                            {selectedMethod === method.id && (
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}