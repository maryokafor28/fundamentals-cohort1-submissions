console.log('Test file: About to require app.js');
try {
  const app = require('./dist/app.js');
  console.log('Successfully required app.js');
  console.log('app keys:', Object.keys(app));
} catch (error) {
  console.error('ERROR requiring app.js:', error.message);
  console.error(error.stack);
}
