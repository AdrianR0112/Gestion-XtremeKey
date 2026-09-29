-- ---------------------------------------------------------------------------
-- Migracion: el revendedor puede ser titular de una suscripcion
-- ---------------------------------------------------------------------------
-- Antes de esta migracion, suscripciones.Id_Cli era NOT NULL y las ventas a
-- revendedor no generaban ninguna suscripcion (solo quedaban como lineas en
-- detalle_ventas). A partir de aqui una suscripcion pertenece exactamente a un
-- titular: un cliente final (Id_Cli) O un revendedor (Id_Rev), nunca ambos ni
-- ninguno. Misma semantica que ya tiene la tabla ventas.
--
-- El bootstrap idempotente de Backend/src/config/database.js
-- (ensureSuscripcionTitularSchema) aplica estos mismos cambios en cada arranque.
-- Este script existe para instalaciones que se migran a mano y como
-- documentacion del cambio.
--
-- IMPORTANTE: el orden importa. La CHECK se valida contra las filas existentes
-- en el momento de crearse, asi que va al final, cuando los datos ya cumplen.
-- ---------------------------------------------------------------------------

-- 1. Verificacion previa. Debe devolver 0 filas.
--    Si devuelve alguna, esas suscripciones no tienen titular y hay que
--    asignarles un Id_Cli o un Id_Rev a mano antes de continuar: el paso 5
--    fallaria con ellas presentes.
SELECT Id_Sus, Id_Prd, Fec_Ini_Sus FROM suscripciones WHERE Id_Cli IS NULL;

-- 2. Columna del titular revendedor + indice + FK.
ALTER TABLE `suscripciones`
  ADD COLUMN `Id_Rev` int(11) DEFAULT NULL AFTER `Id_Cli`,
  ADD KEY `idx_suscripciones_revendedor` (`Id_Rev`),
  ADD CONSTRAINT `fk_suscripciones_revendedor`
    FOREIGN KEY (`Id_Rev`) REFERENCES `revendedores` (`Id_Rev`);

-- 3. Id_Cli pasa a ser opcional. La FK suscripciones_ibfk_1 sigue siendo valida:
--    InnoDB no valida las referencias NULL.
ALTER TABLE `suscripciones` MODIFY COLUMN `Id_Cli` int(11) DEFAULT NULL;

-- 4. Indice compuesto para el job de expiracion, el filtro "por vencer" y el
--    resumen de KPIs, que siempre combinan Est_Sus con Fec_Fin_Sus.
ALTER TABLE `suscripciones`
  ADD KEY `idx_suscripciones_estado_fin` (`Est_Sus`, `Fec_Fin_Sus`);

-- 5. Exclusividad del titular (XOR): exactamente uno de los dos.
--    MariaDB >= 10.2 aplica CHECK; ya hay precedente en este mismo esquema con
--    chk_detalle_ventas_producto_variante.
ALTER TABLE `suscripciones`
  ADD CONSTRAINT `chk_suscripciones_titular`
  CHECK ((`Id_Cli` IS NULL) <> (`Id_Rev` IS NULL));

-- ---------------------------------------------------------------------------
-- Verificacion posterior
-- ---------------------------------------------------------------------------
-- DESCRIBE suscripciones;  -- Id_Cli y Id_Rev deben aparecer como NULL = YES
-- SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS
--   WHERE TABLE_NAME = 'suscripciones';  -- debe listar chk_suscripciones_titular
-- SELECT COUNT(*) FROM suscripciones WHERE (Id_Cli IS NULL) = (Id_Rev IS NULL);  -- 0
