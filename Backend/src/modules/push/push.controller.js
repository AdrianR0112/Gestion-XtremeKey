const pushService = require('./push.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const getVapidPublicKey = asyncHandler(async (_req, res) => {
  res.status(200).json(successResponse(pushService.getClavePublica(), 'Clave pública obtenida.'));
});

const subscribe = asyncHandler(async (req, res) => {
  const data = await pushService.registrarSuscripcion(req.body, {
    authUserId: req.user.authUserId,
    staffId: req.user.staff?.Id_Staff || null,
    userAgent: req.get('user-agent') || null
  });
  res.status(201).json(successResponse({ id: data.Id_Psh }, 'Dispositivo registrado correctamente.'));
});

const unsubscribe = asyncHandler(async (req, res) => {
  const data = await pushService.eliminarSuscripcion(req.body, req.user.authUserId);
  res.status(200).json(successResponse(data, 'Dispositivo eliminado correctamente.'));
});

const list = asyncHandler(async (req, res) => {
  const data = await pushService.listarSuscripciones(req.user.authUserId);
  res.status(200).json(successResponse(data, 'Dispositivos obtenidos correctamente.'));
});

const test = asyncHandler(async (req, res) => {
  const data = await pushService.enviarPrueba(req.user.authUserId);
  res.status(200).json(successResponse(data, 'Notificación de prueba procesada.'));
});

module.exports = { getVapidPublicKey, subscribe, unsubscribe, list, test };
