export const ESTADOS_CUENTA = ["disponible", "ocupada", "parcial", "vencida", "suspendida"];

export const CUENTA_INICIAL = {
	Id_Prd: "",
	Id_Var: "",
	Id_Pro: "",
	Nom_Cue: "",
	Usu_Cue: "",
	Pas_Cue: "",
	Pin_Cue: "",
	Per_Cue: "",
	Tot_Per_Cue: "",
	Per_Dis_Cue: "",
	Fec_Com_Cue: "",
	Fec_Ven_Cue: "",
	Cos_Cue: "",
	Not_Cue: "",
	Est_Cue: "disponible",
};

function isNonNegativeNumber(value) {
	if (value === "" || value === null || value === undefined) return true;
	const parsed = Number(value);
	return Number.isFinite(parsed) && parsed >= 0;
}

export function validateCuentaForm(form = {}) {
	const errors = {};

	if (!form.Nom_Cue?.trim()) {
		errors.Nom_Cue = "El nombre de la cuenta es obligatorio.";
	}

	if (!isNonNegativeNumber(form.Tot_Per_Cue)) {
		errors.Tot_Per_Cue = "Total de perfiles debe ser un numero positivo.";
	}

	if (!isNonNegativeNumber(form.Per_Dis_Cue)) {
		errors.Per_Dis_Cue = "Perfiles disponibles debe ser un numero positivo.";
	}

	if (!isNonNegativeNumber(form.Cos_Cue)) {
		errors.Cos_Cue = "El costo debe ser un numero positivo.";
	}

	if (form.Est_Cue && !ESTADOS_CUENTA.includes(form.Est_Cue)) {
		errors.Est_Cue = "Estado de cuenta invalido.";
	}

	return errors;
}

export function isCuentaFormValid(form = {}) {
	return Object.keys(validateCuentaForm(form)).length === 0;
}

export const cuentaSchema = {
	validate: validateCuentaForm,
};

export default cuentaSchema;
