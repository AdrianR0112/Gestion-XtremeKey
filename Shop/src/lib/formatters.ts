export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function maskLicenseKey(value: string) {
  return `${value.slice(0, 4)}-${value.slice(5, 9)}-****-${value.slice(-4)}`;
}
