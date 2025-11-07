import app from "./app";
import config from "./config";
import logger from "./utils/logger";

const port = config.port;

app.listen(port, () => {
  logger.info(`FlowServe API listening on port http://localhost:${port}`);
});
