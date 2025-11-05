import { parentPort, workerData } from 'worker_threads';

// A complex mathematical loop (Fibonacci for deep recursion)
function fibonacci(n: number): number {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// A function to simulate massive JSON parsing
function parseLargeJson(data: any): any {
    let largeObject: any = {};
    for (let i = 0; i < 1000; i++) { // Ensure this matches the app.ts version for comparison
        largeObject[`key_${i}`] = { ...data, timestamp: Date.now() + i };
    }
    return JSON.parse(JSON.stringify(largeObject));
}

if (parentPort) {
  // Receive data from the main thread
  const { inputData } = workerData;

  console.log('Worker thread started processing data...');

  // Perform the CPU-intensive tasks
  const processedJson = parseLargeJson(inputData.data);
  const fibResult = fibonacci(40); // Same fibonacci number as unoptimized

  console.log('Worker thread finished processing data.');

  // Send the result back to the main thread
  parentPort.postMessage({
    fibonacciResult: fibResult,
    processedJsonKeys: Object.keys(processedJson).length,
    message: 'Data processed by worker',
    originalData: inputData.data,
    timestamp: new Date().toISOString(),
  });
}