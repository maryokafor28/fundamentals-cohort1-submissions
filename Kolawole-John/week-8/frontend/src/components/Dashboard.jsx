import { useState, useEffect, useCallback } from 'react';
import { Activity, Server, Clock, Cpu, HardDrive, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchDashboardData } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [data, setData] = useState({
    health: null,
    status: null,
    info: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data function wrapped in useCallback to prevent re-renders
  const fetchData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const result = await fetchDashboardData();
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch data');
      }

      setData({
        health: result.health,
        status: result.status,
        info: result.info,
      });
      
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []); // Empty dependency array - function never changes

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData is stable due to useCallback

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchData(true);
  };

  // Utility function
  const formatUptime = (seconds) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading && !data.health) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading system data...</p>
      </div>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================
  if (error && !data.health) {
    return (
      <div className="error-container">
        <AlertCircle size={48} color="#f56565" />
        <h2>Unable to connect to backend</h2>
        <p className="error-message">{error}</p>
        <div className="error-details">
          <p>Please ensure:</p>
          <ul>
            <li>Backend server is running on <code>localhost:5000</code></li>
            <li>CORS is properly configured</li>
            <li>No firewall blocking the connection</li>
          </ul>
        </div>
        <button onClick={handleRefresh} className="retry-button">
          <RefreshCw size={16} />
          Retry Connection
        </button>
      </div>
    );
  }

  // ============================================================
  // SUCCESS STATE
  // ============================================================
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>
            <Server size={32} />
            DeployHub System Dashboard
          </h1>
          <p className="subtitle">Production monitoring and observability</p>
        </div>
        <div className="header-info">
          <span className="last-update">
            <Clock size={16} />
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <button 
            onClick={handleRefresh} 
            className="refresh-button"
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </header>

      {/* Show error banner if we have data but latest fetch failed */}
      {error && data.health && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>Latest refresh failed: {error}</span>
          <button onClick={handleRefresh} className="banner-retry">Retry</button>
        </div>
      )}

      <div className="cards-grid">
        {/* Status Card */}
        <div className="card status-card">
          <div className="card-header">
            <Activity size={24} />
            <h2>Service Status</h2>
          </div>
          <div className="card-content">
            <div className={`status-badge ${data.health?.status || 'unknown'}`}>
              {data.health?.status || 'Unknown'}
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Version</span>
                <span className="value">{data.status?.version || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Environment</span>
                <span className="value">{data.health?.environment || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Uptime</span>
                <span className="value">{formatUptime(data.health?.uptime)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Resources Card */}
        <div className="card">
          <div className="card-header">
            <Cpu size={24} />
            <h2>System Resources</h2>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <span className="label">
                  <HardDrive size={16} />
                  Memory Usage
                </span>
                <span className="value">{data.health?.system?.memory?.usage || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Total Memory</span>
                <span className="value">{data.health?.system?.memory?.total || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Free Memory</span>
                <span className="value">{data.health?.system?.memory?.free || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">CPU Cores</span>
                <span className="value">{data.health?.system?.cpus || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Platform</span>
                <span className="value">{data.health?.system?.platform || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Node Version</span>
                <span className="value">{data.health?.system?.nodeVersion || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Card */}
        <div className="card features-card">
          <div className="card-header">
            <Server size={24} />
            <h2>Platform Features</h2>
          </div>
          <div className="card-content">
            <h3>{data.info?.name || 'DeployHub'}</h3>
            <p className="description">{data.info?.description || 'Loading...'}</p>
            {data.info?.features && (
              <ul className="features-list">
                {data.info.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* API Endpoints Card */}
        <div className="card">
          <div className="card-header">
            <Activity size={24} />
            <h2>Available Endpoints</h2>
          </div>
          <div className="card-content">
            <div className="endpoints-list">
              {data.info?.endpoints ? (
                Object.entries(data.info.endpoints).map(([name, path]) => (
                  <div key={name} className="endpoint-item">
                    <span className="endpoint-name">{name}</span>
                    <code className="endpoint-path">{path}</code>
                  </div>
                ))
              ) : (
                <p>Loading endpoints...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;