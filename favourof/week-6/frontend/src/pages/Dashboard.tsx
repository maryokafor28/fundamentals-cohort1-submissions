import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { userService } from "../api/userService";
import { transactionService } from "../api/transactionService";
import type { User, Transaction } from "../types";

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [u, t] = await Promise.all([
          userService.getAll(1, 100),
          transactionService.getAll(1, 10),
        ]);
        if (!mounted) return;
        setUsers(u);
        setTransactions(t);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const totalBalance = users.reduce((s, u) => s + (u.balance || 0), 0);
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="text-sm text-slate-500">Total Users</div>
          <div className="text-2xl font-bold">
            {loading ? "..." : users.length}
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="text-sm text-slate-500">Total Balance</div>
          <div className="text-2xl font-bold">
            ₦{loading ? "..." : totalBalance.toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="text-sm text-slate-500">Recent Transactions</div>
          <div className="text-2xl font-bold">
            {loading ? "..." : transactions.length}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08 }}
        className="bg-white rounded-2xl shadow p-4"
      >
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="divide-y">
          {loading ? (
            <div className="py-8 text-center text-slate-400">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              No transactions yet
            </div>
          ) : (
            transactions.map((t) => (
              <div
                key={t.id}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {t.type.toUpperCase()} — ₦{t.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-500">
                    {t.description || "—"}
                  </div>
                </div>
                <div className="text-sm text-slate-400">
                  {new Date(t.createdAt || "").toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
