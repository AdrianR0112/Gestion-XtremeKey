const { getPool } = require('../../config/database');

// El titular de una suscripcion es un cliente final O un revendedor, nunca los
// dos: por eso ambos joins son LEFT. Con INNER JOIN clientes (como estaba antes)
// las suscripciones de revendedor desaparecerian de todas las consultas.
const BASE_SELECT = `
  SELECT
    s.*,
    c.Nom_Cli,
    c.Ape_Cli,
    c.Ema_Cli,
    c.Tel_Cli,
    c.Ace_Not_What_Cli,
    r.Nom_Rev,
    r.Ape_Rev,
    r.Ema_Rev,
    r.Tel_Rev,
    CASE WHEN s.Id_Rev IS NOT NULL THEN 'revendedor' ELSE 'cliente' END AS Tip_Tit_Sus,
    TRIM(CONCAT_WS(' ', COALESCE(c.Nom_Cli, r.Nom_Rev), COALESCE(c.Ape_Cli, r.Ape_Rev))) AS Nom_Tit_Sus,
    COALESCE(c.Ema_Cli, r.Ema_Rev) AS Ema_Tit_Sus,
    COALESCE(c.Tel_Cli, r.Tel_Rev) AS Tel_Tit_Sus,
    p.Nom_Prd,
    p.Tip_Prd,
    v.Nom_Var,
    v.Dur_Tip_Var,
    v.Dur_Val_Var,
    v.Pre_Ven_Var,
    v.Pre_Rev_Var,
    v.Not_Ven_Wsp_Var,
    CASE
      WHEN s.Fec_Fin_Sus IS NULL THEN NULL
      ELSE DATEDIFF(DATE(s.Fec_Fin_Sus), CURDATE())
    END AS Dias_Restantes
  FROM suscripciones s
  LEFT JOIN clientes c ON c.Id_Cli = s.Id_Cli
  LEFT JOIN revendedores r ON r.Id_Rev = s.Id_Rev
  INNER JOIN productos p ON p.Id_Prd = s.Id_Prd
  LEFT JOIN variantes_productos v ON v.Id_Var = s.Id_Var
`;

function resolvePool(connection) {
  return connection || getPool();
}

// Lo que vence antes primero; las suscripciones sin vencimiento al final.
const DEFAULT_ORDER = 'ORDER BY (s.Fec_Fin_Sus IS NULL), s.Fec_Fin_Sus ASC, s.Id_Sus DESC';
// En el archivo interesa recuperar primero lo que vencio hace menos tiempo.
// Una fila expirada sin fecha sigue siendo valida, pero queda al final porque
// no se puede establecer su cercania temporal.
const ARCHIVED_ORDER = 'ORDER BY (s.Fec_Fin_Sus IS NULL), s.Fec_Fin_Sus DESC, s.Id_Sus DESC';

/**
 * Una suscripcion esta "archivada" cuando ya no hay nada que perseguir en ella:
 * o esta marcada como expirada, o lleva vencida mas dias de los que define la
 * configuracion.
 *
 * Son dos condiciones porque cubren momentos distintos: Est_Sus lo pone el cron
 * de expiracion (una vez al dia, a las 00:10), y el umbral de dias cubre la
 * ventana entre que algo vence y el cron pasa a marcarlo.
 */
const CLAUSULA_ARCHIVADA = `(
  s.Est_Sus = 'expirada'
  OR (s.Fec_Fin_Sus IS NOT NULL AND DATEDIFF(DATE(s.Fec_Fin_Sus), CURDATE()) < ?)
)`;

/**
 * Traduce los filtros de la API a clausulas WHERE. La definicion de "por vencer"
 * y la de "archivada" viven aqui y solo aqui: las comparten el listado, el
 * resumen de KPIs y el job de expiracion.
 */
function buildFilters(filters = {}) {
  const clauses = [];
  const values = [];

  // El listado principal excluye el archivo salvo que se pida explicitamente.
  // archivadas: true -> solo el archivo; false/undefined -> todo menos archivo;
  // null -> sin filtrar (para conteos globales).
  const diasArchivo = Number.isInteger(filters.diasArchivo) ? filters.diasArchivo : 5;
  const umbral = -diasArchivo;

  if (filters.archivadas === true) {
    clauses.push(`(${CLAUSULA_ARCHIVADA})`);
    values.push(umbral);
  } else if (filters.archivadas !== null) {
    clauses.push(`NOT (${CLAUSULA_ARCHIVADA})`);
    values.push(umbral);
  }

  if (Array.isArray(filters.estado) && filters.estado.length > 0) {
    clauses.push(`s.Est_Sus IN (${filters.estado.map(() => '?').join(', ')})`);
    values.push(...filters.estado);
  }

  if (filters.titular === 'cliente') {
    clauses.push('s.Id_Cli IS NOT NULL');
  } else if (filters.titular === 'revendedor') {
    clauses.push('s.Id_Rev IS NOT NULL');
  }

  if (filters.Id_Cli) {
    clauses.push('s.Id_Cli = ?');
    values.push(filters.Id_Cli);
  }

  if (filters.Id_Rev) {
    clauses.push('s.Id_Rev = ?');
    values.push(filters.Id_Rev);
  }

  if (filters.Id_Prd) {
    clauses.push('s.Id_Prd = ?');
    values.push(filters.Id_Prd);
  }

  const dias = Number.isInteger(filters.dias) ? filters.dias : 7;
  if (filters.vencimiento === 'por_vencer') {
    clauses.push('s.Fec_Fin_Sus IS NOT NULL AND DATEDIFF(DATE(s.Fec_Fin_Sus), CURDATE()) BETWEEN 0 AND ?');
    values.push(dias);
  } else if (filters.vencimiento === 'vencidas') {
    clauses.push('s.Fec_Fin_Sus IS NOT NULL AND DATEDIFF(DATE(s.Fec_Fin_Sus), CURDATE()) < 0');
  } else if (filters.vencimiento === 'vigentes') {
    clauses.push('s.Fec_Fin_Sus IS NOT NULL AND DATEDIFF(DATE(s.Fec_Fin_Sus), CURDATE()) >= 0');
  } else if (filters.vencimiento === 'sin_vencimiento') {
    clauses.push('s.Fec_Fin_Sus IS NULL');
  }

  if (filters.desde) {
    clauses.push('DATE(s.Fec_Fin_Sus) >= ?');
    values.push(filters.desde);
  }

  if (filters.hasta) {
    clauses.push('DATE(s.Fec_Fin_Sus) <= ?');
    values.push(filters.hasta);
  }

  if (filters.q) {
    // Incluye la cuenta del cliente final: en las suscripciones de revendedor
    // es el unico dato que distingue una fila de otra.
    //
    // El nombre completo se compara tambien concatenado (misma expresion que el
    // alias Nom_Tit_Sus): buscando por columnas sueltas, "Walter Guachizaca" no
    // casaba ni con Nom_Cli ni con Ape_Cli.
    clauses.push(`(
      c.Nom_Cli LIKE ? OR c.Ape_Cli LIKE ? OR c.Ema_Cli LIKE ?
      OR r.Nom_Rev LIKE ? OR r.Ape_Rev LIKE ? OR r.Ema_Rev LIKE ?
      OR p.Nom_Prd LIKE ? OR v.Nom_Var LIKE ? OR s.Not_Sus LIKE ?
      OR s.Cor_Cue_Sus LIKE ?
      OR TRIM(CONCAT_WS(' ', COALESCE(c.Nom_Cli, r.Nom_Rev), COALESCE(c.Ape_Cli, r.Ape_Rev))) LIKE ?
    )`);
    const like = `%${filters.q}%`;
    values.push(like, like, like, like, like, like, like, like, like, like, like);
  }

  return {
    where: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    values,
  };
}

async function findAll(filters = {}, connection) {
  const pool = resolvePool(connection);
  const { where, values } = buildFilters(filters);
  const order = filters.archivadas === true ? ARCHIVED_ORDER : DEFAULT_ORDER;
  const [rows] = await pool.query(`${BASE_SELECT} ${where} ${order}`, values);
  return rows;
}

async function findById(id, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(`${BASE_SELECT} WHERE s.Id_Sus = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

/**
 * Igual que findById pero bloqueando la fila hasta el fin de la transaccion.
 * Necesario en la renovacion: sin el bloqueo, dos clics simultaneos sobre el
 * mismo boton "Renovar" crearian dos periodos.
 */
async function findByIdForUpdate(id, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query('SELECT * FROM suscripciones WHERE Id_Sus = ? FOR UPDATE', [id]);
  return rows[0] || null;
}

async function findByClienteId(idCli, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(
    `${BASE_SELECT} WHERE s.Id_Cli = ? ORDER BY s.Fec_Ini_Sus DESC, s.Id_Sus DESC`,
    [idCli]
  );
  return rows;
}

async function findByRevendedorId(idRev, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(
    `${BASE_SELECT} WHERE s.Id_Rev = ? ORDER BY s.Fec_Ini_Sus DESC, s.Id_Sus DESC`,
    [idRev]
  );
  return rows;
}

/**
 * Contadores para las tarjetas KPI, en una sola pasada sin joins.
 * mysql2 devuelve los SUM como string o decimal: el service los castea.
 */
/**
 * Contadores de las tarjetas KPI.
 *
 * Todos los contadores salvo `archivadas` excluyen el archivo, para que el
 * numero de la tarjeta coincida con las filas que se ven al pulsarla. Si
 * `total` contara tambien las archivadas, la tarjeta diria 133 y la tabla
 * mostraria 112.
 */
async function getResumen(dias = 7, diasArchivo = 5, connection) {
  const pool = resolvePool(connection);
  const umbral = -Math.abs(Number.isInteger(diasArchivo) ? diasArchivo : 5);
  const [rows] = await pool.query(
    `
      SELECT
        SUM(NOT archivada) AS total,
        SUM(NOT archivada AND Est_Sus = 'activa') AS activas,
        SUM(NOT archivada AND Est_Sus = 'suspendida') AS suspendidas,
        SUM(NOT archivada AND Est_Sus = 'cancelada') AS canceladas,
        SUM(NOT archivada AND Est_Sus = 'expirada') AS expiradas,
        SUM(
          NOT archivada
          AND Est_Sus = 'activa'
          AND Fec_Fin_Sus IS NOT NULL
          AND DATEDIFF(DATE(Fec_Fin_Sus), CURDATE()) BETWEEN 0 AND ?
        ) AS por_vencer,
        SUM(
          NOT archivada
          AND Fec_Fin_Sus IS NOT NULL
          AND DATEDIFF(DATE(Fec_Fin_Sus), CURDATE()) < 0
          AND Est_Sus IN ('activa', 'expirada')
        ) AS vencidas,
        SUM(archivada) AS archivadas,
        SUM(NOT archivada AND Id_Rev IS NOT NULL) AS de_revendedor,
        SUM(NOT archivada AND Id_Cli IS NOT NULL) AS de_cliente
      FROM (
        SELECT
          Est_Sus,
          Fec_Fin_Sus,
          Id_Rev,
          Id_Cli,
          (
            Est_Sus = 'expirada'
            OR (Fec_Fin_Sus IS NOT NULL AND DATEDIFF(DATE(Fec_Fin_Sus), CURDATE()) < ?)
          ) AS archivada
        FROM suscripciones
      ) s
    `,
    [dias, umbral]
  );

  return rows[0] || {};
}

async function countLinkedDetalles(idSus, connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM detalle_ventas
      WHERE Id_Sus = ?
    `,
    [idSus]
  );

  return Number(rows[0]?.total || 0);
}

async function createOne(data, connection) {
  const pool = resolvePool(connection);
  const sql = `
    INSERT INTO suscripciones (
      Id_Cli,
      Id_Rev,
      Id_Prd,
      Id_Var,
      Cor_Cue_Sus,
      Fec_Ini_Sus,
      Fec_Fin_Sus,
      Est_Sus,
      Ren_Auto,
      Not_Sus
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Id_Cli ?? null,
    data.Id_Rev ?? null,
    data.Id_Prd,
    data.Id_Var ?? null,
    data.Cor_Cue_Sus ?? null,
    data.Fec_Ini_Sus,
    data.Fec_Fin_Sus ?? null,
    data.Est_Sus ?? 'activa',
    data.Ren_Auto ?? 1,
    data.Not_Sus ?? null,
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

  await pool.query(`UPDATE suscripciones SET ${setClause} WHERE Id_Sus = ?`, [...values, id]);
  return findById(id, connection);
}

async function removeById(id, connection) {
  const pool = resolvePool(connection);
  const [result] = await pool.query('DELETE FROM suscripciones WHERE Id_Sus = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByIdForUpdate,
  findByClienteId,
  findByRevendedorId,
  getResumen,
  countLinkedDetalles,
  createOne,
  updateById,
  removeById,
};
