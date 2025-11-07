const { spawn } = require('child_process');
const http = require('http');

let serverProcess = null;

async function makeRequest(id) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const data = JSON.stringify({ data: `test-${id}` });
    
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/process-data',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        const latency = Date.now() - startTime;
        resolve({ id, latency, success: res.statusCode === 200 });
      });
    });

    req.on('error', () => resolve({ id, latency: 0, success: false }));
    req.write(data);
    req.end();
  });
}

async function testServer(serverFile, name) {
  console.log(`\n🔍 Testing ${name}`);
  console.log('='.repeat(40));
  
  serverProcess = spawn('node', [serverFile], { stdio: 'pipe' });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('Sending 3 requests simultaneously...');
  const startTime = Date.now();
  
  const results = await Promise.all([
    makeRequest(1),
    makeRequest(2), 
    makeRequest(3)
  ]);
  
  const totalTime = Date.now() - startTime;
  
  console.log('\nResults:');
  results.forEach(r => {
    console.log(`Request ${r.id}: ${r.latency}ms`);
  });
  
  console.log(`\nTotal time: ${totalTime}ms`);
  console.log(`Average: ${(results.reduce((sum, r) => sum + r.latency, 0) / 3).toFixed(0)}ms`);
  
  serverProcess.kill();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { totalTime, results };
}

async function runDemo() {
  console.log('🚀 LATENCY DETECTIVE - Final Demo\n');
  
  const unoptimized = await testServer('dist/server-simple.js', 'UNOPTIMIZED (Blocking)');
  const optimized = await testServer('dist/server-simple-optimized.js', 'OPTIMIZED (Non-blocking)');
  
  console.log('\n🎯 FINAL COMPARISON');
  console.log('='.repeat(40));
  console.log(`Unoptimized total: ${unoptimized.totalTime}ms`);
  console.log(`Optimized total:   ${optimized.totalTime}ms`);
  
  const improvement = ((unoptimized.totalTime - optimized.totalTime) / unoptimized.totalTime * 100);
  console.log(`\nImprovement: ${improvement > 0 ? improvement.toFixed(1) + '% faster' : 'Similar performance'}`);
  
  console.log('\n💡 Key Learning:');
  console.log('Worker Threads prevent Event Loop blocking,');
  console.log('enabling true concurrent request processing!');
}

runDemo().catch(console.error);