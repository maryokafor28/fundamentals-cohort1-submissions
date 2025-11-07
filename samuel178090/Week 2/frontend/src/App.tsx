import { useState } from 'react';
import './App.css';

interface TestResult {
  requestId: number;
  success: boolean;
  processingTime: number;
  error?: string;
}

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [stats, setStats] = useState<{
    totalRequests: number;
    successfulRequests: number;
    averageLatency: number;
    minLatency: number;
    maxLatency: number;
  } | null>(null);

  const runLoadTest = async () => {
    setIsRunning(true);
    setResults([]);
    setStats(null);

    const testData = { data: 'test payload for processing' };
    const promises: Promise<TestResult>[] = [];

    // Create 100 concurrent requests
    for (let i = 0; i < 100; i++) {
      const promise = fetch(`${import.meta.env.VITE_API_URL || 'https://latency-detective-backend.onrender.com'}/api/process-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      .then(async (response) => {
        const data = await response.json();
        return {
          requestId: i + 1,
          success: response.ok,
          processingTime: data.processingTime || 0
        };
      })
      .catch((error) => ({
        requestId: i + 1,
        success: false,
        processingTime: 0,
        error: error.message
      }));

      promises.push(promise);
    }

    try {
      const testResults = await Promise.all(promises);
      setResults(testResults);

      // Calculate statistics
      const successful = testResults.filter(r => r.success);
      const latencies = successful.map(r => r.processingTime);
      
      if (latencies.length > 0) {
        setStats({
          totalRequests: testResults.length,
          successfulRequests: successful.length,
          averageLatency: latencies.reduce((a, b) => a + b, 0) / latencies.length,
          minLatency: Math.min(...latencies),
          maxLatency: Math.max(...latencies)
        });
      }
    } catch (error) {
      console.error('Load test failed:', error);
    }

    setIsRunning(false);
  };

  return (
    <div className="App">
      <h1>Latency Detective - Load Tester</h1>
      
      <button 
        onClick={runLoadTest} 
        disabled={isRunning}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px', 
          marginBottom: '20px',
          backgroundColor: isRunning ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isRunning ? 'not-allowed' : 'pointer'
        }}
      >
        {isRunning ? 'Running Load Test...' : 'Run 100 Concurrent Requests'}
      </button>

      {stats && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <h3>Test Results</h3>
          <p><strong>Total Requests:</strong> {stats.totalRequests}</p>
          <p><strong>Successful Requests:</strong> {stats.successfulRequests}</p>
          <p><strong>Average Latency:</strong> {stats.averageLatency.toFixed(2)}ms</p>
          <p><strong>Min Latency:</strong> {stats.minLatency}ms</p>
          <p><strong>Max Latency:</strong> {stats.maxLatency}ms</p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h3>Individual Request Results (First 10)</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {results.slice(0, 10).map((result) => (
              <div key={result.requestId} style={{ 
                padding: '5px', 
                borderBottom: '1px solid #eee',
                color: result.success ? 'green' : 'red'
              }}>
                Request {result.requestId}: {result.success ? 'Success' : 'Failed'} 
                {result.success && ` - ${result.processingTime}ms`}
                {result.error && ` - ${result.error}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;