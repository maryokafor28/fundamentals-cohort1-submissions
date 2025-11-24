import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Building } from 'lucide-react';
import { useCustomers } from '../services/queries';
import LoadingSpinner, { CardSkeleton } from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorBoundary';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import { getInitials } from '../utils/format';

/**
 * Customers Page
 * Lists all customers with search and pagination
 */

export default function Customers() {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, error, refetch } = useCustomers({ page, limit });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="mt-2 text-gray-600">View and manage customer information</p>
      </div>

      {/* Error State */}
      {error && (
        <ErrorDisplay
          error={error as Error}
          title="Failed to load customers"
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

      {/* Customers Grid */}
      {!isLoading && !error && data?.data && data.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((customer) => (
              <Link
                key={customer.id}
                to={`/customers/${customer.id.replace('CUST-', '')}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                {/* Avatar and Name */}
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold mr-4">
                    {getInitials(customer.fullName)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{customer.fullName}</h3>
                    <p className="text-sm text-gray-600">{customer.id}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{customer.location.city}</span>
                  </div>
                  {customer.company && (
                    <div className="flex items-center text-gray-600">
                      <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{customer.company.name}</span>
                    </div>
                  )}
                </div>
              </Link>
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
          title="No customers found"
          description="No customer data is available."
          icon="search"
        />
      )}
    </div>
  );
}