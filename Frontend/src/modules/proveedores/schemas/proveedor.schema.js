export const TIPOS_PROVEEDOR = ["persona", "empresa", "plataforma", "tienda_web", "otro"];
export const MEDIOS_CONTACTO = ["whatsapp", "telegram", "web", "email", "telefono"];
export const ESTADOS_PROVEEDOR = ["activo", "inactivo", "suspendido"];

export const PROVEEDOR_INICIAL = {
	Nom_Pro: "",
	Tip_Pro: "empresa",
	Con_Pri_Pro: "",
	Tel_Pro: "",
	Wha_Pro: "",
	Ema_Pro: "",
	Tel_Gram_Pro: "",
	Web_Pro: "",
	Pai_Pro: "",
	Med_Con_Pro: "whatsapp",
	Con_Com_Pro: "",
	Cal_Pro: 5,
	Not_Pro: "",
	Est_Pro: "activo",
};

function isValidEmail(value) {
	if (!value) return true;
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export function validateProveedorForm(form = {}) {
	const errors = {};

	if (!form.Nom_Pro?.trim()) {
		errors.Nom_Pro = "El nombre del proveedor es obligatorio.";
	}

	if (form.Tip_Pro && !TIPOS_PROVEEDOR.includes(form.Tip_Pro)) {
		errors.Tip_Pro = "Tipo de proveedor invalido.";
	}

	if (!isValidEmail(form.Ema_Pro)) {
		errors.Ema_Pro = "Correo invalido.";
	}

	if (form.Med_Con_Pro && !MEDIOS_CONTACTO.includes(form.Med_Con_Pro)) {
		errors.Med_Con_Pro = "Medio de contacto invalido.";
	}

	if (form.Est_Pro && !ESTADOS_PROVEEDOR.includes(form.Est_Pro)) {
		errors.Est_Pro = "Estado invalido.";
	}

	const calificacion = Number(form.Cal_Pro);
	if (form.Cal_Pro !== "" && (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5)) {
		errors.Cal_Pro = "La calificacion debe ser un entero entre 1 y 5.";
	}

	return errors;
}

export function isProveedorFormValid(form = {}) {
	return Object.keys(validateProveedorForm(form)).length === 0;
}

export const proveedorSchema = {
	validate: validateProveedorForm,
};

export default proveedorSchema;
