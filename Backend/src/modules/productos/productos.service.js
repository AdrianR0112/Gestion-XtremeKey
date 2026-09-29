const productosRepository = require('./productos.repository');
const categoriasRepository = require('../categorias/categorias.repository');
const { validatePayload, isNumericId } = require('./productos.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function ensureCategoriaExists(idCat) {
  if (idCat === undefined || idCat === null) return;
  const categoria = await categoriasRepository.findById(idCat);
  if (!categoria) {
    throw createHttpError(400, 'La categoria indicada no existe.');
  }
}

async function ensureCodigoDisponible(code, currentId = null) {
  if (!code) return;
  const existing = await productosRepository.findByCode(code);
  if (existing && existing.Id_Prd !== currentId) {
    throw createHttpError(409, 'El codigo del producto ya existe.');
  }
}

async function listProductos() {
  return productosRepository.findAll();
}

async function listProductosVendibles() {
  const rows = await productosRepository.findVendibles();
  const productos = new Map();
  for (const row of rows) {
    const id = Number(row.Id_Prd);
    if (!productos.has(id)) {
      productos.set(id, {
        Id_Prd: row.Id_Prd,
        Nom_Prd: row.Nom_Prd,
        Tip_Prd: row.Tip_Prd,
        variantes: [],
      });
    }
    productos.get(id).variantes.push({
      Id_Var: row.Id_Var,
      Nom_Var: row.Nom_Var,
      Pre_Ven_Var: row.Pre_Ven_Var,
      Pre_Rev_Var: row.Pre_Rev_Var,
      Dur_Tip_Var: row.Dur_Tip_Var,
      Dur_Val_Var: row.Dur_Val_Var,
    });
  }
  return [...productos.values()];
}

async function getProductoById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Prd invalido.');
  }

  const item = await productosRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Producto no encontrado.');
  }

  return item;
}

async function createProducto(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureCategoriaExists(validation.payload.Id_Cat);
  await ensureCodigoDisponible(validation.payload.Cod_Prd);

  return productosRepository.createOne(validation.payload);
}

async function updateProducto(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Prd invalido.');
  }

  const current = await productosRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Producto no encontrado.');
  }

  const validation = validatePayload(payload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureCategoriaExists(validation.payload.Id_Cat);
  await ensureCodigoDisponible(validation.payload.Cod_Prd, Number(id));

  return productosRepository.updateById(Number(id), validation.payload);
}

async function deleteProducto(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Prd invalido.');
  }

  const deleted = await productosRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Producto no encontrado.');
  }
}

module.exports = {
  listProductos,
  listProductosVendibles,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
};
