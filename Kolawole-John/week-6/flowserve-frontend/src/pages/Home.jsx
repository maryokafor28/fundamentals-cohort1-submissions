import { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import userService from '../services/userService';
import transactionService from '../services/transactionService';

const Home = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalVolume: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [usersRes, transactionsRes] = await Promise.all([
        userService.getAll(1, 5),
        transactionService.getAll(1, 5)
      ]);

      const totalVolume = transactionsRes.data.transactions.reduce(
        (sum, t) => sum + parseFloat(t.amount),
        0
      );

      setStats({
        totalUsers: usersRes.data.pagination.total,
        totalTransactions: transactionsRes.data.pagination.total,
        totalVolume: totalVolume.toFixed(2)
      });

      setRecentTransactions(transactionsRes.data.transactions);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <Icon className="w-12 h-12" style={{ color }} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats.totalUsers}
          color="#3B82F6"
        />
        <StatCard
          icon={TrendingUp}
          title="Total Transactions"
          value={stats.totalTransactions}
          color="#10B981"
        />
        <StatCard
          icon={DollarSign}
          title="Total Volume"
          value={`$${stats.totalVolume}`}
          color="#F59E0B"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        {recentTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{transaction.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {transaction.description || 'No description'}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'CREDIT' ? '+' : '-'}$
                    {parseFloat(transaction.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;