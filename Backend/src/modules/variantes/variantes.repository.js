const { getPool } = require('../../config/database');

function mapRow(row) {
  if (!row) return null;

  let parsedAtr = row.Atr_Var;
  if (typeof row.Atr_Var === 'string') {
    try {
      parsedAtr = JSON.parse(row.Atr_Var);
    } catch (_error) {
      parsedAtr = row.Atr_Var;
    }
  }

  return {
    ...row,
    Not_Ven_Cor_Var: Boolean(row.Not_Ven_Cor_Var),
    Not_Ven_Wsp_Var: Boolean(row.Not_Ven_Wsp_Var),
    Atr_Var: parsedAtr
  };
}

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM variantes_productos ORDER BY Id_Var DESC');
  return rows.map(mapRow);
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM variantes_productos WHERE Id_Var = ? LIMIT 1', [id]);
  return mapRow(rows[0] || null);
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO variantes_productos (
      Id_Prd,
      Nom_Var,
      Des_Var,
      Pre_Cos_Var,
      Pre_Ven_Var,
      Pre_Rev_Var,
      Dur_Tip_Var,
      Dur_Val_Var,
      Max_Usu_Var,
      Not_Ven_Cor_Var,
      Not_Ven_Wsp_Var,
      Atr_Var,
      Est_Var
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Id_Prd,
    data.Nom_Var,
    data.Des_Var ?? null,
    data.Pre_Cos_Var,
    data.Pre_Ven_Var,
    data.Pre_Rev_Var ?? null,
    data.Dur_Tip_Var ?? null,
    data.Dur_Val_Var ?? null,
    data.Max_Usu_Var ?? null,
    data.Not_Ven_Cor_Var ?? true,
    data.Not_Ven_Wsp_Var ?? true,
    data.Atr_Var !== undefined && data.Atr_Var !== null ? JSON.stringify(data.Atr_Var) : null,
    data.Est_Var ?? 'activo'
  ];

  const [result] = await pool.query(sql, values);
  return findById(result.insertId);
}

async function updateById(id, data) {
  const fields = Object.keys(data);
  if (fields.length === 0) return findById(id);

  const payload = { ...data };
  if (payload.Atr_Var !== undefined) {
    payload.Atr_Var = payload.Atr_Var === null ? null : JSON.stringify(payload.Atr_Var);
  }

  const updateFields = Object.keys(payload);
  const pool = getPool();
  const setClause = updateFields.map((field) => `${field} = ?`).join(', ');
  const values = updateFields.map((field) => payload[field]);

  await pool.query(`UPDATE variantes_productos SET ${setClause} WHERE Id_Var = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM variantes_productos WHERE Id_Var = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  createOne,
  updateById,
  removeById
};
