import { api } from "../../../services/api";
import endpoints from "../../../services/endpoints";

const basePath = endpoints.detalleVentas;

function extractPayload(response) {
  if (response && typeof response === "object" && "ok" in response && "data" in response) {
    return response.data;
  }

  if (response && typeof response === "object" && "data" in response) {
    return response.data;
  }

  return response;
}

export const detalleVentasService = {
  list: async (options) => extractPayload(await api.get(basePath, options)),
  getById: async (id, options) => extractPayload(await api.get(`${basePath}/${id}`, options)),
  findByCliente: async (clienteId, options) => extractPayload(await api.get(`${basePath}/by-cliente`, { ...options, params: { clienteId } })),
  create: async (payload, options) => extractPayload(await api.post(basePath, payload, options)),
  update: async (id, payload, options) => extractPayload(await api.put(`${basePath}/${id}`, payload, options)),
  remove: async (id, options) => extractPayload(await api.del(`${basePath}/${id}`, options)),
};

export default detalleVentasService;
