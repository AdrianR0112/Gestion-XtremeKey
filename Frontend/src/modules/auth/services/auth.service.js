import { api } from "../../../services/api";
import endpoints from "../../../services/endpoints";

const authEndpoints = endpoints.auth;

export const authService = {
	login: (payload, options) => api.post(authEndpoints.login, payload, options),
	register: (payload, options) => api.post(authEndpoints.register, payload, options),
	me: (options) => api.get(authEndpoints.me, options),
	changePassword: (payload, options) => api.post(authEndpoints.changePassword, payload, options),
	logout: (options) => api.post(authEndpoints.logout, {}, options),
};

export default authService;
