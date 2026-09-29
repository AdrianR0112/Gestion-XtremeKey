-- La tabla renovaciones esta vacia en este proyecto y se elimina sin respaldo.
-- Ejecutar una sola vez sobre una base que ya tenga detalle_ventas.

ALTER TABLE detalle_ventas
  ADD COLUMN Id_Dve_Ant INT NULL AFTER Id_Ven,
  ADD UNIQUE KEY uk_detalle_ventas_anterior (Id_Dve_Ant),
  ADD CONSTRAINT fk_detalle_venta_anterior
    FOREIGN KEY (Id_Dve_Ant)
    REFERENCES detalle_ventas (Id_Dve)
    ON DELETE SET NULL;

DROP TABLE IF EXISTS renovaciones;
