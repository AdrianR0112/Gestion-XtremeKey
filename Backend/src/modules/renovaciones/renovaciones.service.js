const renovacionesRepository = require('./renovaciones.repository');
const detalleVentasRepository = require('../detalle-ventas/detalleVentas.repository');
const clientesRepository = require('../clientes/clientes.repository');
const productosRepository = require('../productos/productos.repository');
const variantesRepository = require('../variantes/variantes.repository');
const { validatePayload, isNumericId } = require('./renovaciones.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function ensureDetalleVentaExiste(idDve) {
  if (idDve === undefined || idDve === null) return;
  const detalleVenta = await detalleVentasRepository.findById(idDve);
  if (!detalleVenta) {
    throw createHttpError(400, 'El detalle de venta indicado no existe.');
  }
}

async function ensureClienteExiste(idCli) {
  if (idCli === undefined || idCli === null) return;
  const cliente = await clientesRepository.findById(idCli);
  if (!cliente) {
    throw createHttpError(400, 'El cliente indicado no existe.');
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

async function listRenovaciones() {
  return renovacionesRepository.findAll();
}

async function getRenovacionById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Ren invalido.');
  }

  const item = await renovacionesRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Renovacion no encontrada.');
  }

  return item;
}

async function createRenovacion(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureDetalleVentaExiste(validation.payload.Id_Dve_Ori);
  await ensureDetalleVentaExiste(validation.payload.Id_Dve_Nue);
  await ensureClienteExiste(validation.payload.Id_Cli);
  await ensureProductoExiste(validation.payload.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var);

  return renovacionesRepository.createOne(validation.payload);
}

async function updateRenovacion(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Ren invalido.');
  }

  const current = await renovacionesRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Renovacion no encontrada.');
  }

  const validation = validatePayload(payload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  const merged = {
    ...current,
    ...validation.payload
  };

  const mergedValidation = validatePayload(merged);
  if (!mergedValidation.isValid) {
    throw createHttpError(400, 'Payload invalido.', mergedValidation.errors);
  }

  await ensureDetalleVentaExiste(validation.payload.Id_Dve_Ori ?? current.Id_Dve_Ori);
  await ensureDetalleVentaExiste(validation.payload.Id_Dve_Nue ?? current.Id_Dve_Nue);
  await ensureClienteExiste(validation.payload.Id_Cli ?? current.Id_Cli);
  await ensureProductoExiste(validation.payload.Id_Prd ?? current.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var ?? current.Id_Var);

  return renovacionesRepository.updateById(Number(id), validation.payload);
}

async function deleteRenovacion(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Ren invalido.');
  }

  const deleted = await renovacionesRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Renovacion no encontrada.');
  }
}

module.exports = {
  listRenovaciones,
  getRenovacionById,
  createRenovacion,
  updateRenovacion,
  deleteRenovacion
};
