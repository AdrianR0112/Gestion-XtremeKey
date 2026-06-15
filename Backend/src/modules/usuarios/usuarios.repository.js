const { getPool } = require('../../config/database');
const { publicUserColumns } = require('./usuarios.schemas');

const PUBLIC_COLUMNS = publicUserColumns.join(', ');

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query(`SELECT ${PUBLIC_COLUMNS} FROM usuarios ORDER BY Id_Usu DESC`);
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`SELECT ${PUBLIC_COLUMNS} FROM usuarios WHERE Id_Usu = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function findByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE Ema_Usu = ? LIMIT 1', [email]);
  return rows[0] || null;
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO usuarios (
      Nom_Usu,
      Ape_Usu,
      Ema_Usu,
      Pas_Usu,
      Tel_Usu,
      Rol_Usu,
      Est_Usu
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Nom_Usu,
    data.Ape_Usu,
    data.Ema_Usu,
    data.Pas_Usu,
    data.Tel_Usu ?? null,
    data.Rol_Usu ?? 'vendedor',
    data.Est_Usu ?? 'activo'
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

  await pool.query(`UPDATE usuarios SET ${setClause} WHERE Id_Usu = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM usuarios WHERE Id_Usu = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  createOne,
  updateById,
  removeById
};
