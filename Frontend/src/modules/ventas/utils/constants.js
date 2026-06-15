export const NONE_VALUE = "__none__";

import { getTimezone } from "../../../utils/timezone";

function tz() { return getTimezone(); }

function formatDateTimeInputValue(date, timeZone) {
	if (!date) return "";
	const parsedDate = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(parsedDate.getTime())) return "";

	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: timeZone || tz(),
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).formatToParts(parsedDate);

	const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
	const hour = values.hour === "24" ? "00" : values.hour;
	return `${values.year}-${values.month}-${values.day}T${hour}:${values.minute}`;
}

function formatDateInputValue(date, timeZone) {
	if (!date) return "";
	const parsedDate = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(parsedDate.getTime())) return "";
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: timeZone || tz(), year: "numeric", month: "2-digit", day: "2-digit",
	}).formatToParts(parsedDate);
	const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
	return `${values.year}-${values.month}-${values.day}`;
}

export function getTodayDateInputValue() {
	return formatDateInputValue(new Date());
}

export function getCurrentDateTimeInputValue() {
	return formatDateTimeInputValue(new Date());
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
	return formatDateInputValue(nextDate);
}

export function addDurationToDateInput(dateValue, durTip, durVal) {
	if (!durTip || !durVal) return dateValue || getTodayDateInputValue();

	const val = Number(durVal);
	if (!Number.isInteger(val) || val < 1) return dateValue || getTodayDateInputValue();

	if (durTip === "dias") {
		const base = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();
		base.setDate(base.getDate() + val);
		return formatDateInputValue(base);
	}

	if (durTip === "meses") {
		return addMonthsToDateInput(dateValue, val);
	}

	if (durTip === "anios") {
		const base = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();
		base.setFullYear(base.getFullYear() + val);
		return formatDateInputValue(base);
	}

	return dateValue || getTodayDateInputValue();
}

export const VENTA_INICIAL = {
	Id_Cli: "",
	Id_Rev: "",
	Fec_Ven: getCurrentDateTimeInputValue(),
	Des_Tot_Ven: "0",
	Imp_Tot_Ven: "0",
	Met_Pag_Ven: "Transferencia",
	Not_Ven: "",
	Est_Ven: "completada",
};

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
	return formatDateInputValue(d);
}

export function getTimeInputValue(value) {
	if (!value) return "";
	const text = String(value).trim();
	if (!text) return "";
	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(text)) {
		return text.slice(11, 16);
	}
	const d = new Date(text);
	if (Number.isNaN(d.getTime())) {
		if (text.length >= 16 && text.includes("T")) return text.slice(11, 16);
		if (text.includes(" ")) return text.split(" ")[1]?.slice(0, 5) || "";
		return "";
	}
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: tz(), hour: "2-digit", minute: "2-digit", hour12: false,
	}).formatToParts(d);
	const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));
	return `${values.hour}:${values.minute}`;
}

export function combineDateWithTimeInput(dateValue, timeValue) {
	if (!dateValue) return "";
	const date = toDateInputValue(dateValue);
	if (!date) return "";
	const time = getTimeInputValue(timeValue) || getTimeInputValue(getCurrentDateTimeInputValue()) || "00:00";
	const iso = `${date}T${time}:00`;
	return toEcuadorDateTimeIso(iso);
}

export function toDateTimeInputValue(value) {
	if (!value) return "";

	const text = String(value).trim();
	if (!text) return "";
	if (!/[zZ]$|[+-]\d{2}:\d{2}$/.test(text)) {
		return text.replace(" ", "T").slice(0, 16);
	}

	return formatDateTimeInputValue(text);
}

function getTzOffset() {
	try {
		const parts = new Intl.DateTimeFormat("en-US", {
			timeZone: tz(),
			timeZoneName: "longOffset",
		}).formatToParts(new Date());
		const tzPart = parts.find((p) => p.type === "timeZoneName");
		return tzPart ? tzPart.value.replace("GMT", "") : "-05:00";
	} catch {
		return "-05:00";
	}
}

export function toEcuadorDateTimeIso(value) {
	if (!value) return null;

	const text = String(value).trim();
	if (!text) return null;
	const offset = getTzOffset();
	if (/[zZ]$|[+-]\d{2}:\d{2}$/.test(text)) return text;
	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(text)) return `${text}:00${offset}`;
	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(text)) return `${text}${offset}`;
	return text;
}
