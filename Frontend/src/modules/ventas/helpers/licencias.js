/**
 * Licencias (detalles de venta) previas de un titular, que son las candidatas a
 * renovar desde la pantalla de ventas.
 *
 * El titular de una venta es un cliente O un revendedor, nunca los dos, y se
 * identifica con la clave C<id>/R<id> que usa tambien el backend al agrupar
 * renovaciones en lote.
 */

export function claveTitular({ clienteId, revendedorId } = {}) {
	if (clienteId) return `C${Number(clienteId)}`;
	if (revendedorId) return `R${Number(revendedorId)}`;
	return null;
}

export function buildVentaTitularMap(ventas = []) {
	const mapa = new Map();
	for (const venta of ventas) {
		if (!venta?.Id_Ven) continue;
		const clave = claveTitular({ clienteId: venta.Id_Cli, revendedorId: venta.Id_Rev });
		if (clave) mapa.set(Number(venta.Id_Ven), clave);
	}
	return mapa;
}

export function findLicenciasTitular(detalleVentas = [], ventaTitularMap, titular) {
	if (!titular || !ventaTitularMap) return [];
	return detalleVentas.filter((detalle) => ventaTitularMap.get(Number(detalle.Id_Ven)) === titular);
}

export default { claveTitular, buildVentaTitularMap, findLicenciasTitular };
