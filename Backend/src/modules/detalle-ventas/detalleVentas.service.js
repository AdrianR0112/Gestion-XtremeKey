const detalleVentasRepository = require('./detalleVentas.repository');
const ventasRepository = require('../ventas/ventas.repository');
const productosRepository = require('../productos/productos.repository');
const variantesRepository = require('../variantes/variantes.repository');
const cuentasRepository = require('../cuentas/cuentas.repository');
const keysRepository = require('../keys/keys.repository');
const suscripcionesService = require('../suscripciones/suscripciones.service');
const { validatePayload, isNumericId } = require('./detalleVentas.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function ensureVentaExiste(idVen) {
  if (idVen === undefined || idVen === null) return null;
  const venta = await ventasRepository.findById(idVen);
  if (!venta) {
    throw createHttpError(400, 'La venta indicada no existe.');
  }
  return venta;
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

async function ensureCuentaExiste(idCue) {
  if (idCue === undefined || idCue === null) return;
  const cuenta = await cuentasRepository.findById(idCue);
  if (!cuenta) {
    throw createHttpError(400, 'La cuenta indicada no existe.');
  }
}

async function ensureKeyExiste(idKey) {
  if (idKey === undefined || idKey === null) return;
  const key = await keysRepository.findById(idKey);
  if (!key) {
    throw createHttpError(400, 'La key indicada no existe.');
  }
}

async function listDetalleVentas() {
  return detalleVentasRepository.findAll();
}

async function getDetalleVentaById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Dve invalido.');
  }

  const item = await detalleVentasRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Detalle de venta no encontrado.');
  }

  return item;
}

async function createDetalleVenta(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  const venta = await ensureVentaExiste(validation.payload.Id_Ven);
  if (validation.payload.Id_Dve_Ant !== undefined && validation.payload.Id_Dve_Ant !== null) {
    throw createHttpError(400, 'Las renovaciones deben registrarse mediante POST /ventas/con-detalles.');
  }
  await ensureProductoExiste(validation.payload.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var);
  await ensureCuentaExiste(validation.payload.Id_Cue);
  await ensureKeyExiste(validation.payload.Id_Key);

  const detalle = await detalleVentasRepository.createOne(validation.payload);

  // Si la linea corresponde a un producto de tipo suscripcion, registra la
  // suscripcion del cliente y enlaza Id_Sus de vuelta al detalle.
  await registrarSuscripcionSiAplica(detalle, venta);

  return detalleVentasRepository.findById(detalle.Id_Dve);
}

/**
 * Crea una suscripcion a partir de un detalle recien insertado cuando el producto
 * es de tipo 'suscripcion', y enlaza el Id_Sus resultante al detalle.
 * Requiere la venta para resolver el titular, que puede ser el cliente final
 * (Id_Cli) o el revendedor (Id_Rev). No-op si la venta no tiene ninguno de los
 * dos o si el producto no es una suscripcion.
 */
async function registrarSuscripcionSiAplica(detalle, venta, connection) {
  if (!detalle || !venta) return null;

  const clienteRef = venta.Id_Cli || null;
  const revendedorRef = clienteRef ? null : venta.Id_Rev || null;
  if (!clienteRef && !revendedorRef) {
    return null;
  }

  // El validador de detalle iguala Fec_Fin_Dve a Fec_Ini_Dve cuando se deja vacio.
  // En ese caso preferimos calcular el fin por la duracion de la variante en vez
  // de crear una suscripcion de duracion cero; solo respetamos un fin explicito
  // que sea realmente posterior al inicio.
  const finExplicito =
    detalle.Fec_Fin_Dve && detalle.Fec_Ini_Dve && new Date(detalle.Fec_Fin_Dve) > new Date(detalle.Fec_Ini_Dve)
      ? detalle.Fec_Fin_Dve
      : null;

  const suscripcion = await suscripcionesService.crearSuscripcionDesdeLinea(
    {
      clienteRef,
      revendedorRef,
      idProducto: detalle.Id_Prd,
      idVariante: detalle.Id_Var ?? null,
      fechaInicio: detalle.Fec_Ini_Dve,
      fechaFin: finExplicito,
      // Correo donde se activo el servicio. Para una venta a revendedor es el
      // de SU cliente final, y es lo que identifica la suscripcion.
      correoCuenta: detalle.Cor_Cue ?? null,
    },
    connection
  );

  if (suscripcion) {
    await detalleVentasRepository.updateById(detalle.Id_Dve, { Id_Sus: suscripcion.Id_Sus }, connection);
  }

  return suscripcion;
}

async function updateDetalleVenta(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Dve invalido.');
  }

  const current = await detalleVentasRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Detalle de venta no encontrado.');
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'Id_Dve_Ant')) {
    throw createHttpError(400, 'Id_Dve_Ant no puede modificarse despues de crear el detalle.');
  }

  const validation = validatePayload(payload, { isUpdate: true });
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

  await ensureVentaExiste(validation.payload.Id_Ven ?? current.Id_Ven);
  await ensureProductoExiste(validation.payload.Id_Prd ?? current.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var ?? current.Id_Var);
  await ensureCuentaExiste(validation.payload.Id_Cue ?? current.Id_Cue);
  await ensureKeyExiste(validation.payload.Id_Key ?? current.Id_Key);

  return detalleVentasRepository.updateById(Number(id), validation.payload);
}

async function deleteDetalleVenta(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Dve invalido.');
  }

  const detalle = await detalleVentasRepository.findById(Number(id));
  if (!detalle) {
    throw createHttpError(404, 'Detalle de venta no encontrado.');
  }

  const siguiente = await detalleVentasRepository.findByAnteriorId(Number(id));
  if (siguiente) {
    throw createHttpError(409, 'No se puede eliminar un detalle que tiene una renovacion posterior.');
  }

  if (detalle.Id_Dve_Ant) {
    throw createHttpError(409, 'No se puede eliminar un detalle que forma parte de una cadena de renovaciones.');
  }

  const deleted = await detalleVentasRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Detalle de venta no encontrado.');
  }
}

async function listByCliente(clienteId) {
  const id = Number(clienteId);
  if (!Number.isInteger(id) || id <= 0) {
    throw createHttpError(400, 'clienteId invalido.');
  }
  return detalleVentasRepository.findByClienteId(id);
}

module.exports = {
  listDetalleVentas,
  getDetalleVentaById,
  createDetalleVenta,
  updateDetalleVenta,
  deleteDetalleVenta,
  listByCliente,
  registrarSuscripcionSiAplica,
};
