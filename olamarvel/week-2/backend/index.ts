import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

async function calculateFibonacci(n: number): Promise<number> {
  return fibonacci(n);
}


app.post("/api/process-data", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { n } = req.body;
    if (typeof n !== "number" || n < 0) {
      return res.status(400).json({ error: "Invalid input: n must be a non-negative number" });
    }

    const result = await calculateFibonacci(n);

    res.status(200).json({
      success: true,
      input: n,
      result,
    });
  } catch (err) {
    next(err);
  }
});


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
