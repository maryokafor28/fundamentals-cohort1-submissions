import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const {
  DATABASE_URL,
  NODE_ENV = 'development',
} = process.env;

if (!DATABASE_URL) {
  logger.error('DATABASE_URL is not defined. Please check your environment variables.');
  throw new Error('DATABASE_URL is required to initialize the database connection.');
}

const sequelize = new Sequelize(DATABASE_URL, {
  logging: NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  dialect: 'postgres',
  define: {
    underscored: true,
    freezeTableName: true,
    timestamps: true,
  },
});

export default sequelize;
