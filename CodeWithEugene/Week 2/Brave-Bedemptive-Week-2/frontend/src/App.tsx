import { useState } from 'react';
import './App.css';

interface TestResult {
  latency: number;
  successCount: number;
  errorCount: number;
  totalTime: number;
  result?: { data: string; processedAt: string };
}

interface PerformanceInsight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  icon: string;
}

function App() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [requestCount, setRequestCount] = useState<number>(100);
  const [progress, setProgress] = useState<number>(0);

  const BASE_URL = 'http://localhost:3000';

  const sendRequests = async () => {
    setLoading(true);
    setTestResult(null);
    setProgress(0);
    const startTime = Date.now();

    const promises = Array.from({ length: requestCount }).map(async (_, index) => {
      try {
        const response = await fetch(`${BASE_URL}/api/process-data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: `request-${index}` }),
        });
        
        // Update progress
        setProgress(prev => prev + (100 / requestCount));
        
        return response.json();
      } catch (error) {
        console.error(`Request ${index} failed:`, error);
        setProgress(prev => prev + (100 / requestCount));
        return null;
      }
    });

    const responses = await Promise.all(promises);
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const avgLatency = totalTime / requestCount;
    const successCount = responses.filter(r => r !== null).length;
    const errorCount = requestCount - successCount;

    setTestResult({
      latency: avgLatency,
      successCount,
      errorCount,
      totalTime,
      result: responses.find(r => r !== null) || undefined
    });
    setLoading(false);
    setProgress(0);
  };

  const getPerformanceRating = (latency: number) => {
    if (latency < 10) return { rating: 'Excellent', color: '#10b981' };
    if (latency < 20) return { rating: 'Good', color: '#3b82f6' };
    if (latency < 50) return { rating: 'Fair', color: '#f59e0b' };
    return { rating: 'Poor', color: '#ef4444' };
  };

  const getPerformanceInsights = (result: TestResult): PerformanceInsight[] => {
    const insights: PerformanceInsight[] = [];
    
    // Latency insights
    if (result.latency < 15) {
      insights.push({
        type: 'success',
        title: 'Excellent Performance',
        description: `Your average latency of ${result.latency.toFixed(2)}ms is excellent! The Worker Thread optimization is working effectively.`,
        icon: '🚀'
      });
    } else if (result.latency < 25) {
      insights.push({
        type: 'info',
        title: 'Good Performance',
        description: `Your average latency of ${result.latency.toFixed(2)}ms shows good performance. Consider monitoring under higher loads.`,
        icon: '✅'
      });
    } else {
      insights.push({
        type: 'warning',
        title: 'Performance Concerns',
        description: `Your average latency of ${result.latency.toFixed(2)}ms is higher than expected. Check server resources and optimization.`,
        icon: '⚠️'
      });
    }

    // Success rate insights
    const successRate = (result.successCount / requestCount) * 100;
    if (successRate >= 99) {
      insights.push({
        type: 'success',
        title: 'High Reliability',
        description: `${successRate.toFixed(1)}% success rate indicates excellent system stability.`,
        icon: '💪'
      });
    } else if (successRate >= 95) {
      insights.push({
        type: 'info',
        title: 'Good Reliability',
        description: `${successRate.toFixed(1)}% success rate shows good system stability with minor issues.`,
        icon: '📊'
      });
    } else {
      insights.push({
        type: 'warning',
        title: 'Reliability Issues',
        description: `${successRate.toFixed(1)}% success rate indicates potential system issues that need attention.`,
        icon: '🔧'
      });
    }

    // Throughput insights
    const requestsPerSecond = (requestCount / (result.totalTime / 1000)).toFixed(1);
    insights.push({
      type: 'info',
      title: 'Throughput Analysis',
      description: `Processing ${requestsPerSecond} requests per second. This shows your system's concurrent processing capability.`,
      icon: '⚡'
    });

    return insights;
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="header-content">
            <h1 className="title">
              <span className="title-icon">🔍</span>
              Latency Detective
            </h1>
            <p className="subtitle">
              Performance testing tool for Node.js Worker Thread optimization
            </p>
          </div>
        </header>

        <main className="main">
          <div className="test-config">
            <div className="config-card">
              <h2>Test Configuration</h2>
              <div className="input-group">
                <label htmlFor="requestCount">Number of Concurrent Requests</label>
                <input
                  id="requestCount"
                  type="number"
                  value={requestCount}
                  onChange={(e) => setRequestCount(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="1000"
                  className="request-input"
                />
              </div>
              <button 
                onClick={sendRequests} 
                disabled={loading} 
                className="test-button"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Running Test...
                  </>
                ) : (
                  <>
                    <span className="button-icon">🚀</span>
                    Start Performance Test
                  </>
                )}
              </button>
            </div>
          </div>

          {loading && (
            <div className="progress-section">
              <div className="progress-card">
                <h3>Test in Progress</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  Sending {requestCount} concurrent requests...
                </p>
              </div>
            </div>
          )}

          {testResult && (
            <div className="results-section">
              <div className="results-card">
                <h2>Test Results</h2>
                
                <div className="metrics-grid">
                  <div className="metric-card primary">
                    <div className="metric-icon">⚡</div>
                    <div className="metric-content">
                      <h3>Average Latency</h3>
                      <div className="metric-value">
                        {testResult.latency.toFixed(2)} ms
                      </div>
                      <div 
                        className="performance-rating"
                        style={{ color: getPerformanceRating(testResult.latency).color }}
                      >
                        {getPerformanceRating(testResult.latency).rating}
                      </div>
                    </div>
                  </div>

                  <div className="metric-card success">
                    <div className="metric-icon">✅</div>
                    <div className="metric-content">
                      <h3>Successful Requests</h3>
                      <div className="metric-value">{testResult.successCount}</div>
                      <div className="metric-percentage">
                        {((testResult.successCount / requestCount) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="metric-card error">
                    <div className="metric-icon">❌</div>
                    <div className="metric-content">
                      <h3>Failed Requests</h3>
                      <div className="metric-value">{testResult.errorCount}</div>
                      <div className="metric-percentage">
                        {((testResult.errorCount / requestCount) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="metric-card info">
                    <div className="metric-icon">⏱️</div>
                    <div className="metric-content">
                      <h3>Total Test Time</h3>
                      <div className="metric-value">{testResult.totalTime} ms</div>
                      <div className="metric-subtitle">Wall clock time</div>
                    </div>
                  </div>
                </div>

                {/* Performance Insights */}
                <div className="insights-section">
                  <h3>Performance Insights</h3>
                  <div className="insights-grid">
                    {getPerformanceInsights(testResult).map((insight, index) => (
                      <div key={index} className={`insight-card ${insight.type}`}>
                        <div className="insight-icon">{insight.icon}</div>
                        <div className="insight-content">
                          <h4>{insight.title}</h4>
                          <p>{insight.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {testResult.result && (
                  <div className="response-section">
                    <h3>Sample Response</h3>
                    <div className="response-card">
                      <pre className="response-json">
                        {JSON.stringify(testResult.result, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        <footer className="footer">
          <p>
            Built with React + TypeScript • 
            <a href="https://github.com/CodeWithEugene/Brave-Bedemptive-Week-2" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;