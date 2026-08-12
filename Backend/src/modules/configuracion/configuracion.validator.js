const {
  allowedFields,
  requiredCreateFields,
  MAX_DIAS_GRACIA_RENOVACION,
  MAX_DIAS_ARCHIVO_VENCIDA
} = require('./configuracion.schemas');
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
  // Gracia al renovar suscripciones. 0 es valido: significa "nunca encadenar
  // desde un vencimiento ya pasado".
  Dia_Gra_Ren_Con: z.preprocess((value) => {
    if (value === undefined || value === null || value === '') return undefined;
    return Number(value);
  }, z
    .number(`Dia_Gra_Ren_Con must be an integer between 0 and ${MAX_DIAS_GRACIA_RENOVACION}`)
    .int(`Dia_Gra_Ren_Con must be an integer between 0 and ${MAX_DIAS_GRACIA_RENOVACION}`)
    .min(0, `Dia_Gra_Ren_Con must be an integer between 0 and ${MAX_DIAS_GRACIA_RENOVACION}`)
    .max(MAX_DIAS_GRACIA_RENOVACION, `Dia_Gra_Ren_Con must be an integer between 0 and ${MAX_DIAS_GRACIA_RENOVACION}`)
    .optional()),
  // Dias que una vencida sigue visible antes de archivarse. 0 = archivarla en
  // cuanto vence.
  Dia_Arc_Ven_Con: z.preprocess((value) => {
    if (value === undefined || value === null || value === '') return undefined;
    return Number(value);
  }, z
    .number(`Dia_Arc_Ven_Con must be an integer between 0 and ${MAX_DIAS_ARCHIVO_VENCIDA}`)
    .int(`Dia_Arc_Ven_Con must be an integer between 0 and ${MAX_DIAS_ARCHIVO_VENCIDA}`)
    .min(0, `Dia_Arc_Ven_Con must be an integer between 0 and ${MAX_DIAS_ARCHIVO_VENCIDA}`)
    .max(MAX_DIAS_ARCHIVO_VENCIDA, `Dia_Arc_Ven_Con must be an integer between 0 and ${MAX_DIAS_ARCHIVO_VENCIDA}`)
    .optional()),
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
