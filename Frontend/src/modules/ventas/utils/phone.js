/**
 * Normaliza un número de teléfono removiendo espacios y caracteres especiales
 * Ejemplo: "+593 99 270 6565" -> "593992706565"
 */
export function normalizePhoneNumber(phone) {
	if (!phone) return "";
	return String(phone).replace(/\D/g, "");
}

/**
 * Busca un cliente por número de teléfono exacto (normalizado)
 * Devuelve el cliente si encuentra coincidencia exacta, null si no
 */
export function findClienteByPhone(clientes, searchPhone) {
	if (!searchPhone) return clientes;
	
	const normalized = normalizePhoneNumber(searchPhone);
	if (!normalized) return clientes;

	return clientes.find((cliente) => {
		const telPrincipal = normalizePhoneNumber(cliente.Tel_Cli);
		const telAlternativo = normalizePhoneNumber(cliente.Tel_Alt_Cli);
		
		return telPrincipal === normalized || telAlternativo === normalized;
	}) || null;
}
