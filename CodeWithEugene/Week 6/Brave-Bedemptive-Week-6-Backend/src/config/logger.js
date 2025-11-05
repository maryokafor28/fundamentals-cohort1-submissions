import winston from 'winston';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const env = process.env.NODE_ENV || 'development';
const isDevelopment = env === 'development';

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  if (stack) {
    return `${ts} ${level}: ${message}\n${stack}`;
  }
  return `${ts} ${level}: ${message}`;
});

const transports = [];

if (isDevelopment) {
  transports.push(
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
  );
} else {
  transports.push(
    new winston.transports.Console({
      format: combine(json()),
    }),
  );
}

const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info',
  format: combine(
    errors({ stack: true }),
    timestamp(),
    logFormat,
  ),
  transports,
});

export default logger;
