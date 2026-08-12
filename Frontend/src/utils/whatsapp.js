/**
 * Enlace de envío directo por WhatsApp.
 *
 * El teléfono llega ya normalizado desde el backend (normalizeWhatsappPhone, en
 * services/vencimientoEmail.service.js): aquí solo se concatena, para no tener
 * dos reglas distintas de prefijo de país.
 */
export function buildWaMeUrl(telefono, texto) {
	const digits = String(telefono || "").replace(/\D/g, "");
	if (!digits) return "";
	return `https://wa.me/${digits}?text=${encodeURIComponent(String(texto || ""))}`;
}

export default { buildWaMeUrl };
