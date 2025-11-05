# Stress Testing a Server Using a client

A small Vite + React frontend to compare two backend variants:

* No worker server at `http://localhost:3000/api/process-data`
* Worker pool server at `http://localhost:5000/api/process-data`

Use this UI to run batches of requests, measure round trip time, and compare results side by side. Fast, minimal, and judgmental about bad CPU hogs.

---

## Features

* Input field for Fibonacci `n`
* Configurable batch size (number of sequential requests per server)
* Runs the same workload against both servers and measures client-side latency
* Shows per-request times, average time, and simple comparison
* Useful for quick, repeatable experiments without wiring up autocannon

---

## Quick start

```bash
# create the project (if you haven't already)
npm create vite@latest brave-frontend -- --template react-ts
cd brave-frontend

# install deps
npm install

# run dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## How to use the UI

1. Start your two backend servers:

   * No-worker server on port 3000
   * Worker-pool server on port 5000
2. Open the frontend.
3. Enter a value for `n` and a Batch Size.
4. Click "Run Test".
5. The UI will:

   * Send the given `n` to the no-worker server batchSize times, measuring each round-trip.
   * Send the same batch to the worker-pool server.
   * Display per-request times and averaged metrics for both.

Tip: on a low-RAM machine, use batch sizes of 5 to 20 and `n` between 30 and 40. Higher values will bog down your laptop.

---

## CORS note

If your browser blocks requests, enable CORS on both backends:

```ts
// backend
import cors from "cors";
app.use(cors());
```

Install with:

```bash
npm install cors
```

---

## Commands used by the UI (for reference)

Frontend makes a POST request like this:

```bash
curl -X POST http://localhost:3000/api/process-data \
  -H "Content-Type: application/json" \
  -d '{"n":35}'
```

Replace `3000` with `5000` to target the worker server.

---

## What the UI measures

* Client latency: measured with `performance.now()` before fetch and after `res.json()` completes. This includes network, server compute, and JSON parsing time.
* Server compute time is optional. If backend returns `serverTime` you will see it. The UI does not rely on server timing to compute latency.

---

## Interpreting results

* Lower average time is better.
* If the worker-pool server shows higher average but far fewer timeouts under load tests, that means throughput and reliability improved even if single-request latency rose.
* Use the batch view to inspect dispersion and outliers. A few high tail values mean requests are queuing or hitting resource limits.

---

## Project structure

```
frontend/
  src/
    App.tsx       # main UI, batch runner and comparator
    main.tsx
  index.html
  package.json
  vite.config.ts
```

---

## Testing checklist

* [ ] Start no-worker backend on port 3000
* [ ] Start worker-pool backend on port 5000
* [ ] Start frontend with `npm run dev`
* [ ] Run several batches with n=30..40 and batch size 5..20
* [ ] Compare average times and per-request spread

---

## Troubleshooting

* If you see `net::ERR_UNSAFE_PORT` change the backend port to a safe port such as 5000, 3001, or 8080.
* If responses are errors, check backend logs for thrown exceptions or timeouts.
* If the UI freezes under heavy tests, reduce batch size or `n`, or run the heavy tests with autocannon instead of the UI.
