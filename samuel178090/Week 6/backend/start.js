// Startup script that handles Prisma initialization gracefully
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🚀 Starting FlowServe API...');

// Set mock mode by default for development
process.env.USE_MOCK_DB = 'true';
console.log('⚠️  Using mock database for development');
console.log('   To use real database, run: npm run db:generate && npm run db:push');

// Start the main application
try {
    await import('./index.js');
} catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
}