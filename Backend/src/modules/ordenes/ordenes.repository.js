const { getPool } = require('../../config/database');
const { parseJsonField } = require('../../utils/entityHelpers');

const ORDER_SELECT = `
  SELECT
    o.*,
    c.Nom_Cli,
    c.Ape_Cli,
    c.Ema_Cli
  FROM ordenes o
  LEFT JOIN clientes c ON c.Id_Cli = o.Id_Cli
`;

const ITEM_SELECT = `
  SELECT
    io.*,
    p.Nom_Prd AS Nom_Prd_Actual,
    v.Nom_Var AS Nom_Var_Actual
  FROM items_orden io
  INNER JOIN ordenes o ON o.Id_Ord = io.Id_Ord
  INNER JOIN productos p ON p.Id_Prd = io.Id_Prd
  LEFT JOIN variantes_productos v ON v.Id_Var = io.Id_Var
`;

function mapOrder(row) {
  if (!row) return null;
  return { ...row, Metadatos: parseJsonField(row.Metadatos) };
}

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query(`${ORDER_SELECT} ORDER BY o.Id_Ord DESC`);
  return rows.map(mapOrder);
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`${ORDER_SELECT} WHERE o.Id_Ord = ? LIMIT 1`, [id]);
  return mapOrder(rows[0] || null);
}

async function findByNumber(numeroOrd) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM ordenes WHERE Numero_Ord = ? LIMIT 1', [numeroOrd]);
  return mapOrder(rows[0] || null);
}

async function createOne(data) {
  const pool = getPool();
  const [result] = await pool.query(
    `
      INSERT INTO ordenes (
        Numero_Ord, Id_Cli, Email_Invitado, Estado_Ord, Estado_Pago, Moneda,
        Subtotal, Descuento, Total, Id_Cupon, Codigo_Cupon, Notas_Cliente,
        Notas_Internas, Metadatos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.Numero_Ord,
      data.Id_Cli ?? null,
      data.Email_Invitado ?? null,
      data.Estado_Ord ?? 'pendiente',
      data.Estado_Pago ?? 'pendiente',
      data.Moneda ?? 'USD',
      data.Subtotal,
      data.Descuento ?? 0,
      data.Total,
      data.Id_Cupon ?? null,
      data.Codigo_Cupon ?? null,
      data.Notas_Cliente ?? null,
      data.Notas_Internas ?? null,
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

  await pool.query(`UPDATE ordenes SET ${setClause} WHERE Id_Ord = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM ordenes WHERE Id_Ord = ?', [id]);
  return result.affectedRows > 0;
}

async function findItemsByOrderId(orderId) {
  const pool = getPool();
  const [rows] = await pool.query(`${ITEM_SELECT} WHERE io.Id_Ord = ? ORDER BY io.Id_Item_Ord DESC`, [orderId]);
  return rows;
}

async function findItemById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`${ITEM_SELECT} WHERE io.Id_Item_Ord = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function createItem(orderId, data) {
  const pool = getPool();
  const [result] = await pool.query(
    `
      INSERT INTO items_orden (
        Id_Ord, Id_Prd, Id_Var, Id_Key, Id_Cue, Nombre_Prd, Nombre_Var,
        Precio_Unitario, Cantidad, Precio_Total, Descuento_Item, Clave_Licencia,
        Correo_Asociado, Contrasena_Asociada, Fec_Ini_Licencia, Fec_Fin_Licencia, Estado_Item
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      orderId,
      data.Id_Prd,
      data.Id_Var ?? null,
      data.Id_Key ?? null,
      data.Id_Cue ?? null,
      data.Nombre_Prd,
      data.Nombre_Var ?? null,
      data.Precio_Unitario,
      data.Cantidad ?? 1,
      data.Precio_Total,
      data.Descuento_Item ?? 0,
      data.Clave_Licencia ?? null,
      data.Correo_Asociado ?? null,
      data.Contrasena_Asociada ?? null,
      data.Fec_Ini_Licencia ?? null,
      data.Fec_Fin_Licencia ?? null,
      data.Estado_Item ?? 'pendiente',
    ]
  );
  return findItemById(result.insertId);
}

async function updateItemById(id, data) {
  const fields = Object.keys(data);
  if (fields.length === 0) return findItemById(id);

  const pool = getPool();
  const setClause = fields.map((field) => `${field} = ?`).join(', ');
  const values = fields.map((field) => data[field]);

  await pool.query(`UPDATE items_orden SET ${setClause} WHERE Id_Item_Ord = ?`, [...values, id]);
  return findItemById(id);
}

async function removeItemById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM items_orden WHERE Id_Item_Ord = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByNumber,
  createOne,
  updateById,
  removeById,
  findItemsByOrderId,
  findItemById,
  createItem,
  updateItemById,
  removeItemById,
};
