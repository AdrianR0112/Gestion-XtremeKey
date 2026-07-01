const path = require('path');

const { migrate } = require('drizzle-orm/mysql2/migrator');

const { logger } = require('../../config/logger');
const { connectDatabase } = require('../../config/database');
const { getDrizzleDb } = require('./client');

const migrationsFolder = path.join(__dirname, 'migrations');

async function migrateDatabase() {
  const db = getDrizzleDb();
  await migrate(db, { migrationsFolder });
  logger.info(`Drizzle migrations applied from ${migrationsFolder}`);
}

async function runFromCli() {
  await connectDatabase();
  await migrateDatabase();
}

if (require.main === module) {
  runFromCli().catch((error) => {
    logger.error('Failed to run Drizzle migrations:', error.message);
    process.exit(1);
  });
}

module.exports = { migrateDatabase };
