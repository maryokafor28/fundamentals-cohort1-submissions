const express = require("express");
// const { fibonacci } = require("./utils/heavyTask");
// const { Worker } = require("worker_threads");
const workerpool = require("workerpool");

const app = express();
const PORT = 3000;

// create a pool with up to 4 workers
const pool = workerpool.pool(__dirname + "/worker.js", { maxWorkers: 4 });

// Bottleneck endpoint
// app.post("/api/process-data", (req, res) => {
//   const num = 42;
//   const result = fibonacci(num);
//   res.json({ result });
// });

// Optimized endpoint using workers
app.post("/api/process-data", async (req, res) => {
  const num = 40;
  try {
    const result = await pool.exec("fibonacci", [num]);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// quick health check to confirm main thread isn't blocked
app.get("/ping", (req, res) => {
  res.send("pong 🏓");
});

app.get("/", (req, res) => {
  res.send("Server is alive 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
