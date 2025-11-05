import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CreditCard, TrendingUp, TrendingDown, Activity, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import Loader from '../components/Loader';

const HomePage: React.FC = () => {
  const { stats, isLoadingStats, fetchStats } = useStore();

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoadingStats) {
    return <Loader size="large" message="Loading dashboard..." />;
  }

  const statsCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Balance',
      value: formatCurrency(stats?.totalBalance || 0),
      icon: Activity,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Transactions',
      value: stats?.totalTransactions || 0,
      icon: CreditCard,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      title: 'Average Balance',
      value: formatCurrency(stats?.averageBalance || 0),
      icon: TrendingUp,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
    },
  ];

  const transactionStats = [
    {
      label: 'Total Credits',
      value: formatCurrency(stats?.totalCredit || 0),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Total Debits',
      value: formatCurrency(stats?.totalDebit || 0),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Successful',
      value: stats?.successfulCount || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Pending',
      value: stats?.pendingCount || 0,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Failed',
      value: stats?.failedCount || 0,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to FlowServe - Your scalable and reliable API system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.lightColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {transactionStats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} rounded-lg p-4 text-center`}>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`mt-2 text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/users"
          className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Manage Users</h3>
              <p className="mt-2 text-sm text-gray-600">
                Create, update, and manage user accounts
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
          </div>
        </Link>

        <Link
          to="/transactions"
          className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">View Transactions</h3>
              <p className="mt-2 text-sm text-gray-600">
                Monitor and simulate financial transactions
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
          </div>
        </Link>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">System Status</h3>
            <p className="mt-2 text-primary-100">All systems operational</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
