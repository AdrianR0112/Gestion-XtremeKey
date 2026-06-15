const { getPool } = require('../../config/database');

function normalizeRow(row) {
  if (!row) return row;

  let parsedVar = row.Var_Pla;
  if (typeof row.Var_Pla === 'string') {
    try {
      parsedVar = JSON.parse(row.Var_Pla);
    } catch (_error) {
      parsedVar = row.Var_Pla;
    }
  }

  return {
    ...row,
    Var_Pla: parsedVar
  };
}

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM plantillas_notificacion ORDER BY Id_Pla DESC');
  return rows.map(normalizeRow);
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM plantillas_notificacion WHERE Id_Pla = ? LIMIT 1', [id]);
  return normalizeRow(rows[0] || null);
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO plantillas_notificacion (
      Nom_Pla,
      Tip_Pla,
      Can_Pla,
      Asu_Pla,
      Cue_Pla,
      Var_Pla,
      Est_Pla
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Nom_Pla,
    data.Tip_Pla ?? 'personalizado',
    data.Can_Pla ?? 'whatsapp',
    data.Asu_Pla ?? null,
    data.Cue_Pla,
    data.Var_Pla !== undefined && data.Var_Pla !== null ? JSON.stringify(data.Var_Pla) : null,
    data.Est_Pla ?? 'activo'
  ];

  const [result] = await pool.query(sql, values);
  return findById(result.insertId);
}

async function updateById(id, data) {
  const fields = Object.keys(data);
  if (fields.length === 0) return findById(id);

  const pool = getPool();
  const updateData = { ...data };
  if (Object.prototype.hasOwnProperty.call(updateData, 'Var_Pla')) {
    updateData.Var_Pla = updateData.Var_Pla !== null ? JSON.stringify(updateData.Var_Pla) : null;
  }

  const setClause = fields.map((field) => `${field} = ?`).join(', ');
  const values = fields.map((field) => updateData[field]);

  await pool.query(`UPDATE plantillas_notificacion SET ${setClause} WHERE Id_Pla = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM plantillas_notificacion WHERE Id_Pla = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  createOne,
  updateById,
  removeById
};
