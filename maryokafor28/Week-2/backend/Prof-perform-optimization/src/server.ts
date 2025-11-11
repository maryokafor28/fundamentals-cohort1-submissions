// src/server.ts
import express from "express";
import { runWorker } from "./utils/workerRunner";

const app = express();
app.use(express.json());

app.post("/api/process-data", async (req, res) => {
  try {
    const input = req.body?.num ?? 40;
    const result = await runWorker(input); // ⬅️ spawns worker, waits async
    res.json({ result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Optional: health endpoint to test responsiveness
app.get("/health", (_req, res) => {
  res.send("OK");
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
