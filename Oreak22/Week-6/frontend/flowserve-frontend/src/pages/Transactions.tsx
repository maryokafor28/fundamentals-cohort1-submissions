import React, { useEffect, useState } from "react";
import api from "../api/axios";

type Tx = {
  id: string;
  reference: string;
  amount: string;
  currency: string;
  status: string;
};

export default function TransactionsPage() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>(100);
  const [currency, setCurrency] = useState("NGN");
  const [type, setType] = useState<"deposit" | "withdrawal" | "transfer">(
    "deposit"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTxs();
  }, []);

  async function fetchTxs() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/transactions?page=1&limit=20");
      setTxs(res.data.data || []);
    } catch (err: any) {
      setError(err.error || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  async function handleSimulate(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/api/transactions/simulate", {
        amount,
        currency,
        type,
      });
      alert("Transaction " + res.data.status);
      fetchTxs();
    } catch (err: any) {
      setError(err.error || "Simulation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Transactions</h1>

      <form
        onSubmit={handleSimulate}
        className="bg-white p-4 rounded shadow space-y-3"
      >
        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-1 block w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Currency</label>
          <input
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="mt-1 block w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="mt-1 block w-full border p-2 rounded"
          >
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
        <div>
          <button className="px-4 py-2 bg-green-600 text-white rounded">
            Simulate
          </button>
        </div>
        {error && <div className="text-red-600">{error}</div>}
      </form>

      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {txs.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="py-2">{t.reference}</td>
                  <td>{t.amount}</td>
                  <td>{t.currency}</td>
                  <td>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
