const { getPool } = require('../../config/database');

function resolvePool(connection) {
  return connection || getPool();
}

const BASE_SELECT = `
  SELECT
    d.*,
    v.Id_Ven AS Num_Ven,
    v.Est_Ven,
    p.Nom_Prd,
    vr.Nom_Var,
    c.Nom_Cue,
    k.Des_Key
  FROM detalle_ventas d
  INNER JOIN ventas v ON v.Id_Ven = d.Id_Ven
  LEFT JOIN productos p ON p.Id_Prd = d.Id_Prd
  LEFT JOIN variantes_productos vr ON vr.Id_Var = d.Id_Var
  LEFT JOIN cuentas c ON c.Id_Cue = d.Id_Cue
  LEFT JOIN keys_productos k ON k.Id_Key = d.Id_Key
`;

async function findAll(connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY d.Id_Dve DESC`);
  return rows;
}

async function findById(id, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(`${BASE_SELECT} WHERE d.Id_Dve = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function findByClienteId(clienteId, connection) {
  const pool = resolvePool(connection);
  const sql = `
    SELECT d.*, v.Id_Cli, v.Est_Ven,
      p.Nom_Prd, vr.Nom_Var
    FROM detalle_ventas d
    INNER JOIN ventas v ON v.Id_Ven = d.Id_Ven
    LEFT JOIN productos p ON p.Id_Prd = d.Id_Prd
    LEFT JOIN variantes_productos vr ON vr.Id_Var = d.Id_Var
    WHERE v.Id_Cli = ?
    ORDER BY d.Fec_Fin_Dve DESC, d.Id_Dve DESC
  `;
  const [rows] = await pool.query(sql, [clienteId]);
  return rows;
}

async function createOne(data, connection) {
  const pool = resolvePool(connection);
  const sql = `
    INSERT INTO detalle_ventas (
      Id_Ven,
      Id_Prd,
      Id_Var,
      Id_Cue,
      Id_Key,
      Cor_Cue,
      Con_Cue,
      Can_Dve,
      Pre_Uni_Dve,
      Des_Uni_Dve,
      Fec_Ini_Dve,
      Fec_Fin_Dve,
      Not_Dve,
      Est_Dve
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Id_Ven,
    data.Id_Prd ?? null,
    data.Id_Var ?? null,
    data.Id_Cue ?? null,
    data.Id_Key ?? null,
    data.Cor_Cue ?? null,
    data.Con_Cue ?? null,
    data.Can_Dve ?? 1,
    data.Pre_Uni_Dve,
    data.Des_Uni_Dve ?? 0,
    data.Fec_Ini_Dve,
    data.Fec_Fin_Dve,
    data.Not_Dve ?? null,
    data.Est_Dve ?? 'activo'
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

  await pool.query(`UPDATE detalle_ventas SET ${setClause} WHERE Id_Dve = ?`, [...values, id]);
  return findById(id, connection);
}

async function removeById(id, connection) {
  const pool = resolvePool(connection);
  const [result] = await pool.query('DELETE FROM detalle_ventas WHERE Id_Dve = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByClienteId,
  createOne,
  updateById,
  removeById
};
