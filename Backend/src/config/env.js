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
<<<<<<< Updated upstream
  remindersTestMode: String(process.env.REMINDERS_TEST_MODE || 'false').toLowerCase() === 'true',
  remindersTestClientId: process.env.REMINDERS_TEST_CLIENT_ID ? Number(process.env.REMINDERS_TEST_CLIENT_ID) : null,
  remindersTestOverrideEmail: process.env.REMINDERS_TEST_OVERRIDE_EMAIL || ''
=======
  cronTimezone: process.env.CRON_TIMEZONE || 'America/Guayaquil',
  cronToken: process.env.CRON_TOKEN || '',
  pushEnabled: String(process.env.PUSH_ENABLED || 'false').toLowerCase() === 'true',
  pushVapidPublicKey: process.env.PUSH_VAPID_PUBLIC_KEY || '',
  pushVapidPrivateKey: process.env.PUSH_VAPID_PRIVATE_KEY || '',
  pushVapidSubject: process.env.PUSH_VAPID_SUBJECT || 'mailto:admin@example.com',
  pushCronEnabled: String(process.env.PUSH_CRON_ENABLED || 'false').toLowerCase() === 'true',
  pushCron: process.env.PUSH_CRON || '0 * * * *',
  pushDryRun: String(process.env.PUSH_DRY_RUN || 'true').toLowerCase() === 'true',
  // A diferencia de los recordatorios, este job viene habilitado por defecto:
  // no envia mensajes ni consume APIs de pago, solo corrige un estado que ya es
  // incorrecto. Corre a las 00:10 (America/Guayaquil), recien cambiado el dia y
  // mucho antes del envio configurable de recordatorios.
  expiracionEnabled: String(process.env.EXPIRACION_ENABLED || 'true').toLowerCase() === 'true',
  expiracionCron: process.env.EXPIRACION_CRON || '10 0 * * *',
  expiracionDryRun: String(process.env.EXPIRACION_DRY_RUN || 'false').toLowerCase() === 'true'
>>>>>>> Stashed changes
};

module.exports = { env };
