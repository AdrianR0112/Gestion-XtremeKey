export const REVENDEDOR_INICIAL = {
	Id_Rev: "",
	Tel_Rev: "",
	Nom_Rev: "",
	Ape_Rev: "",
	Ema_Rev: "",
	Doc_Rev: "",
	Not_Rev: "",
	Est_Rev: "activo",
};

const estados = ["activo", "inactivo"];

function isValidEmail(value) {
	if (!value) return true;
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export function validateRevendedorForm(form = {}) {
	const errors = {};

	if (!form.Tel_Rev?.trim()) errors.Tel_Rev = "El telefono es obligatorio.";

	if (!isValidEmail(form.Ema_Rev?.trim())) errors.Ema_Rev = "El correo no tiene un formato valido.";
	if (form.Est_Rev && !estados.includes(form.Est_Rev)) errors.Est_Rev = "Estado invalido.";

	return errors;
}

export function isRevendedorFormValid(form = {}) {
	return Object.keys(validateRevendedorForm(form)).length === 0;
}

export default { REVENDEDOR_INICIAL };
