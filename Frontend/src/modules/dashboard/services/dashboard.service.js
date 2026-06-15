import { api } from "../../../services/api";
import endpoints from "../../../services/endpoints";

const basePath = endpoints.dashboard;

function extractPayload(response) {
	if (response && typeof response === "object" && "ok" in response && "data" in response) {
		return response.data;
	}
	if (response && typeof response === "object" && "data" in response) {
		return response.data;
	}
	return response;
}

export const dashboardService = {
	getResumen: async (options) => extractPayload(await api.get(basePath, options)),
};

export default dashboardService;
