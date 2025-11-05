import express from 'express';
import cors from 'cors';
import { Worker } from 'worker_threads';
import path from 'path';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- Optimized Endpoint using Worker Threads ---
app.post('/api/process-data', async (req, res) => {
  console.log('Received request on main thread (optimized)');
  const { data } = req.body;

  try {
    // Create a new worker for each request (for simplicity in this example)
    // In a real application, you might use a worker pool for better performance
    const worker = new Worker(path.resolve(__dirname, 'worker.js'), { // Note: path.resolve to compiled JS
      workerData: { inputData: req.body },
    });

    worker.on('message', (result) => {
      console.log('Worker thread sent message back to main thread.');
      res.json(result);
    });

    worker.on('error', (err) => {
      console.error('Worker thread error:', err);
      res.status(500).json({ error: 'Worker thread error processing data.' });
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
    });
  } catch (error) {
    console.error('Failed to spawn worker:', error);
    res.status(500).json({ error: 'Failed to offload task to worker.' });
  }
});

app.get('/', (req, res) => {
    res.send('Backend is running (optimized)!');
});

app.listen(port, () => {
  console.log(`Optimized server listening at http://localhost:${port}`);
});