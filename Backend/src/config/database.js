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

async function ensureEcommerceSchema(connection) {
  // Columnas nuevas en productos
  if (await tableExists(connection, 'productos')) {
    if (!(await columnExists(connection, 'productos', 'Slug_Prd'))) {
      await connection.query('ALTER TABLE `productos` ADD COLUMN `Slug_Prd` VARCHAR(200) DEFAULT NULL AFTER `Nom_Prd`');
    }
    if (!(await columnExists(connection, 'productos', 'Precio_Venta'))) {
      await connection.query('ALTER TABLE `productos` ADD COLUMN `Precio_Venta` DECIMAL(10,2) DEFAULT NULL AFTER `Des_Cor_Prd`');
    }
    if (!(await columnExists(connection, 'productos', 'Precio_Regular'))) {
      await connection.query('ALTER TABLE `productos` ADD COLUMN `Precio_Regular` DECIMAL(10,2) DEFAULT NULL AFTER `Precio_Venta`');
    }
    if (!(await columnExists(connection, 'productos', 'Estado_Tienda'))) {
      await connection.query("ALTER TABLE `productos` ADD COLUMN `Estado_Tienda` ENUM('borrador','activo','archivado') DEFAULT 'activo' AFTER `Est_Prd`");
    }
    if (!(await columnExists(connection, 'productos', 'Es_Destacado'))) {
      await connection.query('ALTER TABLE `productos` ADD COLUMN `Es_Destacado` TINYINT(1) NOT NULL DEFAULT 0 AFTER `Estado_Tienda`');
    }
    if (!(await columnExists(connection, 'productos', 'Meta_Titulo'))) {
      await connection.query('ALTER TABLE `productos` ADD COLUMN `Meta_Titulo` VARCHAR(200) DEFAULT NULL AFTER `Es_Destacado`');
    }
    if (!(await columnExists(connection, 'productos', 'Meta_Descripcion'))) {
      await connection.query('ALTER TABLE `productos` ADD COLUMN `Meta_Descripcion` TEXT DEFAULT NULL AFTER `Meta_Titulo`');
    }
    if (!(await indexExists(connection, 'productos', 'uk_slug_prd'))) {
      await connection.query('ALTER TABLE `productos` ADD UNIQUE KEY `uk_slug_prd` (`Slug_Prd`)');
    }
    if (!(await indexExists(connection, 'productos', 'idx_estado_tienda_prd'))) {
      await connection.query('ALTER TABLE `productos` ADD KEY `idx_estado_tienda_prd` (`Estado_Tienda`)');
    }
  }

  // Columnas nuevas en clientes
  if (await tableExists(connection, 'clientes')) {
    if (!(await columnExists(connection, 'clientes', 'Password_Hash'))) {
      await connection.query('ALTER TABLE `clientes` ADD COLUMN `Password_Hash` VARCHAR(255) DEFAULT NULL AFTER `Ema_Cli`');
    }
    if (!(await columnExists(connection, 'clientes', 'Email_Verificado'))) {
      await connection.query('ALTER TABLE `clientes` ADD COLUMN `Email_Verificado` TINYINT(1) NOT NULL DEFAULT 0 AFTER `Password_Hash`');
    }
    if (!(await columnExists(connection, 'clientes', 'Token_Verificacion'))) {
      await connection.query('ALTER TABLE `clientes` ADD COLUMN `Token_Verificacion` VARCHAR(255) DEFAULT NULL AFTER `Email_Verificado`');
    }
    if (!(await columnExists(connection, 'clientes', 'Fec_Ultimo_Acceso'))) {
      await connection.query('ALTER TABLE `clientes` ADD COLUMN `Fec_Ultimo_Acceso` DATETIME DEFAULT NULL AFTER `Token_Verificacion`');
    }
  }

  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`cupones\` (
      \`Id_Cup\` int(11) NOT NULL AUTO_INCREMENT,
      \`Codigo_Cup\` varchar(50) NOT NULL,
      \`Descripcion_Cup\` text DEFAULT NULL,
      \`Tipo_Cup\` enum('porcentaje','fijo') DEFAULT 'porcentaje',
      \`Monto_Descuento\` decimal(10,2) DEFAULT 0.00,
      \`Minimo_Carrito\` decimal(10,2) DEFAULT 0.00,
      \`Maximo_Descuento\` decimal(10,2) DEFAULT NULL,
      \`Fecha_Desde\` datetime NOT NULL,
      \`Fecha_Hasta\` datetime NOT NULL,
      \`Limite_Uso\` int(11) DEFAULT NULL,
      \`Limite_Uso_Por_Usuario\` int(11) DEFAULT 1,
      \`Veces_Usado\` int(11) DEFAULT 0,
      \`Esta_Activo\` tinyint(1) DEFAULT 1,
      \`Estado_Cup\` enum('activo','inactivo','expirado','programado') DEFAULT 'activo',
      \`Aplica_A\` enum('todos','productos_especificos','categorias_especificas') DEFAULT 'todos',
      \`Fec_Cre\` datetime DEFAULT current_timestamp(),
      \`Fec_Mod\` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (\`Id_Cup\`),
      UNIQUE KEY \`Codigo_Cup\` (\`Codigo_Cup\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`ordenes\` (
      \`Id_Ord\` int(11) NOT NULL AUTO_INCREMENT,
      \`Numero_Ord\` varchar(50) NOT NULL,
      \`Id_Cli\` int(11) DEFAULT NULL,
      \`Email_Invitado\` varchar(150) DEFAULT NULL COMMENT 'Si compra sin registro',
      \`Estado_Ord\` enum('pendiente','pagada','completada','cancelada','reembolsada') DEFAULT 'pendiente',
      \`Estado_Pago\` enum('pendiente','pagado','fallido','reembolsado','parcial') DEFAULT 'pendiente',
      \`Moneda\` varchar(10) DEFAULT 'USD',
      \`Subtotal\` decimal(10,2) NOT NULL,
      \`Descuento\` decimal(10,2) DEFAULT 0.00,
      \`Total\` decimal(10,2) NOT NULL,
      \`Id_Cupon\` int(11) DEFAULT NULL,
      \`Codigo_Cupon\` varchar(50) DEFAULT NULL,
      \`Notas_Cliente\` text DEFAULT NULL,
      \`Notas_Internas\` text DEFAULT NULL,
      \`Metadatos\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(\`Metadatos\`)),
      \`Fec_Cre\` datetime DEFAULT current_timestamp(),
      \`Fec_Mod\` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (\`Id_Ord\`),
      UNIQUE KEY \`Numero_Ord\` (\`Numero_Ord\`),
      KEY \`idx_orden_cliente\` (\`Id_Cli\`),
      CONSTRAINT \`ordenes_ibfk_1\` FOREIGN KEY (\`Id_Cli\`) REFERENCES \`clientes\` (\`Id_Cli\`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`carrito_sesiones\` (
      \`Id_Car_Ses\` varchar(64) NOT NULL,
      \`Id_Cli\` int(11) DEFAULT NULL,
      \`Id_Sesion_Tmp\` varchar(64) DEFAULT NULL,
      \`Expira_En\` datetime DEFAULT NULL,
      \`Fec_Cre\` datetime DEFAULT current_timestamp(),
      \`Fec_Mod\` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (\`Id_Car_Ses\`),
      KEY \`idx_carrito_cliente\` (\`Id_Cli\`),
      KEY \`idx_carrito_sesion_tmp\` (\`Id_Sesion_Tmp\`),
      CONSTRAINT \`carrito_sesiones_ibfk_1\` FOREIGN KEY (\`Id_Cli\`) REFERENCES \`clientes\` (\`Id_Cli\`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`imagenes_productos\` (
      \`Id_Ima\` int(11) NOT NULL AUTO_INCREMENT,
      \`Id_Prd\` int(11) NOT NULL,
      \`Url_Ima\` varchar(500) NOT NULL,
      \`Texto_Alt\` varchar(255) DEFAULT NULL,
      \`Orden\` int(11) DEFAULT 0,
      \`Es_Primaria\` tinyint(1) DEFAULT 0,
      \`Fec_Cre\` datetime DEFAULT current_timestamp(),
      PRIMARY KEY (\`Id_Ima\`),
      KEY \`idx_imagen_producto\` (\`Id_Prd\`),
      CONSTRAINT \`imagenes_productos_ibfk_1\` FOREIGN KEY (\`Id_Prd\`) REFERENCES \`productos\` (\`Id_Prd\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`lista_deseos\` (
      \`Id_Des\` int(11) NOT NULL AUTO_INCREMENT,
      \`Id_Cli\` int(11) NOT NULL,
      \`Id_Prd\` int(11) NOT NULL,
      \`Fec_Cre\` datetime DEFAULT current_timestamp(),
      PRIMARY KEY (\`Id_Des\`),
      UNIQUE KEY \`uk_lista_deseos_cliente_producto\` (\`Id_Cli\`,\`Id_Prd\`),
      KEY \`idx_lista_deseos_producto\` (\`Id_Prd\`),
      CONSTRAINT \`lista_deseos_ibfk_1\` FOREIGN KEY (\`Id_Cli\`) REFERENCES \`clientes\` (\`Id_Cli\`) ON DELETE CASCADE,
      CONSTRAINT \`lista_deseos_ibfk_2\` FOREIGN KEY (\`Id_Prd\`) REFERENCES \`productos\` (\`Id_Prd\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`notificaciones\` (
      \`Id_Not\` int(11) NOT NULL AUTO_INCREMENT,
      \`Tipo_Not\` enum('nuevo_pedido','pago','stock_bajo','sistema') NOT NULL,
      \`Titulo_Not\` varchar(200) NOT NULL,
      \`Mensaje_Not\` text NOT NULL,
      \`Datos_Not\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(\`Datos_Not\`)),
      \`Leida\` tinyint(1) DEFAULT 0,
      \`Fecha_Lectura\` datetime DEFAULT NULL,
      \`Fec_Cre\` datetime DEFAULT current_timestamp(),
      PRIMARY KEY (\`Id_Not\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`items_orden\` (
      \`Id_Item_Ord\` int(11) NOT NULL AUTO_INCREMENT,
      \`Id_Ord\` int(11) NOT NULL,
      \`Id_Prd\` int(11) NOT NULL,
      \`Id_Var\` int(11) DEFAULT NULL,
      \`Id_Key\` int(11) DEFAULT NULL COMMENT 'Clave de licencia asignada tras pago',
      \`Id_Cue\` int(11) DEFAULT NULL COMMENT 'Cuenta asignada tras pago',
      \`Nombre_Prd\` varchar(150) NOT NULL,
      \`Nombre_Var\` varchar(100) DEFAULT NULL,
      \`Precio_Unitario\` decimal(10,2) NOT NULL,
      \`Cantidad\` int(11) DEFAULT 1,
      \`Precio_Total\` decimal(10,2) NOT NULL,
      \`Descuento_Item\` decimal(10,2) DEFAULT 0.00,
      \`Clave_Licencia\` text DEFAULT NULL,
      \`Correo_Asociado\` varchar(150) DEFAULT NULL,
      \`Contrasena_Asociada\` varchar(255) DEFAULT NULL,
      \`Fec_Ini_Licencia\` datetime DEFAULT NULL,
      \`Fec_Fin_Licencia\` datetime DEFAULT NULL,
      \`Estado_Item\` enum('pendiente','entregado','cancelado') DEFAULT 'pendiente',
      \`Fec_Cre\` datetime DEFAULT current_timestamp(),
      PRIMARY KEY (\`Id_Item_Ord\`),
      KEY \`idx_item_orden\` (\`Id_Ord\`),
      KEY \`idx_item_producto\` (\`Id_Prd\`),
      KEY \`idx_item_variante\` (\`Id_Var\`),
      KEY \`idx_item_key\` (\`Id_Key\`),
      KEY \`idx_item_cuenta\` (\`Id_Cue\`),
      CONSTRAINT \`items_orden_ibfk_1\` FOREIGN KEY (\`Id_Ord\`) REFERENCES \`ordenes\` (\`Id_Ord\`) ON DELETE CASCADE,
      CONSTRAINT \`items_orden_ibfk_2\` FOREIGN KEY (\`Id_Prd\`) REFERENCES \`productos\` (\`Id_Prd\`),
      CONSTRAINT \`items_orden_ibfk_3\` FOREIGN KEY (\`Id_Var\`) REFERENCES \`variantes_productos\` (\`Id_Var\`),
      CONSTRAINT \`items_orden_ibfk_4\` FOREIGN KEY (\`Id_Key\`) REFERENCES \`keys_productos\` (\`Id_Key\`) ON DELETE SET NULL,
      CONSTRAINT \`items_orden_ibfk_5\` FOREIGN KEY (\`Id_Cue\`) REFERENCES \`cuentas\` (\`Id_Cue\`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`pagos\` (
      \`Id_Pag\` int(11) NOT NULL AUTO_INCREMENT,
      \`Id_Ord\` int(11) NOT NULL,
      \`Metodo_Pago\` enum('tarjeta','paypal','cripto','transferencia') NOT NULL,
      \`Proveedor_Pago\` varchar(50) DEFAULT 'stripe',
      \`Monto\` decimal(10,2) NOT NULL,
      \`Moneda\` varchar(10) DEFAULT 'USD',
      \`Estado_Pago_Prov\` varchar(50) DEFAULT 'pendiente',
      \`Id_Transaccion\` varchar(255) DEFAULT NULL,
      \`Stripe_PaymentIntent_Id\` varchar(255) DEFAULT NULL,
      \`Metadatos\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(\`Metadatos\`)),
      \`Fec_Cre\` datetime DEFAULT current_timestamp(),
      \`Fec_Mod\` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (\`Id_Pag\`),
      KEY \`idx_pago_orden\` (\`Id_Ord\`),
      CONSTRAINT \`pagos_ibfk_1\` FOREIGN KEY (\`Id_Ord\`) REFERENCES \`ordenes\` (\`Id_Ord\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`cupones_productos\` (
      \`Id_Cup\` int(11) NOT NULL,
      \`Id_Prd\` int(11) NOT NULL,
      PRIMARY KEY (\`Id_Cup\`,\`Id_Prd\`),
      KEY \`idx_cupones_productos_producto\` (\`Id_Prd\`),
      CONSTRAINT \`cupones_productos_ibfk_1\` FOREIGN KEY (\`Id_Cup\`) REFERENCES \`cupones\` (\`Id_Cup\`) ON DELETE CASCADE,
      CONSTRAINT \`cupones_productos_ibfk_2\` FOREIGN KEY (\`Id_Prd\`) REFERENCES \`productos\` (\`Id_Prd\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`uso_cupones\` (
      \`Id_Uso\` int(11) NOT NULL AUTO_INCREMENT,
      \`Id_Cup\` int(11) NOT NULL,
      \`Id_Cli\` int(11) NOT NULL,
      \`Id_Ord\` int(11) DEFAULT NULL,
      \`Descuento_Aplicado\` decimal(10,2) DEFAULT 0.00,
      \`Usado_En\` datetime DEFAULT current_timestamp(),
      PRIMARY KEY (\`Id_Uso\`),
      KEY \`idx_uso_cupon\` (\`Id_Cup\`),
      KEY \`idx_uso_cliente\` (\`Id_Cli\`),
      KEY \`idx_uso_orden\` (\`Id_Ord\`),
      CONSTRAINT \`uso_cupones_ibfk_1\` FOREIGN KEY (\`Id_Cup\`) REFERENCES \`cupones\` (\`Id_Cup\`),
      CONSTRAINT \`uso_cupones_ibfk_2\` FOREIGN KEY (\`Id_Cli\`) REFERENCES \`clientes\` (\`Id_Cli\`),
      CONSTRAINT \`uso_cupones_ibfk_3\` FOREIGN KEY (\`Id_Ord\`) REFERENCES \`ordenes\` (\`Id_Ord\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`resenias\` (
      \`Id_Res\` int(11) NOT NULL AUTO_INCREMENT,
      \`Id_Cli\` int(11) NOT NULL,
      \`Id_Prd\` int(11) NOT NULL,
      \`Id_Ord\` int(11) NOT NULL,
      \`Id_Item_Ord\` int(11) NOT NULL,
      \`Calificacion\` tinyint(4) NOT NULL CHECK (\`Calificacion\` between 1 and 5),
      \`Titulo_Res\` varchar(200) NOT NULL,
      \`Comentario_Res\` text NOT NULL,
      \`Estado_Res\` enum('pendiente','aprobada','rechazada') DEFAULT 'aprobada',
      \`Votos_Utiles\` int(11) DEFAULT 0,
      \`Es_Compra_Verificada\` tinyint(1) DEFAULT 1,
      \`Fec_Cre\` datetime DEFAULT current_timestamp(),
      \`Fec_Mod\` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (\`Id_Res\`),
      KEY \`idx_resenia_cliente\` (\`Id_Cli\`),
      KEY \`idx_resenia_producto\` (\`Id_Prd\`),
      KEY \`idx_resenia_orden\` (\`Id_Ord\`),
      KEY \`idx_resenia_item_orden\` (\`Id_Item_Ord\`),
      CONSTRAINT \`resenias_ibfk_1\` FOREIGN KEY (\`Id_Cli\`) REFERENCES \`clientes\` (\`Id_Cli\`),
      CONSTRAINT \`resenias_ibfk_2\` FOREIGN KEY (\`Id_Prd\`) REFERENCES \`productos\` (\`Id_Prd\`),
      CONSTRAINT \`resenias_ibfk_3\` FOREIGN KEY (\`Id_Ord\`) REFERENCES \`ordenes\` (\`Id_Ord\`),
      CONSTRAINT \`resenias_ibfk_4\` FOREIGN KEY (\`Id_Item_Ord\`) REFERENCES \`items_orden\` (\`Id_Item_Ord\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`carrito_items\` (
      \`Id_Car_Item\` int(11) NOT NULL AUTO_INCREMENT,
      \`Id_Car_Ses\` varchar(64) NOT NULL,
      \`Id_Prd\` int(11) NOT NULL,
      \`Id_Var\` int(11) DEFAULT NULL COMMENT 'Variante elegida (ej. plan mensual/anual)',
      \`Cantidad\` int(11) DEFAULT 1,
      \`Fec_Agregado\` datetime DEFAULT current_timestamp(),
      \`Fec_Mod\` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (\`Id_Car_Item\`),
      KEY \`idx_carrito_item_sesion\` (\`Id_Car_Ses\`),
      KEY \`idx_carrito_item_producto\` (\`Id_Prd\`),
      KEY \`idx_carrito_item_variante\` (\`Id_Var\`),
      CONSTRAINT \`carrito_items_ibfk_1\` FOREIGN KEY (\`Id_Car_Ses\`) REFERENCES \`carrito_sesiones\` (\`Id_Car_Ses\`) ON DELETE CASCADE,
      CONSTRAINT \`carrito_items_ibfk_2\` FOREIGN KEY (\`Id_Prd\`) REFERENCES \`productos\` (\`Id_Prd\`),
      CONSTRAINT \`carrito_items_ibfk_3\` FOREIGN KEY (\`Id_Var\`) REFERENCES \`variantes_productos\` (\`Id_Var\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function ensureAuthAndDomainSchema(connection) {
  await ensureBetterAuthSchema(connection);
  await ensureStaffTable(connection);
  await migrateLegacyUsuariosToStaff(connection);
  await ensureClientesAuthSchema(connection);
  await ensureEcommerceSchema(connection);
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
