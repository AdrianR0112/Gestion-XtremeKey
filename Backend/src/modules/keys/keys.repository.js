const { getPool } = require('../../config/database');

const BASE_SELECT = `
  SELECT
    k.*,
    p.Nom_Prd,
    v.Nom_Var,
    pr.Nom_Pro
  FROM keys_productos k
  LEFT JOIN productos p ON p.Id_Prd = k.Id_Prd
  LEFT JOIN variantes_productos v ON v.Id_Var = k.Id_Var
  LEFT JOIN proveedores pr ON pr.Id_Pro = k.Id_Pro
`;

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY k.Id_Key DESC`);
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} WHERE k.Id_Key = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO keys_productos (
      Id_Prd,
      Id_Var,
      Id_Pro,
      Cla_Key,
      Des_Key,
      Fec_Com_Key,
      Fec_Ven_Key,
      Cos_Key,
      Pre_Ven_Key,
      Es_Per_Vid_Key,
      Est_Key,
      Not_Key
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Id_Prd,
    data.Id_Var ?? null,
    data.Id_Pro ?? null,
    data.Cla_Key,
    data.Des_Key ?? null,
    data.Fec_Com_Key ?? null,
    data.Fec_Ven_Key ?? null,
    data.Cos_Key ?? null,
    data.Pre_Ven_Key ?? null,
    data.Es_Per_Vid_Key ?? 0,
    data.Est_Key ?? 'disponible',
    data.Not_Key ?? null
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

  await pool.query(`UPDATE keys_productos SET ${setClause} WHERE Id_Key = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM keys_productos WHERE Id_Key = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  createOne,
  updateById,
  removeById
};
