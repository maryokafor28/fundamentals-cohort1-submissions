#!/usr/bin/env node

/**
 * FlowServe Backend Setup Verification Script
 * Run this to verify your setup is complete
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 FlowServe Backend Setup Verification\n');
console.log('========================================\n');

let allChecksPass = true;

// Check 1: Node.js version
console.log('✓ Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion >= 16) {
  console.log(`  ✅ Node.js ${nodeVersion} (OK)\n`);
} else {
  console.log(`  ❌ Node.js ${nodeVersion} (Need v16 or higher)\n`);
  allChecksPass = false;
}

// Check 2: package.json exists
console.log('✓ Checking package.json...');
if (fs.existsSync(path.join(__dirname, 'package.json'))) {
  console.log('  ✅ package.json exists\n');
} else {
  console.log('  ❌ package.json not found\n');
  allChecksPass = false;
}

// Check 3: node_modules exists
console.log('✓ Checking dependencies...');
if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('  ✅ Dependencies installed\n');
} else {
  console.log('  ❌ Dependencies not installed. Run: npm install\n');
  allChecksPass = false;
}

// Check 4: .env file exists
console.log('✓ Checking environment configuration...');
if (fs.existsSync(path.join(__dirname, '.env'))) {
  console.log('  ✅ .env file exists\n');
} else {
  console.log('  ⚠️  .env file not found. Copy .env.example to .env\n');
  allChecksPass = false;
}

// Check 5: Required directories exist
console.log('✓ Checking project structure...');
const requiredDirs = [
  'src/config',
  'src/models',
  'src/controllers',
  'src/routes',
  'src/middleware',
  'src/services',
  'src/tests'
];

let dirsOk = true;
requiredDirs.forEach(dir => {
  if (!fs.existsSync(path.join(__dirname, dir))) {
    console.log(`  ❌ Directory missing: ${dir}`);
    dirsOk = false;
    allChecksPass = false;
  }
});

if (dirsOk) {
  console.log('  ✅ All required directories exist\n');
}

// Check 6: Key files exist
console.log('✓ Checking key files...');
const requiredFiles = [
  'src/app.js',
  'src/index.js',
  'src/config/db.js',
  'src/config/logger.js',
  'src/config/database.js'
];

let filesOk = true;
requiredFiles.forEach(file => {
  if (!fs.existsSync(path.join(__dirname, file))) {
    console.log(`  ❌ File missing: ${file}`);
    filesOk = false;
    allChecksPass = false;
  }
});

if (filesOk) {
  console.log('  ✅ All key files exist\n');
}

// Final summary
console.log('========================================\n');

if (allChecksPass) {
  console.log('🎉 Setup verification PASSED!\n');
  console.log('Next steps:');
  console.log('1. Ensure PostgreSQL is running');
  console.log('2. Create databases: flowserve_db and flowserve_db_test');
  console.log('3. Configure your .env file');
  console.log('4. Run tests: npm test');
  console.log('5. Start server: npm run dev\n');
} else {
  console.log('❌ Setup verification FAILED!\n');
  console.log('Please fix the issues above and run this script again.\n');
  process.exit(1);
}