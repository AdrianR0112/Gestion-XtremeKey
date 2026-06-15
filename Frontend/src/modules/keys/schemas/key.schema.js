export const ESTADOS_KEY = ["disponible", "vendida", "reservada", "vencida", "cancelada"];

export const KEY_INICIAL = {
	Id_Prd: "",
	Id_Var: "",
	Id_Pro: "",
	Cla_Key: "",
	Es_Per_Vid_Key: false,
	Des_Key: "",
	Fec_Com_Key: "",
	Fec_Ven_Key: "",
	Cos_Key: "",
	Pre_Ven_Key: "",
	Est_Key: "disponible",
	Not_Key: "",
};

function isNonNegativeNumber(value) {
	if (value === "" || value === null || value === undefined) return true;
	const parsed = Number(value);
	return Number.isFinite(parsed) && parsed >= 0;
}

export function validateKeyForm(form = {}) {
	const errors = {};

	if (!form.Cla_Key?.trim()) {
		errors.Cla_Key = "La clave es obligatoria.";
	}

	if (!isNonNegativeNumber(form.Cos_Key)) {
		errors.Cos_Key = "Costo invalido.";
	}

	if (!isNonNegativeNumber(form.Pre_Ven_Key)) {
		errors.Pre_Ven_Key = "Precio de venta invalido.";
	}

	if (typeof form.Es_Per_Vid_Key !== "boolean") {
		errors.Es_Per_Vid_Key = "El campo por vida debe ser booleano.";
	}

	if (form.Est_Key && !ESTADOS_KEY.includes(form.Est_Key)) {
		errors.Est_Key = "Estado de key invalido.";
	}

	return errors;
}

export function isKeyFormValid(form = {}) {
	return Object.keys(validateKeyForm(form)).length === 0;
}

export const keySchema = {
	validate: validateKeyForm,
};

export default keySchema;
