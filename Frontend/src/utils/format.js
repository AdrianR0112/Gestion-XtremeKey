export function formatText(value) {
    return String(value ?? "").trim();
}

export function formatName(firstName, lastName) {
    return [firstName, lastName].filter(Boolean).join(" ").trim();
}