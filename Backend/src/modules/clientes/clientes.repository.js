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

<<<<<<< Updated upstream
=======
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

async function findByPhone(phone) {
  const pool = getPool();
  const normalized = String(phone ?? '').trim();
  if (!normalized) {
    return null;
  }
  const [rows] = await pool.query('SELECT * FROM clientes WHERE Tel_Cli = ? ORDER BY Id_Cli ASC LIMIT 1', [normalized]);
  return rows[0] || null;
}

async function findByPhoneCandidates(candidates = []) {
  const pool = getPool();
  const values = [...new Set(candidates.map((value) => String(value || '').trim()).filter(Boolean))];
  if (values.length === 0) return [];

  const [exactRows] = await pool.query(
    'SELECT * FROM clientes WHERE Tel_Cli IN (?) ORDER BY Id_Cli ASC LIMIT 5',
    [values]
  );
  if (exactRows.length > 0) return exactRows;

  const digits = [...new Set(values.map((value) => value.replace(/\D/g, '')).filter(Boolean))];
  const normalizedColumn = "REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(Tel_Cli, '+', ''), ' ', ''), '-', ''), '(', ''), ')', ''), '.', '')";
  const [normalizedRows] = await pool.query(
    `SELECT * FROM clientes WHERE ${normalizedColumn} IN (?) ORDER BY Id_Cli ASC LIMIT 5`,
    [digits]
  );
  return normalizedRows;
}

>>>>>>> Stashed changes
async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO clientes (
      Nom_Cli,
      Ape_Cli,
      Tel_Cli,
      Ema_Cli,
      Pai_Cli,
      Doc_Cli,
      Cat_Cli,
      Pre_Con_Cli,
      Ace_Not_What_Cli,
      Ace_Not_Cor_Cli,
      Not_Cli,
      Est_Cli
<<<<<<< Updated upstream
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
=======
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
>>>>>>> Stashed changes
  `;

  const values = [
    data.Nom_Cli,
    data.Ape_Cli,
    data.Tel_Cli,
    data.Ema_Cli ?? null,
    data.Pai_Cli ?? 'Ecuador',
    data.Doc_Cli ?? null,
    data.Cat_Cli ?? 'nuevo',
    data.Pre_Con_Cli ?? 'whatsapp',
    data.Ace_Not_What_Cli ?? 1,
    data.Ace_Not_Cor_Cli ?? 1,
    data.Not_Cli ?? null,
    data.Est_Cli ?? 'activo'
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
<<<<<<< Updated upstream
=======
  findByEmail,
  findByPhone,
  findByPhoneCandidates,
>>>>>>> Stashed changes
  createOne,
  updateById,
  removeById
};
