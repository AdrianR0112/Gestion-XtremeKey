const cuentasRepository = require('./cuentas.repository');
const productosRepository = require('../productos/productos.repository');
const variantesRepository = require('../variantes/variantes.repository');
const proveedoresRepository = require('../proveedores/proveedores.repository');
const { validatePayload, isNumericId } = require('./cuentas.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
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

async function ensureProveedorExiste(idPro) {
  if (idPro === undefined || idPro === null) return;
  const proveedor = await proveedoresRepository.findById(idPro);
  if (!proveedor) {
    throw createHttpError(400, 'El proveedor indicado no existe.');
  }
}

function validateSeatRules(payload) {
  const total = payload.Tot_Per_Cue;
  const available = payload.Per_Dis_Cue;

  if (total !== undefined && available !== undefined && available > total) {
    throw createHttpError(400, 'Per_Dis_Cue no puede ser mayor que Tot_Per_Cue.');
  }
}

function validateDateRange(payload) {
  if (!payload.Fec_Com_Cue || !payload.Fec_Ven_Cue) return;

  const start = new Date(payload.Fec_Com_Cue);
  const end = new Date(payload.Fec_Ven_Cue);
  if (end < start) {
    throw createHttpError(400, 'Fec_Ven_Cue no puede ser menor que Fec_Com_Cue.');
  }
}

async function listCuentas() {
  return cuentasRepository.findAll();
}

async function getCuentaById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Cue invalido.');
  }

  const item = await cuentasRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Cuenta no encontrada.');
  }

  return item;
}

async function createCuenta(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  validateSeatRules(validation.payload);
  validateDateRange(validation.payload);
  await ensureProductoExiste(validation.payload.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var);
  await ensureProveedorExiste(validation.payload.Id_Pro);

  return cuentasRepository.createOne(validation.payload);
}

async function updateCuenta(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Cue invalido.');
  }

  const current = await cuentasRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Cuenta no encontrada.');
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

  validateSeatRules(merged);
  validateDateRange(merged);
  await ensureProductoExiste(validation.payload.Id_Prd ?? current.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var ?? current.Id_Var);
  await ensureProveedorExiste(validation.payload.Id_Pro ?? current.Id_Pro);

  return cuentasRepository.updateById(Number(id), validation.payload);
}

async function deleteCuenta(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Cue invalido.');
  }

  const deleted = await cuentasRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Cuenta no encontrada.');
  }
}

module.exports = {
  listCuentas,
  getCuentaById,
  createCuenta,
  updateCuenta,
  deleteCuenta
};
