import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// CPU-intensive synchronous function that blocks the Event Loop
function cpuIntensiveTask(data: any): any {
  // Parse large JSON (simulated)
  const jsonString = JSON.stringify(data);
  const parsed = JSON.parse(jsonString);
  
  // Simple CPU-intensive calculation (for demonstration)
  function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
  
  // Very light Fibonacci - just for demo purposes
  const results = [];
  results.push(fibonacci(35)); // Just 1 fibonacci call
  
  // Simple loop for CPU work
  let sum = 0;
  for (let i = 0; i < 100000000; i++) { // 100 million simple additions
    sum += i;
  }
  
  return {
    ...parsed,
    fibResults: results,
    computedSum: sum,
    timestamp: Date.now()
  };
}

// The bottleneck endpoint
app.post('/api/process-data', (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  console.log(`[${new Date().toISOString()}] 📥 Request ${requestId} received`);
  
  try {
    console.log(`[${new Date().toISOString()}] ⚙️  Request ${requestId} processing (this will block the Event Loop)...`);
    
    // This BLOCKS the Event Loop!
    const result = cpuIntensiveTask(req.body);
    
    const processingTime = Date.now() - startTime;
    
    console.log(`[${new Date().toISOString()}] ✅ Request ${requestId} completed in ${processingTime}ms`);
    
    res.json({
      success: true,
      data: result,
      processingTime: `${processingTime}ms`
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Request ${requestId} failed:`, error);
    res.status(500).json({
      success: false,
      error: 'Processing failed'
    });
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 Unoptimized server running on http://localhost:${PORT}`);
  console.log(`⚠️  WARNING: This server has blocking CPU operations!`);
  console.log('='.repeat(60));
  console.log('📊 Waiting for requests...\n');
});

export default app;