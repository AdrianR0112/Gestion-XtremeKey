const { getPool } = require('../../config/database');

const BASE_SELECT = `
  SELECT
    d.*,
    p.Nom_Prd,
    v.Nom_Var
  FROM detalle_compras d
  INNER JOIN compras c ON c.Id_Com = d.Id_Com
  LEFT JOIN productos p ON p.Id_Prd = d.Id_Prd
  LEFT JOIN variantes_productos v ON v.Id_Var = d.Id_Var
`;

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY d.Id_Dco DESC`);
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} WHERE d.Id_Dco = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO detalle_compras (
      Id_Com,
      Id_Prd,
      Id_Var,
      Can_Dco,
      Pre_Uni_Dco,
      Sub_Tot_Dco,
      Not_Dco
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Id_Com,
    data.Id_Prd ?? null,
    data.Id_Var ?? null,
    data.Can_Dco ?? 1,
    data.Pre_Uni_Dco,
    data.Sub_Tot_Dco,
    data.Not_Dco ?? null
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

  await pool.query(`UPDATE detalle_compras SET ${setClause} WHERE Id_Dco = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM detalle_compras WHERE Id_Dco = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  createOne,
  updateById,
  removeById
};
