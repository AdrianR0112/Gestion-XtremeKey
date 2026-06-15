const { getPool } = require('../../config/database');

const BASE_SELECT = `
  SELECT
    t.*,
    c.Nom_Cli,
    c.Ape_Cli,
    v.Id_Ven AS Num_Ven
  FROM tareas t
  LEFT JOIN clientes c ON c.Id_Cli = t.Id_Cli
  LEFT JOIN ventas v ON v.Id_Ven = t.Id_Ven
`;

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY t.Id_Tar DESC`);
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} WHERE t.Id_Tar = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO tareas (
      Tit_Tar,
      Des_Tar,
      Id_Cli,
      Id_Ven,
      Fec_Lim_Tar,
      Pri_Tar,
      Pro_Tar,
      Est_Tar,
      Fec_Com_Tar
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Tit_Tar,
    data.Des_Tar ?? null,
    data.Id_Cli ?? null,
    data.Id_Ven ?? null,
    data.Fec_Lim_Tar ?? null,
    data.Pri_Tar ?? 'media',
    data.Pro_Tar ?? 0,
    data.Est_Tar ?? 'pendiente',
    data.Fec_Com_Tar ?? null
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

  await pool.query(`UPDATE tareas SET ${setClause} WHERE Id_Tar = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM tareas WHERE Id_Tar = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  createOne,
  updateById,
  removeById
};
