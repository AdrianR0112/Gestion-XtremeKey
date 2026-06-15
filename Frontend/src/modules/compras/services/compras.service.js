import { api } from "../../../services/api";
import endpoints from "../../../services/endpoints";

const basePath = endpoints.compras;

function extractPayload(response) {
	if (response && typeof response === "object" && "data" in response) {
		return response.data;
	}

	return response;
}

const comprasService = {
	list: async (options) => extractPayload(await api.get(basePath, options)),
	getById: async (id, options) => extractPayload(await api.get(`${basePath}/${id}`, options)),
	create: async (payload, options) => extractPayload(await api.post(basePath, payload, options)),
	update: async (id, payload, options) => extractPayload(await api.put(`${basePath}/${id}`, payload, options)),
	remove: async (id, options) => extractPayload(await api.del(`${basePath}/${id}`, options)),
};

export default comprasService;
