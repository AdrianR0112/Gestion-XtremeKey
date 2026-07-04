const ventasRepository = require('./ventas.repository');
const clientesRepository = require('../clientes/clientes.repository');
const { findOrCreateClienteByCorreo } = require('../clientes/clientes.identity');
const revendedoresRepository = require('../revendedores/revendedores.repository');
const detalleVentasRepository = require('../detalle-ventas/detalleVentas.repository');
const detalleVentasValidator = require('../detalle-ventas/detalleVentas.validator');
const renovacionesRepository = require('../renovaciones/renovaciones.repository');
const productosRepository = require('../productos/productos.repository');
const variantesRepository = require('../variantes/variantes.repository');
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

  return ventasRepository.updateById(Number(id), mergedValidation.payload);
}

async function deleteVenta(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Ven invalido.');
  }

  const deleted = await ventasRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Venta no encontrada.');
  }
}

/**
 * Crea una venta de ecommerce resolviendo el cliente comercial por correo.
 *
 * La venta se asocia principalmente a clientes.Id_Cli (no depende unicamente
 * del usuario autenticado, dejando espacio para compras invitadas/manuales).
 * Si el correo ya existe en clientes se reutiliza; si no, se crea con
 * origen = ecommerce. El authUserId, cuando existe, queda registrado en la venta.
 *
 * @param {Object} params
 * @param {string} params.correo       Correo del comprador (obligatorio).
 * @param {string} [params.nombre]     Nombre del comprador.
 * @param {string} [params.apellido]   Apellido del comprador.
 * @param {string} [params.telefono]   Telefono del comprador.
 * @param {string} [params.authUserId] Id de Better Auth del usuario autenticado.
 * @param {Object} params.venta        Datos de la venta (Tot_Ven, Met_Pag_Ven, etc.).
 */
async function createVentaEcommerce(params = {}) {
  const correo = String(params.correo ?? '').trim().toLowerCase();
  if (!correo) {
    throw createHttpError(400, 'El correo del cliente es obligatorio para una venta de ecommerce.');
  }

  const { cliente } = await findOrCreateClienteByCorreo({
    correo,
    nombre: params.nombre,
    apellido: params.apellido,
    telefono: params.telefono,
    documento: params.documento,
    origen: 'ecommerce',
    authUserId: params.authUserId ?? null,
  });

  const ventaPayload = {
    ...(params.venta || {}),
    Id_Cli: Number(cliente.Id_Cli),
    Id_Rev: null,
    Auth_User_Id: params.authUserId ?? cliente.Auth_User_Id ?? null,
    Origen_Ven: 'ecommerce',
  };

  const normalizedPayload = await applyImpuestoConfig(ventaPayload);
  const validation = validatePayload(normalizedPayload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  return ventasRepository.createOne(validation.payload);
}

async function createVentaConDetallesYRenovaciones(payload) {
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
    const idClienteVenta = ventaCreada.Id_Cli;

    let subtotalTotal = 0;
    const detallesCreados = [];
    const renovacionesCreadas = [];

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

      const computedSub = dveValidation.payload._computedSubtotal || detalleVentasValidator.computeSubtotal(dveValidation.payload);
      subtotalTotal += computedSub;

      const detalleCreado = await detalleVentasRepository.createOne(dveValidation.payload, connection);
      detalleCreado._computedSubtotal = computedSub;
      detallesCreados.push(detalleCreado);

      if (detalle.tipoOperacion === 'renovacion' && detalle.renovacion?.Id_Dve_Ori) {
        const renovacionData = detalle.renovacion;
        const idDveOri = Number(renovacionData.Id_Dve_Ori);
        if (!Number.isInteger(idDveOri) || idDveOri <= 0) {
          throw createHttpError(400, `Detalle ${i + 1}: Id_Dve_Ori invalido para renovacion.`);
        }

        const detalleAnterior = await detalleVentasRepository.findById(idDveOri, connection);
        if (!detalleAnterior) {
          throw createHttpError(400, `Detalle ${i + 1}: la licencia anterior (Id_Dve_Ori=${idDveOri}) no existe.`);
        }

        const ventaAnterior = await ventasRepository.findById(detalleAnterior.Id_Ven, connection);
        if (!ventaAnterior) {
          throw createHttpError(400, `Detalle ${i + 1}: no se encontro la venta de la licencia anterior.`);
        }

        const clienteAnteriorId = ventaAnterior.Id_Cli || ventaAnterior.Id_Rev;
        const clienteVentaId = idClienteVenta;
        if (clienteAnteriorId !== null && clienteVentaId !== null && Number(clienteAnteriorId) !== Number(clienteVentaId)) {
          throw createHttpError(400, `Detalle ${i + 1}: la licencia anterior no pertenece al mismo cliente/revendedor.`);
        }

        const productoNuevo = detalleCreado.Id_Prd;
        const productoAnterior = detalleAnterior.Id_Prd;
        if (productoNuevo && productoAnterior && Number(productoNuevo) !== Number(productoAnterior)) {
          throw createHttpError(400, `Detalle ${i + 1}: el producto a renovar (Id_Prd=${productoNuevo}) no coincide con la licencia anterior (Id_Prd=${productoAnterior}).`);
        }

        const precioOri = Number(detalleAnterior.Pre_Uni_Dve || 0);
        const precioNuevo = Number(detalleCreado.Pre_Uni_Dve || 0);
        const descuentoRen = Number(renovacionData.Des_Ren ?? 0);
        const precioFinal = Number((precioNuevo - descuentoRen).toFixed(2));

        const estadoRen = ventaCreada.Est_Ven === 'completada' ? 'completada' : 'pendiente';

        const payloadRenovacion = {
          Id_Dve_Ori: idDveOri,
          Id_Dve_Nue: detalleCreado.Id_Dve,
          Id_Cli: ventaCreada.Id_Cli || null,
          Id_Prd: detalleCreado.Id_Prd || null,
          Id_Var: detalleCreado.Id_Var || null,
          Fec_Ven_Ant_Ren: detalleAnterior.Fec_Fin_Dve || detalleAnterior.Fec_Ini_Dve,
          Fec_Ini_Nue_Ren: detalleCreado.Fec_Ini_Dve || null,
          Fec_Fin_Nue_Ren: detalleCreado.Fec_Fin_Dve || null,
          Pre_Ori_Ren: precioOri,
          Pre_Ren: precioFinal,
          Des_Ren: descuentoRen,
          Tip_Ren: renovacionData.Tip_Ren || 'manual',
          Est_Ren: estadoRen,
          Not_Ren: renovacionData.Not_Ren || null,
        };

        const renovacionCreada = await renovacionesRepository.createOne(payloadRenovacion, connection);
        renovacionesCreadas.push(renovacionCreada);

        await detalleVentasRepository.updateById(idDveOri, { Est_Dve: 'renovado' }, connection);
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
      renovaciones: renovacionesCreadas,
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
  createVentaEcommerce,
  updateVenta,
  deleteVenta,
  createVentaConDetallesYRenovaciones,
};
