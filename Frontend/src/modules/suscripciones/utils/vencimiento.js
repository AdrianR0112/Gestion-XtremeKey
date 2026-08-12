/**
 * Utilidades de vencimiento.
 *
 * El backend ya devuelve Dias_Restantes calculado en dias calendario
 * (DATEDIFF sobre DATE()), de modo que "vence hoy" es exactamente 0 y "vencio
 * ayer" es -1. Aqui solo se formatea, con un calculo local de respaldo por si
 * el dato llega de una respuesta antigua en cache.
 *
 * null significa "sin vencimiento" y nunca debe compararse como numero.
 */

export function getDiasRestantes(entrada) {
	const suscripcion = entrada ?? {};
	if (suscripcion.Dias_Restantes !== undefined && suscripcion.Dias_Restantes !== null) {
		return Number(suscripcion.Dias_Restantes);
	}

	if (!suscripcion.Fec_Fin_Sus) return null;

	const fin = new Date(suscripcion.Fec_Fin_Sus);
	if (Number.isNaN(fin.getTime())) return null;

	const soloDia = (fecha) => Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
	return Math.round((soloDia(fin) - soloDia(new Date())) / 86400000);
}

export function formatVenceEn(dias) {
	if (dias === null || dias === undefined) return "Sin vencimiento";
	if (dias === 0) return "Vence hoy";
	if (dias === 1) return "Vence mañana";
	if (dias > 1) return `Vence en ${dias} días`;
	if (dias === -1) return "Venció ayer";
	return `Venció hace ${Math.abs(dias)} días`;
}

export function getVencimientoVariant(dias) {
	if (dias === null || dias === undefined) return "secondary";
	if (dias < 0) return "destructive";
	if (dias <= 7) return "warning";
	return "success";
}

export function estaVencida(suscripcion) {
	const dias = getDiasRestantes(suscripcion);
	return dias !== null && dias < 0;
}

export function estaPorVencer(suscripcion, umbral = 7) {
	const dias = getDiasRestantes(suscripcion);
	return dias !== null && dias >= 0 && dias <= umbral;
}

export default { getDiasRestantes, formatVenceEn, getVencimientoVariant, estaVencida, estaPorVencer };
