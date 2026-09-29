import { z } from "zod";

export function fieldErrorsFromResult(result) {
  if (result.success) return {};

  const errors = {};

  for (const issue of result.error.issues) {
    const key = issue.path[0] || "form";
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }

  return errors;
}

export function firstErrorFromResult(result) {
  if (result.success) return "";
  return result.error.issues[0]?.message || "Datos inválidos";
}

export function toOptionalTrimmedString(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

export const optionalEmailString = z
  .string()
  .trim()
  .refine((value) => value === "" || z.email().safeParse(value).success, {
    message: "Correo invalido",
  });

export function toPositiveIntegerString(message) {
  return z
    .union([z.string(), z.number()])
    .refine((value) => Number.isInteger(Number(value)) && Number(value) > 0, { message });
}

export function toNonNegativeNumberString(requiredMessage, invalidMessage) {
  return z
    .union([z.string(), z.number()])
    .refine((value) => value !== "" && value !== null && value !== undefined, { message: requiredMessage })
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, { message: invalidMessage });
}
