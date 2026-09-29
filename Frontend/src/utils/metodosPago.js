/**
 * Metodos de pago del sistema.
 *
 * Lista unica a proposito: antes cada formulario tenia la suya (la venta nueva,
 * la edicion de venta y la renovacion de suscripciones), con nombres que no
 * coincidian entre si, y eso ensucia cualquier reporte agrupado por metodo.
 *
 * El backend guarda Met_Pag_Ven como texto libre, asi que los valores viejos
 * que no esten aqui se siguen mostrando: usa asegurarMetodoPago para no perder
 * el dato al editar un registro antiguo.
 */
export const METODOS_PAGO = [
	"Efectivo",
	"Transferencia",
	"Tarjeta",
	"PayPal",
	"Binance/Crypto",
	"Otro",
];

/**
 * Lista de opciones que incluye el valor actual aunque sea uno historico no
 * contemplado en METODOS_PAGO.
 */
export function opcionesMetodoPago(valorActual) {
	const actual = String(valorActual || "").trim();
	if (!actual || METODOS_PAGO.some((m) => m.toLowerCase() === actual.toLowerCase())) {
		return METODOS_PAGO;
	}
	return [actual, ...METODOS_PAGO];
}

export default { METODOS_PAGO, opcionesMetodoPago };
