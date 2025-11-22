const dotenv = require('dotenv');
const path = require('path');


const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: path.join(__dirname, '..', '..', envFile) });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  api: {
    version: process.env.API_VERSION || 'v1'
  },
  log: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

module.exports = config;