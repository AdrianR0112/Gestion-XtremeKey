const { getPool } = require('../../config/database');
const { parseJsonField } = require('../../utils/entityHelpers');

const BASE_SELECT = `
  SELECT
    p.*,
    o.Numero_Ord
  FROM pagos p
  INNER JOIN ordenes o ON o.Id_Ord = p.Id_Ord
`;

function mapRow(row) {
  if (!row) return null;
  return { ...row, Metadatos: parseJsonField(row.Metadatos) };
}

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY p.Id_Pag DESC`);
  return rows.map(mapRow);
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`${BASE_SELECT} WHERE p.Id_Pag = ? LIMIT 1`, [id]);
  return mapRow(rows[0] || null);
}

async function createOne(data) {
  const pool = getPool();
  const [result] = await pool.query(
    `
      INSERT INTO pagos (
        Id_Ord, Metodo_Pago, Proveedor_Pago, Monto, Moneda,
        Estado_Pago_Prov, Id_Transaccion, Stripe_PaymentIntent_Id, Metadatos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.Id_Ord,
      data.Metodo_Pago,
      data.Proveedor_Pago ?? 'stripe',
      data.Monto,
      data.Moneda ?? 'USD',
      data.Estado_Pago_Prov ?? 'pendiente',
      data.Id_Transaccion ?? null,
      data.Stripe_PaymentIntent_Id ?? null,
      data.Metadatos !== undefined && data.Metadatos !== null ? JSON.stringify(data.Metadatos) : null,
    ]
  );
  return findById(result.insertId);
}

async function updateById(id, data) {
  const fields = Object.keys(data);
  if (fields.length === 0) return findById(id);

  const payload = { ...data };
  if (payload.Metadatos !== undefined) {
    payload.Metadatos = payload.Metadatos === null ? null : JSON.stringify(payload.Metadatos);
  }

  const updateFields = Object.keys(payload);
  const pool = getPool();
  const setClause = updateFields.map((field) => `${field} = ?`).join(', ');
  const values = updateFields.map((field) => payload[field]);
  await pool.query(`UPDATE pagos SET ${setClause} WHERE Id_Pag = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM pagos WHERE Id_Pag = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, createOne, updateById, removeById };
