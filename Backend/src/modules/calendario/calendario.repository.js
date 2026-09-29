const { getPool } = require('../../config/database');

async function findEventsBetween(startDate, endDate) {
  const pool = getPool();

  const [rows] = await pool.query(
    `
    SELECT
      _utf8mb4'tarea' COLLATE utf8mb4_unicode_ci AS Event_Type,
      CONVERT(CONCAT('tarea-', t.Id_Tar) USING utf8mb4) COLLATE utf8mb4_unicode_ci AS Event_Key,
      t.Id_Tar AS Event_Id,
      CONVERT(t.Tit_Tar USING utf8mb4) COLLATE utf8mb4_unicode_ci AS Title,
      CONVERT(t.Des_Tar USING utf8mb4) COLLATE utf8mb4_unicode_ci AS Description,
      t.Fec_Lim_Tar AS Event_Date,
      CONVERT(t.Est_Tar USING utf8mb4) COLLATE utf8mb4_unicode_ci AS Status,
      CONVERT(t.Pri_Tar USING utf8mb4) COLLATE utf8mb4_unicode_ci AS Priority,
      t.Pro_Tar AS Progress,
      t.Id_Cli AS Client_Id,
      CONVERT(CONCAT_WS(' ', c.Nom_Cli, c.Ape_Cli) USING utf8mb4) COLLATE utf8mb4_unicode_ci AS Client_Name,
      t.Id_Ven AS Sale_Id,
      NULL AS Product_Id,
      NULL AS Product_Name,
      NULL AS Variant_Id,
      NULL AS Variant_Name,
      _utf8mb4'tarea' COLLATE utf8mb4_unicode_ci AS Source
    FROM tareas t
    LEFT JOIN clientes c ON c.Id_Cli = t.Id_Cli
    WHERE t.Fec_Lim_Tar IS NOT NULL
      AND t.Fec_Lim_Tar BETWEEN ? AND ?

    UNION ALL

    SELECT
      _utf8mb4'detalle-venta' COLLATE utf8mb4_unicode_ci AS Event_Type,
      CONVERT(CONCAT('detalle-venta-', d.Id_Dve) USING utf8mb4) COLLATE utf8mb4_unicode_ci AS Event_Key,
      d.Id_Dve AS Event_Id,
      CONVERT(CONCAT('Venta #', v.Id_Ven, ' - ', COALESCE(p.Nom_Prd, 'Detalle de venta')) USING utf8mb4) COLLATE utf8mb4_unicode_ci AS Title,
      CONVERT(d.Not_Dve USING utf8mb4) COLLATE utf8mb4_unicode_ci AS Description,
      d.Fec_Fin_Dve AS Event_Date,
      CONVERT(d.Est_Dve USING utf8mb4) COLLATE utf8mb4_unicode_ci AS Status,
      NULL AS Priority,
      NULL AS Progress,
      v.Id_Cli AS Client_Id,
      CONVERT(CONCAT_WS(' ', c.Nom_Cli, c.Ape_Cli) USING utf8mb4) COLLATE utf8mb4_unicode_ci AS Client_Name,
      d.Id_Ven AS Sale_Id,
      d.Id_Prd AS Product_Id,
      CONVERT(p.Nom_Prd USING utf8mb4) COLLATE utf8mb4_unicode_ci AS Product_Name,
      d.Id_Var AS Variant_Id,
      CONVERT(vr.Nom_Var USING utf8mb4) COLLATE utf8mb4_unicode_ci AS Variant_Name,
      _utf8mb4'detalle-venta' COLLATE utf8mb4_unicode_ci AS Source
    FROM detalle_ventas d
    INNER JOIN ventas v ON v.Id_Ven = d.Id_Ven
    INNER JOIN clientes c ON c.Id_Cli = v.Id_Cli
    LEFT JOIN productos p ON p.Id_Prd = d.Id_Prd
    LEFT JOIN variantes_productos vr ON vr.Id_Var = d.Id_Var
    WHERE d.Fec_Fin_Dve IS NOT NULL
      AND d.Fec_Fin_Dve BETWEEN ? AND ?

    ORDER BY Event_Date ASC, Event_Type ASC, Event_Id ASC
    `,
    [startDate, endDate, startDate, endDate]
  );

  return rows;
}

module.exports = { findEventsBetween };
