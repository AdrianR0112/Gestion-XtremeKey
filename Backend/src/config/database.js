const { env } = require('./env');
const { logger } = require('./logger');
const mysql = require('mysql2/promise');
const { generateId } = require('better-auth');

let pool;

async function tableExists(connection, tableName) {
  const [rows] = await connection.query(
    `
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      LIMIT 1
    `,
    [env.mysqlDatabase, tableName]
  );

  return rows.length > 0;
}

async function columnExists(connection, tableName, columnName) {
  const [rows] = await connection.query(
    `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?
      LIMIT 1
    `,
    [env.mysqlDatabase, tableName, columnName]
  );

  return rows.length > 0;
}

async function indexExists(connection, tableName, indexName) {
  const [rows] = await connection.query(
    `
      SELECT INDEX_NAME
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?
      LIMIT 1
    `,
    [env.mysqlDatabase, tableName, indexName]
  );

  return rows.length > 0;
}

async function ensureStaffTable(connection) {
  const hasStaff = await tableExists(connection, 'staff');
  const hasUsuarios = await tableExists(connection, 'usuarios');

  if (hasStaff) {
    return;
  }

  if (hasUsuarios) {
    await connection.query(`
      CREATE TABLE staff (
        Id_Stf char(36) NOT NULL,
        Auth_Usu_Id varchar(255) NOT NULL,
        Nom_Stf varchar(150) DEFAULT NULL,
        Ape_Stf varchar(150) DEFAULT NULL,
        Car_Stf varchar(100) DEFAULT NULL,
        Tel_Stf varchar(30) DEFAULT NULL,
        Act_Stf tinyint(1) NOT NULL DEFAULT 1,
        Fec_Cre datetime DEFAULT current_timestamp(),
        Fec_Mod datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (Id_Stf),
        UNIQUE KEY uq_staff_auth_user (Auth_Usu_Id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    return;
  }

  if (!(await tableExists(connection, 'staff'))) {
    await connection.query(`
      CREATE TABLE staff (
        Id_Stf char(36) NOT NULL,
        Auth_Usu_Id varchar(255) NOT NULL,
        Nom_Stf varchar(150) DEFAULT NULL,
        Ape_Stf varchar(150) DEFAULT NULL,
        Car_Stf varchar(100) DEFAULT NULL,
        Tel_Stf varchar(30) DEFAULT NULL,
        Act_Stf tinyint(1) NOT NULL DEFAULT 1,
        Fec_Cre datetime DEFAULT current_timestamp(),
        Fec_Mod datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (Id_Stf),
        UNIQUE KEY uq_staff_auth_user (Auth_Usu_Id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }
}

async function ensureClientesAuthSchema(connection) {
  const telColumnExists = await columnExists(connection, 'clientes', 'Tel_Cli');
  if (telColumnExists) {
    const [rows] = await connection.query(
      `
        SELECT IS_NULLABLE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'clientes' AND COLUMN_NAME = 'Tel_Cli'
      `,
      [env.mysqlDatabase]
    );

    if (rows[0]?.IS_NULLABLE === 'NO') {
      await connection.query('ALTER TABLE clientes MODIFY COLUMN Tel_Cli varchar(20) NULL');
    }
  }

  if (!(await columnExists(connection, 'clientes', 'Auth_User_Id'))) {
    await connection.query('ALTER TABLE clientes ADD COLUMN Auth_User_Id varchar(36) DEFAULT NULL AFTER Ema_Cli');
  }

  if (!(await indexExists(connection, 'clientes', 'uq_clientes_auth_user'))) {
    await connection.query('ALTER TABLE clientes ADD UNIQUE KEY uq_clientes_auth_user (Auth_User_Id)');
  }
}

async function ensureBetterAuthSchema(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`user\` (
      id varchar(36) NOT NULL,
      name text NOT NULL,
      email varchar(255) NOT NULL,
      emailVerified boolean NOT NULL DEFAULT false,
      image text DEFAULT NULL,
      createdAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      role text DEFAULT NULL,
      banned boolean DEFAULT false,
      banReason text DEFAULT NULL,
      banExpires datetime(3) DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY user_email_unique (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS session (
      id varchar(36) NOT NULL,
      expiresAt datetime(3) NOT NULL,
      token varchar(255) NOT NULL,
      createdAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      ipAddress text DEFAULT NULL,
      userAgent text DEFAULT NULL,
      userId varchar(36) NOT NULL,
      impersonatedBy text DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY session_token_unique (token),
      KEY session_userId_idx (userId),
      CONSTRAINT session_userId_fk FOREIGN KEY (userId) REFERENCES \`user\` (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS account (
      id varchar(36) NOT NULL,
      accountId text NOT NULL,
      providerId text NOT NULL,
      userId varchar(36) NOT NULL,
      accessToken text DEFAULT NULL,
      refreshToken text DEFAULT NULL,
      idToken text DEFAULT NULL,
      accessTokenExpiresAt datetime(3) DEFAULT NULL,
      refreshTokenExpiresAt datetime(3) DEFAULT NULL,
      scope text DEFAULT NULL,
      password text DEFAULT NULL,
      createdAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      KEY account_userId_idx (userId),
      CONSTRAINT account_userId_fk FOREIGN KEY (userId) REFERENCES \`user\` (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS verification (
      id varchar(36) NOT NULL,
      identifier varchar(255) NOT NULL,
      value text NOT NULL,
      expiresAt datetime(3) NOT NULL,
      createdAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      KEY verification_identifier_idx (identifier)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function migrateLegacyUsuariosToStaff(connection) {
  if (!(await tableExists(connection, 'usuarios')) || !(await tableExists(connection, 'staff'))) {
    return;
  }

  const [legacyUsers] = await connection.query('SELECT * FROM usuarios ORDER BY Id_Usu ASC');
  if (legacyUsers.length === 0) {
    await connection.query('DROP TABLE usuarios');
    return;
  }

  for (const legacyUser of legacyUsers) {
    const email = String(legacyUser.Ema_Usu || '').trim().toLowerCase();
    if (!email) {
      continue;
    }

    const [authRows] = await connection.query('SELECT id FROM `user` WHERE email = ? LIMIT 1', [email]);
    let authUserId = authRows[0]?.id;

    if (!authUserId) {
      authUserId = generateId();
      const accountRowId = generateId();
      const now = new Date();

      await connection.query(
        `
          INSERT INTO \`user\` (
            id,
            name,
            email,
            emailVerified,
            image,
            createdAt,
            updatedAt,
            role,
            banned,
            banReason,
            banExpires
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          authUserId,
          `${legacyUser.Nom_Usu || ''} ${legacyUser.Ape_Usu || ''}`.trim() || 'Admin',
          email,
          1,
          null,
          now,
          now,
          'admin',
          0,
          null,
          null,
        ]
      );

      await connection.query(
        `
          INSERT INTO account (
            id,
            accountId,
            providerId,
            userId,
            password,
            createdAt,
            updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [accountRowId, authUserId, 'credential', authUserId, legacyUser.Pas_Usu, now, now]
      );
    }

    const [staffRows] = await connection.query('SELECT Id_Stf FROM staff WHERE Auth_Usu_Id = ? LIMIT 1', [authUserId]);
    if (staffRows.length === 0) {
      await connection.query(
        `
          INSERT INTO staff (
            Id_Stf,
            Auth_Usu_Id,
            Nom_Stf,
            Ape_Stf,
            Car_Stf,
            Tel_Stf,
            Act_Stf,
            Fec_Cre,
            Fec_Mod
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          authUserId,
          authUserId,
          legacyUser.Nom_Usu || null,
          legacyUser.Ape_Usu || null,
          'Admin',
          legacyUser.Tel_Usu || null,
          legacyUser.Est_Usu === 'activo' ? 1 : 0,
          legacyUser.Fec_Cre || new Date(),
          legacyUser.Fec_Mod || new Date(),
        ]
      );
    }
  }

  await connection.query('DROP TABLE usuarios');
  logger.info('Tabla legacy usuarios migrada a staff y eliminada.');
}

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

async function ensureAuthAndDomainSchema(connection) {
  await ensureBetterAuthSchema(connection);
  await ensureStaffTable(connection);
  await migrateLegacyUsuariosToStaff(connection);
  await ensureClientesAuthSchema(connection);
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
  await ensureAuthAndDomainSchema(pool);
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
