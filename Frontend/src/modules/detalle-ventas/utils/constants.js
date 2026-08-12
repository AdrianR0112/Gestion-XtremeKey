// La aritmetica de fechas vive en utils/duration.js porque tambien la usa el
// modulo de suscripciones: la regla de "desde cuando arranca un periodo" tiene
// que ser una sola en todo el frontend. Se reexporta para no tocar los imports
// existentes de este modulo.
export {
	getTodayDateInputValue,
	getTomorrowDateInputValue,
	addDaysToDateInput,
	addMonthsToDateInput,
	addDurationToDateInput,
	calcularInicioPeriodo,
	toDateInputValue,
} from "../../../utils/duration";

import { getTodayDateInputValue } from "../../../utils/duration";

export const DETALLE_INICIAL = {
	Id_Prd: "",
	Id_Var: "",
	Id_Cue: "",
	Id_Key: "",
	Can_Dve: "1",
	Pre_Uni_Dve: "",
	Des_Uni_Dve: "0",
	Fec_Ini_Dve: getTodayDateInputValue(),
	Fec_Fin_Dve: getTodayDateInputValue(),
	Es_Suscripcion_Dve: false,
	Cor_Cue: "",
	Con_Cue: "",
	Not_Dve: "",
	Est_Dve: "activo",
};

export function createDetalleInitialValues() {
	const today = getTodayDateInputValue();
	return {
		...DETALLE_INICIAL,
		Fec_Ini_Dve: today,
		Fec_Fin_Dve: today,
		Es_Suscripcion_Dve: false,
	};
}

export const ESTADOS_DETALLE_VENTA = ["activo", "vencido", "cancelado", "renovado"];

export const NONE_VALUE = "__none__";

export function toSelectValue(value) {
	if (value === null || value === undefined || value === "") return NONE_VALUE;
	return String(value);
}

export function fromSelectValue(value) {
	return value === NONE_VALUE ? "" : value;
}

export function toNullableInteger(value) {
	if (value === "" || value === null || value === undefined) return null;
	const parsed = Number(value);
	return Number.isInteger(parsed) ? parsed : null;
}

export function toNullableString(value) {
	if (value === "" || value === null || value === undefined) return null;
	return String(value).trim() || null;
}
