const { getPool } = require('../../config/database');

function resolvePool(connection) {
  return connection || getPool();
}

function normalizeLimit(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, 100) : fallback;
}

async function getTotales(desde, hasta, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(
    `
      SELECT
        (
          SELECT COALESCE(SUM(v.Tot_Ven), 0)
          FROM ventas v
          WHERE v.Est_Ven = 'completada'
            AND v.Fec_Ven >= ?
            AND v.Fec_Ven < DATE_ADD(?, INTERVAL 1 DAY)
        ) AS ingresos,
        (
          SELECT COALESCE(SUM(COALESCE(vp.Pre_Cos_Var, 0) * d.Can_Dve), 0)
          FROM detalle_ventas d
          INNER JOIN ventas v ON v.Id_Ven = d.Id_Ven
          LEFT JOIN variantes_productos vp ON vp.Id_Var = d.Id_Var
          WHERE v.Est_Ven = 'completada'
            AND v.Fec_Ven >= ?
            AND v.Fec_Ven < DATE_ADD(?, INTERVAL 1 DAY)
        ) AS costo,
        (
          SELECT COUNT(*)
          FROM ventas v
          WHERE v.Est_Ven = 'completada'
            AND v.Fec_Ven >= ?
            AND v.Fec_Ven < DATE_ADD(?, INTERVAL 1 DAY)
        ) AS cantidadVentas,
        (
          SELECT COALESCE(SUM(d.Can_Dve), 0)
          FROM detalle_ventas d
          INNER JOIN ventas v ON v.Id_Ven = d.Id_Ven
          WHERE v.Est_Ven = 'completada'
            AND v.Fec_Ven >= ?
            AND v.Fec_Ven < DATE_ADD(?, INTERVAL 1 DAY)
        ) AS unidades,
        (
          SELECT COUNT(*)
          FROM detalle_ventas d
          INNER JOIN ventas v ON v.Id_Ven = d.Id_Ven
          LEFT JOIN variantes_productos vp ON vp.Id_Var = d.Id_Var
          WHERE v.Est_Ven = 'completada'
            AND v.Fec_Ven >= ?
            AND v.Fec_Ven < DATE_ADD(?, INTERVAL 1 DAY)
            AND (d.Id_Var IS NULL OR COALESCE(vp.Pre_Cos_Var, 0) = 0)
        ) AS lineasSinCosto
    `,
    [desde, hasta, desde, hasta, desde, hasta, desde, hasta, desde, hasta]
  );

  return rows[0] || {};
}

async function getSerie(desde, hasta, granularidad = 'dia', connection) {
  const pool = resolvePool(connection);
  const bucketFormat = granularidad === 'mes' ? '%Y-%m' : '%Y-%m-%d';
  const [rows] = await pool.query(
    `
      SELECT
        DATE_FORMAT(v.Fec_Ven, '${bucketFormat}') AS bucket,
        COALESCE(SUM(v.Tot_Ven), 0) AS ingresos,
        COALESCE(SUM(v.Tot_Ven - COALESCE(c.costo, 0)), 0) AS ganancia,
        COUNT(*) AS cantidad
      FROM ventas v
      LEFT JOIN (
        SELECT
          d.Id_Ven,
          SUM(COALESCE(vp.Pre_Cos_Var, 0) * d.Can_Dve) AS costo
        FROM detalle_ventas d
        LEFT JOIN variantes_productos vp ON vp.Id_Var = d.Id_Var
        GROUP BY d.Id_Ven
      ) c ON c.Id_Ven = v.Id_Ven
      WHERE v.Est_Ven = 'completada'
        AND v.Fec_Ven >= ?
        AND v.Fec_Ven < DATE_ADD(?, INTERVAL 1 DAY)
      GROUP BY bucket
      ORDER BY bucket
    `,
    [desde, hasta]
  );

  return rows;
}

async function getConteos(connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM productos WHERE Est_Prd = 'activo') AS productos,
      (SELECT COUNT(*) FROM clientes WHERE Est_Cli = 'activo') AS clientes,
      (SELECT COUNT(*) FROM revendedores WHERE Est_Rev = 'activo') AS revendedores
  `);
  return rows[0] || {};
}

async function getTopProductos(desde, hasta, limite = 5, connection) {
  const pool = resolvePool(connection);
  const safeLimit = normalizeLimit(limite, 5);
  const [rows] = await pool.query(
    `
      SELECT
        p.Id_Prd AS id,
        p.Nom_Prd AS nombre,
        COALESCE(SUM(d.Can_Dve), 0) AS cantidad,
        COALESCE(SUM((d.Pre_Uni_Dve - COALESCE(d.Des_Uni_Dve, 0)) * d.Can_Dve), 0) AS monto,
        COALESCE(SUM(
          ((d.Pre_Uni_Dve - COALESCE(d.Des_Uni_Dve, 0)) - COALESCE(vp.Pre_Cos_Var, 0)) * d.Can_Dve
        ), 0) AS ganancia
      FROM detalle_ventas d
      INNER JOIN ventas v ON v.Id_Ven = d.Id_Ven
      INNER JOIN productos p ON p.Id_Prd = d.Id_Prd
      LEFT JOIN variantes_productos vp ON vp.Id_Var = d.Id_Var
      WHERE v.Est_Ven = 'completada'
        AND v.Fec_Ven >= ?
        AND v.Fec_Ven < DATE_ADD(?, INTERVAL 1 DAY)
      GROUP BY p.Id_Prd, p.Nom_Prd
      ORDER BY monto DESC, cantidad DESC
      LIMIT ${safeLimit}
    `,
    [desde, hasta]
  );

  return rows;
}

async function getTopClientes(desde, hasta, limite = 5, connection) {
  const pool = resolvePool(connection);
  const safeLimit = normalizeLimit(limite, 5);
  const [rows] = await pool.query(
    `
      SELECT
        COALESCE(c.Id_Cli, r.Id_Rev) AS id,
        COALESCE(
          NULLIF(TRIM(CONCAT_WS(' ', c.Nom_Cli, c.Ape_Cli)), ''),
          NULLIF(TRIM(CONCAT_WS(' ', r.Nom_Rev, r.Ape_Rev)), ''),
          'Sin nombre'
        ) AS nombre,
        CASE WHEN v.Id_Cli IS NOT NULL THEN 'cliente' ELSE 'revendedor' END AS tipo,
        COALESCE(SUM(v.Tot_Ven), 0) AS monto,
        COUNT(*) AS compras
      FROM ventas v
      LEFT JOIN clientes c ON c.Id_Cli = v.Id_Cli
      LEFT JOIN revendedores r ON r.Id_Rev = v.Id_Rev
      WHERE v.Est_Ven = 'completada'
        AND v.Fec_Ven >= ?
        AND v.Fec_Ven < DATE_ADD(?, INTERVAL 1 DAY)
      GROUP BY id, nombre, tipo
      ORDER BY monto DESC, compras DESC
      LIMIT ${safeLimit}
    `,
    [desde, hasta]
  );

  return rows;
}

async function getUltimasVentas(limite = 10, connection) {
  const pool = resolvePool(connection);
  const safeLimit = normalizeLimit(limite, 10);
  const [rows] = await pool.query(`
    SELECT
      v.Id_Ven AS id,
      COALESCE(
        NULLIF(TRIM(CONCAT_WS(' ', c.Nom_Cli, c.Ape_Cli)), ''),
        NULLIF(TRIM(CONCAT_WS(' ', r.Nom_Rev, r.Ape_Rev)), ''),
        '—'
      ) AS cliente,
      CASE WHEN v.Id_Cli IS NOT NULL THEN 'Cliente' ELSE 'Revendedor' END AS rol,
      GROUP_CONCAT(DISTINCT COALESCE(p.Nom_Prd, 'Sin producto') ORDER BY p.Nom_Prd SEPARATOR ', ') AS producto,
      MIN(d.Fec_Ini_Dve) AS Fec_Ini_Dve,
      MAX(d.Fec_Fin_Dve) AS Fec_Fin_Dve,
      CASE
        WHEN SUM(d.Est_Dve = 'activo') > 0 THEN 'activo'
        WHEN SUM(d.Est_Dve = 'vencido') > 0 THEN 'vencido'
        WHEN SUM(d.Est_Dve = 'renovado') > 0 THEN 'renovado'
        ELSE 'cancelado'
      END AS Est_Dve
    FROM ventas v
    INNER JOIN detalle_ventas d ON d.Id_Ven = v.Id_Ven
    LEFT JOIN productos p ON p.Id_Prd = d.Id_Prd
    LEFT JOIN clientes c ON c.Id_Cli = v.Id_Cli
    LEFT JOIN revendedores r ON r.Id_Rev = v.Id_Rev
    WHERE v.Est_Ven = 'completada'
    GROUP BY v.Id_Ven, cliente, rol, v.Fec_Ven
    ORDER BY v.Fec_Ven DESC, v.Id_Ven DESC
    LIMIT ${safeLimit}
  `);

  return rows;
}

async function getRenovaciones(desde, hasta, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(
    `
      SELECT
        renovaciones.cantidad,
        renovaciones.importe,
        vencimientos.cantidad AS vencimientos,
        CASE
          WHEN vencimientos.cantidad = 0 THEN 0
          ELSE (renovaciones.cantidad / vencimientos.cantidad) * 100
        END AS tasaRenovacion
      FROM (
        SELECT
          COUNT(*) AS cantidad,
          COALESCE(SUM(
            (nueva.Pre_Uni_Dve - COALESCE(nueva.Des_Uni_Dve, 0)) * nueva.Can_Dve
          ), 0) AS importe
        FROM detalle_ventas nueva
        INNER JOIN detalle_ventas anterior ON anterior.Id_Dve = nueva.Id_Dve_Ant
        INNER JOIN ventas ventaNueva ON ventaNueva.Id_Ven = nueva.Id_Ven
        WHERE ventaNueva.Est_Ven = 'completada'
          AND ventaNueva.Fec_Ven >= ?
          AND ventaNueva.Fec_Ven < DATE_ADD(?, INTERVAL 1 DAY)
      ) renovaciones
      CROSS JOIN (
        SELECT COUNT(*) AS cantidad
        FROM detalle_ventas detalle
        INNER JOIN ventas ventaOriginal ON ventaOriginal.Id_Ven = detalle.Id_Ven
        WHERE ventaOriginal.Est_Ven = 'completada'
          AND detalle.Fec_Fin_Dve >= ?
          AND detalle.Fec_Fin_Dve < DATE_ADD(?, INTERVAL 1 DAY)
      ) vencimientos
    `,
    [desde, hasta, desde, hasta]
  );

  return rows[0] || {};
}

module.exports = {
  getTotales,
  getSerie,
  getConteos,
  getTopProductos,
  getTopClientes,
  getUltimasVentas,
  getRenovaciones,
};
