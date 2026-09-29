import { z } from "zod";
import { firstErrorFromResult } from "@/lib/zod";

const loginFormSchema = z.object({
	email: z.email("Correo invalido"),
	password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres"),
});

const registerFormSchema = z.object({
	firstName: z.string().trim().min(1, "El nombre es obligatorio"),
	lastName: z.string().trim().min(1, "El apellido es obligatorio"),
	email: z.email("Correo invalido"),
	phone: z.string().trim().min(1, "El telefono es obligatorio"),
	password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres"),
	role: z.string().trim().min(1, "Selecciona un rol"),
});

const changePasswordFormSchema = z.object({
	currentPassword: z.string().min(6, "Contrasena actual invalida"),
	newPassword: z.string().min(6, "La nueva contrasena debe tener al menos 6 caracteres"),
});

export function validateLoginForm(form) {
	return firstErrorFromResult(loginFormSchema.safeParse(form));
}

export function validateRegisterForm(form) {
	return firstErrorFromResult(registerFormSchema.safeParse(form));
}

export function validateChangePasswordForm(form) {
	return firstErrorFromResult(changePasswordFormSchema.safeParse(form));
}

export const authSchema = {
	loginFormSchema,
	registerFormSchema,
	changePasswordFormSchema,
	validateLoginForm,
	validateRegisterForm,
	validateChangePasswordForm,
};

export default authSchema;
