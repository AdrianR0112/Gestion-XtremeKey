const productosService = require('./productos.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

function buildImageUrl(file) {
  if (!file?.filename) return undefined;
  return `/uploads/productos/${file.filename}`;
}

function buildProductoPayload(body = {}, file = null) {
  const shouldRemoveImage = String(body.Eliminar_Ima_Prd || '').toLowerCase() === 'true';
  const payload = { ...body };

  delete payload.Eliminar_Ima_Prd;

  if (file?.filename) {
    payload.Ima_Prd = buildImageUrl(file);
  } else if (shouldRemoveImage) {
    payload.Ima_Prd = null;
  }

  return payload;
}

const list = asyncHandler(async (_req, res) => {
  const data = await productosService.listProductos();
  res.status(200).json(successResponse(data, 'Productos obtenidos correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await productosService.getProductoById(req.params.id);
  res.status(200).json(successResponse(data, 'Producto obtenido correctamente.'));
});

const create = asyncHandler(async (req, res) => {
  const data = await productosService.createProducto(buildProductoPayload(req.body, req.file));
  res.status(201).json(successResponse(data, 'Producto creado correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await productosService.updateProducto(req.params.id, buildProductoPayload(req.body, req.file));
  res.status(200).json(successResponse(data, 'Producto actualizado correctamente.'));
});

const removeImage = asyncHandler(async (req, res) => {
  const data = await productosService.deleteProductoImage(req.params.id);
  res.status(200).json(successResponse(data, 'Imagen del producto eliminada correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await productosService.deleteProducto(req.params.id);
  res.status(200).json(successResponse(null, 'Producto eliminado correctamente.'));
});

module.exports = { list, getById, create, update, removeImage, remove };
