export interface BenchmarkReport {
  averageLatency: number;
  averageRPS: number;
  totalRequests: number;
  totalErrors: number;
  totalTimeouts: number;
  successRate: string;

}
