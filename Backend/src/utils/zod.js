const { z } = require("zod");

function formatZodErrors(error) {
  return error.issues.map((issue) => issue.message);
}

function validationResult(schema, payload) {
  const result = schema.safeParse(payload);

  if (!result.success) {
    return {
      isValid: false,
      errors: formatZodErrors(result.error),
      payload: {},
    };
  }

  return {
    isValid: true,
    errors: [],
    payload: result.data,
  };
}

function isNumericId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0;
}

const optionalTrimmedNullableString = z.preprocess((value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}, z.string().nullable().optional());

const optionalTinyIntBoolean = z.preprocess((value) => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return 0;
  if (typeof value === "boolean") return value ? 1 : 0;
  return Number(value) === 1 ? 1 : 0;
}, z.union([z.literal(0), z.literal(1)]).optional());

module.exports = {
  z,
  validationResult,
  isNumericId,
  optionalTrimmedNullableString,
  optionalTinyIntBoolean,
};
