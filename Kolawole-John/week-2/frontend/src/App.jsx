import { useState } from 'react';
import './App.css';

function App() {
  // State to store our results
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfRequests, setNumberOfRequests] = useState(5);

  // Function to send ONE request
  const sendRequest = async () => {
    const startTime = Date.now();
    
    try {
      const response = await fetch('http://localhost:3000/api/process-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number: 40 }) // Calculate Fibonacci(40)
      });
      
      const data = await response.json();
      const totalTime = Date.now() - startTime;
      
      return {
        success: true,
        serverTime: data.timeTaken,
        totalTime: totalTime,
        result: data.result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Function to send MULTIPLE requests at once
  const sendConcurrentRequests = async () => {
    setIsLoading(true);
    setResults([]); // Clear previous results
    
    console.log(`🚀 Sending ${numberOfRequests} concurrent requests...`);
    
    // Create an array of promises (multiple requests at the same time)
    const promises = [];
    for (let i = 0; i < numberOfRequests; i++) {
      promises.push(sendRequest());
    }
    
    // Wait for ALL requests to complete
    const allResults = await Promise.all(promises);
    
    // Calculate average time
    const successfulResults = allResults.filter(r => r.success);
    const avgTime = successfulResults.reduce((sum, r) => sum + r.totalTime, 0) / successfulResults.length;
    
    console.log(`✅ All requests completed! Average time: ${avgTime.toFixed(2)}ms`);
    
    setResults(allResults);
    setIsLoading(false);
  };

  // Calculate statistics
  const stats = results.length > 0 ? {
    total: results.length,
    successful: results.filter(r => r.success).length,
    avgTime: (results.filter(r => r.success).reduce((sum, r) => sum + r.totalTime, 0) / results.filter(r => r.success).length).toFixed(2),
    minTime: Math.min(...results.filter(r => r.success).map(r => r.totalTime)),
    maxTime: Math.max(...results.filter(r => r.success).map(r => r.totalTime))
  } : null;

  return (
    <div className="App">
      <header>
        <h1>🔍 The Latency Detective</h1>
        <p>Load Testing Tool</p>
        <div style={{marginTop: '10px', fontSize: '0.9em'}}>
          <span style={{padding: '5px 15px', background: 'rgba(255,255,255,0.2)', borderRadius: '20px'}}>
            Testing: {results.length > 0 && results[0].success ? (results[0].isOptimized ? '⚡ Optimized' : '🐌 Unoptimized') : 'Ready'}
          </span>
        </div>
      </header>

      <main>
        <div className="controls">
          <div className="input-group">
            <label>Number of Concurrent Requests:</label>
            <input 
              type="number" 
              value={numberOfRequests}
              onChange={(e) => setNumberOfRequests(parseInt(e.target.value))}
              min="1"
              max="100"
              disabled={isLoading}
            />
          </div>
          
          <button 
            onClick={sendConcurrentRequests}
            disabled={isLoading}
            className="test-button"
          >
            {isLoading ? '⏳ Testing...' : '🚀 Run Load Test'}
          </button>
        </div>

        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Sending {numberOfRequests} requests... Watch your browser console!</p>
          </div>
        )}

        {stats && (
          <div className="results">
            <h2>📊 Results</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Requests</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.successful}</div>
                <div className="stat-label">Successful</div>
              </div>
              <div className="stat-card highlight">
                <div className="stat-value">{stats.avgTime}ms</div>
                <div className="stat-label">Average Time</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.minTime}ms</div>
                <div className="stat-label">Fastest</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.maxTime}ms</div>
                <div className="stat-label">Slowest</div>
              </div>
            </div>

            <div className="results-list">
              <h3>Individual Request Times:</h3>
              {results.map((result, index) => (
                <div key={index} className={`result-item ${result.success ? 'success' : 'error'}`}>
                  <span className="request-number">Request #{index + 1}</span>
                  {result.success ? (
                    <span className="time">{result.totalTime}ms</span>
                  ) : (
                    <span className="error-msg">Failed: {result.error}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;