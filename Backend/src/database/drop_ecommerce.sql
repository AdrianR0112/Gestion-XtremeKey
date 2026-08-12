-- =============================================================================
-- Migración: eliminación de los módulos de ecommerce del backend.
-- Base de datos: sistema_gestion_xk (MariaDB).
--
-- Elimina las tablas exclusivas de la tienda online, borra las cuentas de
-- clientes creadas por el registro del ecommerce (Better Auth con role='cliente')
-- y quita las columnas/relaciones de ecommerce de las tablas compartidas.
--
-- Idempotente: usa IF EXISTS para tolerar el drift entre el dump versionado y la
-- base en vivo. Ejecutar una sola vez tras desplegar los cambios de código.
--
-- Se conservan: clientes, productos (con Ima_Prd y Des_Cor_Prd), ventas,
-- suscripciones, keys, variantes, categorías, y el staff (user role='admin').
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Tablas exclusivas de ecommerce.
DROP TABLE IF EXISTS `resenias`;
DROP TABLE IF EXISTS `uso_cupones`;
DROP TABLE IF EXISTS `pagos`;
DROP TABLE IF EXISTS `items_orden`;
DROP TABLE IF EXISTS `carrito_items`;
DROP TABLE IF EXISTS `carrito_sesiones`;
DROP TABLE IF EXISTS `cupones_productos`;
DROP TABLE IF EXISTS `lista_deseos`;
DROP TABLE IF EXISTS `ordenes`;
DROP TABLE IF EXISTS `cupones`;
DROP TABLE IF EXISTS `notificaciones`;
DROP TABLE IF EXISTS `imagenes_productos`;

SET FOREIGN_KEY_CHECKS = 1;

-- 2. Cuentas de Better Auth de los clientes de la tienda (role='cliente').
--    El staff (role='admin') queda intacto. Las filas de la tabla `clientes`
--    se conservan; solo se elimina su identidad de acceso.
DELETE FROM `session` WHERE `userId` IN (SELECT `id` FROM `user` WHERE `role` = 'cliente');
DELETE FROM `account` WHERE `userId` IN (SELECT `id` FROM `user` WHERE `role` = 'cliente');
DELETE FROM `user` WHERE `role` = 'cliente';

-- 3. Quitar columnas y relaciones de ecommerce de las tablas compartidas.
ALTER TABLE `user`
  DROP FOREIGN KEY IF EXISTS `fk_user_cliente`;
ALTER TABLE `user`
  DROP KEY IF EXISTS `idx_user_cliente_id`,
  DROP COLUMN IF EXISTS `cliente_id`;

ALTER TABLE `clientes`
  DROP FOREIGN KEY IF EXISTS `fk_clientes_auth_user_id`;
ALTER TABLE `clientes`
  DROP KEY IF EXISTS `uq_clientes_auth_user`,
  DROP COLUMN IF EXISTS `Auth_User_Id`,
  DROP COLUMN IF EXISTS `Password_Hash`,
  DROP COLUMN IF EXISTS `Email_Verificado`,
  DROP COLUMN IF EXISTS `Token_Verificacion`,
  DROP COLUMN IF EXISTS `Fec_Ultimo_Acceso`,
  DROP COLUMN IF EXISTS `Origen_Cli`;

ALTER TABLE `productos`
  DROP KEY IF EXISTS `uk_slug_prd`,
  DROP KEY IF EXISTS `idx_estado_tienda_prd`,
  DROP COLUMN IF EXISTS `Slug_Prd`,
  DROP COLUMN IF EXISTS `Precio_Venta`,
  DROP COLUMN IF EXISTS `Precio_Regular`,
  DROP COLUMN IF EXISTS `Estado_Tienda`,
  DROP COLUMN IF EXISTS `Es_Destacado`,
  DROP COLUMN IF EXISTS `Meta_Titulo`,
  DROP COLUMN IF EXISTS `Meta_Descripcion`;

ALTER TABLE `ventas`
  DROP KEY IF EXISTS `idx_ventas_auth_user`,
  DROP COLUMN IF EXISTS `Auth_User_Id`,
  DROP COLUMN IF EXISTS `Origen_Ven`;
