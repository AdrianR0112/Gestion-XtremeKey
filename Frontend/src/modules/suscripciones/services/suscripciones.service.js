import { api } from "../../../services/api";
import endpoints from "../../../services/endpoints";

const basePath = endpoints.suscripciones;

function extractPayload(response) {
	if (response && typeof response === "object" && "data" in response) {
		return response.data;
	}

	return response;
}

/**
 * api.get no serializa query params: hay que construir la querystring a mano.
 * Se omiten los valores vacios para no mandar filtros que el backend ignoraria.
 */
function buildQuery(params = {}) {
	const search = new URLSearchParams();
	for (const [clave, valor] of Object.entries(params)) {
		if (valor === undefined || valor === null || valor === "" || valor === "todos" || valor === "todas") continue;
		search.set(clave, String(valor));
	}
	const query = search.toString();
	return query ? `?${query}` : "";
}

const suscripcionesService = {
	list: async (params, options) => extractPayload(await api.get(`${basePath}${buildQuery(params)}`, options)),
	getResumen: async (params, options) =>
		extractPayload(await api.get(`${basePath}/resumen${buildQuery(params)}`, options)),
	getById: async (id, options) => extractPayload(await api.get(`${basePath}/${id}`, options)),
	getHistorial: async (id, options) => extractPayload(await api.get(`${basePath}/${id}/historial`, options)),
	// El mensaje lo arma el servidor: la plantilla vive en BD y debe ser la
	// misma que usa el bot de Telegram.
	getMensajeWhatsapp: async (id, options) =>
		extractPayload(await api.get(`${basePath}/${id}/mensaje-whatsapp`, options)),
	create: async (payload, options) => extractPayload(await api.post(basePath, payload, options)),
	update: async (id, payload, options) => extractPayload(await api.put(`${basePath}/${id}`, payload, options)),
	remove: async (id, options) => extractPayload(await api.del(`${basePath}/${id}`, options)),
	renovar: async (id, payload, options) =>
		extractPayload(await api.post(`${basePath}/${id}/renovar`, payload, options)),
	renovarLote: async (payload, options) =>
		extractPayload(await api.post(`${basePath}/renovar-lote`, payload, options)),
};

export default suscripcionesService;
