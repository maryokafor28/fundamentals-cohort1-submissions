import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useUsers } from "../hooks/useUsers";
import { useTransactions } from "../hooks/useTransactions";
import { transactionApi } from "../api/transactionApi";
import { Navbar } from "../layout/Navbar";
import { SendMoneyForm } from "../components/transactions/SendMoneyForm";
import { TransactionList } from "../components/transactions/TransactionList";
import { TransactionFilters } from "../components/transactions/TransactionFilters";
import { LoadingSpinner } from "../components/common/Loading";
import type { TransactionStatus } from "../types";

export const TransactionsPage = () => {
  const navigate = useNavigate();
  const { currentUser, loading: userLoading } = useCurrentUser();
  const { users } = useUsers();
  const {
    transactions,
    loading,
    error,
    page,
    setPage,
    totalPages,
    total,
    selectedStatus,
    setSelectedStatus,
    refetch,
  } = useTransactions(currentUser?.id); // ✅ Pass currentUser.id

  // Redirect to landing if no user selected
  useEffect(() => {
    if (!userLoading && !currentUser) {
      console.log("❌ No user found, redirecting to landing page");

      navigate("/");
    }
  }, [currentUser, userLoading, navigate]);
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const handleSendMoney = async (
    receiverId: string,
    amount: number,
    description?: string
  ) => {
    if (!currentUser) return;

    await transactionApi.createTransaction({
      senderId: currentUser.id,
      receiverId,
      amount,
      description,
    });

    refetch();
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }
  const handleStatusUpdate = async (id: string, status: TransactionStatus) => {
    try {
      await transactionApi.updateTransactionStatus(id, status);
      refetch(); // Refresh the list
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update transaction status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send Money Form */}
          <div className="lg:col-span-1">
            {!users || users.length === 0 ? (
              <div className="bg-white border p-4 rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm">Loading users...</p>
              </div>
            ) : (
              <SendMoneyForm
                users={users}
                currentUserId={currentUser.id}
                onSubmit={handleSendMoney}
              />
            )}
          </div>
          {/* Transaction History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <TransactionFilters
                selectedStatus={selectedStatus}
                onStatusChange={(status) => {
                  setSelectedStatus(status);
                  setPage(1); // Reset to first page when filter changes
                }}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalTransactions={total}
              />
            </div>

            {/* Transaction List */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Transaction History
              </h2>
              <TransactionList
                transactions={transactions}
                loading={loading}
                error={error}
                onRetry={refetch}
                currentUserId={currentUser.id}
                onStatusUpdate={handleStatusUpdate} // ADD THIS
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
