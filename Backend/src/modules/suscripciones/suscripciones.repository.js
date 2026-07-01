const { getPool } = require('../../config/database');

const BASE_SELECT = `
  SELECT
    s.*,
    c.Auth_Usu_Id,
    c.Nom_Cli,
    c.Ape_Cli,
    c.Ema_Cli,
    p.Nom_Prd,
    p.Tip_Prd,
    v.Nom_Var
  FROM suscripciones s
  INNER JOIN clientes c ON c.Id_Cli = s.Id_Cli
  INNER JOIN productos p ON p.Id_Prd = s.Id_Prd
  LEFT JOIN variantes_productos v ON v.Id_Var = s.Id_Var
`;

function resolvePool(connection) {
  return connection || getPool();
}

async function findAll(connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY s.Id_Sus DESC`);
  return rows;
}

async function findById(id, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(`${BASE_SELECT} WHERE s.Id_Sus = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function findByClienteId(idCli, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(
    `${BASE_SELECT} WHERE s.Id_Cli = ? ORDER BY s.Fec_Ini_Sus DESC, s.Id_Sus DESC`,
    [idCli]
  );
  return rows;
}

async function countLinkedDetalles(idSus, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM detalle_ventas
      WHERE Id_Sus = ?
    `,
    [idSus]
  );

  return Number(rows[0]?.total || 0);
}

async function createOne(data, connection) {
  const pool = resolvePool(connection);
  const sql = `
    INSERT INTO suscripciones (
      Id_Cli,
      Uuid_Cli,
      Id_Prd,
      Id_Var,
      Fec_Ini_Sus,
      Fec_Fin_Sus,
      Est_Sus,
      Ren_Auto,
      Not_Sus
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Id_Cli,
    data.Uuid_Cli ?? null,
    data.Id_Prd,
    data.Id_Var ?? null,
    data.Fec_Ini_Sus,
    data.Fec_Fin_Sus ?? null,
    data.Est_Sus ?? 'activa',
    data.Ren_Auto ?? 1,
    data.Not_Sus ?? null,
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

  await pool.query(`UPDATE suscripciones SET ${setClause} WHERE Id_Sus = ?`, [...values, id]);
  return findById(id, connection);
}

async function removeById(id, connection) {
  const pool = resolvePool(connection);
  const [result] = await pool.query('DELETE FROM suscripciones WHERE Id_Sus = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByClienteId,
  countLinkedDetalles,
  createOne,
  updateById,
  removeById,
};
