const { getPool } = require('../../config/database');

const SESSION_SELECT = `
  SELECT
    cs.*,
    c.Nom_Cli,
    c.Ape_Cli,
    c.Ema_Cli
  FROM carrito_sesiones cs
  LEFT JOIN clientes c ON c.Id_Cli = cs.Id_Cli
`;

const ITEM_SELECT = `
  SELECT
    ci.*,
    p.Nom_Prd,
    v.Nom_Var
  FROM carrito_items ci
  INNER JOIN carrito_sesiones cs ON cs.Id_Car_Ses = ci.Id_Car_Ses
  INNER JOIN productos p ON p.Id_Prd = ci.Id_Prd
  LEFT JOIN variantes_productos v ON v.Id_Var = ci.Id_Var
`;

async function findAllSessions() {
  const pool = getPool();
  const [rows] = await pool.query(`${SESSION_SELECT} ORDER BY cs.Fec_Cre DESC`);
  return rows;
}

async function findSessionById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`${SESSION_SELECT} WHERE cs.Id_Car_Ses = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function createSession(data) {
  const pool = getPool();
  await pool.query(
    `
      INSERT INTO carrito_sesiones (Id_Car_Ses, Id_Cli, Id_Sesion_Tmp, Expira_En)
      VALUES (?, ?, ?, ?)
    `,
    [data.Id_Car_Ses, data.Id_Cli ?? null, data.Id_Sesion_Tmp ?? null, data.Expira_En ?? null]
  );
  return findSessionById(data.Id_Car_Ses);
}

async function updateSessionById(id, data) {
  const fields = Object.keys(data).filter((field) => field !== 'Id_Car_Ses');
  if (fields.length === 0) return findSessionById(id);

  const pool = getPool();
  const setClause = fields.map((field) => `${field} = ?`).join(', ');
  const values = fields.map((field) => data[field]);

  await pool.query(`UPDATE carrito_sesiones SET ${setClause} WHERE Id_Car_Ses = ?`, [...values, id]);
  return findSessionById(id);
}

async function removeSessionById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM carrito_sesiones WHERE Id_Car_Ses = ?', [id]);
  return result.affectedRows > 0;
}

async function findItemsBySessionId(sessionId) {
  const pool = getPool();
  const [rows] = await pool.query(`${ITEM_SELECT} WHERE ci.Id_Car_Ses = ? ORDER BY ci.Id_Car_Item DESC`, [sessionId]);
  return rows;
}

async function findItemById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`${ITEM_SELECT} WHERE ci.Id_Car_Item = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function createItem(sessionId, data) {
  const pool = getPool();
  const [result] = await pool.query(
    `
      INSERT INTO carrito_items (Id_Car_Ses, Id_Prd, Id_Var, Cantidad)
      VALUES (?, ?, ?, ?)
    `,
    [sessionId, data.Id_Prd, data.Id_Var ?? null, data.Cantidad ?? 1]
  );
  return findItemById(result.insertId);
}

async function updateItemById(id, data) {
  const fields = Object.keys(data);
  if (fields.length === 0) return findItemById(id);

  const pool = getPool();
  const setClause = fields.map((field) => `${field} = ?`).join(', ');
  const values = fields.map((field) => data[field]);

  await pool.query(`UPDATE carrito_items SET ${setClause} WHERE Id_Car_Item = ?`, [...values, id]);
  return findItemById(id);
}

async function removeItemById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM carrito_items WHERE Id_Car_Item = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAllSessions,
  findSessionById,
  createSession,
  updateSessionById,
  removeSessionById,
  findItemsBySessionId,
  findItemById,
  createItem,
  updateItemById,
  removeItemById,
};
