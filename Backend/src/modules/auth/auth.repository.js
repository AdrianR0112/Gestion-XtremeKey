const { getPool } = require('../../config/database');
const { publicUserColumns } = require('./auth.schemas');

const PUBLIC_COLUMNS = publicUserColumns.join(', ');

async function findByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE Ema_Usu = ? LIMIT 1', [email]);
  return rows[0] || null;
}

async function findPublicById(userId) {
  const pool = getPool();
  const [rows] = await pool.query(`SELECT ${PUBLIC_COLUMNS} FROM usuarios WHERE Id_Usu = ? LIMIT 1`, [userId]);
  return rows[0] || null;
}

async function createUser(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO usuarios (
      Nom_Usu,
      Ape_Usu,
      Ema_Usu,
      Pas_Usu,
      Tel_Usu,
      Rol_Usu
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Nom_Usu,
    data.Ape_Usu,
    data.Ema_Usu,
    data.Pas_Usu,
    data.Tel_Usu ?? null,
    data.Rol_Usu ?? 'vendedor'
  ];

  const [result] = await pool.query(sql, values);
  return findPublicById(result.insertId);
}

async function updateLastAccess(userId) {
  const pool = getPool();
  await pool.query('UPDATE usuarios SET Ult_Acc_Usu = NOW() WHERE Id_Usu = ?', [userId]);
}

async function updatePassword(userId, passwordHash) {
  const pool = getPool();
  await pool.query('UPDATE usuarios SET Pas_Usu = ? WHERE Id_Usu = ?', [passwordHash, userId]);
}

module.exports = {
  findByEmail,
  findPublicById,
  createUser,
  updateLastAccess,
  updatePassword
};
