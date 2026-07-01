const fs = require('node:fs/promises');
const path = require('node:path');
const productosRepository = require('./productos.repository');
const categoriasRepository = require('../categorias/categorias.repository');
const { validatePayload, isNumericId } = require('./productos.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

const backendRootPath = path.join(__dirname, '../../../');
const localProductUploadsPrefix = '/uploads/productos/';

function getLocalImagePath(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith(localProductUploadsPrefix)) {
    return null;
  }

  const relativePath = imageUrl.replace(/^\//, '').split('/').join(path.sep);
  return path.join(backendRootPath, relativePath);
}

async function deleteLocalImage(imageUrl) {
  const filePath = getLocalImagePath(imageUrl);
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('No se pudo eliminar la imagen local del producto:', error);
    }
  }
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

async function ensureSlugDisponible(slug, currentId = null) {
  if (!slug) return;
  const existing = await productosRepository.findBySlug(slug);
  if (existing && existing.Id_Prd !== currentId) {
    throw createHttpError(409, 'El slug del producto ya existe.');
  }
}

async function listProductos() {
  return productosRepository.findAll();
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

  try {
    if (!validation.isValid) {
      throw createHttpError(400, 'Payload invalido.', validation.errors);
    }

    await ensureCategoriaExists(validation.payload.Id_Cat);
    await ensureCodigoDisponible(validation.payload.Cod_Prd);
    await ensureSlugDisponible(validation.payload.Slug_Prd);

    return await productosRepository.createOne(validation.payload);
  } catch (error) {
    await deleteLocalImage(payload?.Ima_Prd);
    throw error;
  }
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

  try {
    if (!validation.isValid) {
      throw createHttpError(400, 'Payload invalido.', validation.errors);
    }

    await ensureCategoriaExists(validation.payload.Id_Cat);
    await ensureCodigoDisponible(validation.payload.Cod_Prd, Number(id));
    await ensureSlugDisponible(validation.payload.Slug_Prd, Number(id));

    const updated = await productosRepository.updateById(Number(id), validation.payload);

    if (validation.payload.Ima_Prd !== undefined && current.Ima_Prd && current.Ima_Prd !== updated.Ima_Prd) {
      await deleteLocalImage(current.Ima_Prd);
    }

    return updated;
  } catch (error) {
    if (payload?.Ima_Prd && payload.Ima_Prd !== current.Ima_Prd) {
      await deleteLocalImage(payload.Ima_Prd);
    }
    throw error;
  }
}

async function deleteProductoImage(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Prd invalido.');
  }

  const current = await productosRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Producto no encontrado.');
  }

  if (!current.Ima_Prd) {
    return current;
  }

  const updated = await productosRepository.updateById(Number(id), { Ima_Prd: null });
  await deleteLocalImage(current.Ima_Prd);
  return updated;
}

async function deleteProducto(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Prd invalido.');
  }

  const current = await productosRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Producto no encontrado.');
  }

  const deleted = await productosRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Producto no encontrado.');
  }

  await deleteLocalImage(current.Ima_Prd);
}

module.exports = {
  listProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProductoImage,
  deleteProducto
};
