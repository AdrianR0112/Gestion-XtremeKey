const { getPool } = require('../config/database');
const { logger } = require('../config/logger');

async function runRenovacionesJob() {
  const pool = getPool();
  const [expireResult] = await pool.query(
    `UPDATE renovaciones
     SET Est_Ren = 'expirada'
     WHERE Est_Ren = 'pendiente'
       AND Fec_Ven_Ant_Ren < CURDATE()`
  );

  const [pendingRows] = await pool.query(
    `SELECT Id_Ren, Id_Dve_Ori, Id_Dve_Nue, Id_Cli, Id_Prd, Id_Var, Fec_Ven_Ant_Ren
     FROM renovaciones
     WHERE Est_Ren = 'pendiente'
       AND Fec_Ven_Ant_Ren >= CURDATE()
     ORDER BY Fec_Ven_Ant_Ren ASC`
  );

  const summary = {
    expiredCount: expireResult.affectedRows,
    pendingCount: pendingRows.length,
    pending: pendingRows
  };

  logger.info(`Renovaciones job: ${summary.expiredCount} renovaciones expiradas, ${summary.pendingCount} pendientes`);
  return summary;
}

module.exports = { runRenovacionesJob };
