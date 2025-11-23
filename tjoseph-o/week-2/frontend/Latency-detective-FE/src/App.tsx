import { useState } from 'react';

interface TestResponse {
  success: boolean;
  time?: string;
  error?: string;
}

interface LoadTestResults {
  totalRequests: number;
  successful: number;
  failed: number;
  totalTime: string;
  avgLatency: string;
  responses: TestResponse[];
}

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<LoadTestResults | null>(null);
  const [concurrentRequests, setConcurrentRequests] = useState(100);

  const runLoadTest = async () => {
    setIsLoading(true);
    setResults(null);

    const apiUrl = 'http://localhost:5000/api/process-data';
    const testData = {
      message: 'Load test data',
      userId: 12345,
      items: Array.from({ length: 100 }, (_, i) => ({ id: i, value: Math.random() }))
    };

    const startTime = performance.now();
    const requests = [];

    // Create concurrent requests
    for (let i = 0; i < concurrentRequests; i++) {
      requests.push(
        fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData)
        })
          .then(res => res.json())
          .then(data => ({ success: true, time: data.processingTime }))
          .catch(error => ({ success: false, error: error.message }))
      );
    }

    try {
      const responses = await Promise.all(requests);
      const endTime = performance.now();
      const totalTime = endTime - startTime;

      const successCount = responses.filter(r => r.success).length;
      const failCount = responses.length - successCount;

      setResults({
        totalRequests: concurrentRequests,
        successful: successCount,
        failed: failCount,
        totalTime: (totalTime / 1000).toFixed(2),
        avgLatency: (totalTime / concurrentRequests).toFixed(2),
        responses: responses.slice(0, 5) // Show first 5 for debugging
      });
    } catch (error) {
      console.error('Load test failed:', error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            🔍 The Latency Detective
          </h1>
          <p className="text-slate-400 mb-8">Performance Profiling & Load Testing Tool</p>

          <div className="space-y-6">
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Concurrent Requests
              </label>
              <input
                type="number"
                value={concurrentRequests}
                onChange={(e) => setConcurrentRequests(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="500"
              />
            </div>

            <button
              onClick={runLoadTest}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Running Load Test...
                </span>
              ) : (
                '🚀 Start Load Test'
              )}
            </button>

            {results && (
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 space-y-4">
                <h2 className="text-2xl font-bold text-blue-400 mb-4">📊 Results</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm">Total Requests</p>
                    <p className="text-3xl font-bold">{results.totalRequests}</p>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm">Successful</p>
                    <p className="text-3xl font-bold text-green-400">{results.successful}</p>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm">Total Time</p>
                    <p className="text-3xl font-bold text-yellow-400">{results.totalTime}s</p>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm">Avg Latency</p>
                    <p className="text-3xl font-bold text-red-400">{results.avgLatency}ms</p>
                  </div>
                </div>

                {results.failed > 0 && (
                  <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
                    <p className="text-red-400 font-semibold">⚠️ {results.failed} requests failed</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3 text-slate-300">📝 Instructions</h3>
          <ol className="space-y-2 text-sm text-slate-400">
            <li>1. Ensure your Node.js server is running on port 5000</li>
            <li>2. Set concurrent requests (default: 100)</li>
            <li>3. Click "Start Load Test" to benchmark performance</li>
            <li>4. Record the average latency for your report</li>
          </ol>
        </div>
      </div>
    </div>
  );
}