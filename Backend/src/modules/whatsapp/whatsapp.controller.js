const whatsappService = require('./whatsapp.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const contexto = asyncHandler(async (req, res) => {
  const data = await whatsappService.getContexto(req.query);
  res.status(200).json(successResponse(data, data.encontrado ? 'Contexto de WhatsApp obtenido correctamente.' : 'El teléfono todavía no está registrado.'));
});

module.exports = { contexto };
