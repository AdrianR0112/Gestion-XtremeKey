import type { AuthFormData } from "@/modules/auth/auth.types";

export function validateAuthForm(data: AuthFormData, requiresName = false) {
  const errors: Partial<Record<keyof AuthFormData, string>> = {};

  if (requiresName && !data.name?.trim()) {
    errors.name = "Ingresa tu nombre.";
  }

  if (!data.email.trim() || !data.email.includes("@")) {
    errors.email = "Ingresa un correo valido.";
  }

  if (data.password.trim().length < 6) {
    errors.password = "La contrasena debe tener al menos 6 caracteres.";
  }

  return errors;
}
