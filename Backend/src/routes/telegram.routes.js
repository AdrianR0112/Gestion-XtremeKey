const { Router } = require('express');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
const { asyncHandler } = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const { runNotificacionesSuscripcionJob } = require('../jobs/suscripcionesTelegram.job');
const telegramService = require('../modules/telegram/telegram.service');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.post('/notificar/run', asyncHandler(async (req, res) => {
  const summary = await runNotificacionesSuscripcionJob({
    dryRun: req.body?.dryRun,
    milestone: req.body?.milestone,
    forceResend: req.body?.forceResend
  });
  res.status(200).json(successResponse(summary, 'Job de notificaciones Telegram ejecutado correctamente.'));
}));

router.get('/vencimientos', asyncHandler(async (req, res) => {
  const rawMilestones = req.query.milestones || req.query.milestone;
  const milestones = rawMilestones
    ? String(rawMilestones).split(',').map((value) => value.trim())
    : [5, 1, 0];
  const result = await telegramService.listarPorVencer(milestones);
  res.status(200).json(successResponse(result, 'Vencimientos consultados correctamente.'));
}));

module.exports = { router };
