import { useEffect, useState } from "react";
import {
  FaUser,
  FaDollarSign,
  FaExchangeAlt,
  FaChartLine,
} from "react-icons/fa";
import type { UserType, TransactionType } from "../types/type";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-semibold mt-1">{value}</h3>
    </div>
    <div
      className={`p-3 rounded-xl text-white ${color} flex items-center justify-center`}
    >
      {icon}
    </div>
  </div>
);

interface TransactionRowProps {
  type: string;
  description: string;
  amount: number;
  createdAt: string;
}

const TransactionRow = ({
  type,
  description,
  amount,
  createdAt,
}: TransactionRowProps) => {
  const color =
    type === "DEPOSIT"
      ? "text-green-500"
      : type === "WITHDRAWAL"
      ? "text-red-500"
      : "text-blue-500";

  const icon =
    type === "DEPOSIT" ? (
      <FaDollarSign className="text-green-500" />
    ) : type === "WITHDRAWAL" ? (
      <FaExchangeAlt className="text-red-500" />
    ) : (
      <FaExchangeAlt className="text-blue-500" />
    );

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        <div>
          <p className="font-medium text-gray-800 capitalize">{type}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${color}`}>
          {(amount > 0 && type === "DEPOSIT") ? "+" : "-"}
          {amount.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
        </p>
        <p className="text-xs text-gray-400">
          {new Date(createdAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    totalTransactions: 0,
    growthRate: 0,
  });

  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, transactionsRes] = await Promise.all([
          fetch(`${baseUrl}/users`),
          fetch(`${baseUrl}/transactions`),
        ]);

        const usersData = await usersRes.json();
        const transactionsData = await transactionsRes.json();

        const users: UserType[] = usersData?.data ?? [];
        const txs: TransactionType[] = transactionsData?.transactions ?? [];
        const totalBalance = users.reduce(
          (sum, user) => sum + (user.balance || 0),
          0
        );

        setStats({
          totalUsers: users.length,
          totalBalance,
          totalTransactions: txs.length,
          growthRate: 24.5,
        });

        setTransactions(txs.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [baseUrl]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
      <p className="text-gray-500 mb-6">Welcome back! Here's your overview.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FaUser />}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Balance"
          value={stats.totalBalance.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          icon={<FaDollarSign />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions}
          icon={<FaExchangeAlt />}
          color="bg-purple-500"
        />
        <StatCard
          title="Growth Rate"
          value={`${stats.growthRate}%`}
          icon={<FaChartLine />}
          color="bg-orange-500"
        />
      </div>

      

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 text-lg">
            Recent Transactions
          </h3>
          <a href="/transactions" className="text-blue-500 text-sm font-medium">
            View All
          </a>
        </div>

        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <TransactionRow
              key={tx.id}
              type={tx.type}
              description={tx.description}
              amount={tx.amount}
              createdAt={tx.createdAt}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center py-8">
            No transactions available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
