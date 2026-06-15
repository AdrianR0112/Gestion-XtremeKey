const dashboardService = require('./dashboard.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const getResumen = asyncHandler(async (_req, res) => {
  const data = await dashboardService.getResumen();
  res.status(200).json(successResponse(data, 'Dashboard resumen obtenido correctamente.'));
});

module.exports = { getResumen };
