const { app } = require('./app');
const { env } = require('./config/env');
const { logger } = require('./config/logger');
const { connectDatabase } = require('./config/database');
const { startJobs } = require('./jobs');

let server;

async function bootstrap() {
  await connectDatabase();
  startJobs();

  server = app.listen(env.port, () => {
    logger.info(`API listening on port ${env.port} (${env.nodeEnv})`);
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to start server:', error.message);
  process.exit(1);
});

process.on('SIGINT', () => {
  logger.info('Shutting down server (SIGINT)...');
  if (server) {
    server.close(() => process.exit(0));
    return;
  }

  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Shutting down server (SIGTERM)...');
  if (server) {
    server.close(() => process.exit(0));
    return;
  }

  process.exit(0);
});
