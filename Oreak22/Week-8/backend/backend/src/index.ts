import { app } from "./server";
import { logger } from "./utils/logger";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
