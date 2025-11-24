import { TrendingUp, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { PaymentStats as PaymentStatsType } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/format';

/**
 * Payment Statistics Component
 * Displays payment statistics in cards
 */

interface PaymentStatsProps {
  stats: PaymentStatsType;
}

export default function PaymentStats({ stats }: PaymentStatsProps) {
  const statCards = [
    {
      name: 'Total Payments',
      value: formatNumber(stats.total),
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      name: 'Total Amount',
      value: formatCurrency(stats.totalAmount),
      icon: DollarSign,
      color: 'text-green-600 bg-green-100',
    },
    {
      name: 'Completed',
      value: formatNumber(stats.completed),
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100',
      percentage: ((stats.completed / stats.total) * 100).toFixed(1) + '%',
    },
    {
      name: 'Pending',
      value: formatNumber(stats.pending),
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100',
      percentage: ((stats.pending / stats.total) * 100).toFixed(1) + '%',
    },
    {
      name: 'Failed',
      value: formatNumber(stats.failed),
      icon: XCircle,
      color: 'text-red-600 bg-red-100',
      percentage: ((stats.failed / stats.total) * 100).toFixed(1) + '%',
    },
    {
      name: 'Average Amount',
      value: formatCurrency(stats.averageAmount),
      icon: DollarSign,
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
                {stat.percentage && (
                  <p className="text-sm text-gray-600 mt-1">{stat.percentage}</p>
                )}
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}