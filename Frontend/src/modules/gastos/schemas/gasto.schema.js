import { getTimezone } from "../../../utils/timezone";

function getTodayDateInputValue() {
	const tz = getTimezone();
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: tz,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(new Date());
	const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));
	return `${values.year}-${values.month}-${values.day}`;
}

export const GASTO_INICIAL = {
	Nom_Gas: "",
	Des_Gas: "",
	Cat_Gas: "operativo",
	Mon_Gas: 0,
	Fec_Gas: getTodayDateInputValue(),
	Id_Pro: null,
	Id_Com: null,
	Com_Gas: "",
	Est_Gas: "registrado",
};

export function createGastoForm() {
	return { ...GASTO_INICIAL, Fec_Gas: getTodayDateInputValue() };
}

export function validateGastoForm(form) {
	const errors = {};

	if (!form.Nom_Gas || !form.Nom_Gas.trim()) {
		errors.Nom_Gas = "El nombre es requerido";
	} else if (form.Nom_Gas.trim().length > 150) {
		errors.Nom_Gas = "El nombre no puede exceder 150 caracteres";
	}

	if (form.Mon_Gas === "" || form.Mon_Gas === null || Number.isNaN(form.Mon_Gas)) {
		errors.Mon_Gas = "El monto es requerido";
	} else if (Number(form.Mon_Gas) < 0) {
		errors.Mon_Gas = "El monto no puede ser negativo";
	}

	if (!form.Fec_Gas || !form.Fec_Gas.trim()) {
		errors.Fec_Gas = "La fecha es requerida";
	}

	const validCategorias = ["operativo", "administrativo", "marketing", "proveedor", "impuesto", "otro"];
	if (form.Cat_Gas && !validCategorias.includes(form.Cat_Gas)) {
		errors.Cat_Gas = "Categoría inválida";
	}

	const validEstados = ["registrado", "pagado", "cancelado"];
	if (form.Est_Gas && !validEstados.includes(form.Est_Gas)) {
		errors.Est_Gas = "Estado inválido";
	}

	return errors;
}

export function isGastoFormValid(form) {
	return Object.keys(validateGastoForm(form)).length === 0;
}
