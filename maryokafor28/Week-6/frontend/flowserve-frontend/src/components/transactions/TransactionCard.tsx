// src/components/transactions/TransactionCard.tsx
import type { Transaction, TransactionStatus } from "../../types";
import { Button } from "../common/Button";

interface TransactionCardProps {
  transaction: Transaction;
  currentUserId?: string;
  onStatusUpdate?: (id: string, status: TransactionStatus) => void; // NEW
}

export const TransactionCard = ({
  transaction,
  currentUserId,
  onStatusUpdate, // NEW
}: TransactionCardProps) => {
  const isSender = transaction.senderId === currentUserId;
  const otherUser = isSender ? transaction.receiver : transaction.sender;
  const sign = isSender ? "-" : "+";

  const statusColors: Record<TransactionStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    COMPLETED: "bg-green-100 text-green-800 border-green-200",
    FAILED: "bg-red-100 text-red-800 border-red-200",
    CANCELLED: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const statusIcons: Record<TransactionStatus, string> = {
    PENDING: "⏳",
    COMPLETED: "✅",
    FAILED: "❌",
    CANCELLED: "🚫",
  };

  return (
    <div
      className={`bg-white border-2 rounded-lg p-4 shadow-sm hover:shadow-md transition ${
        isSender
          ? "border-red-200 hover:border-red-300"
          : "border-green-200 hover:border-green-300"
      }`}
    >
      {/* Header: Amount and Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-2xl font-bold ${
              isSender ? "text-red-600" : "text-green-600"
            }`}
          >
            {sign}${parseFloat(transaction.amount).toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">
            {isSender ? "Sent" : "Received"}
          </span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${
            statusColors[transaction.status]
          }`}
        >
          <span>{statusIcons[transaction.status]}</span>
          {transaction.status}
        </span>
      </div>

      {/* Transaction Details */}
      <div className="space-y-2">
        {/* Other User */}
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
            {otherUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {isSender ? "To: " : "From: "}
              {otherUser.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{otherUser.email}</p>
          </div>
        </div>

        {/* Description */}
        {transaction.description && (
          <div className="bg-gray-50 rounded-md p-2 border border-gray-100">
            <p className="text-sm text-gray-700 italic">
              "{transaction.description}"
            </p>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {new Date(transaction.createdAt).toLocaleString()}
        </div>
      </div>

      {/* Status Update Buttons - NEW */}
      {onStatusUpdate && transaction.status === "PENDING" && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Quick Actions:</p>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => onStatusUpdate(transaction.id, "COMPLETED")}
              className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition"
            >
              ✅ Mark Complete
            </Button>
            <button
              onClick={() => onStatusUpdate(transaction.id, "FAILED")}
              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition"
            >
              ❌ Mark Failed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
