export const CONFIGURACION_INICIAL = {
	Nom_Emp_Con: "",
	Dir_Con: "",
	Tel_Con: "",
	Ema_Con: "",
	Log_Con: "",
	Mon_Con: "",
	Zon_Hor_Con: "",
	Imp_Con: "",
	Hab_Imp_Con: true,
};

function isValidEmail(value) {
	if (!value) return true;
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isWithinPercentage(value) {
	if (value === "" || value === null || value === undefined) return true;
	const parsed = Number(value);
	return !Number.isNaN(parsed) && parsed >= 0 && parsed <= 100;
}

function isValidCurrency(value) {
	if (!value) return true;
	return /^[A-Za-z]{3,6}$/.test(String(value).trim());
}

export function validateConfiguracionForm(form = {}) {
	const errors = {};

	if (!form.Nom_Emp_Con?.trim()) {
		errors.Nom_Emp_Con = "El nombre de empresa es obligatorio.";
	}

	if (!isValidEmail(form.Ema_Con?.trim())) {
		errors.Ema_Con = "El correo no tiene un formato valido.";
	}

	if (!isValidCurrency(form.Mon_Con)) {
		errors.Mon_Con = "La moneda debe ser un codigo valido (ej. USD).";
	}

	if (form.Hab_Imp_Con && !isWithinPercentage(form.Imp_Con)) {
		errors.Imp_Con = "El impuesto debe ser un porcentaje entre 0 y 100.";
	}

	return errors;
}

export function isConfiguracionFormValid(form = {}) {
	return Object.keys(validateConfiguracionForm(form)).length === 0;
}

export const configuracionSchema = {
	validate: validateConfiguracionForm,
};

export default configuracionSchema;
