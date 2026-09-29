const { Router } = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
const { asyncHandler } = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const recordatoriosController = require('../modules/recordatorios/recordatorios.controller');
const { runRecordatoriosPushJob } = require('../jobs/recordatoriosPush.job');

const router = Router();
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/vencimientos', recordatoriosController.vencimientos);
router.get('/vencidas-ayer', recordatoriosController.vencidasAyer);
router.post('/:idSus/marcar-enviado', recordatoriosController.marcarEnviado);
router.delete('/:idSus/marcar-enviado', recordatoriosController.desmarcarEnviado);
router.post('/push/run', asyncHandler(async (req, res) => {
  const data = await runRecordatoriosPushJob({
    dryRun: req.body?.dryRun,
    force: req.body?.force ?? true
  });
  res.status(200).json(successResponse(data, 'Job de recordatorios push ejecutado.'));
}));

module.exports = { router };
