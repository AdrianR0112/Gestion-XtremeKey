const renovacionesService = require('./renovaciones.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (_req, res) => {
  const data = await renovacionesService.listRenovaciones();
  res.status(200).json(successResponse(data, 'Renovaciones obtenidas correctamente.'));
});

module.exports = { list };
