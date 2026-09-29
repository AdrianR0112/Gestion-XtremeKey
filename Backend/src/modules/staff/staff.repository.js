const { getPool } = require('../../config/database');
const { publicStaffColumns } = require('./staff.schemas');

const PUBLIC_COLUMNS = publicStaffColumns.join(', ');
const STAFF_SELECT = `
  SELECT
    s.Id_Stf AS Id_Staff,
    s.Nom_Stf AS Nom_Staff,
    s.Ape_Stf AS Ape_Staff,
    u.email AS Ema_Staff,
    s.Tel_Stf AS Tel_Staff,
    'admin' AS Rol_Staff,
    CASE WHEN s.Act_Stf = 1 THEN 'activo' ELSE 'inactivo' END AS Est_Staff,
    s.Auth_Usu_Id AS Auth_User_Id,
    s.Fec_Cre,
    s.Fec_Mod,
    NULL AS Ult_Acc_Staff
  FROM staff s
  LEFT JOIN \`user\` u ON u.id = s.Auth_Usu_Id
`;

async function countAll() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM staff');
  return Number(rows[0]?.total || 0);
}

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query(`${STAFF_SELECT} ORDER BY s.Fec_Cre DESC`);
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`${STAFF_SELECT} WHERE s.Id_Stf = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function findByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query(`${STAFF_SELECT} WHERE u.email = ? LIMIT 1`, [String(email).trim().toLowerCase()]);
  return rows[0] || null;
}

async function findByAuthUserId(authUserId) {
  const pool = getPool();
  const [rows] = await pool.query(`${STAFF_SELECT} WHERE s.Auth_Usu_Id = ? LIMIT 1`, [authUserId]);
  return rows[0] || null;
}

async function createOne(data) {
  const pool = getPool();
  const [result] = await pool.query(
    `
      INSERT INTO staff (
        Id_Stf,
        Auth_Usu_Id,
        Nom_Stf,
        Ape_Stf,
        Car_Stf,
        Tel_Stf,
        Act_Stf
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.Auth_User_Id,
      data.Auth_User_Id,
      data.Nom_Staff,
      data.Ape_Staff,
      'Admin',
      data.Tel_Staff ?? null,
      data.Est_Staff === 'inactivo' || data.Est_Staff === 'bloqueado' ? 0 : 1,
    ]
  );

  return findByAuthUserId(data.Auth_User_Id);
}

async function updateById(id, data) {
  const updates = {};

  if (data.Nom_Staff !== undefined) {
    updates.Nom_Stf = data.Nom_Staff;
  }

  if (data.Ape_Staff !== undefined) {
    updates.Ape_Stf = data.Ape_Staff;
  }

  if (data.Tel_Staff !== undefined) {
    updates.Tel_Stf = data.Tel_Staff;
  }

  if (data.Est_Staff !== undefined) {
    updates.Act_Stf = data.Est_Staff === 'inactivo' || data.Est_Staff === 'bloqueado' ? 0 : 1;
  }

  const fields = Object.keys(updates);
  if (fields.length === 0) {
    return findById(id);
  }

  const pool = getPool();
  const setClause = fields.map((field) => `${field} = ?`).join(', ');
  const values = fields.map((field) => updates[field]);

  await pool.query(`UPDATE staff SET ${setClause} WHERE Id_Stf = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM staff WHERE Id_Stf = ?', [id]);
  return result.affectedRows > 0;
}

async function updateLastAccessByAuthUserId(authUserId) {
  return authUserId;
}

module.exports = {
  countAll,
  findAll,
  findById,
  findByEmail,
  findByAuthUserId,
  createOne,
  updateById,
  removeById,
  updateLastAccessByAuthUserId,
};
