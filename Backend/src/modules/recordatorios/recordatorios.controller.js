const recordatoriosService = require('./recordatorios.service');
const { validateMarcarPayload } = require('./recordatorios.validator');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const vencimientos = asyncHandler(async (req, res) => {
  const raw = req.query.milestones || req.query.milestone;
  const milestones = raw ? String(raw).split(',').map((value) => value.trim()) : [5, 1, 0];
  const data = await recordatoriosService.listarPorVencer(milestones);
  res.status(200).json(successResponse(data, 'Vencimientos consultados correctamente.'));
});

const vencidasAyer = asyncHandler(async (_req, res) => {
  const data = await recordatoriosService.listarVencidasAyer();
  res.status(200).json(successResponse(data, 'Vencimientos de ayer consultados correctamente.'));
});

function validated(body) {
  const result = validateMarcarPayload(body);
  if (result.isValid) return result.payload;
  const error = new Error('Payload de recordatorio inválido.');
  error.statusCode = 400;
  error.errors = result.errors;
  throw error;
}

const marcarEnviado = asyncHandler(async (req, res) => {
  const data = await recordatoriosService.marcarRecordatorioEnviado(req.params.idSus, {
    ...validated(req.body), authUserId: req.user.authUserId
  });
  res.status(200).json(successResponse(data, 'Recordatorio marcado como enviado.'));
});

const desmarcarEnviado = asyncHandler(async (req, res) => {
  const data = await recordatoriosService.desmarcarRecordatorioEnviado(req.params.idSus, {
    ...validated(req.query), authUserId: req.user.authUserId
  });
  res.status(200).json(successResponse(data, 'Marca de envío eliminada.'));
});

module.exports = { vencimientos, vencidasAyer, marcarEnviado, desmarcarEnviado };
