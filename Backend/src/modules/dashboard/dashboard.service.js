const dashboardRepository = require('./dashboard.repository');
const suscripcionesRepository = require('../suscripciones/suscripciones.repository');
const { toEcuadorDateTime } = require('../../utils/dateHelper');
const {
  resolverRango,
  resolverRangoAnterior,
  validateQuery,
} = require('./dashboard.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
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

function toNumber(value) {
  return Number(value || 0);
}

function variacionPorcentual(actual, anterior) {
  if (anterior === 0) return null;
  return ((actual - anterior) / Math.abs(anterior)) * 100;
}

function mapTotales(row = {}) {
  const ingresos = toNumber(row.ingresos);
  const costo = toNumber(row.costo);
  const cantidadVentas = toNumber(row.cantidadVentas);
  const ganancia = ingresos - costo;

  return {
    ingresos,
    costo,
    ganancia,
    margen: ingresos === 0 ? 0 : (ganancia / ingresos) * 100,
    cantidadVentas,
    unidades: toNumber(row.unidades),
    ticketMedio: cantidadVentas === 0 ? 0 : ingresos / cantidadVentas,
    lineasSinCosto: toNumber(row.lineasSinCosto),
  };
}

async function getResumen(query = {}) {
  const validation = validateQuery(query);
  if (!validation.isValid) {
    throw createHttpError(400, 'Query inválido.', validation.errors);
  }

  const { periodo, ancla } = validation.query;
  const rangoActual = resolverRango(periodo, ancla);
  const rangoPrevio = resolverRangoAnterior(periodo, ancla);
  const granularidad = periodo === 'trimestre' || periodo === 'anio' ? 'mes' : 'dia';

  const [
    totalesActualRow,
    totalesAnteriorRow,
    serieRows,
    conteosRow,
    suscripcionesRow,
    renovacionesRow,
    topProductosRows,
    topClientesRows,
    ultimasVentasRows,
  ] = await Promise.all([
    dashboardRepository.getTotales(rangoActual.desde, rangoActual.hasta),
    dashboardRepository.getTotales(rangoPrevio.desde, rangoPrevio.hasta),
    dashboardRepository.getSerie(rangoActual.desde, rangoActual.hasta, granularidad),
    dashboardRepository.getConteos(),
    suscripcionesRepository.getResumen(7),
    dashboardRepository.getRenovaciones(rangoActual.desde, rangoActual.hasta),
    dashboardRepository.getTopProductos(rangoActual.desde, rangoActual.hasta),
    dashboardRepository.getTopClientes(rangoActual.desde, rangoActual.hasta),
    dashboardRepository.getUltimasVentas(),
  ]);

  const totales = mapTotales(totalesActualRow);
  const totalesAnteriores = mapTotales(totalesAnteriorRow);

  return {
    rango: { periodo, ancla, ...rangoActual },
    rangoAnterior: rangoPrevio,
    totales,
    comparacion: {
      ingresos: variacionPorcentual(totales.ingresos, totalesAnteriores.ingresos),
      ganancia: variacionPorcentual(totales.ganancia, totalesAnteriores.ganancia),
      cantidadVentas: variacionPorcentual(totales.cantidadVentas, totalesAnteriores.cantidadVentas),
      ticketMedio: variacionPorcentual(totales.ticketMedio, totalesAnteriores.ticketMedio),
    },
    serie: serieRows.map((row) => ({
      bucket: row.bucket,
      ingresos: toNumber(row.ingresos),
      ganancia: toNumber(row.ganancia),
      cantidad: toNumber(row.cantidad),
    })),
    conteos: {
      productos: toNumber(conteosRow.productos),
      clientes: toNumber(conteosRow.clientes),
      revendedores: toNumber(conteosRow.revendedores),
    },
    suscripciones: {
      activas: toNumber(suscripcionesRow.activas),
      porVencer: toNumber(suscripcionesRow.por_vencer),
      vencidas: toNumber(suscripcionesRow.vencidas),
      expiradas: toNumber(suscripcionesRow.expiradas),
    },
    renovaciones: {
      cantidad: toNumber(renovacionesRow.cantidad),
      importe: toNumber(renovacionesRow.importe),
      tasaRenovacion: toNumber(renovacionesRow.tasaRenovacion),
    },
    topProductos: topProductosRows.map((row) => ({
      ...row,
      cantidad: toNumber(row.cantidad),
      monto: toNumber(row.monto),
      ganancia: toNumber(row.ganancia),
    })),
    topClientes: topClientesRows.map((row) => ({
      ...row,
      monto: toNumber(row.monto),
      compras: toNumber(row.compras),
    })),
    ultimasVentas: ultimasVentasRows.map((row) => ({
      id: row.id,
      cliente: row.cliente || '—',
      rol: row.rol,
      producto: row.producto || 'Sin producto',
      duracion: formatDuracion(row.Fec_Ini_Dve, row.Fec_Fin_Dve),
      estado: mapEstadoActivo(row.Fec_Fin_Dve, row.Est_Dve),
    })),
  };
}

module.exports = { getResumen };
