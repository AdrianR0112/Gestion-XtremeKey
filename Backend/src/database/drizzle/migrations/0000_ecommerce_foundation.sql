SET @db = DATABASE();

SET @stmt = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'Slug_Prd') = 0,
  'ALTER TABLE `productos` ADD COLUMN `Slug_Prd` VARCHAR(200) DEFAULT NULL AFTER `Nom_Prd`',
  'SELECT 1'
);
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @stmt = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'Precio_Venta') = 0,
  'ALTER TABLE `productos` ADD COLUMN `Precio_Venta` DECIMAL(10,2) DEFAULT NULL AFTER `Des_Cor_Prd`',
  'SELECT 1'
);
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @stmt = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'Precio_Regular') = 0,
  'ALTER TABLE `productos` ADD COLUMN `Precio_Regular` DECIMAL(10,2) DEFAULT NULL AFTER `Precio_Venta`',
  'SELECT 1'
);
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @stmt = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'Estado_Tienda') = 0,
  'ALTER TABLE `productos` ADD COLUMN `Estado_Tienda` ENUM(''borrador'',''activo'',''archivado'') DEFAULT ''activo'' AFTER `Est_Prd`',
  'SELECT 1'
);
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @stmt = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'Es_Destacado') = 0,
  'ALTER TABLE `productos` ADD COLUMN `Es_Destacado` TINYINT(1) NOT NULL DEFAULT 0 AFTER `Estado_Tienda`',
  'SELECT 1'
);
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @stmt = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'Meta_Titulo') = 0,
  'ALTER TABLE `productos` ADD COLUMN `Meta_Titulo` VARCHAR(200) DEFAULT NULL AFTER `Es_Destacado`',
  'SELECT 1'
);
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @stmt = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'Meta_Descripcion') = 0,
  'ALTER TABLE `productos` ADD COLUMN `Meta_Descripcion` TEXT DEFAULT NULL AFTER `Meta_Titulo`',
  'SELECT 1'
);
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @stmt = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'productos' AND INDEX_NAME = 'uk_slug_prd') = 0,
  'ALTER TABLE `productos` ADD UNIQUE KEY `uk_slug_prd` (`Slug_Prd`)',
  'SELECT 1'
);
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @stmt = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'productos' AND INDEX_NAME = 'idx_estado_tienda_prd') = 0,
  'ALTER TABLE `productos` ADD KEY `idx_estado_tienda_prd` (`Estado_Tienda`)',
  'SELECT 1'
);
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

--> statement-breakpoint

SET @stmt = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'clientes' AND COLUMN_NAME = 'Password_Hash') = 0,
  'ALTER TABLE `clientes` ADD COLUMN `Password_Hash` VARCHAR(255) DEFAULT NULL AFTER `Ema_Cli`',
  'SELECT 1'
);
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @stmt = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'clientes' AND COLUMN_NAME = 'Email_Verificado') = 0,
  'ALTER TABLE `clientes` ADD COLUMN `Email_Verificado` TINYINT(1) NOT NULL DEFAULT 0 AFTER `Password_Hash`',
  'SELECT 1'
);
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @stmt = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'clientes' AND COLUMN_NAME = 'Token_Verificacion') = 0,
  'ALTER TABLE `clientes` ADD COLUMN `Token_Verificacion` VARCHAR(255) DEFAULT NULL AFTER `Email_Verificado`',
  'SELECT 1'
);
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @stmt = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'clientes' AND COLUMN_NAME = 'Fec_Ultimo_Acceso') = 0,
  'ALTER TABLE `clientes` ADD COLUMN `Fec_Ultimo_Acceso` DATETIME DEFAULT NULL AFTER `Token_Verificacion`',
  'SELECT 1'
);
PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `cupones` (
  `Id_Cup` int(11) NOT NULL AUTO_INCREMENT,
  `Codigo_Cup` varchar(50) NOT NULL,
  `Descripcion_Cup` text DEFAULT NULL,
  `Tipo_Cup` enum('porcentaje','fijo') DEFAULT 'porcentaje',
  `Monto_Descuento` decimal(10,2) DEFAULT 0.00,
  `Minimo_Carrito` decimal(10,2) DEFAULT 0.00,
  `Maximo_Descuento` decimal(10,2) DEFAULT NULL,
  `Fecha_Desde` datetime NOT NULL,
  `Fecha_Hasta` datetime NOT NULL,
  `Limite_Uso` int(11) DEFAULT NULL,
  `Limite_Uso_Por_Usuario` int(11) DEFAULT 1,
  `Veces_Usado` int(11) DEFAULT 0,
  `Esta_Activo` tinyint(1) DEFAULT 1,
  `Estado_Cup` enum('activo','inactivo','expirado','programado') DEFAULT 'activo',
  `Aplica_A` enum('todos','productos_especificos','categorias_especificas') DEFAULT 'todos',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Cup`),
  UNIQUE KEY `Codigo_Cup` (`Codigo_Cup`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ordenes` (
  `Id_Ord` int(11) NOT NULL AUTO_INCREMENT,
  `Numero_Ord` varchar(50) NOT NULL,
  `Id_Cli` int(11) DEFAULT NULL,
  `Email_Invitado` varchar(150) DEFAULT NULL COMMENT 'Si compra sin registro',
  `Estado_Ord` enum('pendiente','pagada','completada','cancelada','reembolsada') DEFAULT 'pendiente',
  `Estado_Pago` enum('pendiente','pagado','fallido','reembolsado','parcial') DEFAULT 'pendiente',
  `Moneda` varchar(10) DEFAULT 'USD',
  `Subtotal` decimal(10,2) NOT NULL,
  `Descuento` decimal(10,2) DEFAULT 0.00,
  `Total` decimal(10,2) NOT NULL,
  `Id_Cupon` int(11) DEFAULT NULL,
  `Codigo_Cupon` varchar(50) DEFAULT NULL,
  `Notas_Cliente` text DEFAULT NULL,
  `Notas_Internas` text DEFAULT NULL,
  `Metadatos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Metadatos`)),
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Ord`),
  UNIQUE KEY `Numero_Ord` (`Numero_Ord`),
  KEY `idx_orden_cliente` (`Id_Cli`),
  CONSTRAINT `ordenes_ibfk_1` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `carrito_sesiones` (
  `Id_Car_Ses` varchar(64) NOT NULL,
  `Id_Cli` int(11) DEFAULT NULL,
  `Id_Sesion_Tmp` varchar(64) DEFAULT NULL,
  `Expira_En` datetime DEFAULT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Car_Ses`),
  KEY `idx_carrito_cliente` (`Id_Cli`),
  KEY `idx_carrito_sesion_tmp` (`Id_Sesion_Tmp`),
  CONSTRAINT `carrito_sesiones_ibfk_1` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `imagenes_productos` (
  `Id_Ima` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Prd` int(11) NOT NULL,
  `Url_Ima` varchar(500) NOT NULL,
  `Texto_Alt` varchar(255) DEFAULT NULL,
  `Orden` int(11) DEFAULT 0,
  `Es_Primaria` tinyint(1) DEFAULT 0,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`Id_Ima`),
  KEY `idx_imagen_producto` (`Id_Prd`),
  CONSTRAINT `imagenes_productos_ibfk_1` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lista_deseos` (
  `Id_Des` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Cli` int(11) NOT NULL,
  `Id_Prd` int(11) NOT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`Id_Des`),
  UNIQUE KEY `uk_lista_deseos_cliente_producto` (`Id_Cli`,`Id_Prd`),
  KEY `idx_lista_deseos_producto` (`Id_Prd`),
  CONSTRAINT `lista_deseos_ibfk_1` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`) ON DELETE CASCADE,
  CONSTRAINT `lista_deseos_ibfk_2` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `notificaciones` (
  `Id_Not` int(11) NOT NULL AUTO_INCREMENT,
  `Tipo_Not` enum('nuevo_pedido','pago','stock_bajo','sistema') NOT NULL,
  `Titulo_Not` varchar(200) NOT NULL,
  `Mensaje_Not` text NOT NULL,
  `Datos_Not` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Datos_Not`)),
  `Leida` tinyint(1) DEFAULT 0,
  `Fecha_Lectura` datetime DEFAULT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`Id_Not`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `items_orden` (
  `Id_Item_Ord` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Ord` int(11) NOT NULL,
  `Id_Prd` int(11) NOT NULL,
  `Id_Var` int(11) DEFAULT NULL,
  `Id_Key` int(11) DEFAULT NULL COMMENT 'Clave de licencia asignada tras pago',
  `Id_Cue` int(11) DEFAULT NULL COMMENT 'Cuenta asignada tras pago',
  `Nombre_Prd` varchar(150) NOT NULL,
  `Nombre_Var` varchar(100) DEFAULT NULL,
  `Precio_Unitario` decimal(10,2) NOT NULL,
  `Cantidad` int(11) DEFAULT 1,
  `Precio_Total` decimal(10,2) NOT NULL,
  `Descuento_Item` decimal(10,2) DEFAULT 0.00,
  `Clave_Licencia` text DEFAULT NULL,
  `Correo_Asociado` varchar(150) DEFAULT NULL,
  `Contrasena_Asociada` varchar(255) DEFAULT NULL,
  `Fec_Ini_Licencia` datetime DEFAULT NULL,
  `Fec_Fin_Licencia` datetime DEFAULT NULL,
  `Estado_Item` enum('pendiente','entregado','cancelado') DEFAULT 'pendiente',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`Id_Item_Ord`),
  KEY `idx_item_orden` (`Id_Ord`),
  KEY `idx_item_producto` (`Id_Prd`),
  KEY `idx_item_variante` (`Id_Var`),
  KEY `idx_item_key` (`Id_Key`),
  KEY `idx_item_cuenta` (`Id_Cue`),
  CONSTRAINT `items_orden_ibfk_1` FOREIGN KEY (`Id_Ord`) REFERENCES `ordenes` (`Id_Ord`) ON DELETE CASCADE,
  CONSTRAINT `items_orden_ibfk_2` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`),
  CONSTRAINT `items_orden_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`),
  CONSTRAINT `items_orden_ibfk_4` FOREIGN KEY (`Id_Key`) REFERENCES `keys_productos` (`Id_Key`) ON DELETE SET NULL,
  CONSTRAINT `items_orden_ibfk_5` FOREIGN KEY (`Id_Cue`) REFERENCES `cuentas` (`Id_Cue`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pagos` (
  `Id_Pag` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Ord` int(11) NOT NULL,
  `Metodo_Pago` enum('tarjeta','paypal','cripto','transferencia') NOT NULL,
  `Proveedor_Pago` varchar(50) DEFAULT 'stripe',
  `Monto` decimal(10,2) NOT NULL,
  `Moneda` varchar(10) DEFAULT 'USD',
  `Estado_Pago_Prov` varchar(50) DEFAULT 'pendiente',
  `Id_Transaccion` varchar(255) DEFAULT NULL,
  `Stripe_PaymentIntent_Id` varchar(255) DEFAULT NULL,
  `Metadatos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Metadatos`)),
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Pag`),
  KEY `idx_pago_orden` (`Id_Ord`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`Id_Ord`) REFERENCES `ordenes` (`Id_Ord`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cupones_productos` (
  `Id_Cup` int(11) NOT NULL,
  `Id_Prd` int(11) NOT NULL,
  PRIMARY KEY (`Id_Cup`,`Id_Prd`),
  KEY `idx_cupones_productos_producto` (`Id_Prd`),
  CONSTRAINT `cupones_productos_ibfk_1` FOREIGN KEY (`Id_Cup`) REFERENCES `cupones` (`Id_Cup`) ON DELETE CASCADE,
  CONSTRAINT `cupones_productos_ibfk_2` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `uso_cupones` (
  `Id_Uso` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Cup` int(11) NOT NULL,
  `Id_Cli` int(11) NOT NULL,
  `Id_Ord` int(11) DEFAULT NULL,
  `Descuento_Aplicado` decimal(10,2) DEFAULT 0.00,
  `Usado_En` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`Id_Uso`),
  KEY `idx_uso_cupon` (`Id_Cup`),
  KEY `idx_uso_cliente` (`Id_Cli`),
  KEY `idx_uso_orden` (`Id_Ord`),
  CONSTRAINT `uso_cupones_ibfk_1` FOREIGN KEY (`Id_Cup`) REFERENCES `cupones` (`Id_Cup`),
  CONSTRAINT `uso_cupones_ibfk_2` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`),
  CONSTRAINT `uso_cupones_ibfk_3` FOREIGN KEY (`Id_Ord`) REFERENCES `ordenes` (`Id_Ord`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `resenias` (
  `Id_Res` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Cli` int(11) NOT NULL,
  `Id_Prd` int(11) NOT NULL,
  `Id_Ord` int(11) NOT NULL,
  `Id_Item_Ord` int(11) NOT NULL,
  `Calificacion` tinyint(4) NOT NULL CHECK (`Calificacion` between 1 and 5),
  `Titulo_Res` varchar(200) NOT NULL,
  `Comentario_Res` text NOT NULL,
  `Estado_Res` enum('pendiente','aprobada','rechazada') DEFAULT 'aprobada',
  `Votos_Utiles` int(11) DEFAULT 0,
  `Es_Compra_Verificada` tinyint(1) DEFAULT 1,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Res`),
  KEY `idx_resenia_cliente` (`Id_Cli`),
  KEY `idx_resenia_producto` (`Id_Prd`),
  KEY `idx_resenia_orden` (`Id_Ord`),
  KEY `idx_resenia_item_orden` (`Id_Item_Ord`),
  CONSTRAINT `resenias_ibfk_1` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`),
  CONSTRAINT `resenias_ibfk_2` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`),
  CONSTRAINT `resenias_ibfk_3` FOREIGN KEY (`Id_Ord`) REFERENCES `ordenes` (`Id_Ord`),
  CONSTRAINT `resenias_ibfk_4` FOREIGN KEY (`Id_Item_Ord`) REFERENCES `items_orden` (`Id_Item_Ord`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `carrito_items` (
  `Id_Car_Item` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Car_Ses` varchar(64) NOT NULL,
  `Id_Prd` int(11) NOT NULL,
  `Id_Var` int(11) DEFAULT NULL COMMENT 'Variante elegida (ej. plan mensual/anual)',
  `Cantidad` int(11) DEFAULT 1,
  `Fec_Agregado` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Car_Item`),
  KEY `idx_carrito_item_sesion` (`Id_Car_Ses`),
  KEY `idx_carrito_item_producto` (`Id_Prd`),
  KEY `idx_carrito_item_variante` (`Id_Var`),
  CONSTRAINT `carrito_items_ibfk_1` FOREIGN KEY (`Id_Car_Ses`) REFERENCES `carrito_sesiones` (`Id_Car_Ses`) ON DELETE CASCADE,
  CONSTRAINT `carrito_items_ibfk_2` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`),
  CONSTRAINT `carrito_items_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
