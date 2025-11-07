// Quick test script to measure single request latency
const http = require('http');

async function testSingleRequest() {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const data = JSON.stringify({ data: 'test payload' });
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/process-data',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        const latency = Date.now() - startTime;
        console.log(`Request completed in ${latency}ms`);
        resolve(latency);
      });
    });

    req.on('error', (error) => {
      console.log(`Request failed: ${error.message}`);
      resolve(null);
    });

    req.write(data);
    req.end();
  });
}

testSingleRequest();