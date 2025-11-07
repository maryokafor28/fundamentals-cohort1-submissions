import { parentPort } from "worker_threads";

const fibCache: Map<number, number> = new Map();



function fibonacci(n: number): number {
  if (n <= 1) return n;

  if (fibCache.has(n)) return fibCache.get(n)!

  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    if (fibCache.has(i)) {
      curr = fibCache.get(i)!
      prev = fibCache.get(i - 1)!
    } else {
      const next = prev + curr;
      prev= curr;
      curr = next
      fibCache.set(i, curr)
    }
  }

  fibCache.set(n, curr)
  return curr
}

const bigArray: number[] = [];
for (let i = 0; i < 200_000; i++) {
  bigArray.push(i);
}
const stringifiedArr = JSON.stringify({ payload: bigArray });
const parsedArr = JSON.parse(stringifiedArr);

parentPort?.on("message", (fibNum: number) => {
  try {
    const result = fibonacci(fibNum);
    parentPort?.postMessage({ fibNum, result });
  } catch (error) {
    parentPort?.postMessage({error})
  }
})

