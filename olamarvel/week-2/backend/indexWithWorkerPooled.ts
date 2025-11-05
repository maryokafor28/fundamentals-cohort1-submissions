import express, { type Request, type Response } from "express";
import { WorkerPool } from "./workerPool.ts"; 
import os from "os";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 5000;
app.use(express.json());

const pool = new WorkerPool(os.cpus().length - 1);

app.post("/api/process-data", async (req: Request, res: Response) => {
  try {
    const { n } = req.body;
    if (typeof n !== "number" || n < 0) {
      return res.status(400).json({ error: "n must be a non-negative number" });
    }
    const result = await pool.runTask(n);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Optimized server running on http://localhost:${PORT}`);
});
