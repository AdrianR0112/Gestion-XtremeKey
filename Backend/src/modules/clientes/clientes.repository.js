const { getPool } = require('../../config/database');

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM clientes ORDER BY Id_Cli DESC');
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM clientes WHERE Id_Cli = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function findByUuid(uuid) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM clientes WHERE Uuid_Cli = ? LIMIT 1', [String(uuid ?? '').trim()]);
  return rows[0] || null;
}

async function findByEmail(email) {
  const pool = getPool();
  const normalized = String(email ?? '').trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  // Comparacion case-insensitive: los correos historicos pueden tener mayusculas.
  const [rows] = await pool.query(
    'SELECT * FROM clientes WHERE LOWER(TRIM(Ema_Cli)) = ? ORDER BY Id_Cli ASC LIMIT 1',
    [normalized]
  );
  return rows[0] || null;
}

async function findByAuthUserId(authUserId) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM clientes WHERE Auth_User_Id = ? LIMIT 1', [authUserId]);
  return rows[0] || null;
}

async function findByPhone(phone) {
  const pool = getPool();
  const normalized = String(phone ?? '').trim();
  if (!normalized) {
    return null;
  }
  const [rows] = await pool.query('SELECT * FROM clientes WHERE Tel_Cli = ? ORDER BY Id_Cli ASC LIMIT 1', [normalized]);
  return rows[0] || null;
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO clientes (
      Nom_Cli,
      Ape_Cli,
      Tel_Cli,
      Ema_Cli,
      Auth_User_Id,
      Usu_Tel_Cli,
      Pai_Cli,
      Doc_Cli,
      Origen_Cli,
      Dir_Cli,
      Tip_Cli,
      Cat_Cli,
      Pre_Con_Cli,
      Ace_Not_Tel_Cli,
      Ace_Not_Cor_Cli,
      Not_Cli,
      Est_Cli,
      Password_Hash,
      Email_Verificado,
      Token_Verificacion,
      Fec_Ultimo_Acceso
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Nom_Cli,
    data.Ape_Cli,
    data.Tel_Cli,
    data.Ema_Cli ?? null,
    data.Auth_User_Id ?? null,
    data.Usu_Tel_Cli ?? null,
    data.Pai_Cli ?? 'Ecuador',
    data.Doc_Cli ?? null,
    data.Origen_Cli ?? 'whatsapp',
    data.Dir_Cli ?? null,
    data.Tip_Cli ?? 'persona',
    data.Cat_Cli ?? 'nuevo',
    data.Pre_Con_Cli ?? 'whatsapp',
    data.Ace_Not_Tel_Cli ?? 0,
    data.Ace_Not_Cor_Cli ?? 0,
    data.Not_Cli ?? null,
    data.Est_Cli ?? 'activo',
    data.Password_Hash ?? null,
    data.Email_Verificado ?? 0,
    data.Token_Verificacion ?? null,
    data.Fec_Ultimo_Acceso ?? null
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

  await pool.query(`UPDATE clientes SET ${setClause} WHERE Id_Cli = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM clientes WHERE Id_Cli = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByUuid,
  findByEmail,
  findByPhone,
  findByAuthUserId,
  createOne,
  updateById,
  removeById
};
