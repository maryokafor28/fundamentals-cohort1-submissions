import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Task = {
  n: number;
  resolve: (val: number) => void;
  reject: (err: Error) => void;
};

interface WorkerWithTask extends Worker {
  _task?: Task;
}

export class WorkerPool {
  private workers: WorkerWithTask[] = [];
  private available: WorkerWithTask[] = [];
  private queue: Task[] = [];

  constructor(size: number) {
    for (let i = 0; i < size; i++) this.addWorker();
  }

  private addWorker() {
    const worker: WorkerWithTask = new Worker(path.resolve(__dirname, "worker.ts"));
    
    worker.on("message", (result) => {
      if (worker._task) {
        worker._task.resolve(result);
        worker._task = undefined;
      }
      this.available.push(worker);
      this.runNext();
    });

    worker.on("error", (err) => {
      if (worker._task) worker._task.reject(err);
    });

    this.workers.push(worker);
    this.available.push(worker);
  }

  private runNext() {
    if (!this.queue.length || !this.available.length) return;

    const worker = this.available.shift()!;
    const task = this.queue.shift()!;
    worker._task = task;
    worker.postMessage(task.n);
  }

  runTask(n: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.queue.push({ n, resolve, reject });
      this.runNext();
    });
  }

  close() {
    this.workers.forEach((w) => w.terminate());
  }
}
