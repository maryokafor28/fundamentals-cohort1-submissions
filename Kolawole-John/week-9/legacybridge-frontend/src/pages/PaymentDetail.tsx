import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, User, FileText } from 'lucide-react';
import { usePayment } from '../services/queries';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ErrorDisplay } from '../components/common/ErrorBoundary';
import { formatCurrency, formatDateTime, getStatusColor, cn } from '../utils/format';

/**
 * Payment Detail Page
 * Shows detailed information about a single payment
 */

export default function PaymentDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = usePayment(id);

  if (isLoading) {
    return <LoadingSpinner text="Loading payment details..." />;
  }

  if (error) {
    return (
      <div>
        <Link to="/payments" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payments
        </Link>
        <ErrorDisplay error={error as Error} title="Failed to load payment" />
      </div>
    );
  }

  const payment = data?.data;

  if (!payment) {
    return (
      <div>
        <Link to="/payments" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payments
        </Link>
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-600">Payment not found</p>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(payment.status);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/payments"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Payments
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{payment.id}</h1>
            <p className="mt-1 text-gray-600">Payment Details</p>
          </div>
          <span className={cn('px-4 py-2 rounded-full text-sm font-medium capitalize', statusColor)}>
            {payment.status}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Amount</h2>
            <div className="flex items-baseline">
              <DollarSign className="h-8 w-8 text-primary-600 mr-2" />
              <span className="text-4xl font-bold text-gray-900">
                {formatCurrency(payment.amount, payment.currency)}
              </span>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
              <p className="text-gray-700">{payment.description}</p>
            </div>
          </div>

          {/* Customer Information */}
          {payment.customer && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{payment.customer.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{payment.customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{payment.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">
                    {payment.customer.location.city}, {payment.customer.location.zipCode}
                  </p>
                </div>
                <Link
                  to={`/customers/${payment.customerId.replace('CUST-', '')}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
                >
                  View Customer Profile
                  <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Created</p>
                  <p className="text-sm text-gray-600">{formatDateTime(payment.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Source</p>
                <p className="font-medium text-gray-900 capitalize">{payment.metadata.source}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Transformed At</p>
                <p className="font-medium text-gray-900">{formatDateTime(payment.metadata.transformedAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Currency</p>
                <p className="font-medium text-gray-900">{payment.currency}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}