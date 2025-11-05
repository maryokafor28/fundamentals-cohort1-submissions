const dotenv = require('dotenv');

dotenv.config();

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables.');
}

module.exports = {
  development: {
    url: DATABASE_URL,
    dialect: 'postgres',
    logging: false,
  },
  test: {
    url: DATABASE_URL,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    url: DATABASE_URL,
    dialect: 'postgres',
    logging: false,
  },
};
