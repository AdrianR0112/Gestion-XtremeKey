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

function normalizeDateTime(value, fieldName, errors) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    errors.push(`${fieldName} must be a valid datetime`);
    return value;
  }

  return date.toISOString().slice(0, 19).replace('T', ' ');
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
    Not_Cli: optionalTrimmedNullableString,
    Password_Hash: optionalTrimmedNullableString,
    Token_Verificacion: optionalTrimmedNullableString,
    Fec_Ultimo_Acceso: z.any().optional(),
    Pai_Cli: optionalTrimmedNullableString.transform((value) => (value === undefined ? undefined : value || 'Ecuador')),
    Cat_Cli: z.enum(categorias).optional().refine((value) => value === undefined || categorias.includes(value), { message: 'Cat_Cli must be nuevo, ocasional, frecuente or vip' }),
    Pre_Con_Cli: z.enum(preferenciasContacto).optional().refine((value) => value === undefined || preferenciasContacto.includes(value), { message: 'Pre_Con_Cli must be whatsapp, email, instagram, messenger or telegram' }),
    Est_Cli: z.enum(estados).optional().refine((value) => value === undefined || estados.includes(value), { message: 'Est_Cli must be activo, inactivo or suspendido' }),
    Ace_Not_Tel_Cli: optionalTinyIntBoolean,
    Ace_Not_Cor_Cli: optionalTinyIntBoolean,
    Email_Verificado: optionalTinyIntBoolean,
  }).passthrough().transform((payload) => {
    const clean = pickAllowed(payload);
    const errors = [];
    if (clean.Ema_Cli) clean.Ema_Cli = String(clean.Ema_Cli).trim();

    clean.Fec_Ultimo_Acceso = normalizeDateTime(clean.Fec_Ultimo_Acceso, 'Fec_Ultimo_Acceso', errors);

    if (errors.length > 0) {
      throw new z.ZodError(errors.map((message) => ({ code: 'custom', path: [], message })));
    }

    return clean;
  });
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  return validationResult(getClientePayloadSchema(isUpdate), payload);
}

module.exports = { validatePayload, isNumericId };
