// src/server.ts
import express, { Request, Response } from "express";
import autocannon, { Result } from "autocannon";
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: [ "POST"],
  })
);
const port = 3001;

app.post("/api/benchmark", async (req: Request, res: Response) => {
  try {
    const { number, connections, duration } = req.body;

    const fibNum = Number(number ?? 20);
    const conns = Number(connections ?? 50);
    const dur = Number(duration ?? 10);

    const result: Result = await autocannon({
      url: "http://localhost:3000/api/process-data",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ number: fibNum }),
      connections: conns,
      duration: dur,
    });

    const report = {
      averageLatency: result.latency.average,
      averageRPS: result.requests.average,
      totalRequests: result.requests.total,
      totalErrors: result.errors,
      totalTimeouts: result.timeouts,
      successRate:
        (
          ((result.requests.total - result.errors - result.timeouts) /
            result.requests.total) *
          100
        ).toFixed(1) + "%",
    };

    res.json( report );
  } catch (err: any) {
    console.error("Benchmark error:", err);
    res.status(500).json({ error: err.message ?? "Internal error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
