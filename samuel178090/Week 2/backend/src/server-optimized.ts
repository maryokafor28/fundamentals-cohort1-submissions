import express from 'express';
import cors from 'cors';
import { Worker } from 'worker_threads';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper function to run worker thread
function runWorker(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'worker.js'), {
      workerData: data
    });

    worker.on('message', (result) => {
      if (result.success) {
        resolve(result.result);
      } else {
        reject(new Error(result.error));
      }
    });

    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

// OPTIMIZED endpoint - uses Worker Threads
app.post('/api/process-data', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const result = await runWorker(req.body);
    const processingTime = Date.now() - startTime;
    
    res.json({
      success: true,
      result,
      processingTime
    });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Processing failed' 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('OPTIMIZED VERSION - Using Worker Threads');
});