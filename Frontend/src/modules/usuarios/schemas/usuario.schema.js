export const ROLES_USUARIO = ["admin", "vendedor"];
export const ESTADOS_USUARIO = ["activo", "inactivo", "bloqueado"];

export const USUARIO_INICIAL = {
	Nom_Usu: "",
	Ape_Usu: "",
	Ema_Usu: "",
	Pas_Usu: "",
	Tel_Usu: "",
	Rol_Usu: "vendedor",
	Est_Usu: "activo",
};

function isValidEmail(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export function validateUsuarioForm(form = {}, { mode = "create" } = {}) {
	const errors = {};

	if (!form.Nom_Usu?.trim()) {
		errors.Nom_Usu = "El nombre es obligatorio.";
	}

	if (!form.Ape_Usu?.trim()) {
		errors.Ape_Usu = "El apellido es obligatorio.";
	}

	if (!form.Ema_Usu?.trim() || !isValidEmail(form.Ema_Usu)) {
		errors.Ema_Usu = "Ingresa un correo valido.";
	}

	const mustValidatePassword = mode === "create" || Boolean(form.Pas_Usu);
	if (mustValidatePassword && String(form.Pas_Usu || "").length < 6) {
		errors.Pas_Usu = "La contrasena debe tener minimo 6 caracteres.";
	}

	if (form.Rol_Usu && !ROLES_USUARIO.includes(form.Rol_Usu)) {
		errors.Rol_Usu = "Rol invalido.";
	}

	if (form.Est_Usu && !ESTADOS_USUARIO.includes(form.Est_Usu)) {
		errors.Est_Usu = "Estado invalido.";
	}

	return errors;
}

export const usuarioSchema = {
	validate: validateUsuarioForm,
};

export default usuarioSchema;
