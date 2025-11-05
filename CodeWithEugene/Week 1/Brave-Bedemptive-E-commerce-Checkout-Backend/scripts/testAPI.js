const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const TEST_USER_ID = 'test_user_123';

// Test API endpoints
async function testAPI() {
  try {
    console.log('🧪 Testing Cart Service API...\n');

    // 1. Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log(`✅ Health check: ${healthResponse.data.message}\n`);

    // 2. Get empty cart
    console.log('2. Testing get cart (should be empty)...');
    const emptyCartResponse = await axios.get(`${BASE_URL}/get-cart/${TEST_USER_ID}`);
    console.log(`✅ Empty cart retrieved. Items: ${emptyCartResponse.data.data.items.length}\n`);

    // 3. Add item to cart (you'll need to replace with actual product ID)
    console.log('3. Note: To test add-to-cart, you need to:');
    console.log('   - Run: npm run seed');
    console.log('   - Get a product ID from the seeded data');
    console.log('   - Replace PRODUCT_ID_HERE in the request\n');

    console.log('🎉 Basic API tests completed successfully!');
    console.log('📝 For full testing, seed the database and use real product IDs.');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests if server is running
testAPI();
