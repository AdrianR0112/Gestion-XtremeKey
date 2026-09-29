import { getTimezone } from "./timezone";

/**
 * Convierte a Date sin que una fecha de calendario se desplace de dia.
 *
 * "2026-07-18" (sin hora) lo parsea el estandar como medianoche UTC, asi que
 * al formatearlo en Ecuador (UTC-5) retrocedia al 17. Se fija al mediodia,
 * bien lejos de cualquier limite de zona horaria. Los valores que ya traen
 * hora (ISO con T, o datetime de MySQL) se parsean como local y estan bien.
 */
function parseFecha(date) {
    if (date instanceof Date) return date;
    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
        return new Date(`${date.trim()}T12:00:00`);
    }
    return new Date(date);
}

export function formatDate(date, locale = "es-ES") {
    if (!date) return "";

    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        timeZone: getTimezone(),
    }).format(parseFecha(date));
}

export function isExpired(date) {
    if (!date) return false;
    const tz = getTimezone();
    const nowParts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());
    const nowDate = `${nowParts.find((p) => p.type === "year").value}-${nowParts.find((p) => p.type === "month").value}-${nowParts.find((p) => p.type === "day").value}`;

    const dateParts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(parseFecha(date));
    const targetDate = `${dateParts.find((p) => p.type === "year").value}-${dateParts.find((p) => p.type === "month").value}-${dateParts.find((p) => p.type === "day").value}`;

    return new Date(targetDate) < new Date(nowDate);
}