const dotenv = require('dotenv');

dotenv.config();

const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  mysqlHost: process.env.MYSQL_HOST || '127.0.0.1',
  mysqlPort: Number(process.env.MYSQL_PORT || 3306),
  mysqlUser: process.env.MYSQL_USER || 'root',
  mysqlPassword: process.env.MYSQL_PASSWORD || '',
  mysqlDatabase: process.env.MYSQL_DATABASE || '',
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendFromEmail: process.env.RESEND_FROM_EMAIL || '',
  resendFromName: process.env.RESEND_FROM_NAME || '',
  resendReplyTo: process.env.RESEND_REPLY_TO || '',
  remindersEnabled: String(process.env.REMINDERS_ENABLED || 'false').toLowerCase() === 'true',
  remindersCron: process.env.REMINDERS_CRON || '0 9 * * *',
  remindersDryRun: String(process.env.REMINDERS_DRY_RUN || 'true').toLowerCase() === 'true',
  remindersTestMode: String(process.env.REMINDERS_TEST_MODE || 'false').toLowerCase() === 'true',
  remindersTestClientId: process.env.REMINDERS_TEST_CLIENT_ID ? Number(process.env.REMINDERS_TEST_CLIENT_ID) : null,
  remindersTestOverrideEmail: process.env.REMINDERS_TEST_OVERRIDE_EMAIL || ''
};

module.exports = { env };
