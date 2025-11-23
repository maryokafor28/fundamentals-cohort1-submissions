import express, { Request, Response } from 'express';
import cors from 'cors';
import { Worker } from 'worker_threads';
import path from 'path';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Helper function to run worker thread with Promise
function runWorker(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    // Create a new worker thread - using correct path to compiled JS
    const workerPath = path.join(__dirname, 'worker.js');
    console.log(`🔍 Loading worker from: ${workerPath}`);
    
    const worker = new Worker(workerPath, {
      workerData: data
    });

    // Listen for messages from the worker
    worker.on('message', (result) => {
      if (result.success) {
        resolve(result.data);
      } else {
        reject(new Error(result.error));
      }
    });

    // Handle worker errors
    worker.on('error', (error) => {
      reject(error);
    });

    // Handle worker exit
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });

    // Send data to the worker
    worker.postMessage(data);
  });
}

// The optimized endpoint using Worker Threads
app.post('/api/process-data', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  console.log(`[${new Date().toISOString()}] 📥 Request ${requestId} received`);
  console.log(`[${new Date().toISOString()}] 🔄 Request ${requestId} delegating to Worker Thread...`);
  
  try {
    // Main thread is NOW FREE! Worker handles CPU-intensive task
    const result = await runWorker(req.body);
    
    const processingTime = Date.now() - startTime;
    
    console.log(`[${new Date().toISOString()}] ✅ Request ${requestId} completed in ${processingTime}ms (via Worker)`);
    
    res.json({
      success: true,
      data: result,
      processingTime: `${processingTime}ms`,
      optimized: true
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Request ${requestId} failed:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Processing failed'
    });
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', optimized: true });
});

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 Optimized server running on http://localhost:${PORT}`);
  console.log(`✅ Using Worker Threads for CPU-intensive operations`);
  console.log(`✅ Main Event Loop is free to handle I/O`);
  console.log('='.repeat(60));
  console.log('📊 Waiting for requests...\n');
});

export default app;