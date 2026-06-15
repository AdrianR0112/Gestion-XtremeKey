const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm(form) {
	if (!form.email || !emailRegex.test(form.email)) return "Correo invalido";
	if (!form.password || form.password.length < 6) return "La contrasena debe tener al menos 6 caracteres";
	return "";
}

export function validateRegisterForm(form) {
	if (!form.firstName?.trim()) return "El nombre es obligatorio";
	if (!form.lastName?.trim()) return "El apellido es obligatorio";
	if (!form.email || !emailRegex.test(form.email)) return "Correo invalido";
	if (!form.phone?.trim()) return "El telefono es obligatorio";
	if (!form.password || form.password.length < 6) return "La contrasena debe tener al menos 6 caracteres";
	if (!form.role) return "Selecciona un rol";
	return "";
}

export function validateChangePasswordForm(form) {
	if (!form.currentPassword || form.currentPassword.length < 6) return "Contrasena actual invalida";
	if (!form.newPassword || form.newPassword.length < 6) return "La nueva contrasena debe tener al menos 6 caracteres";
	return "";
}

export const authSchema = {
	validateLoginForm,
	validateRegisterForm,
	validateChangePasswordForm,
};

export default authSchema;
