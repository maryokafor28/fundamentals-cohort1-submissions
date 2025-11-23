require('dotenv').config();

const config = {

  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT),
  

  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_TEST_URI: process.env.MONGODB_TEST_URI,
  
 
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  

  FRONTEND_URL: process.env.FRONTEND_URL,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : 
    undefined,
  

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
  
  
  APP_NAME: process.env.APP_NAME,
  API_VERSION: process.env.API_VERSION,
  

  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS),
  
  LOG_LEVEL: process.env.LOG_LEVEL,
  
  isDevelopment: function() {
    return this.NODE_ENV === 'development';
  },
  
  isProduction: function() {
    return this.NODE_ENV === 'production';
  },
  
  isTest: function() {
    return this.NODE_ENV === 'test';
  }
};


const requiredVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'FRONTEND_URL'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  console.error('Please check your .env file');
  process.exit(1);
}

module.exports = config;