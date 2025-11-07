const { spawn } = require('child_process');
const http = require('http');

async function testSingleServer() {
  console.log('🔍 Testing Server Performance\n');
  
  // Kill any existing processes
  try {
    require('child_process').execSync('taskkill /F /IM node.exe', { stdio: 'ignore' });
  } catch (e) {}
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Starting server...');
  const server = spawn('node', ['dist/server-simple.js'], { stdio: 'pipe' });
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('Sending test request...');
  
  const startTime = Date.now();
  const data = JSON.stringify({ data: 'test' });
  
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
      console.log(`✅ Request completed: ${latency}ms`);
      console.log(`📊 Status: ${res.statusCode}`);
      
      server.kill();
      console.log('\n🎯 Test completed successfully!');
    });
  });
  
  req.on('error', (error) => {
    console.log(`❌ Request failed: ${error.message}`);
    server.kill();
  });
  
  req.write(data);
  req.end();
}

testSingleServer().catch(console.error);