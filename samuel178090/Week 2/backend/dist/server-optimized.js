"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Helper function to run worker thread
function runWorker(data) {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads_1.Worker(path_1.default.join(__dirname, 'worker.js'), {
            workerData: data
        });
        worker.on('message', (result) => {
            if (result.success) {
                resolve(result.result);
            }
            else {
                reject(new Error(result.error));
            }
        });
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
}
// OPTIMIZED endpoint - uses Worker Threads
app.post('/api/process-data', async (req, res) => {
    const startTime = Date.now();
    try {
        const result = await runWorker(req.body);
        const processingTime = Date.now() - startTime;
        res.json({
            success: true,
            result,
            processingTime
        });
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Processing failed'
        });
    }
});
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('OPTIMIZED VERSION - Using Worker Threads');
});
