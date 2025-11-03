import express, { Response, Request } from "express";
import { Worker } from "worker_threads";
import path from "path";
import os from "os";
import cors from "cors";


const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: [ "POST"],
  })
);
const port = 3000;
const POOL_SIZE = os.cpus().length;

class WorkerPool {
  private workers: Worker[] = [];
  private available: Worker[] = [];
  private queue: {
    number: number;
    resolve: (v: number) => void;
    reject: (error: any) => void;
  }[] = [];

  constructor(workerPath: string, size: number) {
    for (let i = 0; i < size; i++) {
      const w = new Worker(workerPath);
      w.setMaxListeners(0);
      this.workers.push(w);
      this.available.push(w);
    }
  }

  runTask(number: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const worker = this.available.pop();
      const task = { number, resolve, reject };
      if (worker) this.execute(worker, task);
      else this.queue.push(task);
    });
  }

  private execute(worker: Worker, task: any) {
    const { number, resolve, reject } = task;

    const onMessage = (msg: any) => {
      cleanup();
      this.available.push(worker);
      resolve(msg.result);
      this.processQueue();
    };

    const onError = (err: any) => {
      cleanup();
      this.available.push(worker);
      reject(err);
      this.processQueue();
    };

    const cleanup = () => {
      worker.off("message", onMessage);
      worker.off("error", onError);
    };

    worker.on("message", onMessage);
    worker.on("error", onError);
    worker.postMessage({ number });
  }

  private processQueue() {
    if (this.queue.length === 0 || this.available.length === 0) return;
    const task = this.queue.shift()!;
    const worker = this.available.pop()!;
    this.execute(worker, task);
  }
}

const workerPath = path.resolve("./dist/worker.js");
const pool = new WorkerPool(workerPath, POOL_SIZE);

app.post("/api/process-data/", async (req: Request, res: Response) => {
  try {
    const fibNum = Number(req.body.number);
    const result = await pool.runTask(fibNum);
    res.status(200).json({ message: `fib(${fibNum}) = ${result}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, (e) => {
  if (e) {
    console.error("Error: ", e);
  } else {
    console.log(`Server is running on http://localhost:${port}`);
  }
});
