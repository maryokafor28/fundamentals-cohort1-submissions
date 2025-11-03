import { useEffect, useState } from "react";
import Button from "../component/ui/Button";
import type { TransactionType } from "../types/type";
import SectionHeader from "../component/ui/SectionHeader";
import AddTransactionForm from "../forms/AddTransaction";
import type { TransactionFormData } from "../types/type";

function Transactions() {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${baseUrl}/transactions?page=${page}&limit=${limit}`
        );
        if (!response.ok) throw new Error("Failed to fetch transactions");

        const data = await response.json();

        setTransactions(data.transactions || []);
        setTotalPages(data.pages || 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [baseUrl, page]);

  const handleAddTransaction = async (formData: TransactionFormData) => {
    try {
      const payload: Record<string, unknown> = {
        type: formData.type,
        amount: formData.amount,
        description: formData.description,
      };

      if (formData.type === "TRANSFER") {
        payload.senderEmail = formData.senderEmail;
        payload.receiverEmail = formData.receiverEmail;
      } else {
        payload.userEmail = formData.userEmail;
      }

      const response = await fetch(`${baseUrl}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Transaction failed");

      alert("Transaction created successfully!");

      setPage(1);
    } catch (err) {
      console.error("Error creating transaction", err);
      alert(
        "Error creating transaction. Please check your inputs and try again."
      );
    }
  };

  return (  
    <div>
      <SectionHeader
        title="Transactions"
        subtitle="View and manage all transactions across the platform."
      >
        <Button onClick={() => setShowForm(true)}>Create Transaction</Button>
      </SectionHeader>

      {loading && <p className="mt-4 text-gray-500">Loading transactions...</p>}
      {error && <p className="mt-4 text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <>
          <table className="min-w-full divide-y divide-gray-200 mt-4">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Transaction ID",
                  "Type",
                  "Amount",
                  "Sender",
                  "Receiver",
                  "Date",
                  "Description",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="text-sm px-6 py-4 whitespace-nowrap">
                    {transaction.id.slice(0, 8)}...
                  </td>
                  <td className="text-sm px-6 py-4 whitespace-nowrap">
                    {transaction.type}
                  </td>
                  <td className="text-sm px-6 py-4 whitespace-nowrap">
                    {transaction.amount}
                  </td>
                  <td className="text-sm px-6 py-4 whitespace-nowrap">
                    {transaction.sender?.name || "-"}
                  </td>
                  <td className="text-sm px-6 py-4 whitespace-nowrap">
                    {transaction.receiver?.name || "-"}
                  </td>
                  <td className="text-sm px-6 py-4 whitespace-nowrap">
                    {transaction.createdAt.split("T")[0]}
                  </td>
                  <td className="text-sm px-6 py-4 whitespace-nowrap text-center">
                    {transaction.description || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center gap-4 mt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Prev
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {showForm && (
        <AddTransactionForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddTransaction}
        />
      )}
    </div>
  );
}

export default Transactions;
