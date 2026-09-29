const { getPool } = require('../../config/database');

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM revendedores ORDER BY Id_Rev DESC');
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM revendedores WHERE Id_Rev = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function findByPhoneCandidates(candidates = []) {
  const pool = getPool();
  const values = [...new Set(candidates.map((value) => String(value || '').trim()).filter(Boolean))];
  if (values.length === 0) return [];

  const [exactRows] = await pool.query(
    'SELECT * FROM revendedores WHERE Tel_Rev IN (?) ORDER BY Id_Rev ASC LIMIT 5',
    [values]
  );
  if (exactRows.length > 0) return exactRows;

  const digits = [...new Set(values.map((value) => value.replace(/\D/g, '')).filter(Boolean))];
  const normalizedColumn = "REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(Tel_Rev, '+', ''), ' ', ''), '-', ''), '(', ''), ')', ''), '.', '')";
  const [normalizedRows] = await pool.query(
    `SELECT * FROM revendedores WHERE ${normalizedColumn} IN (?) ORDER BY Id_Rev ASC LIMIT 5`,
    [digits]
  );
  return normalizedRows;
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO revendedores (
      Tel_Rev,
      Nom_Rev,
      Ape_Rev,
      Ema_Rev,
      Doc_Rev,
      Not_Rev,
      Est_Rev
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Tel_Rev,
    data.Nom_Rev ?? null,
    data.Ape_Rev ?? null,
    data.Ema_Rev ?? null,
    data.Doc_Rev ?? null,
    data.Not_Rev ?? null,
    data.Est_Rev ?? 'activo'
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

  await pool.query(`UPDATE revendedores SET ${setClause} WHERE Id_Rev = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM revendedores WHERE Id_Rev = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByPhoneCandidates,
  createOne,
  updateById,
  removeById
};
