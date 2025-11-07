import { parentPort, workerData } from 'worker_threads';

// CPU-intensive task moved to worker thread
function cpuIntensiveTask(data: any): any {
  // Simulate large JSON processing
  const largeData = JSON.parse(JSON.stringify(data));
  
  // Deep Fibonacci calculation
  function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
  
  // Calculate multiple Fibonacci numbers
  const results = [];
  for (let i = 0; i < 35; i++) {
    results.push(fibonacci(35));
  }
  
  return {
    processedData: largeData,
    fibonacciResults: results,
    timestamp: Date.now()
  };
}

// Process the task and send result back to main thread
if (parentPort) {
  try {
    const result = cpuIntensiveTask(workerData);
    parentPort.postMessage({ success: true, result });
  } catch (error) {
    parentPort.postMessage({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}