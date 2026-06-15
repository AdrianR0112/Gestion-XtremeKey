import { getTimezone } from "../../../utils/timezone";

function tz() { return getTimezone(); }

export const NONE_VALUE = "__none__";

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
	nextDate.setMonth(nextDate.getMonth() + monthsToAdd);

	if (nextDate.getDate() !== day) {
		nextDate.setDate(0);
	}

	return formatDateInputValue(nextDate);
}

export function toSelectValue(value) {
	return value === null || value === undefined ? NONE_VALUE : String(value);
}

export function fromSelectValue(value) {
	return value === NONE_VALUE ? null : value;
}
