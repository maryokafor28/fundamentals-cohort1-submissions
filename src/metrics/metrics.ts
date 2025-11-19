import client from "prom-client";

// Create a Registry to register all metrics
export const register = new client.Registry();

// Default metrics (Node.js & process metrics)
client.collectDefaultMetrics({ register });

// Request Counter
export const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

// Response Time Histogram
export const httpResponseTimeHistogram = new client.Histogram({
  name: "http_response_time_seconds",
  help: "Response time in seconds",
  labelNames: ["method", "route", "status"],
});

// Register metrics
register.registerMetric(httpRequestCounter);
register.registerMetric(httpResponseTimeHistogram);
