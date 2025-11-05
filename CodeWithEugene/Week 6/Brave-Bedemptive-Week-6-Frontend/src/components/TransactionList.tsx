import React from 'react';
import { Transaction } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'successful':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'successful':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {transaction.type === 'credit' ? (
                <ArrowDownCircle className="w-10 h-10 text-green-500" />
              ) : (
                <ArrowUpCircle className="w-10 h-10 text-red-500" />
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                  </p>
                  <span className={getStatusBadge(transaction.status)}>
                    {getStatusIcon(transaction.status)}
                    <span className="ml-1">{transaction.status}</span>
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{formatDate(transaction.timestamp)}</p>
                {transaction.user && (
                  <p className="text-xs text-gray-600 mt-1">
                    User: {transaction.user.name} ({transaction.user.email})
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${
                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
              <p className="text-xs text-gray-500 mt-1">ID: {transaction.id.slice(0, 8)}...</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
