const { allowedFields, requiredCreateFields } = require('./configuracion.schemas');
const { z, validationResult, isNumericId } = require('../../utils/zod');

const configuracionPayloadSchema = z.object({
  Nom_Emp_Con: z.any().optional(),
  Ema_Con: z.string().email('Ema_Con must be a valid email').optional().or(z.literal('')).or(z.null()),
  Imp_Con: z.preprocess((value) => {
    if (value === undefined) return undefined;
    return Number(value);
  }, z.number().min(0, 'Imp_Con must be a number between 0 and 100').max(100, 'Imp_Con must be a number between 0 and 100').optional()),
  Hab_Imp_Con: z.preprocess((value) => {
    if (value === undefined) return undefined;
    if (typeof value === 'boolean') return value;
    if (value === 1 || value === '1') return true;
    if (value === 0 || value === '0') return false;
    return value;
  }, z.boolean('Hab_Imp_Con must be a boolean value').optional()),
  Log_Con: z.preprocess((value) => {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;
    return String(value).trim() || null;
  }, z.string().nullable().optional()),
}).passthrough().transform((payload) => {
  const clean = {};
  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      clean[key] = payload[key];
    }
  }
  return clean;
});

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  if (!isUpdate) {
    const errors = [];
    for (const field of requiredCreateFields) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        errors.push(`${field} is required`);
      }
    }
    if (errors.length > 0) {
      return { isValid: false, errors, payload: {} };
    }
  }

  const result = validationResult(configuracionPayloadSchema, payload);
  if (result.isValid && result.payload.Nom_Emp_Con !== undefined && String(result.payload.Nom_Emp_Con).trim() === '') {
    return { isValid: false, errors: ['Nom_Emp_Con cannot be empty'], payload: {} };
  }
  return result;
}

module.exports = { validatePayload, isNumericId };
