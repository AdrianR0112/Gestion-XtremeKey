-- =============================================================================
-- Migración: eliminación de los módulos de gastos, compras y proveedores.
-- Base de datos: sistema_gestion_xk (MariaDB).
--
-- Elimina las tablas exclusivas de gastos, compras (con su detalle) y
-- proveedores (con la tabla puente proveedores_productos), y quita la relación
-- con proveedores de las tablas compartidas `cuentas` y `keys_productos`.
--
-- Idempotente: usa IF EXISTS para tolerar el drift entre el dump versionado y la
-- base en vivo. Ejecutar una sola vez tras desplegar los cambios de código.
--
-- Se conservan: cuentas y keys (sin Id_Pro, manteniendo Cos_Cue/Cos_Key y las
-- fechas Fec_Com_Cue/Fec_Com_Key), productos, variantes, categorías, ventas,
-- suscripciones, clientes y revendedores.
-- =============================================================================

-- 1. Soltar primero las relaciones de las tablas compartidas hacia proveedores.
--    Se hace antes del DROP TABLE para no dejar FKs apuntando a tablas que ya
--    no existen. Al borrar la columna MariaDB retira su índice, pero se declara
--    de forma explícita para dejar constancia.
ALTER TABLE `cuentas`
  DROP FOREIGN KEY IF EXISTS `cuentas_ibfk_2`;
ALTER TABLE `cuentas`
  DROP KEY IF EXISTS `Id_Pro`,
  DROP COLUMN IF EXISTS `Id_Pro`;

ALTER TABLE `keys_productos`
  DROP FOREIGN KEY IF EXISTS `keys_productos_ibfk_2`;
ALTER TABLE `keys_productos`
  DROP KEY IF EXISTS `Id_Pro`,
  DROP COLUMN IF EXISTS `Id_Pro`;

-- 2. Tablas exclusivas de gastos, compras y proveedores (hijo -> padre).
--    `gastos` referencia a proveedores y compras por columna, sin FK declarada.
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `gastos`;
DROP TABLE IF EXISTS `detalle_compras`;
DROP TABLE IF EXISTS `compras`;
DROP TABLE IF EXISTS `proveedores_productos`;
DROP TABLE IF EXISTS `proveedores`;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- Verificación posterior (descomentar para comprobar el resultado):
--
-- SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
--   WHERE TABLE_SCHEMA = 'sistema_gestion_xk'
--     AND TABLE_NAME IN ('gastos','detalle_compras','compras',
--                        'proveedores_productos','proveedores');
--   -- Debe devolver 0 filas.
--
-- SELECT TABLE_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
--   WHERE TABLE_SCHEMA = 'sistema_gestion_xk' AND COLUMN_NAME = 'Id_Pro';
--   -- Debe devolver 0 filas.
-- =============================================================================
