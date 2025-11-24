// This is our OPTIMIZED server - it uses Worker Threads!

const express = require('express');
const cors = require('cors');
const { Worker } = require('worker_threads');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// This function creates a worker and returns a Promise
// A Promise is like a "ticket" - it says "I'll give you the result later"
function runWorker(number) {
  return new Promise((resolve, reject) => {
    // Create a new worker thread
    const worker = new Worker(path.join(__dirname, 'worker.js'));
    
    console.log(`🚀 Spawning worker for Fibonacci(${number})`);
    
    // Listen for messages FROM the worker
    worker.on('message', (result) => {
      console.log(`📨 Received result from worker`);
      resolve(result); // Send the result back
      worker.terminate(); // Close the worker (clean up)
    });
    
    // Handle errors
    worker.on('error', (error) => {
      console.error('❌ Worker error:', error);
      reject(error);
      worker.terminate();
    });
    
    // Handle unexpected exit
    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`❌ Worker stopped with exit code ${code}`);
      }
    });
    
    // Send the number TO the worker
    worker.postMessage({ number: number });
  });
}

// Our OPTIMIZED endpoint!
app.post('/api/process-data', async (req, res) => {
  const startTime = Date.now();
  const number = req.body.number || 40;
  
  console.log(`📥 Request received! Main thread is FREE to handle other requests!`);
  
  try {
    // This is the KEY difference!
    // We use 'await' to wait for the worker, but the main thread isn't blocked
    // Other requests can come in and be processed while we wait!
    const workerResult = await runWorker(number);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log(`✅ Request completed in ${totalTime}ms (optimized)`);
    
    res.json({
      result: workerResult.result,
      workerTime: workerResult.timeTaken,
      totalTime: totalTime,
      message: `Calculation took ${totalTime}ms (optimized with Worker Threads)`,
      isOptimized: true
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Calculation failed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Optimized server is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 OPTIMIZED server running on http://localhost:${PORT}`);
  console.log(`⚡ Using Worker Threads for better performance!`);
  console.log(`📊 Try POST request to http://localhost:${PORT}/api/process-data`);
});