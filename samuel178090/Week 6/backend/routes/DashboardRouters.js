import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { generalLimiter } from "../middleware/rateLimiter.js";
import { requestLogger } from "../middleware/logger.js";
import { getDashboardData } from "../controllers/ParentControllers/DashboardController/dashboardController.js";

const dashboardRouter = Router();

dashboardRouter.use(requestLogger);
dashboardRouter.use(authenticateToken);

dashboardRouter.get('/data', generalLimiter, getDashboardData);

export default dashboardRouter;