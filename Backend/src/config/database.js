const { env } = require('./env');
const { logger } = require('./logger');
const mysql = require('mysql2/promise');

let pool;

async function ensureVariantNotificationColumns(connection) {
  const [columns] = await connection.query(
    `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'variantes_productos'
        AND COLUMN_NAME IN ('Not_Ven_Cor_Var', 'Not_Ven_Wsp_Var')
    `,
    [env.mysqlDatabase]
  );

  const existingColumns = new Set(columns.map((column) => column.COLUMN_NAME));
  const statements = [];

  if (!existingColumns.has('Not_Ven_Cor_Var')) {
    statements.push(
      "ADD COLUMN `Not_Ven_Cor_Var` TINYINT(1) NOT NULL DEFAULT 1 AFTER `Max_Usu_Var`"
    );
  }

  if (!existingColumns.has('Not_Ven_Wsp_Var')) {
    statements.push(
      "ADD COLUMN `Not_Ven_Wsp_Var` TINYINT(1) NOT NULL DEFAULT 1 AFTER `Not_Ven_Cor_Var`"
    );
  }

  if (statements.length > 0) {
    await connection.query(`ALTER TABLE variantes_productos ${statements.join(', ')}`);
    logger.info('Schema actualizado: columnas de notificacion agregadas a variantes_productos.');
  }
}

async function ensureReminderEmailLogTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS recordatorios_vencimiento_email (
      Id_Rec int(11) NOT NULL AUTO_INCREMENT,
      Id_Dve int(11) NOT NULL,
      Tip_Rec enum('pre_vencimiento','dia_vencimiento') NOT NULL,
      Fec_Objetivo date NOT NULL,
      Ema_Destino varchar(150) NOT NULL,
      Id_Cli int(11) DEFAULT NULL,
      Id_Rev int(11) DEFAULT NULL,
      Resend_Id varchar(120) DEFAULT NULL,
      Est_Envio enum('pendiente','enviado','omitido','error') NOT NULL DEFAULT 'pendiente',
      Err_Envio text DEFAULT NULL,
      Fec_Cre datetime DEFAULT current_timestamp(),
      Fec_Mod datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (Id_Rec),
      UNIQUE KEY uq_recordatorio_vencimiento (Id_Dve, Tip_Rec, Fec_Objetivo),
      KEY idx_recordatorios_destino (Ema_Destino),
      KEY idx_recordatorios_detalle (Id_Dve)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function connectDatabase() {
  if (!env.mysqlDatabase) {
    throw new Error('MYSQL_DATABASE is not configured.');
  }

  const { loadTimezone, getTimezoneOffset } = require('../utils/dateHelper');

  const defaultOffset = getTimezoneOffset();

  const tempPool = mysql.createPool({
    host: env.mysqlHost,
    port: env.mysqlPort,
    user: env.mysqlUser,
    password: env.mysqlPassword,
    database: env.mysqlDatabase,
    timezone: defaultOffset,
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0,
  });

  try {
    await tempPool.query('SELECT 1');

    await loadTimezone(() => tempPool);
    const offset = getTimezoneOffset();

    try {
      await tempPool.query(`SET GLOBAL time_zone = '${offset}'`);
    } catch {
      logger.warn(`No se pudo establecer GLOBAL time_zone. Verifica permisos de base de datos.`);
    }

    await tempPool.end();
  } catch {
    await tempPool.end().catch(() => {});
  }

  pool = mysql.createPool({
    host: env.mysqlHost,
    port: env.mysqlPort,
    user: env.mysqlUser,
    password: env.mysqlPassword,
    database: env.mysqlDatabase,
    timezone: getTimezoneOffset(),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  await pool.query('SELECT 1');
  await ensureVariantNotificationColumns(pool);
  await ensureReminderEmailLogTable(pool);

  logger.info(
    `MySQL connected: ${env.mysqlHost}:${env.mysqlPort}/${env.mysqlDatabase} (tz: ${getTimezoneOffset()})`
  );
}

function getPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call connectDatabase first.');
  }

  return pool;
}

module.exports = { connectDatabase, getPool };
