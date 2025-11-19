import { Router } from "express";
import { register } from "../metrics/metrics";

const router = Router();

router.get("/", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export default router;
