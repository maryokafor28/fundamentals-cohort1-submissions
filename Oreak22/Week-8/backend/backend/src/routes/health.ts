import { Router } from "express";
import { httpRequestCounter } from "../metrics/prom";

const router = Router();

router.get("/", (req, res) => {
  httpRequestCounter.inc();
  return res.json({ status: "ok", timestamp: Date.now() });
});

export default router;
