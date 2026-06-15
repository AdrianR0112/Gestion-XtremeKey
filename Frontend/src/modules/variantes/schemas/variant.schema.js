export const ESTADOS_VARIANTE = ["activo", "inactivo"];
export const TIPOS_DURACION_VARIANTE = ["dias", "meses", "anios"];

export const VARIANTE_INICIAL = {
	Id_Prd: "",
	Nom_Var: "",
	Des_Var: "",
	Pre_Cos_Var: "",
	Pre_Ven_Var: "",
	Pre_Rev_Var: "",
	Dur_Tip_Var: "",
	Dur_Val_Var: "",
	Max_Usu_Var: "",
	Not_Ven_Cor_Var: true,
	Not_Ven_Wsp_Var: true,
	Atr_Var: "",
	Est_Var: "activo",
};

function isValidNumber(value) {
	if (value === "" || value === null || value === undefined) return true;
	const num = Number(value);
	return !Number.isNaN(num) && Number.isFinite(num);
}

function isValidJson(value) {
	if (value === "" || value === null || value === undefined) return true;
	if (typeof value === "object") return true;
	try {
		JSON.parse(value);
		return true;
	} catch {
		return false;
	}
}

export function validateVariantForm(form = {}) {
	const errors = {};

	if (!form.Id_Prd) {
		errors.Id_Prd = "El producto es obligatorio.";
	}

	if (!form.Nom_Var?.trim()) {
		errors.Nom_Var = "El nombre de la variante es obligatorio.";
	}

	if (form.Pre_Cos_Var === "" || form.Pre_Cos_Var === null || form.Pre_Cos_Var === undefined) {
		errors.Pre_Cos_Var = "El precio de costo es obligatorio.";
	} else if (!isValidNumber(form.Pre_Cos_Var)) {
		errors.Pre_Cos_Var = "El precio de costo debe ser numerico.";
	} else if (Number(form.Pre_Cos_Var) < 0) {
		errors.Pre_Cos_Var = "El precio de costo debe ser mayor o igual a 0.";
	}

	if (form.Pre_Ven_Var === "" || form.Pre_Ven_Var === null || form.Pre_Ven_Var === undefined) {
		errors.Pre_Ven_Var = "El precio de venta es obligatorio.";
	} else if (!isValidNumber(form.Pre_Ven_Var)) {
		errors.Pre_Ven_Var = "El precio de venta debe ser numerico.";
	} else if (Number(form.Pre_Ven_Var) < 0) {
		errors.Pre_Ven_Var = "El precio de venta debe ser mayor o igual a 0.";
	}

	if (form.Pre_Rev_Var !== "" && form.Pre_Rev_Var !== null && !isValidNumber(form.Pre_Rev_Var)) {
		errors.Pre_Rev_Var = "El precio para revendedor debe ser numerico.";
	} else if (form.Pre_Rev_Var !== "" && form.Pre_Rev_Var !== null && Number(form.Pre_Rev_Var) < 0) {
		errors.Pre_Rev_Var = "El precio para revendedor debe ser mayor o igual a 0.";
	}

	if (form.Dur_Tip_Var && !TIPOS_DURACION_VARIANTE.includes(form.Dur_Tip_Var)) {
		errors.Dur_Tip_Var = "El tipo de duración es invalido.";
	}

	if (form.Dur_Val_Var !== "" && form.Dur_Val_Var !== null && (!Number.isInteger(Number(form.Dur_Val_Var)) || Number(form.Dur_Val_Var) < 1)) {
		errors.Dur_Val_Var = "La duración debe ser un entero mayor o igual a 1.";
	}

	if (
		isValidNumber(form.Pre_Cos_Var) &&
		isValidNumber(form.Pre_Ven_Var) &&
		form.Pre_Cos_Var !== "" &&
		form.Pre_Ven_Var !== "" &&
		Number(form.Pre_Cos_Var) > Number(form.Pre_Ven_Var)
	) {
		errors.Pre_Cos_Var = "El precio de costo no puede ser mayor que el precio de venta.";
	}

	if (form.Dur_Val_Var !== "" && form.Dur_Val_Var !== null && (!Number.isInteger(Number(form.Dur_Val_Var)) || Number(form.Dur_Val_Var) < 1)) {
		errors.Dur_Val_Var = "La duración debe ser un entero mayor o igual a 1.";
	}

	if (form.Max_Usu_Var !== "" && (!Number.isInteger(Number(form.Max_Usu_Var)) || Number(form.Max_Usu_Var) < 1)) {
		errors.Max_Usu_Var = "El maximo de usuarios debe ser un entero mayor o igual a 1.";
	}

	if (form.Est_Var && !ESTADOS_VARIANTE.includes(form.Est_Var)) {
		errors.Est_Var = "Estado invalido.";
	}

	if (!isValidJson(form.Atr_Var)) {
		errors.Atr_Var = "Los atributos deben ser un JSON valido.";
	}

	return errors;
}

export function isVariantFormValid(form = {}) {
	return Object.keys(validateVariantForm(form)).length === 0;
}

export const variantSchema = {
	validate: validateVariantForm,
};

export default variantSchema;
