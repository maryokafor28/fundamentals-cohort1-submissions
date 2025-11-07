import { useEffect, useState } from "react";
// import ModalForm from "../components/modals/ModalForm";
import { transactionService } from "../api/transactionService";
import { userService } from "../api/userService";
import type { Transaction, User } from "../types";
import { toast } from "sonner";
import ModalForm from "@/components/layout/ModalForm";

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const [t, u] = await Promise.all([
        transactionService.getAll(),
        userService.getAll(1, 100),
      ]);
      setTransactions(t);
      setUsers(u);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      userId: Number(fd.get("userId")),
      type: fd.get("type") as "credit" | "debit",
      amount: Number(fd.get("amount")),
      description: String(fd.get("description") || ""),
    };
    try {
      await transactionService.create(payload);
      toast.success("Transaction successful");
      setOpen(false);
      fetch();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Transaction failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Create Transaction
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">User</th>
              <th className="p-3">Description</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  No transactions
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-3">{t.type}</td>
                  <td className="p-3">₦{t.amount.toLocaleString()}</td>
                  <td className="p-3">{t.user?.name ?? `#${t.userId}`}</td>
                  <td className="p-3">{t.description}</td>
                  <td className="p-3 text-sm text-slate-400">
                    {new Date(t.createdAt || "").toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ModalForm
        open={open}
        title="Create Transaction"
        onClose={() => setOpen(false)}
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-sm text-slate-700">User</label>
            <select
              name="userId"
              required
              className="w-full border p-2 rounded mt-1"
            >
              <option value="">Select user</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-700">Type</label>
            <select
              name="type"
              defaultValue="credit"
              className="w-full border p-2 rounded mt-1"
            >
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-700">Amount (₦)</label>
            <input
              name="amount"
              type="number"
              min={100}
              required
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700">Description</label>
            <input
              name="description"
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2  bg-blue-500 text-white rounded"
            >
              Create
            </button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
