const { getPool } = require('../config/database');
const { logger } = require('../config/logger');
const { toEcuadorDateTime } = require('../utils/dateHelper');

function toDateString(daysAhead = 0) {
  const nowEc = toEcuadorDateTime(new Date()).slice(0, 10);
  const date = new Date(`${nowEc}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + daysAhead);
  return toEcuadorDateTime(date).slice(0, 10);
}

async function runVencimientosJob() {
  const pool = getPool();
  const today = toDateString(0);
  const nextSevenDays = toDateString(7);

  const [renovacionesRows] = await pool.query(
    `SELECT Id_Ren, Id_Cli, Id_Prd, Id_Var, Fec_Ven_Ant_Ren, Est_Ren
     FROM renovaciones
     WHERE Est_Ren = 'pendiente'
       AND Fec_Ven_Ant_Ren BETWEEN ? AND ?
     ORDER BY Fec_Ven_Ant_Ren ASC`,
    [today, nextSevenDays]
  );

  const [tareasRows] = await pool.query(
    `SELECT Id_Tar, Tit_Tar, Id_Cli, Id_Ven, Fec_Lim_Tar, Pri_Tar, Pro_Tar, Est_Tar
     FROM tareas
     WHERE Est_Tar IN ('pendiente', 'en_progreso')
       AND Fec_Lim_Tar IS NOT NULL
       AND Fec_Lim_Tar <= CURDATE()
     ORDER BY Fec_Lim_Tar ASC`
  );

  const summary = {
    today,
    nextSevenDays,
    renovacionesProximas: renovacionesRows.length,
    tareasVencidas: tareasRows.length,
    renovaciones: renovacionesRows,
    tareas: tareasRows
  };

  logger.info(
    `Vencimientos job: ${summary.renovacionesProximas} renovaciones próximas y ${summary.tareasVencidas} tareas vencidas`
  );

  return summary;
}

module.exports = { runVencimientosJob };
