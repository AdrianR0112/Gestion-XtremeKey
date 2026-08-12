const { getPool } = require('../config/database');
const { env } = require('../config/env');

/**
 * Marca como 'expirada' toda suscripcion activa cuya fecha de fin ya paso.
 *
 * Sin este job el estado miente: una suscripcion vencida hace meses seguia
 * figurando como 'activa' y no habia forma de listar las vencidas por estado.
 *
 * INVARIANTE: la comparacion es "< CURDATE()", ESTRICTAMENTE anterior a hoy.
 * No la cambies a "<=". Los recordatorios de Telegram
 * (telegram.repository.findSuscripcionesPorVencer) buscan suscripciones con
 * Est_Sus = 'activa' y Fec_Fin_Sus = hoy para el hito del dia de vencimiento:
 * si este job expirara tambien las de hoy, ese recordatorio dejaria de enviarse
 * sin ningun error visible.
 */
const CONDICION = `
  Est_Sus = 'activa'
  AND Fec_Fin_Sus IS NOT NULL
  AND DATE(Fec_Fin_Sus) < CURDATE()
`;

async function runExpirarSuscripcionesJob(options = {}) {
  const dryRun = options.dryRun !== undefined ? Boolean(options.dryRun) : env.expiracionDryRun;
  const pool = getPool();

  const [candidatas] = await pool.query(
    `
      SELECT
        s.Id_Sus,
        s.Id_Cli,
        s.Id_Rev,
        s.Fec_Fin_Sus,
        TRIM(CONCAT_WS(' ', COALESCE(c.Nom_Cli, r.Nom_Rev), COALESCE(c.Ape_Cli, r.Ape_Rev))) AS titular,
        p.Nom_Prd
      FROM suscripciones s
      LEFT JOIN clientes c ON c.Id_Cli = s.Id_Cli
      LEFT JOIN revendedores r ON r.Id_Rev = s.Id_Rev
      LEFT JOIN productos p ON p.Id_Prd = s.Id_Prd
      WHERE ${CONDICION}
      ORDER BY s.Fec_Fin_Sus ASC
    `
  );

  let actualizadas = 0;
  if (!dryRun && candidatas.length > 0) {
    const [result] = await pool.query(`UPDATE suscripciones SET Est_Sus = 'expirada' WHERE ${CONDICION}`);
    actualizadas = result.affectedRows;
  }

  return {
    now: new Date().toISOString(),
    dryRun,
    candidatos: candidatas.length,
    actualizadas,
    items: candidatas.map((fila) => ({
      Id_Sus: fila.Id_Sus,
      Fec_Fin_Sus: fila.Fec_Fin_Sus,
      titular: fila.titular || null,
      producto: fila.Nom_Prd || null,
      tipoTitular: fila.Id_Rev ? 'revendedor' : 'cliente',
    })),
  };
}

module.exports = { runExpirarSuscripcionesJob };
