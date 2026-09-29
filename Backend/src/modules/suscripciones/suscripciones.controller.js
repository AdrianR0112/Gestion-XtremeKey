const suscripcionesService = require('./suscripciones.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const data = await suscripcionesService.listSuscripciones(req.query);
  res.status(200).json(successResponse(data, 'Suscripciones obtenidas correctamente.'));
});

const resumen = asyncHandler(async (req, res) => {
  const data = await suscripcionesService.getResumenSuscripciones(req.query);
  res.status(200).json(successResponse(data, 'Resumen de suscripciones obtenido correctamente.'));
});

const listByCliente = asyncHandler(async (req, res) => {
  const { clienteId } = req.query;
  if (!clienteId) {
    return res.status(400).json({ ok: false, message: 'clienteId query param is required.' });
  }

  const data = await suscripcionesService.listSuscripcionesByCliente(clienteId);
  res.status(200).json(successResponse(data, 'Suscripciones del cliente obtenidas correctamente.'));
});

const listByRevendedor = asyncHandler(async (req, res) => {
  const { revendedorId } = req.query;
  if (!revendedorId) {
    return res.status(400).json({ ok: false, message: 'revendedorId query param is required.' });
  }

  const data = await suscripcionesService.listSuscripcionesByRevendedor(revendedorId);
  res.status(200).json(successResponse(data, 'Suscripciones del revendedor obtenidas correctamente.'));
});

const listMine = asyncHandler(async (req, res) => {
  const idCli = req.user?.Id_Cli;
  if (!idCli) {
    return res.status(200).json(successResponse([], 'Sin suscripciones asociadas al usuario.'));
  }
  const data = await suscripcionesService.listSuscripcionesByCliente(idCli);
  res.status(200).json(successResponse(data, 'Suscripciones del cliente obtenidas correctamente.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await suscripcionesService.getSuscripcionById(req.params.id);
  res.status(200).json(successResponse(data, 'Suscripcion obtenida correctamente.'));
});

const historial = asyncHandler(async (req, res) => {
  const data = await suscripcionesService.getHistorialSuscripcion(req.params.id);
  res.status(200).json(successResponse(data, 'Historial de la suscripcion obtenido correctamente.'));
});

const mensajeWhatsapp = asyncHandler(async (req, res) => {
  const data = await suscripcionesService.getMensajeWhatsapp(req.params.id);
  res.status(200).json(successResponse(data, 'Mensaje de WhatsApp generado correctamente.'));
});

const renovar = asyncHandler(async (req, res) => {
  const data = await suscripcionesService.renovarSuscripcion(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Suscripcion renovada correctamente.'));
});

const renovarLote = asyncHandler(async (req, res) => {
  const data = await suscripcionesService.renovarSuscripcionesEnLote(req.body);
  // Responde 200 aunque haya fallos parciales para que el cliente pueda mostrar
  // el reporte en vez de tratar todo el lote como un error.
  const mensaje = data.fallos > 0
    ? `Renovacion en lote procesada: ${data.exitos} correctas, ${data.fallos} con error.`
    : `Renovacion en lote procesada: ${data.exitos} correctas.`;
  res.status(200).json(successResponse(data, mensaje));
});

const create = asyncHandler(async (req, res) => {
  const data = await suscripcionesService.createSuscripcion(req.body);
  res.status(201).json(successResponse(data, 'Suscripcion creada correctamente.'));
});

const update = asyncHandler(async (req, res) => {
  const data = await suscripcionesService.updateSuscripcion(req.params.id, req.body);
  res.status(200).json(successResponse(data, 'Suscripcion actualizada correctamente.'));
});

const remove = asyncHandler(async (req, res) => {
  await suscripcionesService.deleteSuscripcion(req.params.id);
  res.status(200).json(successResponse(null, 'Suscripcion eliminada correctamente.'));
});

module.exports = {
  list,
  resumen,
  listByCliente,
  listByRevendedor,
  listMine,
  getById,
  historial,
  mensajeWhatsapp,
  renovar,
  renovarLote,
  create,
  update,
  remove,
};
