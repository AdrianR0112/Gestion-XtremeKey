import { getTimezone } from "./timezone";

/**
 * Aritmetica de fechas para periodos de suscripcion, compartida por los modulos
 * de ventas y de suscripciones.
 *
 * Todo trabaja sobre cadenas "YYYY-MM-DD" (el formato de <input type="date">).
 * Las comparaciones se hacen sobre la cadena y las diferencias sobre Date.UTC,
 * nunca sobre la hora local del navegador: asi el resultado no cambia segun
 * donde este abierto el panel.
 */

function tz() {
	return getTimezone();
}

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
	return formatDateEC(new Date());
}

export function getTomorrowDateInputValue() {
	return addDaysToDateInput(getTodayDateInputValue(), 1);
}

/** Normaliza cualquier fecha (ISO, datetime de MySQL, Date) a "YYYY-MM-DD". */
export function toDateInputValue(value) {
	if (!value) return "";
	if (value instanceof Date) {
		return Number.isNaN(value.getTime()) ? "" : formatDateEC(value);
	}
	const text = String(value).trim();
	if (!text) return "";
	if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
	const match = text.match(/^\d{4}-\d{2}-\d{2}/);
	if (!match) return text.slice(0, 10);
	const d = new Date(text);
	if (Number.isNaN(d.getTime())) return match[0];
	return formatDateEC(d);
}

function parseParts(dateValue) {
	const text = toDateInputValue(dateValue);
	if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
	const [year, month, day] = text.split("-").map(Number);
	return { year, month, day };
}

function formatParts(year, monthIndex, day) {
	const pad = (n) => String(n).padStart(2, "0");
	return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

export function addDaysToDateInput(dateValue, daysToAdd) {
	const parts = parseParts(dateValue);
	if (!parts) return getTodayDateInputValue();
	const utc = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
	utc.setUTCDate(utc.getUTCDate() + Number(daysToAdd || 0));
	return formatParts(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
}

export function addMonthsToDateInput(dateValue, monthsToAdd) {
	const parts = parseParts(dateValue);
	if (!parts) return getTodayDateInputValue();

	const total = parts.month - 1 + Number(monthsToAdd || 0);
	const year = parts.year + Math.floor(total / 12);
	const monthIndex = ((total % 12) + 12) % 12;

	// Ajusta al ultimo dia si el mes destino es mas corto (31-ene + 1 mes => 28/29-feb).
	const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
	return formatParts(year, monthIndex, Math.min(parts.day, lastDay));
}

export function addYearsToDateInput(dateValue, yearsToAdd) {
	return addMonthsToDateInput(dateValue, Number(yearsToAdd || 0) * 12);
}

/** Misma semantica que addDuration del backend (dateHelper.js). */
export function addDurationToDateInput(dateValue, durTip, durVal) {
	const base = toDateInputValue(dateValue) || getTodayDateInputValue();
	const val = Number(durVal);
	if (!durTip || !Number.isInteger(val) || val < 1) return base;

	if (durTip === "dias") return addDaysToDateInput(base, val);
	if (durTip === "meses") return addMonthsToDateInput(base, val);
	if (durTip === "anios") return addYearsToDateInput(base, val);
	return base;
}

/** Dias completos transcurridos entre dos fechas (b - a). */
export function diffDiasDateInput(desde, hasta) {
	const a = parseParts(desde);
	const b = parseParts(hasta);
	if (!a || !b) return null;
	const ms =
		Date.UTC(b.year, b.month - 1, b.day) - Date.UTC(a.year, a.month - 1, a.day);
	return Math.round(ms / 86400000);
}

const UNIDADES = {
	dias: ["día", "días"],
	meses: ["mes", "meses"],
	anios: ["año", "años"],
};

/** "1 mes", "3 meses", "1 año". Cadena vacia si la duracion no es valida. */
export function formatDuracion(durTip, durVal) {
	const valor = Number(durVal);
	const unidad = UNIDADES[durTip];
	if (!unidad || !Number.isInteger(valor) || valor < 1) return "";
	return `${valor} ${valor === 1 ? unidad[0] : unidad[1]}`;
}

/** Duracion normalizada a dias, solo para ordenar planes de forma coherente. */
export function duracionEnDias(durTip, durVal) {
	const valor = Number(durVal);
	if (!Number.isInteger(valor) || valor < 1) return Number.MAX_SAFE_INTEGER;
	if (durTip === "dias") return valor;
	if (durTip === "meses") return valor * 30;
	if (durTip === "anios") return valor * 365;
	return Number.MAX_SAFE_INTEGER;
}

export const DEFAULT_DIAS_GRACIA = 30;

/**
 * Inicio del nuevo periodo de una renovacion. Espejo exacto de
 * Backend/src/modules/suscripciones/suscripciones.periodo.js.
 *
 * Encadena desde el vencimiento anterior para no dejar huecos ni regalar dias
 * ya pagados; deja de encadenar pasada la gracia, cuando el periodo anterior
 * ya esta demasiado consumido.
 *
 * @returns {{inicio: string, encadenado: boolean, diasVencida: number|null}}
 */
export function calcularInicioPeriodo(fechaFinAnterior, opciones = {}) {
	const { graciaDias = DEFAULT_DIAS_GRACIA, ahora = new Date() } = opciones;

	const gracia =
		Number.isInteger(Number(graciaDias)) && Number(graciaDias) >= 0
			? Number(graciaDias)
			: DEFAULT_DIAS_GRACIA;

	const hoy = toDateInputValue(ahora) || getTodayDateInputValue();
	const fin = toDateInputValue(fechaFinAnterior);

	if (!fin) return { inicio: hoy, encadenado: false, diasVencida: null };

	const diasVencida = diffDiasDateInput(fin, hoy);
	if (diasVencida === null) return { inicio: hoy, encadenado: false, diasVencida: null };

	// diasVencida <= 0 => renovacion anticipada; 0 < diasVencida <= gracia =>
	// renovacion tardia tolerada. En ambos casos se encadena.
	if (diasVencida <= gracia) return { inicio: fin, encadenado: true, diasVencida };

	return { inicio: hoy, encadenado: false, diasVencida };
}

export default {
	getTodayDateInputValue,
	getTomorrowDateInputValue,
	toDateInputValue,
	addDaysToDateInput,
	addMonthsToDateInput,
	addYearsToDateInput,
	addDurationToDateInput,
	diffDiasDateInput,
	calcularInicioPeriodo,
	formatDuracion,
	duracionEnDias,
	DEFAULT_DIAS_GRACIA,
};
