import { parentPort, workerData } from 'worker_threads';

function cpuIntensiveTask(data: any): any {
  function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
  
  // Same computation as unoptimized version
  const results = [];
  for (let i = 0; i < 5; i++) {
    results.push(fibonacci(30));
  }
  
  return {
    processedData: data,
    fibonacciResults: results,
    timestamp: Date.now()
  };
}

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