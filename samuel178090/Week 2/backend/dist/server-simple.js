"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Lighter CPU-intensive task for clearer demonstration
function cpuIntensiveTask(data) {
    function fibonacci(n) {
        if (n <= 1)
            return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    // Reduced load: 5 calculations of fibonacci(30)
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
// UNOPTIMIZED endpoint - blocks Event Loop
app.post('/api/process-data', (req, res) => {
    const startTime = Date.now();
    try {
        const result = cpuIntensiveTask(req.body);
        const processingTime = Date.now() - startTime;
        res.json({
            success: true,
            result,
            processingTime
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Processing failed' });
    }
});
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('UNOPTIMIZED VERSION - Event Loop BLOCKED');
});
