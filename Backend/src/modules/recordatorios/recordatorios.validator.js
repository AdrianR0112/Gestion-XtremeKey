const { z, validationResult } = require('../../utils/zod');
const { hitos } = require('./recordatorios.schemas');

const marcarSchema = z.object({
  milestone: z.enum(hitos),
  fechaObjetivo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'fechaObjetivo must use YYYY-MM-DD'),
  canal: z.literal('whatsapp').optional(),
  destino: z.string().trim().max(64).nullable().optional()
});

function validateMarcarPayload(payload = {}) {
  return validationResult(marcarSchema, payload);
}

module.exports = { validateMarcarPayload };
