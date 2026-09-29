-- =============================================================================
-- Migración: eliminación de `Uuid_Cli` (clientes ya usan Id_Cli como identificador).
-- Base de datos: sistema_gestion_xk (MariaDB).
--
-- Nota: el código de venta autogenerado (Cod_Ven, tabla contadores_venta) NO
-- requiere este script — se crea y backfillea automáticamente al arrancar el
-- backend vía `ensureVentaCodigoSchema` en Backend/src/config/database.js.
--
-- Orden obligatorio: primero se sueltan las FKs hijas que referencian
-- `clientes.Uuid_Cli` (ventas, suscripciones, tareas), luego se
-- traslada la PRIMARY KEY de `clientes` de `Uuid_Cli` a `Id_Cli`. Todas esas
-- tablas ya tienen `Id_Cli` con su propia FK a `clientes.Id_Cli`, así que
-- ninguna relación se pierde.
--
-- Este script es de un solo uso (no idempotente): si se ejecuta dos veces
-- fallará porque las columnas/FKs ya no existirán en la segunda corrida.
-- =============================================================================

ALTER TABLE `suscripciones` DROP FOREIGN KEY IF EXISTS `fk_suscripciones_uuid_cli`;
ALTER TABLE `suscripciones` DROP KEY IF EXISTS `idx_suscripciones_uuid_cli`, DROP COLUMN IF EXISTS `Uuid_Cli`;

ALTER TABLE `tareas` DROP FOREIGN KEY IF EXISTS `fk_tareas_uuid_cli`;
ALTER TABLE `tareas` DROP KEY IF EXISTS `idx_tareas_uuid_cli`, DROP COLUMN IF EXISTS `Uuid_Cli`;

ALTER TABLE `ventas` DROP FOREIGN KEY IF EXISTS `fk_ventas_uuid_cli`;
ALTER TABLE `ventas` DROP KEY IF EXISTS `idx_ventas_uuid_cli`, DROP COLUMN IF EXISTS `Uuid_Cli`;

ALTER TABLE `clientes`
  DROP PRIMARY KEY,
  ADD PRIMARY KEY (`Id_Cli`),
  DROP KEY IF EXISTS `uk_clientes_uuid`,
  DROP KEY IF EXISTS `uk_clientes_legacy_id`,
  DROP COLUMN IF EXISTS `Uuid_Cli`;
