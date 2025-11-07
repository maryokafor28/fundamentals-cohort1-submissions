const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// CPU-intensive task
function cpuIntensiveTask(data) {
  const largeData = JSON.parse(JSON.stringify(data));
  
  function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
  
  const results = [];
  for (let i = 0; i < 5; i++) {
    results.push(fibonacci(30));
  }
  
  return {
    processedData: largeData,
    fibonacciResults: results,
    timestamp: Date.now()
  };
}

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
  console.log(`Server running on port ${PORT}`);
  console.log('UNOPTIMIZED VERSION - Event Loop BLOCKED');
});