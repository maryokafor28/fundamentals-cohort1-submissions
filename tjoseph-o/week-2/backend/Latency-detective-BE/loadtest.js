const autocannon = require('autocannon');

// Configuration
const url = 'http://localhost:3000/api/process-data';
const connections = 100; // Concurrent connections
const duration = 30; // Test duration in seconds

const testData = {
  message: 'Load test data',
  userId: 12345,
  items: Array.from({ length: 100 }, (_, i) => ({ 
    id: i, 
    value: Math.random() 
  }))
};

console.log('🚀 Starting Load Test...');
console.log(`📊 Configuration:`);
console.log(`   URL: ${url}`);
console.log(`   Connections: ${connections}`);
console.log(`   Duration: ${duration}s`);
console.log('');

const instance = autocannon({
  url,
  connections,
  duration,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testData),
  setupClient: (client) => {
    // Track individual request timings
    client.on('response', (statusCode, resBytes, responseTime) => {
      if (statusCode !== 200) {
        console.log(`⚠️  Request failed with status: ${statusCode}`);
      }
    });
  }
}, (err, results) => {
  if (err) {
    console.error('❌ Load test failed:', err);
    return;
  }

  console.log('\n📈 LOAD TEST RESULTS');
  console.log('='.repeat(50));
  console.log('');
  
  console.log('📊 Request Statistics:');
  console.log(`   Total Requests: ${results.requests.total}`);
  console.log(`   Requests/sec: ${results.requests.average}`);
  console.log(`   Successful: ${results['2xx']}`);
  console.log(`   Failed: ${results.non2xx || 0}`);
  console.log('');
  
  console.log('⏱️  Latency Statistics:');
  console.log(`   Average: ${results.latency.mean}ms`);
  console.log(`   Median (p50): ${results.latency.p50}ms`);
  console.log(`   p75: ${results.latency.p75}ms`);
  console.log(`   p90: ${results.latency.p90}ms`);
  console.log(`   p99: ${results.latency.p99}ms`);
  console.log(`   Max: ${results.latency.max}ms`);
  console.log('');
  
  console.log('📦 Throughput:');
  console.log(`   Average: ${(results.throughput.average / 1024 / 1024).toFixed(2)} MB/s`);
  console.log('');
  
  console.log('🎯 Performance Summary:');
  const avgLatencySeconds = (results.latency.mean / 1000).toFixed(2);
  console.log(`   Average Request Latency: ${avgLatencySeconds}s`);
  console.log(`   Total Test Duration: ${results.duration}s`);
  console.log('');
  
  // Performance evaluation
  if (results.latency.mean < 100) {
    console.log('✅ EXCELLENT: Latency < 100ms');
  } else if (results.latency.mean < 500) {
    console.log('✅ GOOD: Latency < 500ms');
  } else if (results.latency.mean < 1000) {
    console.log('⚠️  FAIR: Latency < 1s');
  } else if (results.latency.mean < 3000) {
    console.log('⚠️  POOR: Latency < 3s');
  } else {
    console.log('❌ CRITICAL: Latency > 3s - Event Loop likely blocked!');
  }
  
  console.log('');
  console.log('💡 Next Steps:');
  console.log('   1. Record these metrics in your README.md');
  console.log('   2. Take a screenshot of the results');
  console.log('   3. Run CPU profiling with: node --inspect dist/app.js');
  console.log('   4. Compare with optimized version results');
});

// Track progress
autocannon.track(instance, {
  renderProgressBar: true,
  renderLatencyTable: true
});