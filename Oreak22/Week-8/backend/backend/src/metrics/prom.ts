import client from "prom-client";

client.collectDefaultMetrics();

export const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
});
export const httpRequestDurationHistogram = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  buckets: [0.1, 0.5, 1, 2.5, 5, 10],
});
export const dbQueryCounter = new client.Counter({
  name: "db_queries_total",
  help: "Total number of database queries",
}); 