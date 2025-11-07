// Simple Node.js script for command-line load testing
const http = require('http');

async function makeRequest(id) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const data = JSON.stringify({ data: 'test payload for processing' });
    
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
        const endTime = Date.now();
        resolve({
          id,
          statusCode: res.statusCode,
          latency: endTime - startTime,
          success: res.statusCode === 200
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        id,
        statusCode: 0,
        latency: Date.now() - startTime,
        success: false,
        error: error.message
      });
    });

    req.write(data);
    req.end();
  });
}

async function runLoadTest() {
  console.log('Starting load test with 100 concurrent requests...');
  const startTime = Date.now();
  
  const promises = [];
  for (let i = 1; i <= 100; i++) {
    promises.push(makeRequest(i));
  }

  const results = await Promise.all(promises);
  const endTime = Date.now();
  
  const successful = results.filter(r => r.success);
  const latencies = successful.map(r => r.latency);
  
  console.log('\n=== LOAD TEST RESULTS ===');
  console.log(`Total time: ${endTime - startTime}ms`);
  console.log(`Total requests: ${results.length}`);
  console.log(`Successful requests: ${successful.length}`);
  console.log(`Failed requests: ${results.length - successful.length}`);
  
  if (latencies.length > 0) {
    console.log(`Average latency: ${(latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2)}ms`);
    console.log(`Min latency: ${Math.min(...latencies)}ms`);
    console.log(`Max latency: ${Math.max(...latencies)}ms`);
  }
  
  console.log('\nFirst 10 request details:');
  results.slice(0, 10).forEach(r => {
    console.log(`Request ${r.id}: ${r.success ? 'SUCCESS' : 'FAILED'} - ${r.latency}ms`);
  });
}

runLoadTest().catch(console.error);