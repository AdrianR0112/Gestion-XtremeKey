const {
  categorias,
  preferenciasContacto,
  estados,
  allowedFields
} = require('./clientes.schemas');
const {
  z,
  validationResult,
  isNumericId,
  optionalTrimmedNullableString,
  optionalTinyIntBoolean,
} = require('../../utils/zod');

function pickAllowed(payload = {}) {
  const clean = {};
  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      clean[key] = payload[key];
    }
  }
  return clean;
}

function getClientePayloadSchema(isUpdate) {
  return z.object({
    Nom_Cli: optionalTrimmedNullableString,
    Ape_Cli: optionalTrimmedNullableString,
    Tel_Cli: isUpdate ? z.any().optional() : z.string().trim().min(1, 'Tel_Cli is required'),
    Ema_Cli: optionalTrimmedNullableString.refine((value) => value === undefined || value === null || z.string().email().safeParse(value).success, {
      message: 'Ema_Cli must be a valid email',
    }),
    Usu_Tel_Cli: optionalTrimmedNullableString,
    Doc_Cli: optionalTrimmedNullableString,
    Dir_Cli: optionalTrimmedNullableString,
    Tip_Cli: optionalTrimmedNullableString,
    Not_Cli: optionalTrimmedNullableString,
    Pai_Cli: optionalTrimmedNullableString.transform((value) => (value === undefined ? undefined : value || 'Ecuador')),
    Cat_Cli: z.enum(categorias).optional().refine((value) => value === undefined || categorias.includes(value), { message: 'Cat_Cli must be nuevo, ocasional, frecuente or vip' }),
    Pre_Con_Cli: z.enum(preferenciasContacto).optional().refine((value) => value === undefined || preferenciasContacto.includes(value), { message: 'Pre_Con_Cli must be whatsapp, email, instagram, messenger or telegram' }),
    Est_Cli: z.enum(estados).optional().refine((value) => value === undefined || estados.includes(value), { message: 'Est_Cli must be activo, inactivo or suspendido' }),
    Ace_Not_Tel_Cli: optionalTinyIntBoolean,
    Ace_Not_Cor_Cli: optionalTinyIntBoolean,
  }).passthrough().transform((payload) => {
    const clean = pickAllowed(payload);
    if (clean.Ema_Cli) clean.Ema_Cli = String(clean.Ema_Cli).trim();
    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getClientePayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
