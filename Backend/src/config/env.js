const dotenv = require('dotenv');

dotenv.config();

const defaultCorsOrigins = 'http://localhost:3000,http://localhost:5173';
const rawCorsOrigin = process.env.CORS_ORIGIN || defaultCorsOrigins;
const corsOrigins = rawCorsOrigin.split(',').map((value) => value.trim()).filter(Boolean);

const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: rawCorsOrigin,
  corsOrigins,
  mysqlHost: process.env.MYSQL_HOST || '127.0.0.1',
  mysqlPort: Number(process.env.MYSQL_PORT || 3306),
  mysqlUser: process.env.MYSQL_USER || 'root',
  mysqlPassword: process.env.MYSQL_PASSWORD || '',
  mysqlDatabase: process.env.MYSQL_DATABASE || '',
  betterAuthUrl: process.env.BETTER_AUTH_URL || `http://localhost:${process.env.PORT || 4000}`,
  betterAuthSecret: process.env.BETTER_AUTH_SECRET || 'change_me_with_a_long_random_secret',
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendFromEmail: process.env.RESEND_FROM_EMAIL || '',
  resendFromName: process.env.RESEND_FROM_NAME || '',
  resendReplyTo: process.env.RESEND_REPLY_TO || '',
  remindersEnabled: String(process.env.REMINDERS_ENABLED || 'false').toLowerCase() === 'true',
  remindersCron: process.env.REMINDERS_CRON || '0 9 * * *',
  remindersDryRun: String(process.env.REMINDERS_DRY_RUN || 'true').toLowerCase() === 'true'
};

module.exports = { env };
