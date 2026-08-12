const { getPool } = require('../../config/database');

function resolvePool(connection) {
  return connection || getPool();
}

/**
 * El titular de una suscripcion puede ser un cliente final o un revendedor, de
 * ahi los LEFT JOIN y los COALESCE: con INNER JOIN clientes las suscripciones de
 * revendedor nunca generaban recordatorio.
 *
 * Los revendedores no tienen columna de consentimiento equivalente a
 * Ace_Not_Tel_Cli, asi que se asume 1: son contraparte comercial y, ademas, el
 * bot no les escribe: manda el aviso al chat del admin con un enlace wa.me que
 * una persona decide pulsar.
 *
 * INVARIANTE: esta consulta busca Est_Sus = 'activa' para el hito del dia de
 * vencimiento (DATE(Fec_Fin_Sus) = hoy). El job de expiracion solo marca como
 * expiradas las anteriores a hoy; si eso cambiara, este recordatorio dejaria de
 * enviarse en silencio.
 */
async function findSuscripcionesPorVencer(poolOrDate, maybeDate) {
  const pool = maybeDate === undefined ? getPool() : resolvePool(poolOrDate);
  const fechaObjetivo = maybeDate === undefined ? poolOrDate : maybeDate;
  const [rows] = await pool.query(
    `
      SELECT
        s.Id_Sus,
        s.Id_Cli,
        s.Id_Rev,
        s.Id_Prd,
        s.Id_Var,
        s.Cor_Cue_Sus,
        s.Fec_Fin_Sus,
        s.Est_Sus,
        COALESCE(c.Nom_Cli, r.Nom_Rev) AS Nom_Cli,
        COALESCE(c.Ape_Cli, r.Ape_Rev) AS Ape_Cli,
        COALESCE(c.Tel_Cli, r.Tel_Rev) AS Tel_Cli,
        COALESCE(c.Ace_Not_Tel_Cli, 1) AS Ace_Not_Tel_Cli,
        CASE WHEN s.Id_Rev IS NOT NULL THEN 'revendedor' ELSE 'cliente' END AS Tip_Tit_Sus,
        p.Nom_Prd,
        v.Nom_Var,
        v.Pre_Ven_Var,
        v.Pre_Rev_Var,
        v.Dur_Tip_Var,
        v.Dur_Val_Var,
        v.Not_Ven_Wsp_Var
      FROM suscripciones s
      LEFT JOIN clientes c ON c.Id_Cli = s.Id_Cli
      LEFT JOIN revendedores r ON r.Id_Rev = s.Id_Rev
      INNER JOIN productos p ON p.Id_Prd = s.Id_Prd
      LEFT JOIN variantes_productos v ON v.Id_Var = s.Id_Var
      WHERE DATE(s.Fec_Fin_Sus) = ?
        AND s.Est_Sus = 'activa'
      ORDER BY s.Fec_Fin_Sus ASC, s.Id_Sus ASC
    `,
    [fechaObjetivo]
  );
  return rows;
}

async function findSuscripcionesVencidasAyer(poolOrDate, maybeDate) {
  const pool = maybeDate === undefined ? getPool() : resolvePool(poolOrDate);
  const fechaObjetivo = maybeDate === undefined ? poolOrDate : maybeDate;
  const [rows] = await pool.query(
    `
      SELECT
        s.Id_Sus,
        s.Id_Cli,
        s.Id_Rev,
        s.Id_Prd,
        s.Id_Var,
        s.Cor_Cue_Sus,
        s.Fec_Fin_Sus,
        s.Est_Sus,
        COALESCE(c.Nom_Cli, r.Nom_Rev) AS Nom_Cli,
        COALESCE(c.Ape_Cli, r.Ape_Rev) AS Ape_Cli,
        COALESCE(c.Tel_Cli, r.Tel_Rev) AS Tel_Cli,
        COALESCE(c.Ace_Not_Tel_Cli, 1) AS Ace_Not_Tel_Cli,
        CASE WHEN s.Id_Rev IS NOT NULL THEN 'revendedor' ELSE 'cliente' END AS Tip_Tit_Sus,
        p.Nom_Prd,
        v.Nom_Var,
        v.Pre_Ven_Var,
        v.Pre_Rev_Var,
        v.Dur_Tip_Var,
        v.Dur_Val_Var,
        v.Not_Ven_Wsp_Var
      FROM suscripciones s
      LEFT JOIN clientes c ON c.Id_Cli = s.Id_Cli
      LEFT JOIN revendedores r ON r.Id_Rev = s.Id_Rev
      INNER JOIN productos p ON p.Id_Prd = s.Id_Prd
      LEFT JOIN variantes_productos v ON v.Id_Var = s.Id_Var
      WHERE DATE(s.Fec_Fin_Sus) = ?
        AND s.Est_Sus IN ('activa', 'expirada')
      ORDER BY s.Fec_Fin_Sus ASC, s.Id_Sus ASC
    `,
    [fechaObjetivo]
  );
  return rows;
}

async function findLog(poolOrId, maybeId, maybeMilestone, maybeDate) {
  const pool = maybeDate === undefined ? getPool() : resolvePool(poolOrId);
  const idSus = maybeDate === undefined ? poolOrId : maybeId;
  const milestone = maybeDate === undefined ? maybeId : maybeMilestone;
  const fechaObjetivo = maybeDate === undefined ? maybeMilestone : maybeDate;
  const [rows] = await pool.query(
    `
      SELECT *
      FROM recordatorios_suscripcion_telegram
      WHERE Id_Sus = ? AND Tip_Rec = ? AND Fec_Objetivo = ?
      LIMIT 1
    `,
    [idSus, milestone, fechaObjetivo]
  );
  return rows[0] || null;
}

async function upsertLog(poolOrPayload, maybePayload) {
  const pool = maybePayload === undefined ? getPool() : resolvePool(poolOrPayload);
  const payload = maybePayload === undefined ? poolOrPayload : maybePayload;
  await pool.query(
    `
      INSERT INTO recordatorios_suscripcion_telegram (
        Id_Sus, Tip_Rec, Fec_Objetivo, Chat_Id, Est_Envio, Err_Envio
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        Chat_Id = VALUES(Chat_Id),
        Est_Envio = VALUES(Est_Envio),
        Err_Envio = VALUES(Err_Envio)
    `,
    [
      payload.Id_Sus,
      payload.Tip_Rec,
      payload.Fec_Objetivo,
      payload.Chat_Id ?? null,
      payload.Est_Envio,
      payload.Err_Envio ?? null
    ]
  );
}

module.exports = {
  findSuscripcionesPorVencer,
  findSuscripcionesVencidasAyer,
  findLog,
  upsertLog
};
