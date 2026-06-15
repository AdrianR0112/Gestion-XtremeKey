import { api } from "../../../services/api";
import endpoints from "../../../services/endpoints";

const basePath = endpoints.clientes;

function extractPayload(response) {
	if (response && typeof response === "object" && "data" in response) {
		return response.data;
	}

	return response;
}

const clientesService = {
	list: async (options) => extractPayload(await api.get(basePath, options)),
	getById: async (id, options) => extractPayload(await api.get(`${basePath}/${id}`, options)),
	create: async (payload, options) => extractPayload(await api.post(basePath, payload, options)),
	update: async (id, payload, options) => extractPayload(await api.put(`${basePath}/${id}`, payload, options)),
	remove: async (id, options) => extractPayload(await api.del(`${basePath}/${id}`, options)),
	import: async (file, options) => {
		const formData = new FormData();
		formData.append("file", file);
		return extractPayload(await api.post(`${basePath}/import`, formData, options));
	},
};

export default clientesService;
