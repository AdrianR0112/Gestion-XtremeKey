export function isRequired(value) {
    return String(value ?? "").trim().length > 0;
}

export function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? ""));
}

export function hasMinLength(value, minLength = 8) {
    return String(value ?? "").length >= minLength;
}