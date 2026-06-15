const { getPool } = require('../../config/database');
const { toEcuadorDateTime } = require('../../utils/dateHelper');

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function formatDuracion(fecIni, fecFin) {
  if (!fecIni || !fecFin) return '—';
  const ini = toEcuadorDateTime(fecIni).slice(0, 10);
  const fin = toEcuadorDateTime(fecFin).slice(0, 10);
  const diff = Math.floor((new Date(fin) - new Date(ini)) / (1000 * 60 * 60 * 24));
  if (diff >= 365) {
    const years = Math.floor(diff / 365);
    return `${years} ${years === 1 ? 'año' : 'años'}`;
  }
  if (diff >= 30) {
    const months = Math.floor(diff / 30);
    return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  }
  return `${diff} ${diff === 1 ? 'día' : 'días'}`;
}

function mapEstadoActivo(fecFin, estDve) {
  if (estDve === 'vencido') return 'vencido';
  if (estDve === 'cancelado' || estDve === 'renovado') return 'inactivo';
  if (estDve === 'activo') {
    if (!fecFin) return 'activo';
    const ahoraEc = toEcuadorDateTime(new Date()).slice(0, 10);
    const finEc = toEcuadorDateTime(fecFin).slice(0, 10);
    const ahora = new Date(ahoraEc);
    const fin = new Date(finEc);
    const diff = Math.floor((fin - ahora) / (1000 * 60 * 60 * 24));
    if (diff <= 7) return 'por culminar';
    return 'activo';
  }
  return 'inactivo';
}

async function getResumen() {
  const pool = getPool();

  const [
    [ventasPorMes],
    [totalMes],
    [totalSemana],
    [totalHoy],
    [countProductos],
    [countClientes],
    [countRevendedores],
    [ingresosTrimestre],
    [topProductos],
    [topClientes],
    [ultimasVentas],
    [gananciaMes],
    [gananciaSemana],
    [gananciaHoy],
    [gananciaTrimestre],
  ] = await Promise.all([
    pool.query(`
      SELECT DATE_FORMAT(v.Fec_Ven, '%Y-%m') AS mes,
        COALESCE(SUM(v.Tot_Ven), 0) AS total,
        COUNT(DISTINCT v.Id_Ven) AS cantidad,
        COALESCE(SUM((d.Pre_Uni_Dve - COALESCE(vp.Pre_Cos_Var, 0)) * d.Can_Dve), 0) AS ganancia
      FROM ventas v
      INNER JOIN detalle_ventas d ON d.Id_Ven = v.Id_Ven
      LEFT JOIN variantes_productos vp ON vp.Id_Var = d.Id_Var
      WHERE v.Est_Ven = 'completada' AND v.Fec_Ven >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY mes ORDER BY mes
    `),
    pool.query(`
      SELECT COALESCE(SUM(Tot_Ven), 0) AS monto, COUNT(*) AS cantidad
      FROM ventas WHERE Est_Ven = 'completada'
      AND MONTH(Fec_Ven) = MONTH(NOW()) AND YEAR(Fec_Ven) = YEAR(NOW())
    `),
    pool.query(`
      SELECT COALESCE(SUM(Tot_Ven), 0) AS monto, COUNT(*) AS cantidad
      FROM ventas WHERE Est_Ven = 'completada'
      AND Fec_Ven >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `),
    pool.query(`
      SELECT COALESCE(SUM(Tot_Ven), 0) AS monto, COUNT(*) AS cantidad
      FROM ventas WHERE Est_Ven = 'completada'
      AND DATE(Fec_Ven) = CURDATE()
    `),
    pool.query(`SELECT COUNT(*) AS total FROM productos WHERE Est_Prd = 'activo'`),
    pool.query(`SELECT COUNT(*) AS total FROM clientes WHERE Est_Cli = 'activo'`),
    pool.query(`SELECT COUNT(*) AS total FROM revendedores WHERE Est_Rev = 'activo'`),
    pool.query(`
      SELECT COALESCE(SUM(Tot_Ven), 0) AS total
      FROM ventas WHERE Est_Ven = 'completada'
      AND Fec_Ven >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
    `),
    pool.query(`
      SELECT p.Id_Prd AS id, p.Nom_Prd AS nombre,
        SUM(d.Can_Dve) AS cantidad,
        COALESCE(SUM(d.Can_Dve * d.Pre_Uni_Dve), 0) AS monto,
        COALESCE(SUM((d.Pre_Uni_Dve - COALESCE(vp.Pre_Cos_Var, 0)) * d.Can_Dve), 0) AS ganancia
      FROM detalle_ventas d
      INNER JOIN ventas v ON v.Id_Ven = d.Id_Ven
      INNER JOIN productos p ON p.Id_Prd = d.Id_Prd
      LEFT JOIN variantes_productos vp ON vp.Id_Var = d.Id_Var
      WHERE v.Est_Ven = 'completada'
      GROUP BY p.Id_Prd, p.Nom_Prd
      ORDER BY monto DESC LIMIT 5
    `),
    pool.query(`
      SELECT
        COALESCE(c.Id_Cli, r.Id_Rev) AS id,
        COALESCE(CONCAT(c.Nom_Cli, ' ', c.Ape_Cli), CONCAT(r.Nom_Rev, ' ', r.Ape_Rev)) AS nombre,
        CASE WHEN v.Id_Cli IS NOT NULL THEN 'cliente' ELSE 'revendedor' END AS tipo,
        COALESCE(SUM(v.Tot_Ven), 0) AS monto,
        COUNT(*) AS compras
      FROM ventas v
      LEFT JOIN clientes c ON c.Id_Cli = v.Id_Cli
      LEFT JOIN revendedores r ON r.Id_Rev = v.Id_Rev
      WHERE v.Est_Ven = 'completada'
      GROUP BY id, nombre, tipo
      ORDER BY monto DESC LIMIT 5
    `),
    pool.query(`
      SELECT v.Id_Ven AS id,
        COALESCE(CONCAT(c.Nom_Cli, ' ', c.Ape_Cli), CONCAT(r.Nom_Rev, ' ', r.Ape_Rev)) AS cliente,
        CASE WHEN v.Id_Cli IS NOT NULL THEN 'Cliente' ELSE 'Revendedor' END AS rol,
        COALESCE(p.Nom_Prd, 'Sin producto') AS producto,
        d.Fec_Ini_Dve, d.Fec_Fin_Dve, d.Est_Dve
      FROM ventas v
      INNER JOIN detalle_ventas d ON d.Id_Ven = v.Id_Ven
      LEFT JOIN productos p ON p.Id_Prd = d.Id_Prd
      LEFT JOIN clientes c ON c.Id_Cli = v.Id_Cli
      LEFT JOIN revendedores r ON r.Id_Rev = v.Id_Rev
      ORDER BY v.Fec_Ven DESC LIMIT 10
    `),
    pool.query(`
      SELECT COALESCE(SUM((d.Pre_Uni_Dve - COALESCE(vp.Pre_Cos_Var, 0)) * d.Can_Dve), 0) AS ganancia
      FROM detalle_ventas d
      INNER JOIN ventas v ON v.Id_Ven = d.Id_Ven
      LEFT JOIN variantes_productos vp ON vp.Id_Var = d.Id_Var
      WHERE v.Est_Ven = 'completada'
      AND MONTH(v.Fec_Ven) = MONTH(NOW()) AND YEAR(v.Fec_Ven) = YEAR(NOW())
    `),
    pool.query(`
      SELECT COALESCE(SUM((d.Pre_Uni_Dve - COALESCE(vp.Pre_Cos_Var, 0)) * d.Can_Dve), 0) AS ganancia
      FROM detalle_ventas d
      INNER JOIN ventas v ON v.Id_Ven = d.Id_Ven
      LEFT JOIN variantes_productos vp ON vp.Id_Var = d.Id_Var
      WHERE v.Est_Ven = 'completada'
      AND v.Fec_Ven >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `),
    pool.query(`
      SELECT COALESCE(SUM((d.Pre_Uni_Dve - COALESCE(vp.Pre_Cos_Var, 0)) * d.Can_Dve), 0) AS ganancia
      FROM detalle_ventas d
      INNER JOIN ventas v ON v.Id_Ven = d.Id_Ven
      LEFT JOIN variantes_productos vp ON vp.Id_Var = d.Id_Var
      WHERE v.Est_Ven = 'completada'
      AND DATE(v.Fec_Ven) = CURDATE()
    `),
    pool.query(`
      SELECT COALESCE(SUM((d.Pre_Uni_Dve - COALESCE(vp.Pre_Cos_Var, 0)) * d.Can_Dve), 0) AS total
      FROM detalle_ventas d
      INNER JOIN ventas v ON v.Id_Ven = d.Id_Ven
      LEFT JOIN variantes_productos vp ON vp.Id_Var = d.Id_Var
      WHERE v.Est_Ven = 'completada'
      AND v.Fec_Ven >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
    `),
  ]);

  const totalMesRow = totalMes[0] || {};
  const totalSemanaRow = totalSemana[0] || {};
  const totalHoyRow = totalHoy[0] || {};
  const gananciaMesRow = gananciaMes[0] || {};
  const gananciaSemanaRow = gananciaSemana[0] || {};
  const gananciaHoyRow = gananciaHoy[0] || {};

  return {
    ventasPorMes: ventasPorMes.map((r) => ({ ...r, total: Number(r.total), cantidad: Number(r.cantidad), ganancia: Number(r.ganancia) })),
    totales: {
      mes: { monto: Number(totalMesRow.monto || 0), cantidad: Number(totalMesRow.cantidad || 0), ganancia: Number(gananciaMesRow.ganancia || 0) },
      semana: { monto: Number(totalSemanaRow.monto || 0), cantidad: Number(totalSemanaRow.cantidad || 0), ganancia: Number(gananciaSemanaRow.ganancia || 0) },
      hoy: { monto: Number(totalHoyRow.monto || 0), cantidad: Number(totalHoyRow.cantidad || 0), ganancia: Number(gananciaHoyRow.ganancia || 0) },
    },
    conteos: {
      productos: Number((countProductos[0] || {}).total || 0),
      clientes: Number((countClientes[0] || {}).total || 0),
      revendedores: Number((countRevendedores[0] || {}).total || 0),
    },
    ingresosTrimestre: Number((ingresosTrimestre[0] || {}).total || 0),
    gananciaTrimestre: Number((gananciaTrimestre[0] || {}).total || 0),
    visitantes: null,
    topProductos: topProductos.map((r) => ({ ...r, cantidad: Number(r.cantidad), monto: Number(r.monto), ganancia: Number(r.ganancia) })),
    topClientes: topClientes.map((r) => ({ ...r, monto: Number(r.monto), compras: Number(r.compras) })),
    ultimasVentas: ultimasVentas.map((r) => ({
      id: r.id,
      cliente: r.cliente || '—',
      rol: r.rol,
      producto: r.producto,
      duracion: formatDuracion(r.Fec_Ini_Dve, r.Fec_Fin_Dve),
      estado: mapEstadoActivo(r.Fec_Fin_Dve, r.Est_Dve),
    })),
    estadoOperativo: null,
  };
}

module.exports = { getResumen };
