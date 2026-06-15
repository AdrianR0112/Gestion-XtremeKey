const { getPool } = require('../../config/database');

const BASE_SELECT = `
  SELECT
    r.*,
    dori.Id_Ven AS Id_Ven_Ori,
    dori.Can_Dve AS Can_Dve_Ori,
    dnue.Id_Ven AS Id_Ven_Nue,
    dnue.Can_Dve AS Can_Dve_Nue,
    c.Nom_Cli,
    p.Nom_Prd,
    v.Nom_Var
  FROM renovaciones r
  INNER JOIN detalle_ventas dori ON dori.Id_Dve = r.Id_Dve_Ori
  LEFT JOIN detalle_ventas dnue ON dnue.Id_Dve = r.Id_Dve_Nue
  INNER JOIN clientes c ON c.Id_Cli = r.Id_Cli
  LEFT JOIN productos p ON p.Id_Prd = r.Id_Prd
  LEFT JOIN variantes_productos v ON v.Id_Var = r.Id_Var
`;

function resolvePool(connection) {
  return connection || getPool();
}

async function findAll(connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY r.Id_Ren DESC`);
  return rows;
}

async function findById(id, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(`${BASE_SELECT} WHERE r.Id_Ren = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function createOne(data, connection) {
  const pool = resolvePool(connection);
  const sql = `
    INSERT INTO renovaciones (
      Id_Dve_Ori,
      Id_Dve_Nue,
      Id_Cli,
      Id_Prd,
      Id_Var,
      Fec_Ven_Ant_Ren,
      Fec_Ini_Nue_Ren,
      Fec_Fin_Nue_Ren,
      Pre_Ori_Ren,
      Pre_Ren,
      Des_Ren,
      Tip_Ren,
      Est_Ren,
      Not_Ren
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Id_Dve_Ori,
    data.Id_Dve_Nue ?? null,
    data.Id_Cli,
    data.Id_Prd,
    data.Id_Var ?? null,
    data.Fec_Ven_Ant_Ren,
    data.Fec_Ini_Nue_Ren ?? null,
    data.Fec_Fin_Nue_Ren ?? null,
    data.Pre_Ori_Ren ?? null,
    data.Pre_Ren ?? null,
    data.Des_Ren ?? 0,
    data.Tip_Ren ?? 'manual',
    data.Est_Ren ?? 'pendiente',
    data.Not_Ren ?? null
  ];

  const [result] = await pool.query(sql, values);
  return findById(result.insertId, connection);
}

async function updateById(id, data, connection) {
  const fields = Object.keys(data);
  if (fields.length === 0) return findById(id, connection);

  const pool = resolvePool(connection);
  const setClause = fields.map((field) => `${field} = ?`).join(', ');
  const values = fields.map((field) => data[field]);

  await pool.query(`UPDATE renovaciones SET ${setClause} WHERE Id_Ren = ?`, [...values, id]);
  return findById(id, connection);
}

async function removeById(id, connection) {
  const pool = resolvePool(connection);
  const [result] = await pool.query('DELETE FROM renovaciones WHERE Id_Ren = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  createOne,
  updateById,
  removeById
};
