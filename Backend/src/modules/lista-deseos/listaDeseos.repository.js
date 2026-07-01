const { getPool } = require('../../config/database');

const BASE_SELECT = `
  SELECT ld.*, c.Nom_Cli, c.Ape_Cli, p.Nom_Prd
  FROM lista_deseos ld
  INNER JOIN clientes c ON c.Id_Cli = ld.Id_Cli
  INNER JOIN productos p ON p.Id_Prd = ld.Id_Prd
`;

async function findAll() { const [rows] = await getPool().query(`${BASE_SELECT} ORDER BY ld.Id_Des DESC`); return rows; }
async function findById(id) { const [rows] = await getPool().query(`${BASE_SELECT} WHERE ld.Id_Des = ? LIMIT 1`, [id]); return rows[0] || null; }
async function createOne(data) { const [result] = await getPool().query('INSERT INTO lista_deseos (Id_Cli, Id_Prd) VALUES (?, ?)', [data.Id_Cli, data.Id_Prd]); return findById(result.insertId); }
async function updateById(id, data) {
  const fields = Object.keys(data);
  if (fields.length === 0) return findById(id);
  const setClause = fields.map((field) => `${field} = ?`).join(', ');
  const values = fields.map((field) => data[field]);
  await getPool().query(`UPDATE lista_deseos SET ${setClause} WHERE Id_Des = ?`, [...values, id]);
  return findById(id);
}
async function removeById(id) { const [result] = await getPool().query('DELETE FROM lista_deseos WHERE Id_Des = ?', [id]); return result.affectedRows > 0; }

module.exports = { findAll, findById, createOne, updateById, removeById };
