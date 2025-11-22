import client from 'prom-client';

// Create a Registry to register metrics
const register = new client.Registry();

// Add default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Custom metrics
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

export const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

export const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

export const errorCounter = new client.Counter({
  name: 'application_errors_total',
  help: 'Total number of application errors',
  labelNames: ['type']
});

export const apiResponseTime = new client.Summary({
  name: 'api_response_time_ms',
  help: 'API response time in milliseconds',
  labelNames: ['endpoint', 'method'],
  percentiles: [0.5, 0.9, 0.95, 0.99]
});

// Register custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);
register.registerMetric(errorCounter);
register.registerMetric(apiResponseTime);

export { register };