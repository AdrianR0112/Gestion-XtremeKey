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

function buildQueryString(params = {}) {
	const query = new URLSearchParams();

	if (params.periodo) query.set("periodo", params.periodo);
	if (params.ancla != null) query.set("ancla", String(params.ancla));

	const queryString = query.toString();
	return queryString ? `?${queryString}` : "";
}

export const dashboardService = {
	getResumen: async (params = {}, options) => {
		const path = `${basePath}${buildQueryString(params)}`;
		return extractPayload(await api.get(path, options));
	},
};

export default dashboardService;
