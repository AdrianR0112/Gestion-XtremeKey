const crypto = require('node:crypto');
const { generateId } = require('better-auth');

const { getPool } = require('../../config/database');

function resolvePool(connection) {
  return connection || getPool();
}

function hashEndpoint(endpoint) {
  return crypto.createHash('sha256').update(String(endpoint || '')).digest('hex');
}

async function upsertSuscripcion(payload, connection) {
  const pool = resolvePool(connection);
  const id = generateId();
  const endpointHash = hashEndpoint(payload.End_Psh);
  await pool.query(
    `
      INSERT INTO suscripciones_push (
        Id_Psh, Auth_Usu_Id, Id_Stf, End_Psh, End_Has_Psh,
        Cla_P256_Psh, Cla_Aut_Psh, Age_Usu_Psh, Eti_Psh, Act_Psh
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      ON DUPLICATE KEY UPDATE
        Auth_Usu_Id = VALUES(Auth_Usu_Id),
        Id_Stf = VALUES(Id_Stf),
        End_Psh = VALUES(End_Psh),
        Cla_P256_Psh = VALUES(Cla_P256_Psh),
        Cla_Aut_Psh = VALUES(Cla_Aut_Psh),
        Age_Usu_Psh = VALUES(Age_Usu_Psh),
        Eti_Psh = COALESCE(VALUES(Eti_Psh), Eti_Psh),
        Act_Psh = 1
    `,
    [
      id,
      payload.Auth_Usu_Id,
      payload.Id_Stf ?? null,
      payload.End_Psh,
      endpointHash,
      payload.Cla_P256_Psh,
      payload.Cla_Aut_Psh,
      payload.Age_Usu_Psh ?? null,
      payload.Eti_Psh ?? null
    ]
  );
  return findByEndpointHash(endpointHash, pool);
}

async function findByEndpointHash(hash, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query('SELECT * FROM suscripciones_push WHERE End_Has_Psh = ? LIMIT 1', [hash]);
  return rows[0] || null;
}

async function findById(id, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query('SELECT * FROM suscripciones_push WHERE Id_Psh = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function findActivasByAuthUser(authUserId, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(
    'SELECT * FROM suscripciones_push WHERE Auth_Usu_Id = ? AND Act_Psh = 1 ORDER BY Fec_Cre DESC',
    [authUserId]
  );
  return rows;
}

async function findTodasActivas(connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query('SELECT * FROM suscripciones_push WHERE Act_Psh = 1 ORDER BY Fec_Cre ASC');
  return rows;
}

async function removeByEndpointHash(hash, connection) {
  const pool = resolvePool(connection);
  const [result] = await pool.query('DELETE FROM suscripciones_push WHERE End_Has_Psh = ?', [hash]);
  return result.affectedRows > 0;
}

async function removeById(id, connection) {
  const pool = resolvePool(connection);
  const [result] = await pool.query('DELETE FROM suscripciones_push WHERE Id_Psh = ?', [id]);
  return result.affectedRows > 0;
}

async function touchUltimoEnvio(id, connection) {
  const pool = resolvePool(connection);
  await pool.query('UPDATE suscripciones_push SET Fec_Ult_Env_Psh = NOW() WHERE Id_Psh = ?', [id]);
}

async function reserveDailyNotice(payload, connection) {
  const pool = resolvePool(connection);
  try {
    const [result] = await pool.query(
      `INSERT INTO avisos_push_diarios
        (Fec_Objetivo, Id_Psh, Tot_Hoy_Avi, Tot_Pro_Avi, Est_Envio)
       VALUES (?, ?, ?, ?, 'pendiente')`,
      [payload.fechaObjetivo, payload.idPush, payload.totalHoy, payload.totalProximas]
    );
    return { reserved: true, id: result.insertId };
  } catch (error) {
    if (error?.code === 'ER_DUP_ENTRY') return { reserved: false, id: null };
    throw error;
  }
}

async function updateDailyNotice(id, status, errorMessage = null, connection) {
  const pool = resolvePool(connection);
  await pool.query(
    'UPDATE avisos_push_diarios SET Est_Envio = ?, Err_Envio = ? WHERE Id_Avi = ?',
    [status, errorMessage, id]
  );
}

function toWebPushSubscription(row) {
  return {
    endpoint: row.End_Psh,
    keys: { p256dh: row.Cla_P256_Psh, auth: row.Cla_Aut_Psh }
  };
}

module.exports = {
  hashEndpoint,
  upsertSuscripcion,
  findByEndpointHash,
  findById,
  findActivasByAuthUser,
  findTodasActivas,
  removeByEndpointHash,
  removeById,
  touchUltimoEnvio,
  reserveDailyNotice,
  updateDailyNotice,
  toWebPushSubscription
};
