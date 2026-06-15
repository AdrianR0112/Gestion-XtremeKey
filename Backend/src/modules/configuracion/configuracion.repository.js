const { getPool } = require('../../config/database');

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM configuracion ORDER BY Id_Con DESC');
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM configuracion WHERE Id_Con = ?', [id]);
  return rows[0] || null;
}

async function findCurrent() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM configuracion ORDER BY Id_Con ASC LIMIT 1');
  return rows[0] || null;
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO configuracion (
      Nom_Emp_Con,
      Dir_Con,
      Tel_Con,
      Ema_Con,
      Log_Con,
      Mon_Con,
      Zon_Hor_Con,
      Imp_Con,
      Hab_Imp_Con
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Nom_Emp_Con,
    data.Dir_Con ?? null,
    data.Tel_Con ?? null,
    data.Ema_Con ?? null,
    data.Log_Con ?? null,
    data.Mon_Con ?? 'USD',
    data.Zon_Hor_Con ?? 'America/Guayaquil',
    data.Imp_Con ?? 0,
    data.Hab_Imp_Con ?? true
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

  await pool.query(`UPDATE configuracion SET ${setClause} WHERE Id_Con = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM configuracion WHERE Id_Con = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findCurrent,
  createOne,
  updateById,
  removeById
};
