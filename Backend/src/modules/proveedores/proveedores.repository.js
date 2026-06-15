const { getPool } = require('../../config/database');

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM proveedores ORDER BY Id_Pro DESC');
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM proveedores WHERE Id_Pro = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO proveedores (
      Nom_Pro,
      Tip_Pro,
      Con_Pri_Pro,
      Tel_Pro,
      Wha_Pro,
      Ema_Pro,
      Tel_Gram_Pro,
      Web_Pro,
      Pai_Pro,
      Med_Con_Pro,
      Con_Com_Pro,
      Cal_Pro,
      Not_Pro,
      Est_Pro
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Nom_Pro,
    data.Tip_Pro ?? 'empresa',
    data.Con_Pri_Pro ?? null,
    data.Tel_Pro ?? null,
    data.Wha_Pro ?? null,
    data.Ema_Pro ?? null,
    data.Tel_Gram_Pro ?? null,
    data.Web_Pro ?? null,
    data.Pai_Pro ?? null,
    data.Med_Con_Pro ?? 'whatsapp',
    data.Con_Com_Pro ?? null,
    data.Cal_Pro ?? 5,
    data.Not_Pro ?? null,
    data.Est_Pro ?? 'activo'
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

  await pool.query(`UPDATE proveedores SET ${setClause} WHERE Id_Pro = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM proveedores WHERE Id_Pro = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  createOne,
  updateById,
  removeById
};
