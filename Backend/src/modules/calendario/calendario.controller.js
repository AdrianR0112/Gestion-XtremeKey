const calendarioService = require('./calendario.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const data = await calendarioService.listCalendarEvents(req.query);
  res.status(200).json(successResponse(data, 'Calendario obtenido correctamente.'));
});

module.exports = { list };