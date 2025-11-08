import express, { Request, Response } from "express";
import { Worker } from "worker_threads";
import dotenv from "dotenv";
import { exit } from "process";
import { createClient } from "redis";
// import { createClient } from "redis";
// import cors from "cors";
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/api/performUnoptimized", async (req: Request, res: Response) => {
  const runHeavy = (n: number): number => {
    if (n <= 1) return n;
    return runHeavy(n - 1) + runHeavy(n - 2);
  };
  try {
    const result = runHeavy(req.body.times);
    res.send(result);
  } finally {
  }
});

// client.ser

const runWorker = (n: number) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./src/worker.ts", {
      execArgv: ["-r", "ts-node/register"],
      workerData: n,
    });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`woker stopped with ${code}`));
    });
  });
};
app.post("/api/performOptimized", async (req: Request, res: Response) => {
  // console.log("works");
  const result = await runWorker(req.body.times);
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
