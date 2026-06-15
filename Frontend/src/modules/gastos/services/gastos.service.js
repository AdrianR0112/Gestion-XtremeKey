import { api } from "../../../services/api";
import endpoints from "../../../services/endpoints";

const basePath = endpoints.gastos;

function extractPayload(response) {
	if (response && typeof response === "object" && "data" in response) {
		return response.data;
	}
	return response;
}

const gastosService = {
  list: (options) => api.get(basePath, options),
  getById: (id, options) => api.get(`${basePath}/${id}`, options),
  create: async (payload, options) => extractPayload(await api.post(basePath, payload, options)),
  update: async (id, payload, options) => extractPayload(await api.put(`${basePath}/${id}`, payload, options)),
  remove: (id, options) => api.del(`${basePath}/${id}`, options),
};

export default gastosService;
