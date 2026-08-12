const { Router } = require('express');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
const { asyncHandler } = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const { runVencimientosJob } = require('../jobs/vencimientos.job');
const { runExpirarSuscripcionesJob } = require('../jobs/suscripcionesExpiracion.job');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.post('/vencimientos-email/run', asyncHandler(async (req, res) => {
  const summary = await runVencimientosJob({
    dryRun: req.body?.dryRun,
    type: req.body?.type,
    clientId: req.body?.clientId,
    detalleId: req.body?.detalleId,
    forceResend: req.body?.forceResend
  });

  res.status(200).json(successResponse(summary, 'Job de recordatorios ejecutado correctamente.'));
}));

router.post('/suscripciones-expiracion/run', asyncHandler(async (req, res) => {
  const summary = await runExpirarSuscripcionesJob({ dryRun: req.body?.dryRun });

  res.status(200).json(successResponse(summary, 'Job de expiracion de suscripciones ejecutado correctamente.'));
}));

module.exports = { router };
