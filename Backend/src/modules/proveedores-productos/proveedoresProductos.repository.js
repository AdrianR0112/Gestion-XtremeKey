const { getPool } = require('../../config/database');

const BASE_SELECT = `
  SELECT
    pp.*, 
    p.Nom_Pro,
    pr.Nom_Prd,
    vr.Nom_Var
  FROM proveedores_productos pp
  INNER JOIN proveedores p ON p.Id_Pro = pp.Id_Pro
  LEFT JOIN productos pr ON pr.Id_Prd = pp.Id_Prd
  LEFT JOIN variantes_productos vr ON vr.Id_Var = pp.Id_Var
`;

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY pp.Id_Pro_Prd DESC`);
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} WHERE pp.Id_Pro_Prd = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function findByRelation(idPro, idPrd, idVar) {
  const pool = getPool();
  const conditions = ['Id_Pro = ?'];
  const values = [idPro];

  if (idPrd !== undefined && idPrd !== null) {
    conditions.push('Id_Prd = ?');
    values.push(idPrd);
  }

  if (idVar !== undefined && idVar !== null) {
    conditions.push('Id_Var = ?');
    values.push(idVar);
  }

  const [rows] = await pool.query(
    `SELECT * FROM proveedores_productos WHERE ${conditions.join(' AND ')} LIMIT 1`,
    values
  );
  return rows[0] || null;
}

async function clearPrimaryForRelation({ idPrd, idVar }) {
  const pool = getPool();
  if (idPrd !== undefined && idPrd !== null) {
    await pool.query('UPDATE proveedores_productos SET Es_Pri_Pro_Prd = 0 WHERE Id_Prd = ?', [idPrd]);
  }

  if (idVar !== undefined && idVar !== null) {
    await pool.query('UPDATE proveedores_productos SET Es_Pri_Pro_Prd = 0 WHERE Id_Var = ?', [idVar]);
  }
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO proveedores_productos (
      Id_Pro,
      Id_Prd,
      Id_Var,
      Pre_Com_Pro_Prd,
      Es_Pri_Pro_Prd,
      Not_Pro_Prd
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Id_Pro,
    data.Id_Prd,
    data.Id_Var ?? null,
    data.Pre_Com_Pro_Prd ?? null,
    data.Es_Pri_Pro_Prd ?? 0,
    data.Not_Pro_Prd ?? null
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

  await pool.query(`UPDATE proveedores_productos SET ${setClause} WHERE Id_Pro_Prd = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM proveedores_productos WHERE Id_Pro_Prd = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByRelation,
  clearPrimaryForRelation,
  createOne,
  updateById,
  removeById
};
