const { toEcuadorDateTime } = require('./dateHelper');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

function pickAllowed(payload = {}, allowedFields = []) {
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

  return toEcuadorDateTime(date);
}

function normalizePositiveInteger(value, fieldName, errors, { allowNull = false, min = 1 } = {}) {
  if (value === undefined) return undefined;

  if (value === null || value === '') {
    if (allowNull) return null;
    errors.push(`${fieldName} is required`);
    return value;
  }

  const numericValue = Number(value);
  if (!Number.isInteger(numericValue) || numericValue < min) {
    errors.push(`${fieldName} must be an integer greater or equal to ${min}`);
    return value;
  }

  return numericValue;
}

function normalizeDecimal(value, fieldName, errors, { allowNull = false, min = 0 } = {}) {
  if (value === undefined) return undefined;

  if (value === null || value === '') {
    if (allowNull) return null;
    errors.push(`${fieldName} is required`);
    return value;
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue) || numericValue < min) {
    errors.push(`${fieldName} must be a number greater or equal to ${min}`);
    return value;
  }

  return numericValue;
}

function normalizeJsonValue(value, fieldName, errors) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  if (typeof value === 'object') return value;

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      errors.push(`${fieldName} must be a valid JSON object`);
      return value;
    }
  }

  errors.push(`${fieldName} must be a valid JSON object`);
  return value;
}

function parseJsonField(value) {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

module.exports = {
  createHttpError,
  pickAllowed,
  normalizeDateTime,
  normalizePositiveInteger,
  normalizeDecimal,
  normalizeJsonValue,
  parseJsonField,
};
