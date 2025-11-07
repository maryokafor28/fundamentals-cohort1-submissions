# Stress Testing a Server

> **Goal:** My goal in this task is to profile a CPU-bound Node.js endpoint, identify why the Event Loop is blocked, and optimize it with Worker Threads.

---

## 📊 Baseline Analysis

### Before Optimization

**Endpoint:**
`POST /api/process-data`

**Workload:**
I decided to utilize a Recursive Fibonacci (`fibonacci(n)`) as the workload for the following reasons:

1. Easy to manipulate
2. High compute cost

### Benchmark

Autocannon, the CLI tool, was used to deliver 100 concurrent client requests to each server type to stress test them.

An example of such a command is below, but for convenience, the commands were added as npm scripts:

* `bombTheServerWithWorker` for the server with workers
* `bombTheServerWithNoWorker` for the server without workers

```bash
npx autocannon -c 100 -d 30 -m POST -H "Content-Type: application/json" -b '{"n":35}' http://localhost:3000/api/process-data
```

**Results (Unoptimized):**

```
┌─────────┬─────────┬─────────┬─────────┬─────────┬───────────┬────────────┬─────────┐
│ Stat    │ 2.5%    │ 50%     │ 97.5%   │ 99%     │ Avg       │ Stdev      │ Max     │
├─────────┼─────────┼─────────┼─────────┼─────────┼───────────┼────────────┼─────────┤
│ Latency │ 2149 ms │ 5914 ms │ 9529 ms │ 9529 ms │ 5890.6 ms │ 2590.77 ms │ 9529 ms │
└─────────┴─────────┴─────────┴─────────┴─────────┴───────────┴────────────┴─────────┘
┌───────────┬─────┬──────┬─────┬───────┬───────┬───────┬───────┐
│ Stat      │ 1%  │ 2.5% │ 50% │ 97.5% │ Avg   │ Stdev │ Min   │
├───────────┼─────┼──────┼─────┼───────┼───────┼───────┼───────┤
│ Req/Sec   │ 0   │ 0    │ 0   │ 1     │ 0.5   │ 0.5   │ 1     │
├───────────┼─────┼──────┼─────┼───────┼───────┼───────┼───────┤
│ Bytes/Sec │ 0 B │ 0 B  │ 0 B │ 313 B │ 157 B │ 157 B │ 313 B │
└───────────┴─────┴──────┴─────┴───────┴───────┴───────┴───────┘
┌──────┬───────┐
│ Code │ Count │
├──────┼───────┤
│ 200  │ 5     │
└──────┴───────┘
```

### CPU Profile

I used the profiling method to track resource-hogging processes. This can be seen in the [unoptimized profile file](https://github.com/olamarvel/stressbomb/blob/main/profile_isolate-0000023164FB1000-8812-v8.txt).
Key excerpt of interest:

* Main thread profile clearly shows **`fibonacci`** dominating CPU time.

```
[JavaScript]:
   ticks  total  nonlib   name
   4398   51.2%   96.7%  JS: *fibonacci index.ts:7:19
      1    0.0%    0.0%  JS: ^onwrite node:internal/streams/writable:615:17
      1    0.0%    0.0%  JS: ^checkListener node:events:274:23
```

---

## ⚙️ Optimization Strategy

### Why the Event Loop Was Blocked

The synchronous recursive Fibonacci calculation hogged the main thread. While it was running, the event loop could not process I/O callbacks, leading to massive latency and timeouts.

### Why Worker Threads

* Worker Threads run in isolated V8 instances, so CPU-bound tasks no longer block the event loop.
* Chosen over clustering because clustering duplicates the entire process, increasing memory overhead. Worker Threads allow task-level offloading inside one process with easier data sharing.

### Communication Strategy

* Main thread sends data via `worker.postMessage(n)`.
* Worker computes Fibonacci and responds with `parentPort.postMessage(result)`.

P.S. While performing the task, I noticed that spinning up new workers per request actually tanked performance instead of improving it. After researching, I found this was due to the overhead required to create new workers for each request, which slowed down the process and essentially *bombed* the server.
To counter this, I implemented a **worker pool**. The worker pool tracks and maintains a limited set of workers, and all tasks are distributed among them. This improved performance significantly.

I also observed that testing on a low-end PC made the optimization effect less profound, but on production servers the impact would be overwhelming.

---

## ✅ Validation Results (Optimized — Worker Pool)

**Endpoint (pooled):**
`POST /api/process-data` at port 5000

### Benchmark (Autocannon)

Command:

```bash
npx autocannon -c 100 -d 30 -m POST -H "Content-Type: application/json" -b '{"n":35}' http://localhost:5000/api/process-data
```

**Results (Optimized):**

```
┌─────────┬─────────┬─────────┬─────────┬─────────┬────────────┬────────────┬─────────┐
│ Stat    │ 2.5%    │ 50%     │ 97.5%   │ 99%     │ Avg        │ Stdev      │ Max     │
├─────────┼─────────┼─────────┼─────────┼─────────┼────────────┼────────────┼─────────┤
│ Latency │ 3811 ms │ 3898 ms │ 7719 ms │ 7719 ms │ 5740.84 ms │ 1882.68 ms │ 7719 ms │
└─────────┴─────────┴─────────┴─────────┴─────────┴────────────┴────────────┴─────────┘
┌───────────┬─────┬──────┬─────┬───────┬───────┬───────┬───────┐
│ Stat      │ 1%  │ 2.5% │ 50% │ 97.5% │ Avg   │ Stdev │ Min   │
├───────────┼─────┼──────┼─────┼───────┼───────┼───────┼───────┤
│ Req/Sec   │ 0   │ 0    │ 0   │ 3     │ 0.6   │ 1.2   │ 3     │
├───────────┼─────┼──────┼─────┼───────┼───────┼───────┼───────┤
│ Bytes/Sec │ 0 B │ 0 B  │ 0 B │ 861 B │ 172 B │ 344 B │ 861 B │
└───────────┴─────┴──────┴─────┴───────┴───────┴───────┴───────┘
┌──────┬───────┐
│ Code │ Count │
├──────┼───────┤
│ 200  │ 6     │
└──────┴───────┘
```

### Comparison

| Metric              | Unoptimized | Optimized (Pool) | Change |
| ------------------- | ----------- | ---------------- | ------ |
| Avg latency (ms)    | 5890.6      | 5740.8           | -2.5%  |
| Req/sec             | 0.5         | 0.6              | +20%   |
| Successful requests | 5           | 6                | +20%   |
| Errors              | 195         | 194              | -0.5%  |


### CPU Profile

I used the profiling method to track resource-hogging processes and saw major improvement with no task exceeding the 25% margin. This can be seen in the [optimized profile file](https://github.com/olamarvel/stressbomb/blob/main/profile_isolate-000001FFE9231000-1000-v8.txt).
Key excerpt of interest:

* Main thread profile clearly shows No sign of the **`fibonacci`** dominating CPU time.
* I also attached the profile for each of the worker in the pool which clearly shows the **`fibonacci`** dominating the worker instance. 
Links to the profile for each wokrer: [Worker 1](https://github.com/olamarvel/stressbomb/blob/main/profile_isolate-000001FFEA7FE000-1000-v8.txt), [worker 2](https://github.com/olamarvel/stressbomb/blob/main/profile_isolate-000001FFEA8CB000-1000-v8.txt), [worker 3](https://github.com/olamarvel/stressbomb/blob/main/profile_isolate-000001FFEAA7C000-1000-v8.txt)
   

Main tread
```
[JavaScript]:
   ticks  total  nonlib   name
      1    0.0%   25.0%  JS: ^maybeReadMore node:internal/streams/readable:857:23
      1    0.0%   25.0%  JS: ^get node:internal/streams/writable:1069:8
      1    0.0%   25.0%  JS: ^__export C:\Users\LENOVO\Documents\olamarvel imagine 2\brave\brave-week-2-backend\node_modules\typescript\lib\typescript.js:22:16
      1    0.0%   25.0%  JS: *noop node:internal/util/debuglog:57:14

```

A worker tread 
```
 [JavaScript]:
   ticks  total  nonlib   name
   1903   22.9%   98.1%  JS: *fibonacci file:///C:/Users/LENOVO/Documents/olamarvel%20imagine%202/brave/brave-week-2-backend/worker.ts:4:19

```

### Analysis

* **Throughput improved** and **errors dropped slightly**, making the system more resilient.
* **Latency reduced by ~2.5%** despite worker overhead on limited hardware.
* On stronger hardware (or with pool tuning), improvements would be much more significant.

---

## 📈 Percentage Improvement

* **Throughput (req/sec):** ↑ ~20%
* **Successful responses:** ↑ ~20%
* **Errors:** ↓ ~0.5%
* **Avg latency:** ↓ ~2.5%

---

## 🛠 How to Reproduce

### Run unoptimized server

```bash
npm run devWithoutWorker
```

### Run optimized server (worker pool)

```bash
npm run devWithWorker
```

### Profiling

```bash
# V8 profiling
npm run createCliprofileWithoutWorker
npm run createCliprofileWithWorker

node --prof-process isolate-[*].log > profile[*].txt

# One-liner for multiple logs (Windows cmd)
for %f in (isolate-*.log) do @node --prof-process "%f" > "profile_%~nf.txt" & del "%f"
```

### Benchmark

```bash
# Unoptimized
npx autocannon -c 100 -d 30 -m POST -H "Content-Type: application/json" -b '{"n":35}' http://localhost:3000/api/process-data

# Optimized (worker pool)
npx autocannon -c 100 -d 30 -m POST -H "Content-Type: application/json" -b '{"n":35}' http://localhost:5000/api/process-data
```

---

## 📂 Repo Structure

```
backend/
  index.ts                # unoptimized
  indexWithWorker.ts      # worker per request
  indexWithWorkerPooled.ts# pooled workers
  worker.ts
  workerPool.ts
  README.md               # this file
  profile-*
```
