const workerpool = require("workerpool");
const { fibonacciIter } = require("./utils/heavyTask");

workerpool.worker({
  fibonacci: fibonacciIter,
});
