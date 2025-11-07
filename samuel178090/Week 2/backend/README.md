⚡ Latency Detective - Backend

(URL = https://latencytest.netlify.app/) 
Node.js Express API demonstrating Event Loop blocking and Worker Threads optimization.

This backend is part of the Latency Detective system — designed to showcase performance optimization for CPU-intensive tasks and improve concurrent request handling.

🚀 Quick Start
# Install dependencies
npm install

# Run unoptimized server
node src/server-simple.js
API Endpoints
POST /api/process-data - CPU-intensive processing

GET /health - Health check

Servers Available
server-simple.js - Unoptimized (blocks Event Loop)

server-simple-optimized.js - Optimized (Worker Threads)

🛠️ Setup Instructions
Backend Setup
bash
Copy code
cd week2-backend
npm install
npm run build
Frontend Setup
bash
Copy code
cd client
npm install
🎯 Running the Tests
Phase 1: Baseline (Unoptimized)
bash
Copy code
# Terminal 1: Start unoptimized server
cd week2-backend
npm run dev

# Terminal 2: Start frontend client
cd client
npm run dev
Phase 2: Optimized Version
bash
Copy code
# Terminal 1: Start optimized server
npm run build
node dist/server-optimized.js

# Terminal 2: Start frontend client
cd client
npm run dev
Profiling Commands
bash
Copy code
# CPU profiling
npm run build
npm run profile

# Chrome DevTools inspection
npm run build
npm run inspect
📊 Performance Analysis Results
Baseline Analysis (Unoptimized)
Initial Average Request Latency: 36,378ms

CPU Profile Analysis:

Main thread blocked by synchronous Fibonacci calculations

Event Loop unable to process new requests during CPU-intensive operations

All 100 concurrent requests queued sequentially

Key Bottleneck Function:

fibonacci() recursive function

Multiple iterations (35 calculations of fibonacci(35))

Blocks Event Loop for extended periods

Optimization Strategy
Why Event Loop was Blocked:
Node.js uses a single-threaded Event Loop. CPU-intensive synchronous tasks like recursive Fibonacci block the thread, preventing new requests from being processed.

Why Worker Threads over Clustering:

Worker Threads: Share memory space, better for CPU-intensive tasks, lower overhead

Clustering: Creates separate processes, better for I/O scaling but higher memory usage

Worker Threads are ideal for CPU-bound tasks

Communication Strategy:

Main thread receives HTTP requests

Spawns Worker Thread with request data

Worker performs CPU-intensive calculations

Results sent back via message passing

Main thread responds to HTTP request

Validation Results (Optimized)
Final Average Request Latency: 13,759ms (13.8 seconds)

Improvements:

Main thread remains free for I/O

Concurrent request processing restored

CPU-intensive work isolated in worker threads

Latency Improvement: Individual request times similar, but overall architecture supports concurrency

🏗️ Architecture Comparison
Before (Unoptimized)
java
Copy code
HTTP Request → Express Route → CPU-Intensive Task (BLOCKS) → Response
After (Optimized)
mathematica
Copy code
HTTP Request → Express Route → Worker Thread → CPU-Intensive Task
                    ↓                              ↓
                Response ← Promise Resolution ← Message Passing
💡 Key Learnings
Event Loop Blocking: Synchronous CPU-intensive tasks severely impact Node.js performance

Worker Threads: Offload CPU-bound tasks efficiently

Profiling: Identify performance bottlenecks

Concurrency: Proper architecture enables true concurrent request handling

📂 Files Structure
pgsql
Copy code
├── week2-backend/
│   ├── src/
│   │   ├── server.ts           # Unoptimized version
│   │   ├── server-optimized.ts # Optimized with Worker Threads
│   │   └── worker.ts           # Worker Thread implementation
│   ├── package.json
│   └── tsconfig.json
├── client/                     # React frontend for load testing
└── README.md
👨‍💻 Author
Samuel Ajewole
Master’s Student, Software Engineering
Email: your.email@example.com

📜 License
This project is open source and available under the MIT License.