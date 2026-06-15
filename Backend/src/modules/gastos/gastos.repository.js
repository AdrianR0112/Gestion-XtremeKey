const { getPool } = require('../../config/database');

const BASE_SELECT = `
  SELECT
    g.*,
    p.Nom_Pro
  FROM gastos g
  LEFT JOIN proveedores p ON p.Id_Pro = g.Id_Pro
  LEFT JOIN compras c ON c.Id_Com = g.Id_Com
`;

function normalizeRow(row) {
  return row;
}

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY g.Id_Gas DESC`);
  return rows.map(normalizeRow);
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} WHERE g.Id_Gas = ? LIMIT 1`, [id]);
  return normalizeRow(rows[0] || null);
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO gastos (
      Nom_Gas,
      Des_Gas,
      Cat_Gas,
      Mon_Gas,
      Fec_Gas,
      Id_Pro,
      Id_Com,
      Com_Gas,
      Est_Gas
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Nom_Gas,
    data.Des_Gas ?? null,
    data.Cat_Gas ?? 'operativo',
    data.Mon_Gas,
    data.Fec_Gas,
    data.Id_Pro ?? null,
    data.Id_Com ?? null,
    data.Com_Gas ?? null,
    data.Est_Gas ?? 'registrado'
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

  await pool.query(`UPDATE gastos SET ${setClause} WHERE Id_Gas = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM gastos WHERE Id_Gas = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  createOne,
  updateById,
  removeById
};
