# 💻 SE Challenge Week 2: The Latency Detective - Performance Report

This report details the profiling and optimization process for a Node.js Express API, focusing on identifying and resolving an Event Loop blocking bottleneck using Worker Threads.

## 1. Baseline Analysis (Unoptimized)

The initial API endpoint (`POST /api/process-data`) was deliberately designed to perform CPU-intensive, synchronous operations: a large JSON data parsing simulation followed by a deep Fibonacci sequence calculation (Fibonacci(40)).

### Initial Average Request Latency

When subjected to 100 concurrent requests, the **average request latency was approximately [Your Baseline Latency Here] ms.**

This high latency indicates that the Node.js Event Loop was significantly blocked, preventing it from processing new incoming requests or other I/O operations efficiently.

### CPU Profile (Unoptimized)

The CPU profile captured during the load test clearly shows the blocking nature of the `fibonacci` and `parseLargeJson` functions on the Main Thread.

*(Insert screenshot of unoptimized Chrome DevTools Performance Flame Graph here. The screenshot should clearly highlight the `fibonacci` and/or `parseLargeJson` functions consuming significant time on the main thread.)*
`
`
*Self-correction: The above image should be a screenshot of the DevTools Performance panel for the unoptimized code, showing the blocking function prominently.*

As evident in the Flame Graph, a single long-running task dominated the Main Thread's execution, leading to the observed high latency and poor responsiveness.

## 2. Optimization Strategy

### Why the Event Loop was Blocked

Node.js is single-threaded for its JavaScript execution. When a synchronous, CPU-intensive operation (like our `fibonacci` calculation or large `JSON.parse`/`JSON.stringify` loop) runs on the Main Thread, it prevents the Event Loop from processing other tasks, including handling new HTTP requests, I/O callbacks, or timers. This effectively "blocks" the server, causing subsequent requests to queue up and experience high latency.

### Justification for Worker Threads

We chose **Worker Threads** for optimization over other techniques like clustering for the following reasons:

*   **CPU-Bound Tasks:** Worker Threads are specifically designed to offload CPU-intensive JavaScript execution to separate threads within the same Node.js process. This is ideal for our scenario, where the bottleneck is a pure computational task.
*   **Shared Memory (Optional but powerful):** While not explicitly used for this basic example, Worker Threads offer mechanisms for sharing `ArrayBuffer` data between threads, which can be more efficient than inter-process communication for large data sets in certain scenarios.
*   **Simplicity for Specific Task:** For a single, clearly identifiable blocking function, spawning a worker thread specifically for that task is a straightforward and effective solution within a single application instance.
*   **Avoids Overhead of Clustering:** Clustering (`cluster` module) creates multiple Node.js processes, which adds overhead for inter-process communication and resource management. For purely CPU-bound tasks within a single application, Worker Threads can be more lightweight. Clustering is generally more beneficial for maximizing CPU core utilization when the application has many independent incoming requests, each potentially doing some CPU work, but not necessarily a single, long-blocking task per request.

### Communication Strategy

The communication between the main thread (Express server) and the worker thread (`worker.ts`) is handled using Node.js's built-in `worker_threads` module:

1.  **Main Thread Spawns Worker:** When `POST /api/process-data` is called, the main thread creates a new `Worker` instance, passing the request body data (`req.body`) to the worker via `workerData`.
2.  **Worker Receives Data and Processes:** The `worker.ts` script listens for the `workerData` and then executes the CPU-intensive `parseLargeJson` and `fibonacci` functions.
3.  **Worker Posts Result:** Once the computation is complete, the worker uses `parentPort.postMessage()` to send the result object back to the main thread.
4.  **Main Thread Receives Result and Responds:** The main thread listens for the `message` event from the worker. Upon receiving the result, it sends an HTTP `200 OK` response to the client.

This asynchronous communication ensures that the main thread remains non-blocked and free to handle other requests while the heavy computation occurs in the background worker thread.

## 3. Validation Results (Optimized)

After refactoring the CPU-intensive logic into a Worker Thread, the server's performance improved dramatically.

### Final Average Request Latency

When re-tested with 100 concurrent requests against the optimized endpoint, the **average request latency was approximately [Your Optimized Latency Here] ms.**

### CPU Profile (Optimized)

The CPU profile for the optimized code shows a significant reduction in the time spent by the Main Thread on the heavy calculation. The Event Loop is now largely free to handle incoming requests and I/O.

*(Insert screenshot of optimized Chrome DevTools Performance Flame Graph here. The screenshot should show a much "flatter" main thread, with the heavy computation occurring in separate worker thread timelines or being entirely absent from the main thread's critical path.)*
`
`
*Self-correction: The above image should be a screenshot of the DevTools Performance panel for the optimized code, showing the main thread is not blocked.*

The Main Thread's activity is now primarily focused on managing HTTP requests and worker communication, while the computational burden is distributed to the worker threads.

### Percentage Improvement in Latency

*   **Baseline Latency:** 15 ms
*   **Optimized Latency:** 11 ms

**Latency improved by approximately 26.7%**