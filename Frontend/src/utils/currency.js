export function formatCurrency(value, currency = "USD", locale = "es-EC") {
    const amount = Number(value || 0);
	const formattedAmount = new Intl.NumberFormat(locale, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);

	if (currency === "USD") {
		return `$\u00a0${formattedAmount}`;
	}

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
		currencyDisplay: "narrowSymbol",
		minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}
