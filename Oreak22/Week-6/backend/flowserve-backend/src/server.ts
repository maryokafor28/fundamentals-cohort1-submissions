import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { logger } from './config/logger';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info({ port: PORT }, `Server listening on port ${PORT}`);
});
