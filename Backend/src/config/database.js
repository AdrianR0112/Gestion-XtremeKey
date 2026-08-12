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

async function ensureRecordatorioTelegramTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS recordatorios_suscripcion_telegram (
      Id_Rec int(11) NOT NULL AUTO_INCREMENT,
      Id_Sus int(11) NOT NULL,
      Tip_Rec enum('pre_5','pre_1','dia') NOT NULL,
      Fec_Objetivo date NOT NULL,
      Chat_Id varchar(64) DEFAULT NULL,
      Est_Envio enum('pendiente','enviado','omitido','error') NOT NULL DEFAULT 'pendiente',
      Err_Envio text DEFAULT NULL,
      Fec_Cre datetime DEFAULT current_timestamp(),
      Fec_Mod datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (Id_Rec),
      UNIQUE KEY uq_recordatorio_suscripcion_telegram (Id_Sus, Tip_Rec, Fec_Objetivo),
      KEY idx_recordatorios_telegram_suscripcion (Id_Sus),
      KEY idx_recordatorios_telegram_chat (Chat_Id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

/**
 * Plantilla de vencimiento por WhatsApp.
 *
 * {{estado}} resuelve por si solo el tiempo verbal y la fecha ("vence en 5
 * días (11 de agosto de 2026)" / "venció hoy (6 de agosto de 2026)"), de modo
 * que un unico cuerpo sirve para todos los hitos y para el envio manual. El
 * marcado *negrita* y _cursiva_ es el nativo de WhatsApp.
 */
const PLANTILLA_VENCIMIENTO_CUERPO = [
  'Hola estimado *{{cliente}}*.',
  '',
  'Servicio: *{{producto}}*',
  'Plan: {{plan}}',
  'Vencimiento: {{fecha}}',
  'Estado: *{{estado_corto}}*',
  '',
  '¿Deseas renovarla?',
  '*Confírmanos por este medio.*',
  '',
  '_Si no confirmas, retiraremos tu acceso._',
  '',
  '*{{empresa}}*'
].join('\n');

// Se muestra en el panel de plantillas como ayuda: valor de ejemplo real, no
// solo el nombre de la variable.
const PLANTILLA_VENCIMIENTO_VARIABLES = {
  cliente: 'Juan Pérez',
  servicio: 'Adobe Creative 2026 · Premium',
  estado: 'venció hoy (6 de agosto de 2026)',
  estado_corto: 'venció hoy',
  fecha: '6 de agosto de 2026',
  producto: 'Adobe Creative 2026',
  plan: 'Premium (1 mes)',
  precio: '$9.00',
  empresa: 'Xtremekey'
};

/**
 * Cuerpo para revendedores.
 *
 * Un revendedor recibe el aviso en SU telefono pero el servicio es de su
 * cliente final, asi que el mensaje tiene que nombrar la cuenta: sin eso, un
 * revendedor con 26 clientes no sabe cual vence.
 */
const PLANTILLA_VENCIMIENTO_REV_CUERPO = [
  'Hola estimado *{{cliente}}*.',
  '',
  'Servicio: *{{producto}}*',
  'Plan: {{plan}}',
  'Cuenta: {{cuenta}}',
  'Vencimiento: {{fecha}}',
  'Estado: *{{estado_corto}}*',
  '',
  '¿Deseas renovarla?',
  '*Confírmanos por este medio.*',
  '',
  '_Si no confirmas, retiraremos el acceso._',
  '',
  '*{{empresa}}*'
].join('\n');

/** Extiende el enum Tip_Pla con el tipo dedicado a revendedores. */
async function ensurePlantillaTipoRevendedor(connection) {
  if (!(await tableExists(connection, 'plantillas_notificacion'))) {
    return;
  }

  const [cols] = await connection.query("SHOW COLUMNS FROM plantillas_notificacion LIKE 'Tip_Pla'");
  const tipo = cols[0]?.Type || '';
  if (tipo.includes('vencimiento_revendedor')) return;

  await connection.query(
    `ALTER TABLE plantillas_notificacion MODIFY Tip_Pla
       enum('bienvenida','venta','renovacion','vencimiento','vencimiento_revendedor','recordatorio','personalizado')
       DEFAULT 'personalizado'`
  );
  logger.info('Schema actualizado: tipo de plantilla vencimiento_revendedor.');
}

async function ensureTelegramTemplate(connection) {
  if (!(await tableExists(connection, 'plantillas_notificacion'))) {
    return;
  }

  const semillas = [
    {
      tipo: 'vencimiento',
      nombre: 'Recordatorio de vencimiento por WhatsApp',
      cuerpo: PLANTILLA_VENCIMIENTO_CUERPO,
      variables: PLANTILLA_VENCIMIENTO_VARIABLES
    },
    {
      tipo: 'vencimiento_revendedor',
      nombre: 'Recordatorio de vencimiento por WhatsApp (revendedores)',
      cuerpo: PLANTILLA_VENCIMIENTO_REV_CUERPO,
      variables: { ...PLANTILLA_VENCIMIENTO_VARIABLES, cuenta: 'jorgeordonez076@gmail.com' }
    }
  ];

  for (const semilla of semillas) {
    const [rows] = await connection.query(
      `
        SELECT Id_Pla
        FROM plantillas_notificacion
        WHERE Tip_Pla = ? AND Can_Pla = 'whatsapp' AND Est_Pla = 'activo'
        ORDER BY Id_Pla ASC
        LIMIT 1
      `,
      [semilla.tipo]
    );

    if (rows.length > 0) continue;

    await connection.query(
      `
        INSERT INTO plantillas_notificacion (
          Nom_Pla, Tip_Pla, Can_Pla, Asu_Pla, Cue_Pla, Var_Pla, Est_Pla
        ) VALUES (?, ?, 'whatsapp', ?, ?, ?, 'activo')
      `,
      [semilla.nombre, semilla.tipo, 'Recordatorio de pago', semilla.cuerpo, JSON.stringify(semilla.variables)]
    );
    logger.info(`Plantilla activa "${semilla.nombre}" creada. Editala desde el panel de plantillas.`);
  }
}

/**
 * Repara la plantilla de vencimiento que perdio el placeholder {{estado}}.
 *
 * Al editarla se dejo el verbo fijo en pasado ("venció el día {{fecha}}"), de
 * modo que los recordatorios de 5 dias y 1 dia antes le decian al cliente que
 * su suscripcion ya habia vencido cuando aun estaba vigente.
 *
 * Es deliberadamente quirurgica: solo actua si el cuerpo NO tiene {{estado}} Y
 * conserva la frase rota, para no pisar ediciones legitimas. Una vez corregido
 * el cuerpo ya contiene {{estado}} y no vuelve a entrar.
 */
async function ensurePlantillaVencimientoEstado(connection) {
  if (!(await tableExists(connection, 'plantillas_notificacion'))) {
    return;
  }

  const [rows] = await connection.query(
    `
      SELECT Id_Pla, Cue_Pla
      FROM plantillas_notificacion
      WHERE Tip_Pla = 'vencimiento' AND Can_Pla = 'whatsapp' AND Est_Pla = 'activo'
      ORDER BY Id_Pla ASC
      LIMIT 1
    `
  );

  const plantilla = rows[0];
  if (!plantilla) return;

  const cuerpo = String(plantilla.Cue_Pla || '');
  if (cuerpo.includes('{{estado}}') || !cuerpo.includes('venció el día')) return;

  // Se respeta la redaccion existente: solo se sustituye el tramo con el verbo
  // fijo por el placeholder que ahora resuelve tiempo verbal y fecha juntos.
  const corregido = cuerpo.replace(/venció el día \*?\{\{\s*fecha\s*\}\}\*?/g, '{{estado}}');

  await connection.query(
    'UPDATE plantillas_notificacion SET Cue_Pla = ?, Var_Pla = ? WHERE Id_Pla = ?',
    [corregido, JSON.stringify(PLANTILLA_VENCIMIENTO_VARIABLES), plantilla.Id_Pla]
  );

  logger.warn(
    `Plantilla de vencimiento #${plantilla.Id_Pla} corregida: se restauro {{estado}}, que hacia que los recordatorios previos al vencimiento dijeran "vencio" en pasado.`
  );
}

/**
 * Asegura las columnas comerciales de clientes (direccion, tipo) e indice de correo.
 *
 * Idempotente: crea lo que falte y no repite nada en instalaciones existentes.
 */
async function ensureClienteComercialSchema(connection) {
  if (await tableExists(connection, 'clientes')) {
    if (!(await columnExists(connection, 'clientes', 'Dir_Cli'))) {
      await connection.query('ALTER TABLE `clientes` ADD COLUMN `Dir_Cli` TEXT DEFAULT NULL AFTER `Doc_Cli`');
    }
    if (!(await columnExists(connection, 'clientes', 'Tip_Cli'))) {
      await connection.query("ALTER TABLE `clientes` ADD COLUMN `Tip_Cli` VARCHAR(30) DEFAULT 'persona' AFTER `Dir_Cli`");
    }
    if (!(await indexExists(connection, 'clientes', 'idx_ema_cli'))) {
      await connection.query('ALTER TABLE `clientes` ADD KEY `idx_ema_cli` (`Ema_Cli`)');
    }
  }

  logger.info('Schema verificado: datos comerciales de clientes.');
}

/**
 * Asegura el esquema del codigo de venta autogenerado (Cod_Ven, formato
 * "VEN-<anio>-<correlativo>") y su tabla de contadores por anio.
 *
 * Idempotente: crea lo que falte y hace backfill de las ventas existentes
 * que aun no tengan Cod_Ven, sembrando el contador de cada anio afectado.
 */
async function ensureVentaCodigoSchema(connection) {
  if (!(await tableExists(connection, 'ventas'))) {
    return;
  }

  if (!(await tableExists(connection, 'contadores_venta'))) {
    await connection.query(`
      CREATE TABLE contadores_venta (
        Anio int(11) NOT NULL,
        Ultimo_Num int(11) NOT NULL DEFAULT 0,
        PRIMARY KEY (Anio)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  if (!(await columnExists(connection, 'ventas', 'Cod_Ven'))) {
    await connection.query('ALTER TABLE `ventas` ADD COLUMN `Cod_Ven` VARCHAR(20) DEFAULT NULL AFTER `Id_Ven`');
  }

  if (!(await indexExists(connection, 'ventas', 'uk_cod_ven'))) {
    await connection.query('ALTER TABLE `ventas` ADD UNIQUE KEY `uk_cod_ven` (`Cod_Ven`)');
  }

  const [pendientes] = await connection.query('SELECT COUNT(*) AS total FROM ventas WHERE Cod_Ven IS NULL');
  if (Number(pendientes[0]?.total || 0) > 0) {
    await connection.query(`
      UPDATE ventas v JOIN (
        SELECT Id_Ven, CONCAT('VEN-', YEAR(COALESCE(Fec_Ven, Fec_Cre)), '-',
          LPAD(ROW_NUMBER() OVER (PARTITION BY YEAR(COALESCE(Fec_Ven, Fec_Cre)) ORDER BY Id_Ven), 4, '0')) AS cod
        FROM ventas
        WHERE Cod_Ven IS NULL
      ) x ON x.Id_Ven = v.Id_Ven
      SET v.Cod_Ven = x.cod
    `);

    await connection.query(`
      INSERT INTO contadores_venta (Anio, Ultimo_Num)
      SELECT YEAR(COALESCE(Fec_Ven, Fec_Cre)), COUNT(*) FROM ventas GROUP BY YEAR(COALESCE(Fec_Ven, Fec_Cre))
      ON DUPLICATE KEY UPDATE Ultimo_Num = GREATEST(Ultimo_Num, VALUES(Ultimo_Num))
    `);

    logger.info('Schema actualizado: Cod_Ven generado (backfill) para ventas existentes.');
  }
}

/**
 * Asegura que una suscripcion pueda pertenecer a un cliente final (Id_Cli) o a
 * un revendedor (Id_Rev), con exactamente uno de los dos siempre presente.
 *
 * Antes solo existia Id_Cli NOT NULL, de modo que las ventas de suscripciones a
 * revendedores no quedaban registradas como suscripcion en ninguna parte.
 *
 * Idempotente: crea lo que falte y no repite nada en instalaciones existentes.
 * Equivale a Backend/src/database/migracion_suscripciones_revendedor.sql.
 */
async function ensureSuscripcionTitularSchema(connection) {
  if (!(await tableExists(connection, 'suscripciones'))) {
    return;
  }

  if (!(await columnExists(connection, 'suscripciones', 'Id_Rev'))) {
    await connection.query('ALTER TABLE `suscripciones` ADD COLUMN `Id_Rev` int(11) DEFAULT NULL AFTER `Id_Cli`');
  }

  if (!(await indexExists(connection, 'suscripciones', 'idx_suscripciones_revendedor'))) {
    await connection.query('ALTER TABLE `suscripciones` ADD KEY `idx_suscripciones_revendedor` (`Id_Rev`)');
  }

  if (await tableExists(connection, 'revendedores')) {
    const [fks] = await connection.query(
      `
        SELECT CONSTRAINT_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = ?
          AND TABLE_NAME = 'suscripciones'
          AND COLUMN_NAME = 'Id_Rev'
          AND REFERENCED_TABLE_NAME = 'revendedores'
        LIMIT 1
      `,
      [env.mysqlDatabase]
    );

    if (fks.length === 0) {
      await connection.query(
        'ALTER TABLE `suscripciones` ADD CONSTRAINT `fk_suscripciones_revendedor` FOREIGN KEY (`Id_Rev`) REFERENCES `revendedores` (`Id_Rev`)'
      );
    }
  }

  const [idCliColumn] = await connection.query(
    `
      SELECT IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'suscripciones' AND COLUMN_NAME = 'Id_Cli'
      LIMIT 1
    `,
    [env.mysqlDatabase]
  );

  if (idCliColumn[0]?.IS_NULLABLE === 'NO') {
    await connection.query('ALTER TABLE `suscripciones` MODIFY COLUMN `Id_Cli` int(11) DEFAULT NULL');
  }

  if (!(await indexExists(connection, 'suscripciones', 'idx_suscripciones_estado_fin'))) {
    await connection.query('ALTER TABLE `suscripciones` ADD KEY `idx_suscripciones_estado_fin` (`Est_Sus`, `Fec_Fin_Sus`)');
  }

  const [checks] = await connection.query(
    `
      SELECT CONSTRAINT_NAME
      FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = ? AND TABLE_NAME = 'suscripciones' AND CONSTRAINT_NAME = 'chk_suscripciones_titular'
      LIMIT 1
    `,
    [env.mysqlDatabase]
  );

  if (checks.length === 0) {
    // La CHECK se valida contra las filas ya existentes al crearse. Si alguna
    // incumple el XOR, anadirla abortaria el arranque del servidor: preferimos
    // avisar y dejar el dato como esta.
    const [invalidas] = await connection.query(
      'SELECT COUNT(*) AS total FROM suscripciones WHERE (Id_Cli IS NULL) = (Id_Rev IS NULL)'
    );

    if (Number(invalidas[0]?.total || 0) > 0) {
      logger.warn(
        `Hay ${invalidas[0].total} suscripcion(es) sin titular unico (Id_Cli/Id_Rev). Corrigelas y reinicia para activar chk_suscripciones_titular.`
      );
    } else {
      await connection.query(
        'ALTER TABLE `suscripciones` ADD CONSTRAINT `chk_suscripciones_titular` CHECK ((`Id_Cli` IS NULL) <> (`Id_Rev` IS NULL))'
      );
    }
  }

  logger.info('Schema verificado: titular (cliente|revendedor) de suscripciones.');
}

/**
 * Asegura la columna con el correo de la cuenta donde se activo el servicio.
 *
 * Es la identidad real de la suscripcion cuando el titular es un revendedor:
 * el revendedor es quien paga, pero cada suscripcion corresponde al cliente
 * final de ese correo. Sin esta columna, un revendedor con 26 clientes produce
 * 26 filas indistinguibles y no se puede saber cual renovar.
 *
 * El dato ya existia por periodo en detalle_ventas.Cor_Cue; aqui se guarda el
 * vigente para poder listarlo, buscarlo y mostrarlo sin JOIN.
 */
async function ensureSuscripcionCuentaSchema(connection) {
  if (!(await tableExists(connection, 'suscripciones'))) {
    return;
  }

  if (!(await columnExists(connection, 'suscripciones', 'Cor_Cue_Sus'))) {
    await connection.query(
      'ALTER TABLE `suscripciones` ADD COLUMN `Cor_Cue_Sus` VARCHAR(150) DEFAULT NULL AFTER `Id_Var`'
    );
    logger.info('Schema actualizado: Cor_Cue_Sus (cuenta del cliente final) en suscripciones.');
  }

  if (!(await indexExists(connection, 'suscripciones', 'idx_suscripciones_cuenta'))) {
    await connection.query(
      'ALTER TABLE `suscripciones` ADD INDEX `idx_suscripciones_cuenta` (`Cor_Cue_Sus`)'
    );
  }
}

/**
 * Asegura la columna de dias de gracia para renovacion de suscripciones.
 *
 * Al renovar, si la suscripcion vencio hace menos dias que esta gracia, el
 * periodo nuevo arranca en la fecha de vencimiento anterior (y no hoy), para
 * no dejar huecos de cobertura ni regalar los dias ya pagados. Pasada la
 * gracia se arranca desde hoy: encadenar desde una fecha muy vieja venderia
 * un periodo integramente consumido.
 */
async function ensureConfiguracionRenovacionSchema(connection) {
  if (!(await tableExists(connection, 'configuracion'))) {
    return;
  }

  if (!(await columnExists(connection, 'configuracion', 'Dia_Gra_Ren_Con'))) {
    await connection.query(
      'ALTER TABLE `configuracion` ADD COLUMN `Dia_Gra_Ren_Con` int(11) NOT NULL DEFAULT 30 AFTER `Hab_Imp_Con`'
    );
    logger.info('Schema actualizado: Dia_Gra_Ren_Con (gracia de renovacion) en configuracion.');
  }

  // Dias que una suscripcion vencida sigue apareciendo en el listado principal
  // antes de pasar al archivo. Las muy antiguas solo hacen ruido: ya no se van
  // a cobrar y tapan las que si hay que perseguir.
  if (!(await columnExists(connection, 'configuracion', 'Dia_Arc_Ven_Con'))) {
    await connection.query(
      'ALTER TABLE `configuracion` ADD COLUMN `Dia_Arc_Ven_Con` int(11) NOT NULL DEFAULT 5 AFTER `Dia_Gra_Ren_Con`'
    );
    logger.info('Schema actualizado: Dia_Arc_Ven_Con (dias antes de archivar una vencida) en configuracion.');
  }
}

async function ensureAuthAndDomainSchema(connection) {
  await ensureBetterAuthSchema(connection);
  await ensureStaffTable(connection);
  await migrateLegacyUsuariosToStaff(connection);
  await ensureClientesAuthSchema(connection);
  await ensureClienteComercialSchema(connection);
  await ensureVentaCodigoSchema(connection);
  await ensureSuscripcionTitularSchema(connection);
  await ensureSuscripcionCuentaSchema(connection);
  await ensureConfiguracionRenovacionSchema(connection);
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
  await ensureRecordatorioTelegramTable(pool);
  await ensurePlantillaTipoRevendedor(pool);
  await ensureTelegramTemplate(pool);
  await ensurePlantillaVencimientoEstado(pool);

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
