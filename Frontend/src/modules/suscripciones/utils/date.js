import { getTimezone } from "../../../utils/timezone";

function tz() {
	return getTimezone();
}

function formatDateInputValue(date, timeZone) {
	if (!date) return "";
	const parsedDate = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(parsedDate.getTime())) return "";

	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: timeZone || tz(),
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(parsedDate);

	const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
	return `${values.year}-${values.month}-${values.day}`;
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

/**
 * Convierte un valor de <input type="date"> a un ISO datetime con offset de
 * Ecuador, fijando la hora al mediodia para que la conversion de zona horaria
 * nunca desplace la fecha calendario al dia anterior o siguiente.
 */
export function toEcuadorDateFromInput(dateValue) {
	if (!dateValue) return null;
	const date = toDateInputValue(dateValue);
	if (!date) return null;
	const offset = getTzOffset();
	return `${date}T12:00:00${offset}`;
}
