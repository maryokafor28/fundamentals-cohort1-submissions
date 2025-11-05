import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- CPU-Intensive, Synchronous Functions ---

// A complex mathematical loop (Fibonacci for deep recursion)
function fibonacci(n: number): number {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// A function to simulate massive JSON parsing
function parseLargeJson(data: any): any {
    // Create a very large object by duplicating the input many times
    let largeObject: any = {};
    for (let i = 0; i < 1000; i++) { // Adjust this number for more or less intensity
        largeObject[`key_${i}`] = { ...data, timestamp: Date.now() + i };
    }
    // Stringify and parse to simulate real JSON processing overhead
    return JSON.parse(JSON.stringify(largeObject));
}


// --- Unoptimized Endpoint ---
app.post('/api/process-data', (req, res) => {
  console.log('Received request on main thread (unoptimized)');
  const { data } = req.body;

  // Simulate massive JSON data processing
  const processedJson = parseLargeJson(data);

  // Perform CPU-intensive calculation
  // A large number like 40-42 for Fibonacci will block significantly
  const fibResult = fibonacci(40);

  res.json({
    message: 'Data processed (unoptimized)',
    originalData: data,
    fibonacciResult: fibResult,
    processedJsonKeys: Object.keys(processedJson).length,
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.listen(port, () => {
  console.log(`Unoptimized server listening at http://localhost:${port}`);
});