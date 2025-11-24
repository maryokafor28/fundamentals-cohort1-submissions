// This is our SLOW server - it will block and make everything wait!

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware - helps our server understand JSON and allow requests from frontend
app.use(cors());
app.use(express.json());

// This is our CPU-INTENSIVE function - it's SLOW on purpose!
function slowCalculation(n) {
  console.log(`Starting calculation for Fibonacci(${n})...`);
  
  // Calculate Fibonacci number - this is VERY slow for big numbers
  function fibonacci(num) {
    if (num <= 1) return num;
    return fibonacci(num - 1) + fibonacci(num - 2);
  }
  
  const result = fibonacci(n);
  console.log(`Finished calculation! Result: ${result}`);
  return result;
}

// Our main endpoint - THIS IS WHERE THE BLOCKING HAPPENS!
app.post('/api/process-data', (req, res) => {
  const startTime = Date.now();
  
  // Get the number from the request (or use default 40)
  const number = req.body.number || 40;
  
  console.log('🔴 Request received! Main thread is now BLOCKED...');
  
  // THIS LINE BLOCKS EVERYTHING! While this runs, no other requests can be handled
  const result = slowCalculation(number);
  
  const endTime = Date.now();
  const timeTaken = endTime - startTime;
  
  console.log(`✅ Request completed in ${timeTaken}ms`);
  
  // Send response back
  res.json({
    result: result,
    timeTaken: timeTaken,
    message: `Calculation took ${timeTaken}ms`,
    isOptimized: false
  });
});

// Simple test endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Unoptimized server running on http://localhost:${PORT}`);
  console.log(`📊 Try POST request to http://localhost:${PORT}/api/process-data`);
});