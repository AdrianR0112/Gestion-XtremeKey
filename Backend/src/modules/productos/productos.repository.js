const { getPool } = require('../../config/database');

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM productos ORDER BY Id_Prd DESC');
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM productos WHERE Id_Prd = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function findByCode(code) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM productos WHERE Cod_Prd = ? LIMIT 1', [code]);
  return rows[0] || null;
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO productos (
      Cod_Prd,
      Nom_Prd,
      Des_Prd,
      Des_Cor_Prd,
      Id_Cat,
      Tip_Prd,
      Ima_Prd,
      Est_Prd
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Cod_Prd ?? null,
    data.Nom_Prd,
    data.Des_Prd ?? null,
    data.Des_Cor_Prd ?? null,
    data.Id_Cat ?? null,
    data.Tip_Prd ?? 'producto',
    data.Ima_Prd ?? null,
    data.Est_Prd ?? 'activo'
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

  await pool.query(`UPDATE productos SET ${setClause} WHERE Id_Prd = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM productos WHERE Id_Prd = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByCode,
  createOne,
  updateById,
  removeById
};
