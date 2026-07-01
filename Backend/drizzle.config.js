const { defineConfig } = require('drizzle-kit');
const { env } = require('./src/config/env');

module.exports = defineConfig({
  dialect: 'mysql',
  schema: './src/database/drizzle/schema/index.js',
  out: './src/database/drizzle/migrations',
  dbCredentials: {
    host: env.mysqlHost,
    port: env.mysqlPort,
    user: env.mysqlUser,
    password: env.mysqlPassword,
    database: env.mysqlDatabase,
  },
  strict: true,
  verbose: true,
});
