const { getPool } = require('../../config/database');

function resolvePool(connection) {
  return connection || getPool();
}

const BASE_SELECT = `
  SELECT
    d.*,
    v.Id_Ven AS Num_Ven,
    v.Est_Ven,
    p.Nom_Prd,
    vr.Nom_Var,
    c.Nom_Cue,
    k.Des_Key
  FROM detalle_ventas d
  INNER JOIN ventas v ON v.Id_Ven = d.Id_Ven
  LEFT JOIN productos p ON p.Id_Prd = d.Id_Prd
  LEFT JOIN variantes_productos vr ON vr.Id_Var = d.Id_Var
  LEFT JOIN cuentas c ON c.Id_Cue = d.Id_Cue
  LEFT JOIN keys_productos k ON k.Id_Key = d.Id_Key
`;

async function findAll(connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY d.Id_Dve DESC`);
  return rows;
}

async function findById(id, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(`${BASE_SELECT} WHERE d.Id_Dve = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function findByClienteId(clienteId, connection) {
  const pool = resolvePool(connection);
  const sql = `
    SELECT d.*, v.Id_Cli, v.Est_Ven,
      p.Nom_Prd, vr.Nom_Var
    FROM detalle_ventas d
    INNER JOIN ventas v ON v.Id_Ven = d.Id_Ven
    LEFT JOIN productos p ON p.Id_Prd = d.Id_Prd
    LEFT JOIN variantes_productos vr ON vr.Id_Var = d.Id_Var
    WHERE v.Id_Cli = ?
    ORDER BY d.Fec_Fin_Dve DESC, d.Id_Dve DESC
  `;
  const [rows] = await pool.query(sql, [clienteId]);
  return rows;
}

async function findByVentaId(idVen, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(`${BASE_SELECT} WHERE d.Id_Ven = ? ORDER BY d.Id_Dve ASC`, [idVen]);
  return rows;
}

async function createOne(data, connection) {
  const pool = resolvePool(connection);
  const sql = `
    INSERT INTO detalle_ventas (
      Id_Ven,
      Id_Dve_Ant,
      Id_Sus,
      Id_Prd,
      Id_Var,
      Id_Cue,
      Id_Key,
      Cor_Cue,
      Con_Cue,
      Can_Dve,
      Pre_Uni_Dve,
      Des_Uni_Dve,
      Fec_Ini_Dve,
      Fec_Fin_Dve,
      Not_Dve,
      Est_Dve
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Id_Ven,
    data.Id_Dve_Ant ?? null,
    data.Id_Sus ?? null,
    data.Id_Prd ?? null,
    data.Id_Var ?? null,
    data.Id_Cue ?? null,
    data.Id_Key ?? null,
    data.Cor_Cue ?? null,
    data.Con_Cue ?? null,
    data.Can_Dve ?? 1,
    data.Pre_Uni_Dve,
    data.Des_Uni_Dve ?? 0,
    data.Fec_Ini_Dve,
    data.Fec_Fin_Dve,
    data.Not_Dve ?? null,
    data.Est_Dve ?? 'activo'
  ];

  const [result] = await pool.query(sql, values);
  return findById(result.insertId, connection);
}

async function updateById(id, data, connection) {
  const fields = Object.keys(data);
  if (fields.length === 0) return findById(id, connection);

  const pool = resolvePool(connection);
  const setClause = fields.map((field) => `${field} = ?`).join(', ');
  const values = fields.map((field) => data[field]);

  await pool.query(`UPDATE detalle_ventas SET ${setClause} WHERE Id_Dve = ?`, [...values, id]);
  return findById(id, connection);
}

async function findByAnteriorId(idDveAnt, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(
    `${BASE_SELECT} WHERE d.Id_Dve_Ant = ? LIMIT 1`,
    [idDveAnt]
  );
  return rows[0] || null;
}

async function findFirstInChain(id, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(
    `
      WITH RECURSIVE cadena AS (
        SELECT d.Id_Dve, d.Id_Dve_Ant, d.Fec_Ini_Dve, d.Id_Sus
        FROM detalle_ventas d
        WHERE d.Id_Dve = ?
        UNION ALL
        SELECT anterior.Id_Dve, anterior.Id_Dve_Ant, anterior.Fec_Ini_Dve, anterior.Id_Sus
        FROM detalle_ventas anterior
        INNER JOIN cadena actual ON actual.Id_Dve_Ant = anterior.Id_Dve
      )
      SELECT * FROM cadena ORDER BY Fec_Ini_Dve ASC, Id_Dve ASC LIMIT 1
    `,
    [id]
  );
  return rows[0] || null;
}

/**
 * Ultimo periodo de la cadena de renovaciones de una suscripcion, o null si la
 * suscripcion nunca se vendio (por ejemplo, si se creo a mano).
 *
 * Se ordena por Fec_Fin_Dve en vez de filtrar Est_Dve = 'activo' a proposito:
 * un periodo ya vencido sigue siendo el ultimo de la cadena y debe poder
 * renovarse. Filtrando por 'activo', justo las suscripciones vencidas -las que
 * mas se renuevan- perderian el enlace Id_Dve_Ant y empezarian cadena nueva.
 */
async function findLastInChainBySuscripcion(idSus, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(
    `
      SELECT d.*
      FROM detalle_ventas d
      WHERE d.Id_Sus = ? AND d.Est_Dve <> 'cancelado'
      ORDER BY d.Fec_Fin_Dve DESC, d.Id_Dve DESC
      LIMIT 1
    `,
    [idSus]
  );
  return rows[0] || null;
}

/**
 * Historial completo de periodos de una suscripcion.
 *
 * Se consulta por Id_Sus y no recorriendo Id_Dve_Ant porque la propia creacion
 * de renovaciones ya propaga Id_Sus hacia atras por toda la cadena, y existe
 * idx_detalle_ventas_id_sus. Id_Dve_Ant se devuelve igualmente para que el
 * frontend dibuje el encadenamiento y detecte huecos.
 */
async function findBySuscripcionId(idSus, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(
    `
      SELECT
        d.Id_Dve,
        d.Id_Dve_Ant,
        d.Id_Ven,
        ven.Cod_Ven,
        ven.Fec_Ven,
        ven.Est_Ven,
        ven.Met_Pag_Ven,
        ven.Id_Cli AS Ven_Id_Cli,
        ven.Id_Rev AS Ven_Id_Rev,
        d.Id_Prd,
        d.Id_Var,
        p.Nom_Prd,
        vp.Nom_Var,
        d.Fec_Ini_Dve,
        d.Fec_Fin_Dve,
        d.Can_Dve,
        d.Pre_Uni_Dve,
        d.Des_Uni_Dve,
        ROUND(d.Can_Dve * (d.Pre_Uni_Dve - COALESCE(d.Des_Uni_Dve, 0)), 2) AS Sub_Tot_Dve,
        d.Est_Dve,
        d.Cor_Cue,
        d.Fec_Cre,
        CASE WHEN d.Id_Dve_Ant IS NULL THEN 'inicial' ELSE 'renovacion' END AS Tip_Per
      FROM detalle_ventas d
      INNER JOIN ventas ven ON ven.Id_Ven = d.Id_Ven
      LEFT JOIN productos p ON p.Id_Prd = d.Id_Prd
      LEFT JOIN variantes_productos vp ON vp.Id_Var = d.Id_Var
      WHERE d.Id_Sus = ?
      ORDER BY d.Fec_Ini_Dve ASC, d.Id_Dve ASC
    `,
    [idSus]
  );
  return rows;
}

async function removeById(id, connection) {
  const pool = resolvePool(connection);
  const [result] = await pool.query('DELETE FROM detalle_ventas WHERE Id_Dve = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByClienteId,
  findByVentaId,
  findByAnteriorId,
  findFirstInChain,
  findLastInChainBySuscripcion,
  findBySuscripcionId,
  createOne,
  updateById,
  removeById
};
