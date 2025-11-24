import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePaymentStats, usePayments, useCustomers } from '../services/queries';
import LoadingSpinner, { CardSkeleton } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorBoundary';
import PaymentStats from '../components/payments/PaymentStats';
import PaymentCard from '../components/payments/PaymentCard';

/**
 * Home/Dashboard Page
 * Shows overview of payments and customers
 */

export default function Home() {
  const { data: statsData, isLoading: statsLoading, error: statsError } = usePaymentStats();
  const { data: paymentsData, isLoading: paymentsLoading } = usePayments({ limit: 6 });
  const { data: customersData, isLoading: customersLoading } = useCustomers({ limit: 5 });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your payment system integration
        </p>
      </div>

      {/* Statistics */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : statsError ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Unable to load statistics. Retrying...</p>
        </div>
      ) : statsData?.data ? (
        <PaymentStats stats={statsData.data} />
      ) : null}

      {/* Recent Payments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Recent Payments</h2>
          <Link
            to="/payments"
            className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            View all
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {paymentsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : paymentsData?.data && paymentsData.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentsData.data.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No payments found</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customers Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Customers</h3>
            <Link
              to="/customers"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>
          {customersLoading ? (
            <LoadingSpinner size="sm" />
          ) : customersData?.data ? (
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {customersData.pagination.total}
              </p>
              <p className="text-sm text-gray-600">Total customers</p>
            </div>
          ) : null}
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="flex items-center text-sm font-medium text-green-600">
                <span className="flex h-2 w-2 rounded-full bg-green-600 mr-2" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cache</span>
              <span className="flex items-center text-sm font-medium text-green-600">
                <span className="flex h-2 w-2 rounded-full bg-green-600 mr-2" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Legacy System</span>
              <span className="flex items-center text-sm font-medium text-green-600">
                <span className="flex h-2 w-2 rounded-full bg-green-600 mr-2" />
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}