import express, { type Request, type Response } from "express";
import { Worker } from "worker_threads";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

app.use(express.json());

function runWorker(n: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, "worker.ts"));
    worker.postMessage(n);
    worker.on("message", (result) => {
      resolve(result);
      worker.terminate();
    });
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}
	
app.post("/api/process-data", async (req: Request, res: Response) => {
 try {
		const { n } = req.body;
    if (typeof n !== "number" || n < 0) {
      return res.status(400).json({ error: "n must be a non-negative number" });
    }
    const result = await runWorker(n);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Optimized server running on http://localhost:${PORT}`);
});
