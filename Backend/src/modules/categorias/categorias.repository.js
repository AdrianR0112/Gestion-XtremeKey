const { getPool } = require('../../config/database');

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT * FROM categorias_productos ORDER BY Ord_Cat ASC, Id_Cat ASC'
  );
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT * FROM categorias_productos WHERE Id_Cat = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO categorias_productos (
      Nom_Cat,
      Des_Cat,
      Id_Cat_Pad,
      Ico_Cat,
      Ord_Cat,
      Est_Cat
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Nom_Cat,
    data.Des_Cat ?? null,
    data.Id_Cat_Pad ?? null,
    data.Ico_Cat ?? null,
    data.Ord_Cat ?? 0,
    data.Est_Cat ?? 'activo'
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

  await pool.query(`UPDATE categorias_productos SET ${setClause} WHERE Id_Cat = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM categorias_productos WHERE Id_Cat = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  createOne,
  updateById,
  removeById
};
