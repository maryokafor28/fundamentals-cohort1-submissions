import { TransactionStatus } from "../../types";

interface TransactionFiltersProps {
  selectedStatus?: TransactionStatus;
  onStatusChange: (status?: TransactionStatus) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalTransactions?: number;
}

export const TransactionFilters = ({
  selectedStatus,
  onStatusChange,
  page,
  totalPages,
  onPageChange,
  totalTransactions = 0,
}: TransactionFiltersProps) => {
  const statuses = Object.values(TransactionStatus);

  const statusColors: Record<TransactionStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    COMPLETED: "bg-green-100 text-green-800 hover:bg-green-200",
    FAILED: "bg-red-100 text-red-800 hover:bg-red-200",
    CANCELLED: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };

  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Status
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onStatusChange(undefined)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              !selectedStatus
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({totalTransactions})
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedStatus === status
                  ? "ring-2 ring-blue-500 " + statusColors[status]
                  : statusColors[status]
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
