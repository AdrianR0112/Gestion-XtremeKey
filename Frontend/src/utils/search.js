export function normalizeSearchText(value) {
	return String(value || "").trim().toLowerCase();
}

export function normalizePhoneSearch(value) {
	return String(value || "").replace(/\D/g, "");
}

export function matchesPhoneSearch(phone, query) {
	const normalizedPhone = normalizePhoneSearch(phone);
	const normalizedQuery = normalizePhoneSearch(query);

	if (!normalizedPhone || !normalizedQuery) return false;
	return normalizedPhone.includes(normalizedQuery) || normalizedQuery.includes(normalizedPhone);
}

export function matchesTextSearch(values, query) {
	const normalizedQuery = normalizeSearchText(query);
	if (!normalizedQuery) return true;

	return values
		.filter(Boolean)
		.join(" ")
		.toLowerCase()
		.includes(normalizedQuery);
}
