const bcrypt = require('bcryptjs');
const { generateId } = require('better-auth');

const { getPool } = require('../config/database');

function mapAuthUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    emailVerified: Boolean(row.emailVerified),
    role: row.role,
    banned: Boolean(row.banned),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function findAuthUserById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM `user` WHERE id = ? LIMIT 1', [id]);
  return mapAuthUser(rows[0] || null);
}

async function findAuthUserByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM `user` WHERE email = ? LIMIT 1', [String(email).trim().toLowerCase()]);
  return mapAuthUser(rows[0] || null);
}

async function createAuthIdentity({ name, email, password, role = 'cliente', emailVerified = false }) {
  const pool = getPool();
  const now = new Date();
  const userId = generateId();
  const accountId = generateId();
  const passwordHash = await bcrypt.hash(password, 10);

  await pool.query(
    `
      INSERT INTO \`user\` (
        id,
        name,
        email,
        emailVerified,
        image,
        createdAt,
        updatedAt,
        role,
        banned,
        banReason,
        banExpires
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [userId, name, String(email).trim().toLowerCase(), emailVerified ? 1 : 0, null, now, now, role, 0, null, null]
  );

  await pool.query(
    `
      INSERT INTO account (
        id,
        accountId,
        providerId,
        userId,
        password,
        createdAt,
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [accountId, userId, 'credential', userId, passwordHash, now, now]
  );

  return findAuthUserById(userId);
}

async function updateAuthIdentity(userId, data = {}) {
  const pool = getPool();
  const updates = [];
  const values = [];

  if (data.name !== undefined) {
    updates.push('name = ?');
    values.push(data.name);
  }

  if (data.email !== undefined) {
    updates.push('email = ?');
    values.push(String(data.email).trim().toLowerCase());
  }

  if (data.role !== undefined) {
    updates.push('role = ?');
    values.push(data.role);
  }

  updates.push('updatedAt = ?');
  values.push(new Date());

  await pool.query(`UPDATE \`user\` SET ${updates.join(', ')} WHERE id = ?`, [...values, userId]);
  return findAuthUserById(userId);
}

async function updateAuthPassword(userId, password) {
  const pool = getPool();
  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query(
    'UPDATE account SET password = ?, updatedAt = ? WHERE userId = ? AND providerId = ?',
    [passwordHash, new Date(), userId, 'credential']
  );
}

async function deleteAuthIdentity(userId) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM `user` WHERE id = ?', [userId]);
  return result.affectedRows > 0;
}

module.exports = {
  findAuthUserById,
  findAuthUserByEmail,
  createAuthIdentity,
  updateAuthIdentity,
  updateAuthPassword,
  deleteAuthIdentity,
};
