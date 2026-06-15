export function formatCurrency(value, currency = "USD", locale = "es-ES") {
    const amount = Number(value || 0);

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}