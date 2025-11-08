import { createClient } from "redis";
import { parentPort, workerData } from "worker_threads";

const runHeavy = (n: number): number => {
  if (n <= 1) return n;
  // console.log(n);
  return runHeavy(n - 1) + runHeavy(n - 2);
};

const result = runHeavy(workerData);
parentPort?.postMessage(result);

// parentPort?.on("message", (n) => {
//   const result = runHeavy(n);
//   parentPort?.postMessage(result);
// });
