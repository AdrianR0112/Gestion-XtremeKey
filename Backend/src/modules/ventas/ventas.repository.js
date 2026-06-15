const { getPool } = require('../../config/database');

const BASE_SELECT = `
  SELECT
    v.*,
    c.Nom_Cli,
    c.Ape_Cli,
    r.Nom_Rev,
    r.Ape_Rev,
    r.Tel_Rev
  FROM ventas v
  LEFT JOIN clientes c ON c.Id_Cli = v.Id_Cli
  LEFT JOIN revendedores r ON r.Id_Rev = v.Id_Rev
`;

function resolvePool(connection) {
  return connection || getPool();
}

async function findAll(connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY v.Id_Ven DESC`);
  return rows;
}

async function findById(id, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(`${BASE_SELECT} WHERE v.Id_Ven = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function createOne(data, connection) {
  const pool = resolvePool(connection);
  const sql = `
    INSERT INTO ventas (
      Id_Cli,
      Id_Rev,
      Fec_Ven,
      Des_Tot_Ven,
      Imp_Tot_Ven,
      Tot_Ven,
      Met_Pag_Ven,
      Not_Ven,
      Est_Ven
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Id_Cli ?? null,
    data.Id_Rev ?? null,
    data.Fec_Ven ?? null,
    data.Des_Tot_Ven ?? 0,
    data.Imp_Tot_Ven ?? 0,
    data.Tot_Ven,
    data.Met_Pag_Ven ?? null,
    data.Not_Ven ?? null,
    data.Est_Ven ?? 'pendiente'
  ];

  const [result] = await pool.query(sql, values);
  return findById(result.insertId, connection);
}

async function updateById(id, data, connection) {
  const fields = Object.keys(data);
  if (fields.length === 0) return findById(id, connection);

  const pool = resolvePool(connection);
  const setClause = fields.map((field) => `${field} = ?`).join(', ');
  const values = fields.map((field) => data[field]);

  await pool.query(`UPDATE ventas SET ${setClause} WHERE Id_Ven = ?`, [...values, id]);
  return findById(id, connection);
}

async function removeById(id, connection) {
  const pool = resolvePool(connection);
  const [result] = await pool.query('DELETE FROM ventas WHERE Id_Ven = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  createOne,
  updateById,
  removeById
};
