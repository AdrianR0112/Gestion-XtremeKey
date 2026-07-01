const { getPool } = require('../../config/database');

const BASE_SELECT = `
  SELECT r.*, c.Nom_Cli, c.Ape_Cli, p.Nom_Prd, o.Numero_Ord
  FROM resenias r
  INNER JOIN clientes c ON c.Id_Cli = r.Id_Cli
  INNER JOIN productos p ON p.Id_Prd = r.Id_Prd
  INNER JOIN ordenes o ON o.Id_Ord = r.Id_Ord
`;

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY r.Id_Res DESC`);
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} WHERE r.Id_Res = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function createOne(data) {
  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO resenias (Id_Cli, Id_Prd, Id_Ord, Id_Item_Ord, Calificacion, Titulo_Res, Comentario_Res, Estado_Res, Votos_Utiles, Es_Compra_Verificada) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.Id_Cli, data.Id_Prd, data.Id_Ord, data.Id_Item_Ord, data.Calificacion, data.Titulo_Res, data.Comentario_Res, data.Estado_Res ?? 'aprobada', data.Votos_Utiles ?? 0, data.Es_Compra_Verificada ?? 1]
  );
  return findById(result.insertId);
}

async function updateById(id, data) {
  const fields = Object.keys(data);
  if (fields.length === 0) return findById(id);
  const pool = getPool();
  const setClause = fields.map((field) => `${field} = ?`).join(', ');
  const values = fields.map((field) => data[field]);
  await pool.query(`UPDATE resenias SET ${setClause} WHERE Id_Res = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM resenias WHERE Id_Res = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, createOne, updateById, removeById };
