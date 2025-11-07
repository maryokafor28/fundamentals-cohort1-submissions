"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
function cpuIntensiveTask(data) {
    function fibonacci(n) {
        if (n <= 1)
            return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    // Same computation as unoptimized version
    const results = [];
    for (let i = 0; i < 5; i++) {
        results.push(fibonacci(30));
    }
    return {
        processedData: data,
        fibonacciResults: results,
        timestamp: Date.now()
    };
}
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
