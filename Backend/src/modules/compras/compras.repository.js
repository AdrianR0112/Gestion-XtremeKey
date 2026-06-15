const { getPool } = require('../../config/database');

const BASE_SELECT = `
  SELECT
    c.*,
    p.Nom_Pro
  FROM compras c
  INNER JOIN proveedores p ON p.Id_Pro = c.Id_Pro
`;

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY c.Id_Com DESC`);
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} WHERE c.Id_Com = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO compras (
      Id_Pro,
      Fec_Com,
      Sub_Tot_Com,
      Imp_Tot_Com,
      Tot_Com,
      Met_Pag_Com,
      Not_Com,
      Est_Com
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Id_Pro,
    data.Fec_Com ?? null,
    data.Sub_Tot_Com,
    data.Imp_Tot_Com ?? 0,
    data.Tot_Com,
    data.Met_Pag_Com ?? null,
    data.Not_Com ?? null,
    data.Est_Com ?? 'pendiente'
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

  await pool.query(`UPDATE compras SET ${setClause} WHERE Id_Com = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM compras WHERE Id_Com = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  createOne,
  updateById,
  removeById
};
