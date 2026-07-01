const { getPool } = require('../../config/database');

const BASE_SELECT = `
  SELECT ip.*, p.Nom_Prd
  FROM imagenes_productos ip
  INNER JOIN productos p ON p.Id_Prd = ip.Id_Prd
`;

async function findAll() { const [rows] = await getPool().query(`${BASE_SELECT} ORDER BY ip.Id_Ima DESC`); return rows; }
async function findById(id) { const [rows] = await getPool().query(`${BASE_SELECT} WHERE ip.Id_Ima = ? LIMIT 1`, [id]); return rows[0] || null; }
async function createOne(data) { const [result] = await getPool().query('INSERT INTO imagenes_productos (Id_Prd, Url_Ima, Texto_Alt, Orden, Es_Primaria) VALUES (?, ?, ?, ?, ?)', [data.Id_Prd, data.Url_Ima, data.Texto_Alt ?? null, data.Orden ?? 0, data.Es_Primaria ?? 0]); return findById(result.insertId); }
async function updateById(id, data) { const fields = Object.keys(data); if (fields.length === 0) return findById(id); const setClause = fields.map((field) => `${field} = ?`).join(', '); const values = fields.map((field) => data[field]); await getPool().query(`UPDATE imagenes_productos SET ${setClause} WHERE Id_Ima = ?`, [...values, id]); return findById(id); }
async function removeById(id) { const [result] = await getPool().query('DELETE FROM imagenes_productos WHERE Id_Ima = ?', [id]); return result.affectedRows > 0; }

module.exports = { findAll, findById, createOne, updateById, removeById };
