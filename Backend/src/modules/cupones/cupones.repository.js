const { getPool } = require('../../config/database');

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM cupones ORDER BY Id_Cup DESC');
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM cupones WHERE Id_Cup = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function findByCode(code) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM cupones WHERE Codigo_Cup = ? LIMIT 1', [code]);
  return rows[0] || null;
}

async function createOne(data) {
  const pool = getPool();
  const [result] = await pool.query(
    `
      INSERT INTO cupones (
        Codigo_Cup, Descripcion_Cup, Tipo_Cup, Monto_Descuento, Minimo_Carrito,
        Maximo_Descuento, Fecha_Desde, Fecha_Hasta, Limite_Uso, Limite_Uso_Por_Usuario,
        Veces_Usado, Esta_Activo, Estado_Cup, Aplica_A
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.Codigo_Cup,
      data.Descripcion_Cup ?? null,
      data.Tipo_Cup ?? 'porcentaje',
      data.Monto_Descuento ?? 0,
      data.Minimo_Carrito ?? 0,
      data.Maximo_Descuento ?? null,
      data.Fecha_Desde,
      data.Fecha_Hasta,
      data.Limite_Uso ?? null,
      data.Limite_Uso_Por_Usuario ?? 1,
      data.Veces_Usado ?? 0,
      data.Esta_Activo ?? 1,
      data.Estado_Cup ?? 'activo',
      data.Aplica_A ?? 'todos',
    ]
  );
  return findById(result.insertId);
}

async function updateById(id, data) {
  const fields = Object.keys(data);
  if (fields.length === 0) return findById(id);

  const pool = getPool();
  const setClause = fields.map((field) => `${field} = ?`).join(', ');
  const values = fields.map((field) => data[field]);
  await pool.query(`UPDATE cupones SET ${setClause} WHERE Id_Cup = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM cupones WHERE Id_Cup = ?', [id]);
  return result.affectedRows > 0;
}

async function findProductsByCouponId(couponId) {
  const pool = getPool();
  const [rows] = await pool.query(
    `
      SELECT cp.*, p.Nom_Prd
      FROM cupones_productos cp
      INNER JOIN productos p ON p.Id_Prd = cp.Id_Prd
      WHERE cp.Id_Cup = ?
      ORDER BY cp.Id_Prd DESC
    `,
    [couponId]
  );
  return rows;
}

async function addProduct(couponId, productId) {
  const pool = getPool();
  await pool.query('INSERT INTO cupones_productos (Id_Cup, Id_Prd) VALUES (?, ?)', [couponId, productId]);
  return { Id_Cup: couponId, Id_Prd: productId };
}

async function removeProduct(couponId, productId) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM cupones_productos WHERE Id_Cup = ? AND Id_Prd = ?', [couponId, productId]);
  return result.affectedRows > 0;
}

async function findUsages() {
  const pool = getPool();
  const [rows] = await pool.query(
    `
      SELECT uc.*, c.Codigo_Cup, cl.Nom_Cli, cl.Ape_Cli, o.Numero_Ord
      FROM uso_cupones uc
      INNER JOIN cupones c ON c.Id_Cup = uc.Id_Cup
      INNER JOIN clientes cl ON cl.Id_Cli = uc.Id_Cli
      LEFT JOIN ordenes o ON o.Id_Ord = uc.Id_Ord
      ORDER BY uc.Id_Uso DESC
    `
  );
  return rows;
}

async function findUsageById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `
      SELECT uc.*, c.Codigo_Cup, cl.Nom_Cli, cl.Ape_Cli, o.Numero_Ord
      FROM uso_cupones uc
      INNER JOIN cupones c ON c.Id_Cup = uc.Id_Cup
      INNER JOIN clientes cl ON cl.Id_Cli = uc.Id_Cli
      LEFT JOIN ordenes o ON o.Id_Ord = uc.Id_Ord
      WHERE uc.Id_Uso = ?
      LIMIT 1
    `,
    [id]
  );
  return rows[0] || null;
}

async function findUsagesByCouponId(couponId) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM uso_cupones WHERE Id_Cup = ? ORDER BY Id_Uso DESC', [couponId]);
  return rows;
}

async function createUsage(data) {
  const pool = getPool();
  const [result] = await pool.query(
    `
      INSERT INTO uso_cupones (Id_Cup, Id_Cli, Id_Ord, Descuento_Aplicado, Usado_En)
      VALUES (?, ?, ?, ?, ?)
    `,
    [data.Id_Cup, data.Id_Cli, data.Id_Ord ?? null, data.Descuento_Aplicado ?? 0, data.Usado_En ?? null]
  );
  return findUsageById(result.insertId);
}

async function updateUsageById(id, data) {
  const fields = Object.keys(data);
  if (fields.length === 0) return findUsageById(id);

  const pool = getPool();
  const setClause = fields.map((field) => `${field} = ?`).join(', ');
  const values = fields.map((field) => data[field]);
  await pool.query(`UPDATE uso_cupones SET ${setClause} WHERE Id_Uso = ?`, [...values, id]);
  return findUsageById(id);
}

async function removeUsageById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM uso_cupones WHERE Id_Uso = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByCode,
  createOne,
  updateById,
  removeById,
  findProductsByCouponId,
  addProduct,
  removeProduct,
  findUsages,
  findUsageById,
  findUsagesByCouponId,
  createUsage,
  updateUsageById,
  removeUsageById,
};
