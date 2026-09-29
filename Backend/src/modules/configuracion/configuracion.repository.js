const { getPool } = require('../../config/database');
const {
  DEFAULT_DIAS_GRACIA_RENOVACION,
  DEFAULT_DIAS_ARCHIVO_VENCIDA,
  DEFAULT_HORA_NOTIFICACION,
  DEFAULT_DIAS_ANTICIPACION_NOTIFICACION
} = require('./configuracion.schemas');

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM configuracion ORDER BY Id_Con DESC');
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM configuracion WHERE Id_Con = ?', [id]);
  return rows[0] || null;
}

async function findCurrent() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM configuracion ORDER BY Id_Con ASC LIMIT 1');
  return rows[0] || null;
}

async function createOne(data) {
  const pool = getPool();
  const sql = `
    INSERT INTO configuracion (
      Nom_Emp_Con,
      Dir_Con,
      Tel_Con,
      Ema_Con,
      Log_Con,
      Mon_Con,
      Zon_Hor_Con,
      Imp_Con,
      Hab_Imp_Con,
      Dia_Gra_Ren_Con,
      Dia_Arc_Ven_Con,
      Hor_Not_Con,
      Dia_Ant_Not_Con
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.Nom_Emp_Con,
    data.Dir_Con ?? null,
    data.Tel_Con ?? null,
    data.Ema_Con ?? null,
    data.Log_Con ?? null,
    data.Mon_Con ?? 'USD',
    data.Zon_Hor_Con ?? 'America/Guayaquil',
    data.Imp_Con ?? 0,
    data.Hab_Imp_Con ?? true,
    data.Dia_Gra_Ren_Con ?? DEFAULT_DIAS_GRACIA_RENOVACION,
    data.Dia_Arc_Ven_Con ?? DEFAULT_DIAS_ARCHIVO_VENCIDA,
    data.Hor_Not_Con ?? DEFAULT_HORA_NOTIFICACION,
    data.Dia_Ant_Not_Con ?? DEFAULT_DIAS_ANTICIPACION_NOTIFICACION
  ];

  const [result] = await pool.query(sql, values);
  return findById(result.insertId);
}

/**
 * Dias de gracia para renovar. Se lee suelto (y no la configuracion entera)
 * porque la renovacion lo consulta una vez por peticion, tambien en lote.
 * Si no hay fila de configuracion todavia, se cae al default.
 */
async function getDiasGraciaRenovacion() {
  const configuracion = await findCurrent();
  const valor = Number(configuracion?.Dia_Gra_Ren_Con);
  return Number.isInteger(valor) && valor >= 0 ? valor : DEFAULT_DIAS_GRACIA_RENOVACION;
}

/** Dias que una vencida sigue en el listado principal antes del archivo. */
async function getDiasArchivoVencida() {
  const configuracion = await findCurrent();
  const valor = Number(configuracion?.Dia_Arc_Ven_Con);
  return Number.isInteger(valor) && valor >= 0 ? valor : DEFAULT_DIAS_ARCHIVO_VENCIDA;
}

async function getConfiguracionNotificaciones() {
  const configuracion = await findCurrent();
  const hora = Number(configuracion?.Hor_Not_Con);
  const dias = Number(configuracion?.Dia_Ant_Not_Con);
  return {
    hora: Number.isInteger(hora) && hora >= 0 && hora <= 23 ? hora : DEFAULT_HORA_NOTIFICACION,
    diasAnticipacion: Number.isInteger(dias) && dias >= 0 && dias <= 60
      ? dias
      : DEFAULT_DIAS_ANTICIPACION_NOTIFICACION,
    timezone: String(configuracion?.Zon_Hor_Con || '').trim() || 'America/Guayaquil'
  };
}

async function updateById(id, data) {
  const fields = Object.keys(data);
  if (fields.length === 0) return findById(id);

  const pool = getPool();
  const setClause = fields.map((field) => `${field} = ?`).join(', ');
  const values = fields.map((field) => data[field]);

  await pool.query(`UPDATE configuracion SET ${setClause} WHERE Id_Con = ?`, [...values, id]);
  return findById(id);
}

async function removeById(id) {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM configuracion WHERE Id_Con = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findCurrent,
  getDiasGraciaRenovacion,
  getDiasArchivoVencida,
  getConfiguracionNotificaciones,
  createOne,
  updateById,
  removeById
};
