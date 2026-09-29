const { Router } = require('express');
const { cronTokenMiddleware } = require('../middlewares/cronToken.middleware');
const { asyncHandler } = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const { runRecordatoriosPushJob } = require('../jobs/recordatoriosPush.job');
const { runExpirarSuscripcionesJob } = require('../jobs/suscripcionesExpiracion.job');
const { runVencimientosJob } = require('../jobs/vencimientos.job');

const router = Router();
router.use(cronTokenMiddleware);

router.post('/recordatorios-push', asyncHandler(async (req, res) => {
  const data = await runRecordatoriosPushJob({ dryRun: req.body?.dryRun, force: req.body?.force });
  res.status(200).json(successResponse(data, 'Job de recordatorios push ejecutado.'));
}));

router.post('/suscripciones-expiracion', asyncHandler(async (req, res) => {
  const data = await runExpirarSuscripcionesJob({ dryRun: req.body?.dryRun });
  res.status(200).json(successResponse(data, 'Job de expiración ejecutado.'));
}));

router.post('/vencimientos-email', asyncHandler(async (req, res) => {
  const data = await runVencimientosJob(req.body || {});
  res.status(200).json(successResponse(data, 'Job de vencimientos por correo ejecutado.'));
}));

module.exports = { router };
