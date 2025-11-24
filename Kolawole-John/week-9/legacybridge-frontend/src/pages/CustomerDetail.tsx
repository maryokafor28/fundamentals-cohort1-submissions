import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Building, TrendingUp } from 'lucide-react';
import { useCustomer } from '../services/queries';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorBoundary';
import PaymentCard from '../components/payments/PaymentCard';
import { getInitials, formatCurrency, formatDate } from '../utils/format';

/**
 * Customer Detail Page
 * Shows detailed information about a single customer
 */

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useCustomer(id);

  if (isLoading) {
    return <LoadingSpinner text="Loading customer details..." />;
  }

  if (error) {
    return (
      <div>
        <Link to="/customers" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Link>
        <ErrorDisplay error={error as Error} title="Failed to load customer" />
      </div>
    );
  }

  const customer = data?.data;

  if (!customer) {
    return (
      <div>
        <Link to="/customers" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Link>
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-600">Customer not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/customers"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Customers
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-xl mr-4">
            {getInitials(customer.fullName)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.fullName}</h1>
            <p className="text-gray-600">{customer.id}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">
                    {customer.location.city}, {customer.location.zipCode}
                  </p>
                </div>
              </div>
              {customer.company && (
                <div className="flex items-start">
                  <Building className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium text-gray-900">{customer.company.name}</p>
                    {customer.company.tagline && (
                      <p className="text-sm text-gray-600 italic">{customer.company.tagline}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment History */}
          {customer.paymentHistory && (
            <>
              {/* Payment Statistics */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Payments</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {customer.paymentHistory.totalPayments}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(customer.paymentHistory.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {customer.paymentHistory.stats.completed}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {customer.paymentHistory.stats.pending}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Payments */}
              {customer.paymentHistory.recentPayments.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customer.paymentHistory.recentPayments.map((payment) => (
                      <PaymentCard key={payment.id} payment={payment} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Registered</p>
                <p className="font-medium text-gray-900">{formatDate(customer.registeredAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Source</p>
                <p className="font-medium text-gray-900 capitalize">{customer.metadata.source}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Legacy ID</p>
                <p className="font-medium text-gray-900">{customer.metadata.legacyId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}