import type { Transaction, TransactionStatus } from "../../types";
import { TransactionCard } from "./TransactionCard";
import { LoadingSpinner } from "../common/Loading";
import { ErrorMessage } from "../common/ErrorMessage";

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  currentUserId?: string;
  onStatusUpdate?: (id: string, status: TransactionStatus) => void;
}

export const TransactionList = ({
  transactions,
  loading,
  error,
  onRetry,
  currentUserId,
  onStatusUpdate,
}: TransactionListProps) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;
  if (transactions.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No transactions yet. Send money to get started!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          currentUserId={currentUserId}
          onStatusUpdate={onStatusUpdate}
        />
      ))}
    </div>
  );
};
