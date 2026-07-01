const {
  tiposProveedor,
  mediosContacto,
  estados,
  allowedFields
} = require('./proveedores.schemas');
const { z, validationResult, isNumericId, optionalTrimmedNullableString } = require('../../utils/zod');

function pickAllowed(payload = {}) {
  const clean = {};
  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      clean[key] = payload[key];
    }
  }
  return clean;
}

function getProveedorPayloadSchema(isUpdate) {
  return z.object({
    Nom_Pro: isUpdate ? z.any().optional() : z.string().trim().min(1, 'Nom_Pro is required'),
    Ema_Pro: optionalTrimmedNullableString.refine((value) => value === undefined || value === null || z.string().email().safeParse(value).success, {
      message: 'Ema_Pro must be a valid email',
    }),
    Con_Pri_Pro: optionalTrimmedNullableString,
    Tel_Pro: optionalTrimmedNullableString,
    Wha_Pro: optionalTrimmedNullableString,
    Tel_Gram_Pro: optionalTrimmedNullableString,
    Web_Pro: optionalTrimmedNullableString,
    Pai_Pro: optionalTrimmedNullableString,
    Con_Com_Pro: optionalTrimmedNullableString,
    Not_Pro: optionalTrimmedNullableString,
    Tip_Pro: z.enum(tiposProveedor).optional().refine((value) => value === undefined || tiposProveedor.includes(value), { message: 'Tip_Pro must be persona, empresa, plataforma, tienda_web or otro' }),
    Med_Con_Pro: z.enum(mediosContacto).optional().refine((value) => value === undefined || mediosContacto.includes(value), { message: 'Med_Con_Pro must be whatsapp, telegram, web, email or telefono' }),
    Est_Pro: z.enum(estados).optional().refine((value) => value === undefined || estados.includes(value), { message: 'Est_Pro must be activo, inactivo or suspendido' }),
    Cal_Pro: z.preprocess((value) => {
      if (value === undefined) return undefined;
      return Number(value);
    }, z.number().int().min(1, 'Cal_Pro must be an integer between 1 and 5').max(5, 'Cal_Pro must be an integer between 1 and 5').optional()),
  }).passthrough().transform((payload) => pickAllowed(payload));
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getProveedorPayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
