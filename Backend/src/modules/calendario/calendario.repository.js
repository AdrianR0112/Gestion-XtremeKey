const { getPool } = require('../../config/database');

async function findEventsBetween(startDate, endDate) {
  const pool = getPool();

  const [rows] = await pool.query(
    `
    SELECT
      'tarea' AS Event_Type,
      CONCAT('tarea-', t.Id_Tar) AS Event_Key,
      t.Id_Tar AS Event_Id,
      t.Tit_Tar AS Title,
      t.Des_Tar AS Description,
      t.Fec_Lim_Tar AS Event_Date,
      t.Est_Tar AS Status,
      t.Pri_Tar AS Priority,
      t.Pro_Tar AS Progress,
      t.Id_Cli AS Client_Id,
      CONCAT_WS(' ', c.Nom_Cli, c.Ape_Cli) AS Client_Name,
      t.Id_Ven AS Sale_Id,
      NULL AS Product_Id,
      NULL AS Product_Name,
      NULL AS Variant_Id,
      NULL AS Variant_Name,
      'tarea' AS Source
    FROM tareas t
    LEFT JOIN clientes c ON c.Id_Cli = t.Id_Cli
    WHERE t.Fec_Lim_Tar IS NOT NULL
      AND t.Fec_Lim_Tar BETWEEN ? AND ?

    UNION ALL

    SELECT
      'detalle-venta' AS Event_Type,
      CONCAT('detalle-venta-', d.Id_Dve) AS Event_Key,
      d.Id_Dve AS Event_Id,
      CONCAT('Venta #', v.Id_Ven, ' - ', COALESCE(p.Nom_Prd, 'Detalle de venta')) AS Title,
      d.Not_Dve AS Description,
      d.Fec_Fin_Dve AS Event_Date,
      d.Est_Dve AS Status,
      NULL AS Priority,
      NULL AS Progress,
      v.Id_Cli AS Client_Id,
      CONCAT_WS(' ', c.Nom_Cli, c.Ape_Cli) AS Client_Name,
      d.Id_Ven AS Sale_Id,
      d.Id_Prd AS Product_Id,
      p.Nom_Prd AS Product_Name,
      d.Id_Var AS Variant_Id,
      vr.Nom_Var AS Variant_Name,
      'detalle-venta' AS Source
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