import pino from 'pino';

const logger = pino({
  // Use pino-pretty for development to make logs more readable
  // In production, logs will be in JSON format for easier processing by log management systems
  transport: process.env.NODE_ENV === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

export default logger;
