const { getPool } = require('../config/database');
const { logger } = require('../config/logger');

async function runTareasJob() {
  const pool = getPool();

  const [syncResult] = await pool.query(
    `UPDATE tareas
     SET Pro_Tar = 100,
         Fec_Com_Tar = COALESCE(Fec_Com_Tar, NOW())
     WHERE Est_Tar = 'completada'
       AND (Pro_Tar <> 100 OR Fec_Com_Tar IS NULL)`
  );

  const [incompleteRows] = await pool.query(
    `SELECT Id_Tar, Tit_Tar, Fec_Lim_Tar, Pri_Tar, Pro_Tar, Est_Tar
     FROM tareas
     WHERE Est_Tar IN ('pendiente', 'en_progreso')
       AND Fec_Lim_Tar IS NOT NULL
       AND Fec_Lim_Tar < CURDATE()
     ORDER BY Fec_Lim_Tar ASC`
  );

  const summary = {
    synchronizedCount: syncResult.affectedRows,
    overdueCount: incompleteRows.length,
    overdue: incompleteRows
  };

  logger.info(
    `Tareas job: ${summary.synchronizedCount} tareas sincronizadas y ${summary.overdueCount} tareas vencidas detectadas`
  );

  return summary;
}

module.exports = { runTareasJob };
