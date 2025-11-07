const { spawn } = require('child_process');
const http = require('http');

let serverProcess = null;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequest() {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const data = JSON.stringify({ data: 'test payload' });
    
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
        resolve({
          success: res.statusCode === 200,
          latency: Date.now() - startTime
        });
      });
    });

    req.on('error', () => resolve({ success: false, latency: 0 }));
    req.write(data);
    req.end();
  });
}

async function startServer(serverFile) {
  return new Promise((resolve) => {
    serverProcess = spawn('node', [serverFile], { stdio: 'pipe' });
    setTimeout(resolve, 2000); // Wait for server to start
  });
}

function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}

async function runLoadTest(concurrency = 10) {
  console.log(`Running ${concurrency} concurrent requests...`);
  const promises = Array(concurrency).fill().map(() => makeRequest());
  const results = await Promise.all(promises);
  
  const successful = results.filter(r => r.success);
  const latencies = successful.map(r => r.latency);
  
  return {
    total: results.length,
    successful: successful.length,
    avgLatency: latencies.length ? latencies.reduce((a, b) => a + b) / latencies.length : 0,
    minLatency: latencies.length ? Math.min(...latencies) : 0,
    maxLatency: latencies.length ? Math.max(...latencies) : 0
  };
}

async function runPerformanceTest() {
  console.log('🔍 LATENCY DETECTIVE - Performance Test\n');
  
  // Test 1: Unoptimized Version
  console.log('📊 PHASE 1: Testing UNOPTIMIZED version');
  console.log('Starting unoptimized server...');
  await startServer('dist/server.js');
  
  const unoptimizedResults = await runLoadTest(10);
  console.log(`✅ Results: ${unoptimizedResults.successful}/${unoptimizedResults.total} successful`);
  console.log(`⏱️  Average latency: ${unoptimizedResults.avgLatency.toFixed(0)}ms`);
  console.log(`📈 Range: ${unoptimizedResults.minLatency}ms - ${unoptimizedResults.maxLatency}ms\n`);
  
  stopServer();
  await delay(1000);
  
  // Test 2: Optimized Version
  console.log('📊 PHASE 2: Testing OPTIMIZED version');
  console.log('Starting optimized server...');
  await startServer('dist/server-optimized.js');
  
  const optimizedResults = await runLoadTest(10);
  console.log(`✅ Results: ${optimizedResults.successful}/${optimizedResults.total} successful`);
  console.log(`⏱️  Average latency: ${optimizedResults.avgLatency.toFixed(0)}ms`);
  console.log(`📈 Range: ${optimizedResults.minLatency}ms - ${optimizedResults.maxLatency}ms\n`);
  
  stopServer();
  
  // Calculate improvement
  const improvement = ((unoptimizedResults.avgLatency - optimizedResults.avgLatency) / unoptimizedResults.avgLatency * 100);
  
  console.log('🎯 PERFORMANCE COMPARISON');
  console.log(`Unoptimized: ${unoptimizedResults.avgLatency.toFixed(0)}ms average`);
  console.log(`Optimized:   ${optimizedResults.avgLatency.toFixed(0)}ms average`);
  console.log(`Improvement: ${improvement.toFixed(1)}% faster\n`);
  
  // Update README with results
  const fs = require('fs');
  let readme = fs.readFileSync('README.md', 'utf8');
  readme = readme.replace('[TO BE MEASURED]', `${unoptimizedResults.avgLatency.toFixed(0)}ms`);
  readme = readme.replace('[TO BE CALCULATED]', improvement.toFixed(1));
  fs.writeFileSync('README.md', readme);
  
  console.log('📝 README.md updated with performance results!');
}

runPerformanceTest().catch(console.error);