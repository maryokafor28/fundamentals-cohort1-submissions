import { useState } from 'react';
import { Filter } from 'lucide-react';
import { usePayments } from '../services/queries';
import { PaymentStatus } from '../types';
import LoadingSpinner, { CardSkeleton } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorBoundary';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import PaymentCard from '../components/payments/PaymentCard';
import { PAYMENT_STATUS_LABELS } from '../utils/constants';

/**
 * Payments Page
 * Lists all payments with filtering and pagination
 */

export default function Payments() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PaymentStatus | ''>('');
  const limit = 12;

  const { data, isLoading, error, refetch } = usePayments({
    page,
    limit,
    ...(status && { status }),
  });

  const handleStatusChange = (newStatus: PaymentStatus | '') => {
    setStatus(newStatus);
    setPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="mt-2 text-gray-600">
            View and manage all payment transactions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusChange('')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                status === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {(['completed', 'pending', 'failed'] as PaymentStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  status === s
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {PAYMENT_STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <ErrorDisplay
          error={error as Error}
          title="Failed to load payments"
          retry={() => refetch()}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Payments Grid */}
      {!isLoading && !error && data?.data && data.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={data.pagination.totalPages}
            totalItems={data.pagination.total}
            pageSize={limit}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Empty State */}
      {!isLoading && !error && data?.data && data.data.length === 0 && (
        <EmptyState
          title={status ? `No ${status} payments found` : 'No payments found'}
          description="Try adjusting your filters or check back later."
          icon="search"
          action={
            status
              ? {
                  label: 'Clear filters',
                  onClick: () => handleStatusChange(''),
                }
              : undefined
          }
        />
      )}
    </div>
  );
}