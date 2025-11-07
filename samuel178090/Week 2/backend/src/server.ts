import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// CPU-intensive blocking function (UNOPTIMIZED)
function cpuIntensiveTask(data: any): any {
  // Simulate large JSON processing
  const largeData = JSON.parse(JSON.stringify(data));
  
  // Deep Fibonacci calculation (blocking operation)
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

// UNOPTIMIZED endpoint - blocks Event Loop
app.post('/api/process-data', (req, res) => {
  const startTime = Date.now();
  
  try {
    const result = cpuIntensiveTask(req.body);
    const processingTime = Date.now() - startTime;
    
    res.json({
      success: true,
      result,
      processingTime
    });
  } catch (error) {
    res.status(500).json({ error: 'Processing failed' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('UNOPTIMIZED VERSION - Event Loop will be blocked');
});