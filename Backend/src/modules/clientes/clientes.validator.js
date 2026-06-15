const {
  categorias,
  preferenciasContacto,
  estados,
  allowedFields
} = require('./clientes.schemas');

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function isNumericId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0;
}

function pickAllowed(payload = {}) {
  const clean = {};
  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      clean[key] = payload[key];
    }
  }
  return clean;
}

function normalizeOptionalString(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed === '' ? null : trimmed;
}

function normalizeBoolToTinyInt(value) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return 0;
  if (typeof value === 'boolean') return value ? 1 : 0;
  const num = Number(value);
  return num === 1 ? 1 : 0;
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  const errors = [];
  const clean = pickAllowed(payload);

  if (!isUpdate) {
    if (!clean.Tel_Cli || String(clean.Tel_Cli).trim() === '') {
      errors.push('Tel_Cli is required');
    }
  }

  if (clean.Ema_Cli !== undefined) {
    const email = normalizeOptionalString(clean.Ema_Cli);
    if (email !== null && !isEmail(email)) {
      errors.push('Ema_Cli must be a valid email');
    }
    clean.Ema_Cli = email;
  }

  clean.Doc_Cli = normalizeOptionalString(clean.Doc_Cli);
  clean.Not_Cli = normalizeOptionalString(clean.Not_Cli);

  if (clean.Pai_Cli !== undefined) {
    const pais = normalizeOptionalString(clean.Pai_Cli);
    clean.Pai_Cli = pais || 'Ecuador';
  }

  if (clean.Cat_Cli !== undefined && !categorias.includes(clean.Cat_Cli)) {
    errors.push('Cat_Cli must be nuevo, ocasional, frecuente or vip');
  }

  if (clean.Pre_Con_Cli !== undefined && !preferenciasContacto.includes(clean.Pre_Con_Cli)) {
    errors.push('Pre_Con_Cli must be whatsapp, email, instagram, messenger or telegram');
  }

  if (clean.Est_Cli !== undefined && !estados.includes(clean.Est_Cli)) {
    errors.push('Est_Cli must be activo, inactivo or suspendido');
  }

  if (clean.Ace_Not_Tel_Cli !== undefined) {
    clean.Ace_Not_Tel_Cli = normalizeBoolToTinyInt(clean.Ace_Not_Tel_Cli);
  }

  if (clean.Ace_Not_Cor_Cli !== undefined) {
    clean.Ace_Not_Cor_Cli = normalizeBoolToTinyInt(clean.Ace_Not_Cor_Cli);
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId };
