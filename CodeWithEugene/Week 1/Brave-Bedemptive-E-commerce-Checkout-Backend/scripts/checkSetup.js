const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function checkSetup() {
  console.log('�� Checking E-commerce Backend Setup...\n');

  let allGood = true;

  // Check 1: Environment file
  console.log('1. Checking environment configuration...');
  if (fs.existsSync('.env')) {
    console.log('✅ .env file exists');
    
    const requiredVars = ['PORT', 'MONGODB_URI', 'FRONTEND_URL'];
    const missingVars = [];
    
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    });
    
    if (missingVars.length > 0) {
      console.log(`❌ Missing environment variables: ${missingVars.join(', ')}`);
      allGood = false;
    } else {
      console.log('✅ All required environment variables are set');
    }
  } else {
    console.log('❌ .env file not found. Please copy .env.example to .env');
    allGood = false;
  }

  // Check 2: MongoDB connection
  console.log('\n2. Checking MongoDB connection...');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connection successful');
    await mongoose.connection.close();
  } catch (error) {
    console.log(`❌ MongoDB connection failed: ${error.message}`);
    console.log('💡 Make sure MongoDB is running on your system');
    allGood = false;
  }

  // Check 3: Node modules
  console.log('\n3. Checking dependencies...');
  if (fs.existsSync('node_modules')) {
    console.log('✅ Dependencies installed');
  } else {
    console.log('❌ Dependencies not installed. Run: npm install');
    allGood = false;
  }

  // Check 4: Project structure
  console.log('\n4. Checking project structure...');
  const requiredPaths = [
    'src/models/Product.js',
    'src/models/Cart.js',
    'src/controllers/cartController.js',
    'src/routes/cartRoutes.js',
    'src/config/database.js',
    'server.js'
  ];

  let structureGood = true;
  requiredPaths.forEach(path => {
    if (fs.existsSync(path)) {
      console.log(`✅ ${path}`);
    } else {
      console.log(`❌ Missing: ${path}`);
      structureGood = false;
    }
  });

  if (structureGood) {
    console.log('✅ Project structure is complete');
  } else {
    allGood = false;
  }

  // Final result
  console.log('\n' + '='.repeat(50));
  if (allGood) {
    console.log('🎉 Setup complete! Ready to start the server.');
    console.log('\nNext steps:');
    console.log('1. npm run seed    # Populate database with sample data');
    console.log('2. npm run dev     # Start development server');
    console.log('3. Open http://localhost:5000 in browser');
  } else {
    console.log('❌ Setup incomplete. Please fix the issues above.');
  }
}

checkSetup().catch(console.error);
