const { getPool } = require('../../config/database');

function resolvePool(connection) {
  return connection || getPool();
}

const BASE_SELECT = `
  SELECT
    s.Id_Sus, s.Id_Cli, s.Id_Rev, s.Id_Prd, s.Id_Var, s.Cor_Cue_Sus,
    s.Fec_Fin_Sus, s.Est_Sus,
    COALESCE(c.Nom_Cli, r.Nom_Rev) AS Nom_Cli,
    COALESCE(c.Ape_Cli, r.Ape_Rev) AS Ape_Cli,
    COALESCE(c.Tel_Cli, r.Tel_Rev) AS Tel_Cli,
    COALESCE(c.Ace_Not_What_Cli, 1) AS Ace_Not_What_Cli,
    CASE WHEN s.Id_Rev IS NOT NULL THEN 'revendedor' ELSE 'cliente' END AS Tip_Tit_Sus,
    p.Nom_Prd,
    v.Nom_Var, v.Pre_Ven_Var, v.Pre_Rev_Var, v.Dur_Tip_Var, v.Dur_Val_Var, v.Not_Ven_Wsp_Var,
    rl.Est_Envio AS Est_Env_Rec
  FROM suscripciones s
  LEFT JOIN clientes c ON c.Id_Cli = s.Id_Cli
  LEFT JOIN revendedores r ON r.Id_Rev = s.Id_Rev
  INNER JOIN productos p ON p.Id_Prd = s.Id_Prd
  LEFT JOIN variantes_productos v ON v.Id_Var = s.Id_Var
  LEFT JOIN recordatorios_suscripcion rl
    ON rl.Id_Sus = s.Id_Sus
    AND rl.Can_Rec = 'whatsapp'
    AND rl.Tip_Rec = ?
    AND rl.Fec_Objetivo = ?
`;

async function findSuscripcionesPorVencer(poolOrDate, maybeDate, maybeMilestone = 'dia') {
  const pool = maybeDate === undefined ? getPool() : resolvePool(poolOrDate);
  const fechaObjetivo = maybeDate === undefined ? poolOrDate : maybeDate;
  const milestone = maybeDate === undefined ? maybeMilestone : arguments[2] || 'dia';
  const [rows] = await pool.query(
    `${BASE_SELECT}
      WHERE DATE(s.Fec_Fin_Sus) = ? AND s.Est_Sus = 'activa'
      ORDER BY s.Fec_Fin_Sus ASC, s.Id_Sus ASC`,
    [milestone, fechaObjetivo, fechaObjetivo]
  );
  return rows;
}

async function findSuscripcionesVencidasAyer(poolOrDate, maybeDate) {
  const pool = maybeDate === undefined ? getPool() : resolvePool(poolOrDate);
  const fechaObjetivo = maybeDate === undefined ? poolOrDate : maybeDate;
  const [rows] = await pool.query(
    `${BASE_SELECT}
      WHERE DATE(s.Fec_Fin_Sus) = ? AND s.Est_Sus IN ('activa', 'expirada')
      ORDER BY s.Fec_Fin_Sus ASC, s.Id_Sus ASC`,
    ['ayer', fechaObjetivo, fechaObjetivo]
  );
  return rows;
}

async function findLog(poolOrId, maybeId, maybeChannel, maybeMilestone, maybeDate) {
  const hasPool = maybeDate !== undefined;
  const pool = hasPool ? resolvePool(poolOrId) : getPool();
  const idSus = hasPool ? maybeId : poolOrId;
  const channel = hasPool ? maybeChannel : maybeId;
  const milestone = hasPool ? maybeMilestone : maybeChannel;
  const fechaObjetivo = hasPool ? maybeDate : maybeMilestone;
  const [rows] = await pool.query(
    `SELECT * FROM recordatorios_suscripcion
     WHERE Id_Sus = ? AND Can_Rec = ? AND Tip_Rec = ? AND Fec_Objetivo = ? LIMIT 1`,
    [idSus, channel, milestone, fechaObjetivo]
  );
  return rows[0] || null;
}

async function upsertLog(poolOrPayload, maybePayload) {
  const pool = maybePayload === undefined ? getPool() : resolvePool(poolOrPayload);
  const payload = maybePayload === undefined ? poolOrPayload : maybePayload;
  await pool.query(
    `INSERT INTO recordatorios_suscripcion
      (Id_Sus, Can_Rec, Tip_Rec, Fec_Objetivo, Des_Rec, Est_Envio, Err_Envio, Aut_Usu_Id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       Des_Rec = VALUES(Des_Rec), Est_Envio = VALUES(Est_Envio),
       Err_Envio = VALUES(Err_Envio), Aut_Usu_Id = VALUES(Aut_Usu_Id)`,
    [
      payload.Id_Sus, payload.Can_Rec, payload.Tip_Rec, payload.Fec_Objetivo,
      payload.Des_Rec ?? null, payload.Est_Envio, payload.Err_Envio ?? null,
      payload.Aut_Usu_Id ?? null
    ]
  );
  return findLog(pool, payload.Id_Sus, payload.Can_Rec, payload.Tip_Rec, payload.Fec_Objetivo);
}

async function deleteLog(idSus, channel, milestone, fechaObjetivo) {
  const pool = getPool();
  const params = [idSus, channel, milestone, fechaObjetivo];
  const [result] = await pool.query(
    `DELETE FROM recordatorios_suscripcion
     WHERE Id_Sus = ? AND Can_Rec = ? AND Tip_Rec = ? AND Fec_Objetivo = ?`,
    params
  );
  return result.affectedRows > 0;
}

module.exports = {
  findSuscripcionesPorVencer,
  findSuscripcionesVencidasAyer,
  findLog,
  upsertLog,
  deleteLog
};
