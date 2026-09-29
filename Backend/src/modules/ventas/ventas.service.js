const ventasRepository = require('./ventas.repository');
const clientesRepository = require('../clientes/clientes.repository');
const revendedoresRepository = require('../revendedores/revendedores.repository');
const detalleVentasRepository = require('../detalle-ventas/detalleVentas.repository');
const detalleVentasValidator = require('../detalle-ventas/detalleVentas.validator');
const productosRepository = require('../productos/productos.repository');
const variantesRepository = require('../variantes/variantes.repository');
const suscripcionesRepository = require('../suscripciones/suscripciones.repository');
const { derivarEstadoSuscripcion } = require('../suscripciones/suscripciones.periodo');
const configuracionRepository = require('../configuracion/configuracion.repository');
const detalleVentasService = require('../detalle-ventas/detalleVentas.service');
const { validatePayload, isNumericId } = require('./ventas.validator');
const { getPool } = require('../../config/database');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function ensureClienteExiste(idCli) {
  if (idCli === undefined || idCli === null) return;
  const cliente = await clientesRepository.findById(idCli);
  if (!cliente) {
    throw createHttpError(400, 'El cliente indicado no existe.');
  }
}

async function ensureRevendedorExiste(idRev) {
  if (idRev === undefined || idRev === null) return;
  const revendedor = await revendedoresRepository.findById(idRev);
  if (!revendedor) {
    throw createHttpError(400, 'El revendedor indicado no existe.');
  }
}

async function ensureProductoExiste(idPrd) {
  if (idPrd === undefined || idPrd === null) return;
  const producto = await productosRepository.findById(idPrd);
  if (!producto) {
    throw createHttpError(400, 'El producto indicado no existe.');
  }
}

async function ensureVarianteExiste(idVar) {
  if (idVar === undefined || idVar === null) return;
  const variante = await variantesRepository.findById(idVar);
  if (!variante) {
    throw createHttpError(400, 'La variante indicada no existe.');
  }
}

async function applyImpuestoConfig(payload, { current = null, isUpdate = false } = {}) {
  const configuracionActual = await configuracionRepository.findCurrent();
  if (configuracionActual?.Hab_Imp_Con) {
    return payload;
  }

  if (!isUpdate) {
    const normalized = { ...payload };
    normalized.Imp_Tot_Ven = 0;
    return normalized;
  }

  const touchesTaxTotals = ['Des_Tot_Ven', 'Imp_Tot_Ven', 'Tot_Ven'].some(
    (field) => payload[field] !== undefined
  );

  if (!touchesTaxTotals) {
    return payload;
  }

  const merged = {
    ...current,
    ...payload,
    Imp_Tot_Ven: 0
  };

  return {
    ...payload,
    Imp_Tot_Ven: 0,
  };
}

async function listVentas() {
  return ventasRepository.findAll();
}

async function listVentasByCliente(idCli) {
  if (!isNumericId(idCli)) return [];
  const ventas = await ventasRepository.findAllByCliente(Number(idCli));
  if (ventas.length === 0) return [];
  const detalles = await detalleVentasRepository.findByClienteId(Number(idCli));
  const byVenta = new Map();
  for (const d of detalles) {
    const key = Number(d.Id_Ven);
    if (!byVenta.has(key)) byVenta.set(key, []);
    byVenta.get(key).push(d);
  }
  return ventas.map((v) => ({
    ...v,
    detalles: byVenta.get(Number(v.Id_Ven)) ?? [],
  }));
}

async function getVentaById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Ven invalido.');
  }

  const item = await ventasRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Venta no encontrada.');
  }

  return item;
}

async function createVenta(payload) {
  const normalizedPayload = await applyImpuestoConfig(payload);
  const validation = validatePayload(normalizedPayload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureClienteExiste(validation.payload.Id_Cli);
  await ensureRevendedorExiste(validation.payload.Id_Rev);

  return ventasRepository.createOne(validation.payload);
}

async function updateVenta(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Ven invalido.');
  }

  const current = await ventasRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Venta no encontrada.');
  }

  const normalizedPayload = await applyImpuestoConfig(payload, { current, isUpdate: true });
  const validation = validatePayload(normalizedPayload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  const merged = {
    ...current,
    ...validation.payload
  };

  const mergedValidation = validatePayload(merged, { isUpdate: true });
  if (!mergedValidation.isValid) {
    throw createHttpError(400, 'Payload invalido.', mergedValidation.errors);
  }

  await ensureClienteExiste(validation.payload.Id_Cli ?? current.Id_Cli);
  await ensureRevendedorExiste(validation.payload.Id_Rev ?? current.Id_Rev);

  const detallesVenta = await detalleVentasRepository.findByVentaId(Number(id));
  let tieneCadenaRenovacion = false;
  for (const detalle of detallesVenta) {
    if (detalle.Id_Dve_Ant || await detalleVentasRepository.findByAnteriorId(detalle.Id_Dve)) {
      tieneCadenaRenovacion = true;
      break;
    }
  }
  const estadoFinal = mergedValidation.payload.Est_Ven ?? current.Est_Ven;
  if (tieneCadenaRenovacion && estadoFinal !== 'completada') {
    throw createHttpError(409, 'Una venta con renovaciones solo puede mantenerse como completada.');
  }

  return ventasRepository.updateById(Number(id), mergedValidation.payload);
}

async function deleteVenta(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Ven invalido.');
  }

  const detallesVenta = await detalleVentasRepository.findByVentaId(Number(id));
  for (const detalle of detallesVenta) {
    const siguiente = await detalleVentasRepository.findByAnteriorId(detalle.Id_Dve);
    if (detalle.Id_Dve_Ant || siguiente) {
      throw createHttpError(409, 'No se puede eliminar una venta que forma parte de una cadena de renovaciones.');
    }
  }

  const deleted = await ventasRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Venta no encontrada.');
  }
}

async function ensureDetalleAnteriorValido(idDveAnt, ventaActual, detalleNuevo, connection) {
  const detalleAnterior = await detalleVentasRepository.findById(idDveAnt, connection);
  if (!detalleAnterior) {
    throw createHttpError(400, `La licencia anterior (Id_Dve_Ant=${idDveAnt}) no existe.`);
  }

  const ventaAnterior = await ventasRepository.findById(detalleAnterior.Id_Ven, connection);
  if (!ventaAnterior) {
    throw createHttpError(400, 'No se encontro la venta de la licencia anterior.');
  }
  if (ventaActual.Est_Ven !== 'completada') {
    throw createHttpError(400, 'Una venta con renovaciones debe estar completada.');
  }

  const titularDe = (venta) => {
    if (venta.Id_Cli) return `C${Number(venta.Id_Cli)}`;
    if (venta.Id_Rev) return `R${Number(venta.Id_Rev)}`;
    return null;
  };
  const titularActual = titularDe(ventaActual);
  if (!titularActual || titularActual !== titularDe(ventaAnterior)) {
    throw createHttpError(400, 'La licencia anterior no pertenece al mismo titular.');
  }
  if (detalleAnterior.Est_Dve === 'cancelado') {
    throw createHttpError(400, 'No se puede renovar un detalle cancelado.');
  }
  if (Number(detalleAnterior.Id_Dve) === Number(detalleNuevo.Id_Dve)) {
    throw createHttpError(400, 'Un detalle no puede renovarse a si mismo.');
  }

  const sucesor = await detalleVentasRepository.findByAnteriorId(idDveAnt, connection);
  if (sucesor) {
    throw createHttpError(409, 'El detalle anterior ya tiene una renovacion registrada.');
  }

  if (Number(detalleAnterior.Id_Prd || 0) !== Number(detalleNuevo.Id_Prd || 0)) {
    throw createHttpError(400, 'El producto de la renovacion debe coincidir con el producto anterior.');
  }

  // La variante SI puede cambiar entre periodos: pasar de mensual a anual (o
  // subir de plan) al renovar es una operacion legitima, y el modulo de
  // suscripciones ya la permite via Id_Var. El producto, en cambio, tiene que
  // ser el mismo: es lo que define la identidad de la cadena.

  return detalleAnterior;
}

async function enlazarSuscripcionRenovada(detalleAnterior, detalleNuevo, ventaActual, connection) {
  if (!detalleNuevo.Id_Prd || (!ventaActual.Id_Cli && !ventaActual.Id_Rev)) return;

  const producto = await productosRepository.findById(Number(detalleNuevo.Id_Prd));
  if (!producto || producto.Tip_Prd !== 'suscripcion') return;

  const primerDetalle = await detalleVentasRepository.findFirstInChain(detalleAnterior.Id_Dve, connection);
  let idSus = detalleAnterior.Id_Sus || primerDetalle?.Id_Sus || null;

  if (!idSus) {
    const suscripcion = await detalleVentasService.registrarSuscripcionSiAplica(
      {
        ...detalleNuevo,
        Fec_Ini_Dve: primerDetalle?.Fec_Ini_Dve || detalleAnterior.Fec_Ini_Dve,
        Fec_Fin_Dve: detalleNuevo.Fec_Fin_Dve,
      },
      ventaActual,
      connection
    );
    idSus = suscripcion?.Id_Sus || null;
  } else {
    const cambios = {
      Id_Prd: detalleNuevo.Id_Prd,
      Id_Var: detalleNuevo.Id_Var ?? null,
      Fec_Fin_Sus: detalleNuevo.Fec_Fin_Dve,
      // Mismo criterio que la renovacion desde el modulo de suscripciones: el
      // estado sale de la fecha de fin real, no se fija en 'activa'.
      Est_Sus: derivarEstadoSuscripcion(detalleNuevo.Fec_Fin_Dve),
    };
    // Si la renovacion se registro contra otra cuenta, la suscripcion pasa a
    // ser de ese cliente final.
    if (detalleNuevo.Cor_Cue) {
      cambios.Cor_Cue_Sus = String(detalleNuevo.Cor_Cue).trim().toLowerCase();
    }
    await suscripcionesRepository.updateById(idSus, cambios, connection);
  }

  if (!idSus) return;

  let cursor = detalleAnterior;
  let guard = 0;
  while (cursor && guard < 100) {
    await detalleVentasRepository.updateById(cursor.Id_Dve, { Id_Sus: idSus }, connection);
    if (!cursor.Id_Dve_Ant) break;
    cursor = await detalleVentasRepository.findById(cursor.Id_Dve_Ant, connection);
    guard += 1;
  }
  await detalleVentasRepository.updateById(detalleNuevo.Id_Dve, { Id_Sus: idSus }, connection);
  detalleNuevo.Id_Sus = idSus;
}

async function createVentaConDetalles(payload) {
  const { venta: ventaPayload, detalles } = payload;
  if (!Array.isArray(detalles) || detalles.length === 0) {
    throw createHttpError(400, 'Debe incluir al menos un detalle.');
  }

  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const normalizedVenta = await applyImpuestoConfig(ventaPayload);
    const ventaValidation = validatePayload(normalizedVenta);
    if (!ventaValidation.isValid) {
      throw createHttpError(400, 'Payload de venta invalido.', ventaValidation.errors);
    }
    await ensureClienteExiste(ventaValidation.payload.Id_Cli);
    await ensureRevendedorExiste(ventaValidation.payload.Id_Rev);

    const ventaCreada = await ventasRepository.createOne(ventaValidation.payload, connection);
    const idVenta = ventaCreada.Id_Ven;
    let subtotalTotal = 0;
    const detallesCreados = [];
    for (let i = 0; i < detalles.length; i++) {
      const detalle = detalles[i];
      const detallePayload = {
        ...detalle,
        Id_Ven: idVenta,
      };
      delete detallePayload.tipoOperacion;
      delete detallePayload.renovacion;
      delete detallePayload.Sub_Tot_Dve;

      const dveValidation = detalleVentasValidator.validatePayload(detallePayload);
      if (!dveValidation.isValid) {
        throw createHttpError(400, `Detalle ${i + 1} invalido.`, dveValidation.errors);
      }

      if (dveValidation.payload.Id_Prd) {
        await ensureProductoExiste(dveValidation.payload.Id_Prd);
      }
      if (dveValidation.payload.Id_Var) {
        await ensureVarianteExiste(dveValidation.payload.Id_Var);
      }

      const detalleAnterior = dveValidation.payload.Id_Dve_Ant
        ? await ensureDetalleAnteriorValido(Number(dveValidation.payload.Id_Dve_Ant), ventaCreada, dveValidation.payload, connection)
        : null;

      const computedSub = dveValidation.payload._computedSubtotal || detalleVentasValidator.computeSubtotal(dveValidation.payload);
      subtotalTotal += computedSub;

      const detalleCreado = await detalleVentasRepository.createOne(dveValidation.payload, connection);
      detalleCreado._computedSubtotal = computedSub;
      detallesCreados.push(detalleCreado);

      if (detalleAnterior) {
        await detalleVentasRepository.updateById(detalleAnterior.Id_Dve, { Est_Dve: 'renovado' }, connection);
        await enlazarSuscripcionRenovada(detalleAnterior, detalleCreado, ventaCreada, connection);
      } else {
        // Linea de venta normal (no renovacion): si el producto es una suscripcion,
        // registra la suscripcion del cliente y enlaza Id_Sus al detalle. Reutiliza
        // la conexion para que todo quede dentro de la misma transaccion.
        const suscripcion = await detalleVentasService.registrarSuscripcionSiAplica(
          detalleCreado,
          ventaCreada,
          connection
        );
        if (suscripcion) {
          detalleCreado.Id_Sus = suscripcion.Id_Sus;
        }
      }
    }

    const subTotalCalculado = Number(subtotalTotal.toFixed(2));
    const descTotal = Number(ventaCreada.Des_Tot_Ven || 0);
    const impTotal = Number(ventaCreada.Imp_Tot_Ven || 0);
    const totEsperado = Number((subTotalCalculado - descTotal + impTotal).toFixed(2));

    if (totEsperado < 0) {
      await connection.rollback();
      throw createHttpError(400, 'El total de la venta no puede ser negativo.');
    }

    await ventasRepository.updateById(idVenta, { Tot_Ven: totEsperado }, connection);
    ventaCreada.Tot_Ven = totEsperado;

    await connection.commit();

    const ventaFinal = await ventasRepository.findById(idVenta);

    return {
      venta: ventaFinal,
      detalles: detallesCreados,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  listVentas,
  listVentasByCliente,
  getVentaById,
  createVenta,
  updateVenta,
  deleteVenta,
  createVentaConDetalles,
};
