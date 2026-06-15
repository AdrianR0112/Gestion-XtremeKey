import { getTimezone } from "./timezone";

export function formatDate(date, locale = "es-ES") {
    if (!date) return "";

    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        timeZone: getTimezone(),
    }).format(new Date(date));
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
    }).formatToParts(new Date(date));
    const targetDate = `${dateParts.find((p) => p.type === "year").value}-${dateParts.find((p) => p.type === "month").value}-${dateParts.find((p) => p.type === "day").value}`;

    return new Date(targetDate) < new Date(nowDate);
}