import { parentPort } from 'worker_threads';

console.log('🔧 Worker thread started');

// CPU-intensive task moved to worker thread
function cpuIntensiveTask(data: any): any {
  console.log('⚙️  Worker: Starting CPU-intensive task...');
  
  // Parse large JSON (simulated)
  const jsonString = JSON.stringify(data);
  const parsed = JSON.parse(jsonString);
  
  // Deep Fibonacci calculation (very CPU intensive)
  function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
  
  // Calculate Fibonacci numbers (reasonable for testing)
  const results = [];
  for (let i = 0; i < 3; i++) {
    results.push(fibonacci(35)); // Reduced to 35, only 3 iterations
  }
  
  // Additional CPU-intensive operations (moderate load)
  let sum = 0;
  for (let i = 0; i < 50000000; i++) { // Reduced to 50 million
    sum += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
  }
  
  console.log('✅ Worker: CPU-intensive task completed');
  
  return {
    ...parsed,
    fibResults: results,
    computedSum: sum,
    timestamp: Date.now()
  };
}

// Listen for messages from the main thread
if (parentPort) {
  console.log('📡 Worker: Listening for messages from main thread');
  
  parentPort.on('message', (data) => {
    console.log('📨 Worker: Received message from main thread');
    
    try {
      // Perform the CPU-intensive calculation
      const result = cpuIntensiveTask(data);
      
      console.log('📤 Worker: Sending result back to main thread');
      
      // Send result back to main thread
      parentPort?.postMessage({ success: true, data: result });
    } catch (error) {
      console.error('❌ Worker: Error during processing:', error);
      
      // Send error back to main thread
      parentPort?.postMessage({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });
} else {
  console.error('❌ Worker: parentPort is null! Worker not initialized properly');
}

export {};