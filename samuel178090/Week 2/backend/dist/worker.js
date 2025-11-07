"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
// CPU-intensive task moved to worker thread
function cpuIntensiveTask(data) {
    // Simulate large JSON processing
    const largeData = JSON.parse(JSON.stringify(data));
    // Deep Fibonacci calculation
    function fibonacci(n) {
        if (n <= 1)
            return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    // Calculate multiple Fibonacci numbers
    const results = [];
    for (let i = 0; i < 35; i++) {
        results.push(fibonacci(35));
    }
    return {
        processedData: largeData,
        fibonacciResults: results,
        timestamp: Date.now()
    };
}
// Process the task and send result back to main thread
if (worker_threads_1.parentPort) {
    try {
        const result = cpuIntensiveTask(worker_threads_1.workerData);
        worker_threads_1.parentPort.postMessage({ success: true, result });
    }
    catch (error) {
        worker_threads_1.parentPort.postMessage({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
