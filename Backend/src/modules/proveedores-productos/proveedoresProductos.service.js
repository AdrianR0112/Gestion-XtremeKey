const proveedoresProductosRepository = require('./proveedoresProductos.repository');
const proveedoresRepository = require('../proveedores/proveedores.repository');
const productosRepository = require('../productos/productos.repository');
const variantesRepository = require('../variantes/variantes.repository');
const { validatePayload, isNumericId } = require('./proveedoresProductos.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function ensureProveedorExiste(idPro) {
  if (idPro === undefined) return;
  const proveedor = await proveedoresRepository.findById(idPro);
  if (!proveedor) {
    throw createHttpError(400, 'El proveedor indicado no existe.');
  }
}

async function ensureProductoExiste(idPrd) {
  if (idPrd === undefined) return;
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

async function ensureRelationDisponible({ idPro, idPrd, idVar }, currentId = null) {
  if (idPro === undefined) return;
  if (idPrd === undefined && idVar === undefined) return;

  const existing = await proveedoresProductosRepository.findByRelation(idPro, idPrd, idVar);
  if (existing && existing.Id_Pro_Prd !== currentId) {
    throw createHttpError(409, 'La relacion proveedor-producto ya existe.');
  }
}

async function listRelaciones() {
  return proveedoresProductosRepository.findAll();
}

async function getRelacionById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Pro_Prd invalido.');
  }

  const item = await proveedoresProductosRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Relacion proveedor-producto no encontrada.');
  }

  return item;
}

async function createRelacion(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureProveedorExiste(validation.payload.Id_Pro);
  await ensureProductoExiste(validation.payload.Id_Prd);
  await ensureVarianteExiste(validation.payload.Id_Var);
  await ensureRelationDisponible(validation.payload);

  if (validation.payload.Es_Pri_Pro_Prd === 1) {
    await proveedoresProductosRepository.clearPrimaryForRelation({
      idPrd: validation.payload.Id_Prd,
      idVar: validation.payload.Id_Var
    });
  }

  return proveedoresProductosRepository.createOne(validation.payload);
}

async function updateRelacion(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Pro_Prd invalido.');
  }

  const current = await proveedoresProductosRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Relacion proveedor-producto no encontrada.');
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

  const nextIdPro = validation.payload.Id_Pro ?? current.Id_Pro;
  const nextIdPrd = validation.payload.Id_Prd ?? current.Id_Prd;
  const nextIdVar = validation.payload.Id_Var ?? current.Id_Var;

  await ensureProveedorExiste(nextIdPro);
  await ensureProductoExiste(nextIdPrd);
  await ensureVarianteExiste(nextIdVar);
  await ensureRelationDisponible({ idPro: nextIdPro, idPrd: nextIdPrd, idVar: nextIdVar }, Number(id));

  if (validation.payload.Es_Pri_Pro_Prd === 1) {
    await proveedoresProductosRepository.clearPrimaryForRelation({
      idPrd: nextIdPrd,
      idVar: nextIdVar
    });
  }

  return proveedoresProductosRepository.updateById(Number(id), validation.payload);
}

async function deleteRelacion(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Pro_Prd invalido.');
  }

  const deleted = await proveedoresProductosRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Relacion proveedor-producto no encontrada.');
  }
}

module.exports = {
  listRelaciones,
  getRelacionById,
  createRelacion,
  updateRelacion,
  deleteRelacion
};
