import { Link } from 'react-router-dom';
import { Calendar, User, TrendingUp } from 'lucide-react';
import { Payment } from '../../types';
import { formatCurrency, formatDate, getStatusColor, cn } from '../../utils/format';

/**
 * Payment Card Component
 * Displays payment information in a card format
 */

interface PaymentCardProps {
  payment: Payment;
}

export default function PaymentCard({ payment }: PaymentCardProps) {
  const statusColor = getStatusColor(payment.status);

  return (
    <Link
      to={`/payments/${payment.id.replace('PAY-', '')}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Payment ID</p>
          <p className="text-lg font-semibold text-gray-900">{payment.id}</p>
        </div>
        <span
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium capitalize',
            statusColor
          )}
        >
          {payment.status}
        </span>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <div className="flex items-baseline">
          <TrendingUp className="h-4 w-4 text-primary-600 mr-2" />
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(payment.amount, payment.currency)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{payment.description}</p>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1" />
          <span>{payment.customerId}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate(payment.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}