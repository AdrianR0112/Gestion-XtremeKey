const { getPool } = require('../../config/database');

const BASE_SELECT = `
  SELECT
    c.*,
    p.Nom_Prd,
    v.Nom_Var,
    pr.Nom_Pro
  FROM cuentas c
  LEFT JOIN productos p ON p.Id_Prd = c.Id_Prd
  LEFT JOIN variantes_productos v ON v.Id_Var = c.Id_Var
  LEFT JOIN proveedores pr ON pr.Id_Pro = c.Id_Pro
`;

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY c.Id_Cue DESC`);
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} WHERE c.Id_Cue = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO cuentas (
      Id_Prd,
      Id_Var,
      Id_Pro,
      Nom_Cue,
      Usu_Cue,
      Pas_Cue,
      Pin_Cue,
      Per_Cue,
      Tot_Per_Cue,
      Per_Dis_Cue,
      Fec_Com_Cue,
      Fec_Ven_Cue,
      Cos_Cue,
      Not_Cue,
      Est_Cue
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Id_Prd,
    data.Id_Var ?? null,
    data.Id_Pro ?? null,
    data.Nom_Cue ?? null,
    data.Usu_Cue ?? null,
    data.Pas_Cue ?? null,
    data.Pin_Cue ?? null,
    data.Per_Cue ?? null,
    data.Tot_Per_Cue ?? 1,
    data.Per_Dis_Cue ?? 1,
    data.Fec_Com_Cue ?? null,
    data.Fec_Ven_Cue ?? null,
    data.Cos_Cue ?? null,
    data.Not_Cue ?? null,
    data.Est_Cue ?? 'disponible'
  ];

  const [result] = await pool.query(sql, values);
  return findById(result.insertId);
}

async function updateById(id, data) {
  const fields = Object.keys(data);
  if (fields.length === 0) return findById(id);

  const pool = getPool();
  const setClause = fields.map((field) => `${field} = ?`).join(', ');
  const values = fields.map((field) => data[field]);

  await pool.query(`UPDATE cuentas SET ${setClause} WHERE Id_Cue = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM cuentas WHERE Id_Cue = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  createOne,
  updateById,
  removeById
};
