const { z, validationResult, isNumericId, optionalTrimmedNullableString, optionalTinyIntBoolean } = require('../../utils/zod');
const { pickAllowed, normalizePositiveInteger } = require('../../utils/entityHelpers');
const { estados, allowedFields } = require('./resenias.schemas');

function getPayloadSchema(isUpdate) {
  return z.object({
    Id_Cli: z.any().optional(),
    Id_Prd: z.any().optional(),
    Id_Ord: z.any().optional(),
    Id_Item_Ord: z.any().optional(),
    Calificacion: z.any().optional(),
    Titulo_Res: z.any().optional(),
    Comentario_Res: z.any().optional(),
    Estado_Res: z.any().optional(),
    Votos_Utiles: z.any().optional(),
    Es_Compra_Verificada: optionalTinyIntBoolean,
  }).passthrough().superRefine((payload, ctx) => {
    if (!isUpdate) {
      for (const field of ['Id_Cli', 'Id_Prd', 'Id_Ord', 'Id_Item_Ord']) {
        if (!isNumericId(payload[field])) {
          ctx.addIssue({ code: 'custom', path: [field], message: `${field} is required and must be a positive integer` });
        }
      }
      if (!payload.Titulo_Res || String(payload.Titulo_Res).trim() === '') ctx.addIssue({ code: 'custom', path: ['Titulo_Res'], message: 'Titulo_Res is required' });
      if (!payload.Comentario_Res || String(payload.Comentario_Res).trim() === '') ctx.addIssue({ code: 'custom', path: ['Comentario_Res'], message: 'Comentario_Res is required' });
    }
  }).transform((payload) => {
    const errors = [];
    const clean = pickAllowed(payload, allowedFields);
    for (const field of ['Id_Cli', 'Id_Prd', 'Id_Ord', 'Id_Item_Ord']) {
      clean[field] = normalizePositiveInteger(clean[field], field, errors);
    }
    clean.Calificacion = normalizePositiveInteger(clean.Calificacion, 'Calificacion', errors, { min: 1 });
    clean.Votos_Utiles = normalizePositiveInteger(clean.Votos_Utiles, 'Votos_Utiles', errors, { min: 0 });
    if (clean.Titulo_Res !== undefined) {
      clean.Titulo_Res = String(clean.Titulo_Res).trim();
      if (clean.Titulo_Res === '') errors.push('Titulo_Res cannot be empty');
    }
    if (clean.Comentario_Res !== undefined) {
      clean.Comentario_Res = String(clean.Comentario_Res).trim();
      if (clean.Comentario_Res === '') errors.push('Comentario_Res cannot be empty');
    }
    if (clean.Calificacion !== undefined && clean.Calificacion > 5) {
      errors.push('Calificacion must be between 1 and 5');
    }
    if (clean.Estado_Res !== undefined && !estados.includes(clean.Estado_Res)) {
      errors.push('Estado_Res must be pendiente, aprobada or rechazada');
    }
    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }
    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
