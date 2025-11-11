// src/worker.ts
import { parentPort, workerData } from "worker_threads";
import { heavyTask } from "./slowfunction";

// workerData comes from the main thread (input value for n)
const result = heavyTask(workerData.num);

// Send the result back to the main thread
parentPort?.postMessage(result);
