
import { parentPort } from "worker_threads";

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

if (parentPort) {
  parentPort.on("message", (n: number) => {
    const result = fibonacci(n);
    parentPort!.postMessage(result);
  });
}
