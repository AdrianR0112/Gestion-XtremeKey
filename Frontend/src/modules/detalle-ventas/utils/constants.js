import { getTimezone } from "../../../utils/timezone";

function tz() { return getTimezone(); }

function formatDateEC(date) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: tz(),
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(date);
	const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));
	return `${values.year}-${values.month}-${values.day}`;
}

export function getTodayDateInputValue() {
	// Return current date in America/Guayaquil (Ecuador) as YYYY-MM-DD
	const now = new Date();
	return formatDateEC(now);
}

export function getTomorrowDateInputValue() {
	const today = getTodayDateInputValue();
	if (!today) return "";
	const [y, m, d] = today.split("-").map((v) => Number(v));
	const localDate = new Date(y, m - 1, d);
	localDate.setDate(localDate.getDate() + 1);
	return formatDateEC(localDate);
}

export function addDaysToDateInput(dateValue, daysToAdd) {
	const base = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();
	if (Number.isNaN(base.getTime())) return getTodayDateInputValue();
	base.setDate(base.getDate() + daysToAdd);
	return formatDateEC(base);
}

export function addMonthsToDateInput(dateValue, monthsToAdd) {
	const baseDate = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();
	if (Number.isNaN(baseDate.getTime())) {
		return getTodayDateInputValue();
	}

	const day = baseDate.getDate();
	const nextDate = new Date(baseDate);
	nextDate.setDate(1);
	nextDate.setMonth(nextDate.getMonth() + monthsToAdd + 1, 0);
	nextDate.setDate(Math.min(day, nextDate.getDate()));
	return formatDateEC(nextDate);
}

export function addDurationToDateInput(dateValue, durTip, durVal) {
	if (!durTip || !durVal) return dateValue || getTodayDateInputValue();

	const val = Number(durVal);
	if (!Number.isInteger(val) || val < 1) return dateValue || getTodayDateInputValue();

	if (durTip === "dias") {
		const base = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();
		base.setDate(base.getDate() + val);
		return formatDateEC(base);
	}

	if (durTip === "meses") {
		return addMonthsToDateInput(dateValue, val);
	}

	if (durTip === "anios") {
		const base = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();
		base.setFullYear(base.getFullYear() + val);
		return formatDateEC(base);
	}

	return dateValue || getTodayDateInputValue();
}

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

export function toDateInputValue(value) {
	if (!value) return "";
	const text = String(value).trim();
	if (!text) return "";
	if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
	const match = text.match(/^\d{4}-\d{2}-\d{2}/);
	if (!match) return text.slice(0, 10);
	const d = new Date(text);
	if (Number.isNaN(d.getTime())) return match[0];
	const tz = getTimezone();
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
	}).formatToParts(d);
	const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));
	return `${values.year}-${values.month}-${values.day}`;
}
