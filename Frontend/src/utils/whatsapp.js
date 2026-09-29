/**
 * Detecta si la aplicación se está usando desde un dispositivo móvil.
 * userAgentData es la señal más directa cuando el navegador la ofrece; el
 * user-agent y la detección de iPadOS quedan como respaldo.
 */
export function isMobileDevice() {
	if (typeof navigator === "undefined") return false;

	if (typeof navigator.userAgentData?.mobile === "boolean") {
		return navigator.userAgentData.mobile;
	}

	const mobileUserAgent = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(
		navigator.userAgent || "",
	);
	const isIPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

	return mobileUserAgent || isIPadOS;
}

/**
 * Enlace de envío directo por WhatsApp.
 *
 * En escritorio abre WhatsApp Web y en móviles usa el enlace universal wa.me.
 * El teléfono llega ya normalizado desde el backend; aquí se eliminan caracteres
 * no numéricos únicamente como medida de seguridad.
 */
export function buildWhatsAppUrl(telefono, texto, mobile = isMobileDevice()) {
	const digits = String(telefono || "").replace(/\D/g, "");
	if (!digits) return "";

	const encodedText = encodeURIComponent(String(texto || ""));

	if (mobile) {
		return `https://wa.me/${digits}?text=${encodedText}`;
	}

	return `https://web.whatsapp.com/send?phone=${digits}&text=${encodedText}`;
}

// Se conserva el nombre anterior para no romper otros consumidores del helper.
export const buildWaMeUrl = buildWhatsAppUrl;

export default { buildWhatsAppUrl, buildWaMeUrl, isMobileDevice };
