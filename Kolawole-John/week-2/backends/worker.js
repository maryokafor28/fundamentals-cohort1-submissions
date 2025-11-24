// This file runs in a SEPARATE THREAD!
// It's like a helper that works independently from the main server

const { parentPort } = require('worker_threads');

// This is the SAME slow calculation, but now it runs in the background!
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Listen for messages from the main thread
parentPort.on('message', (data) => {
  console.log(`👷 Worker received: Calculate Fibonacci(${data.number})`);
  
  const startTime = Date.now();
  
  // Do the heavy calculation HERE in the worker thread
  // The main thread is FREE to handle other requests!
  const result = fibonacci(data.number);
  
  const endTime = Date.now();
  const timeTaken = endTime - startTime;
  
  console.log(`✅ Worker finished in ${timeTaken}ms`);
  
  // Send the result BACK to the main thread
  parentPort.postMessage({
    result: result,
    timeTaken: timeTaken
  });
});

console.log('👷 Worker thread is ready and waiting for work!');