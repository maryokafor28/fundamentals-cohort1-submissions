const { spawn } = require('child_process');
const http = require('http');

let serverProcess = null;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequest(id) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const data = JSON.stringify({ data: `request-${id}` });
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/process-data',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        const latency = Date.now() - startTime;
        console.log(`Request ${id}: ${latency}ms`);
        resolve({ id, success: res.statusCode === 200, latency });
      });
    });

    req.on('error', (err) => {
      console.log(`Request ${id}: FAILED - ${err.message}`);
      resolve({ id, success: false, latency: 0 });
    });
    
    req.write(data);
    req.end();
  });
}

async function startServer(serverFile) {
  return new Promise((resolve) => {
    console.log(`Starting ${serverFile}...`);
    serverProcess = spawn('node', [serverFile], { stdio: 'pipe' });
    setTimeout(resolve, 3000);
  });
}

function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}

async function testConcurrency(serverFile, testName) {
  console.log(`\n🔍 ${testName}`);
  console.log('='.repeat(50));
  
  await startServer(serverFile);
  
  console.log('Sending 5 concurrent requests...');
  const startTime = Date.now();
  
  const promises = [1, 2, 3, 4, 5].map(id => makeRequest(id));
  const results = await Promise.all(promises);
  
  const totalTime = Date.now() - startTime;
  const successful = results.filter(r => r.success);
  
  console.log(`\n📊 Results:`);
  console.log(`Total time: ${totalTime}ms`);
  console.log(`Successful: ${successful.length}/5`);
  
  if (successful.length > 0) {
    const latencies = successful.map(r => r.latency);
    console.log(`Average latency: ${(latencies.reduce((a, b) => a + b) / latencies.length).toFixed(0)}ms`);
  }
  
  stopServer();
  await delay(2000);
  
  return { totalTime, successful: successful.length };
}

async function runConcurrencyTest() {
  console.log('🚀 CONCURRENCY TEST - The Real Difference\n');
  
  const unoptimized = await testConcurrency('dist/server.js', 'UNOPTIMIZED (Sequential)');
  const optimized = await testConcurrency('dist/server-optimized.js', 'OPTIMIZED (Concurrent)');
  
  console.log('\n🎯 COMPARISON');
  console.log(`Unoptimized: ${unoptimized.totalTime}ms`);
  console.log(`Optimized: ${optimized.totalTime}ms`);
  
  const improvement = ((unoptimized.totalTime - optimized.totalTime) / unoptimized.totalTime * 100);
  console.log(`Improvement: ${improvement.toFixed(1)}% faster`);
}

runConcurrencyTest().catch(console.error);