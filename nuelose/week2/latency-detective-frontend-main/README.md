# Latency Detective - Frontend

This is the frontend for the Latency Detective project, designed to test and show the performance of a Node.js backend API under load. Users can configure benchmark parameters, run tests, and view results.

## Features

- Configure Fibonacci number, number of concurrent connections, and test duration.

- Click on run performance benchmarks directly from the UI.

- Display results including average latency, success rate, total requests, and errors.

## Installation

**1. Clone the repository:**

```
git clone https://github.com/nuelose/latency-detective-frontend.git
cd latency-detective-frontend
```

**2. Install dependencies:**

```bash
npm install
```

**3. Running the Frontend:**

```bash
npm run dev
```

- The frontend will be available at: `http://localhost:5173`

**4. Start the development server:**
[backend-server-instruction](https://github.com/NueloSE/latency-detective-backend)

**NOTE:** Ensure the backend servers (server.ts and benchmark.ts) are running before starting a benchmark.

## Usage

- Open the app in your browser.

- Configure the benchmark parameters:

  - Fibonacci Number

  - Concurrent Connections

  - Duration in Seconds

- Click Run Benchmark.

The performance results will be displayed once the test completes the set timer, be patient.

**Notes**

- The frontend communicates with the backend benchmark endpoint at:
  `POST http://localhost:3002/api/benchmark`

- The backend process-data endpoint is at:
  `POST http://localhost:3000/api/process-data`
