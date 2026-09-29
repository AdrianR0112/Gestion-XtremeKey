const clientesRepository = require('../clientes/clientes.repository');
const revendedoresRepository = require('../revendedores/revendedores.repository');
const suscripcionesRepository = require('../suscripciones/suscripciones.repository');
const suscripcionesService = require('../suscripciones/suscripciones.service');
const ventasService = require('../ventas/ventas.service');
const configuracionRepository = require('../configuracion/configuracion.repository');
const { buildPhoneCandidates } = require('./telefono');

function pickCliente(row) {
  if (!row) return null;
  const { Id_Cli, Nom_Cli, Ape_Cli, Tel_Cli, Ema_Cli, Cat_Cli, Est_Cli, Ace_Not_What_Cli } = row;
  return { Id_Cli, Nom_Cli, Ape_Cli, Tel_Cli, Ema_Cli, Cat_Cli, Est_Cli, Ace_Not_What_Cli };
}

function pickRevendedor(row) {
  if (!row) return null;
  const { Id_Rev, Nom_Rev, Ape_Rev, Tel_Rev, Ema_Rev, Est_Rev } = row;
  return { Id_Rev, Nom_Rev, Ape_Rev, Tel_Rev, Ema_Rev, Est_Rev };
}

function toCandidate(tipo, row) {
  const cliente = tipo === 'cliente';
  return {
    tipo,
    id: Number(cliente ? row.Id_Cli : row.Id_Rev),
    nombre: [cliente ? row.Nom_Cli : row.Nom_Rev, cliente ? row.Ape_Cli : row.Ape_Rev].filter(Boolean).join(' ') || 'Sin nombre',
    telefono: cliente ? row.Tel_Cli : row.Tel_Rev,
    estado: cliente ? row.Est_Cli : row.Est_Rev,
    categoria: cliente ? row.Cat_Cli : null,
  };
}

function deriveEstadoUi(suscripcion, diasAnticipacion) {
  if (suscripcion.Est_Sus !== 'activa') return suscripcion.Est_Sus;
  if (suscripcion.Fec_Fin_Sus === null || suscripcion.Fec_Fin_Sus === undefined) return 'sin_vencimiento';
  const dias = Number(suscripcion.Dias_Restantes);
  if (!Number.isFinite(dias)) return 'sin_vencimiento';
  if (dias < 0) return 'vencida';
  if (dias <= diasAnticipacion) return 'por_vencer';
  return 'vigente';
}

function sortByUrgency(items) {
  return [...items].sort((a, b) => {
    const aDays = a.Dias_Restantes === null || a.Dias_Restantes === undefined ? Number.POSITIVE_INFINITY : Number(a.Dias_Restantes);
    const bDays = b.Dias_Restantes === null || b.Dias_Restantes === undefined ? Number.POSITIVE_INFINITY : Number(b.Dias_Restantes);
    return aDays - bDays || Number(b.Id_Sus) - Number(a.Id_Sus);
  });
}

function summarize(suscripciones) {
  return {
    total: suscripciones.length,
    activas: suscripciones.filter((item) => item.Est_Sus === 'activa').length,
    porVencer: suscripciones.filter((item) => item.estadoUi === 'por_vencer').length,
    vencidas: suscripciones.filter((item) => item.estadoUi === 'vencida' || item.estadoUi === 'expirada').length,
  };
}

async function getContexto(query) {
  const telefono = buildPhoneCandidates(query.telefono);
  const [clientes, revendedores] = await Promise.all([
    clientesRepository.findByPhoneCandidates(telefono.variantes),
    revendedoresRepository.findByPhoneCandidates(telefono.variantes),
  ]);
  const matches = [
    ...clientes.map((row) => ({ tipo: 'cliente', row })),
    ...revendedores.map((row) => ({ tipo: 'revendedor', row })),
  ];
  const candidatos = matches.map(({ tipo, row }) => toCandidate(tipo, row));

  const base = {
    telefono,
    encontrado: matches.length > 0,
    ambiguo: matches.length > 1,
    titular: null,
    candidatos: matches.length > 1 ? candidatos : [],
    cliente: null,
    revendedor: null,
    ultimaCompra: null,
    suscripciones: [],
    resumen: { total: 0, activas: 0, porVencer: 0, vencidas: 0 },
    mensajeSugerido: null,
  };
  if (matches.length === 0) return base;

  let selected = matches.length === 1 ? matches[0] : null;
  if (query.titularTipo && query.titularId) {
    selected = matches.find(({ tipo, row }) => (
      tipo === query.titularTipo
      && Number(tipo === 'cliente' ? row.Id_Cli : row.Id_Rev) === Number(query.titularId)
    )) || null;
  }
  if (!selected) return base;

  const isCliente = selected.tipo === 'cliente';
  const id = Number(isCliente ? selected.row.Id_Cli : selected.row.Id_Rev);
  const [config, suscripciones, ventas] = await Promise.all([
    configuracionRepository.getConfiguracionNotificaciones(),
    isCliente
      ? suscripcionesRepository.findByClienteId(id)
      : suscripcionesRepository.findByRevendedorId(id),
    isCliente ? ventasService.listVentasByCliente(id) : Promise.resolve([]),
  ]);
  const diasAnticipacion = Number(config.diasAnticipacion ?? 7);
  const ordered = sortByUrgency(suscripciones.map((item) => ({
    ...item,
    estadoUi: deriveEstadoUi(item, diasAnticipacion),
  })));

  const result = {
    ...base,
    titular: { tipo: selected.tipo },
    cliente: isCliente ? pickCliente(selected.row) : null,
    revendedor: isCliente ? null : pickRevendedor(selected.row),
    ultimaCompra: ventas[0] || null,
    suscripciones: ordered,
    resumen: summarize(ordered),
  };

  if (query.incluirMensaje && ordered[0]) {
    try {
      result.mensajeSugerido = await suscripcionesService.getMensajeWhatsapp(ordered[0].Id_Sus);
    } catch (error) {
      result.mensajeError = error.message || 'No se pudo generar el mensaje sugerido.';
    }
  }

  return result;
}

module.exports = { getContexto, deriveEstadoUi, summarize };
