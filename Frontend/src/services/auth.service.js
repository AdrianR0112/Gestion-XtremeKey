import { api } from "./api";
import endpoints from "./endpoints";

export const authService = {
  login: (payload, options) => api.post(endpoints.auth.login, payload, options),
  me: (options) => api.get(endpoints.auth.me, options),
  logout: (options) => api.post(endpoints.auth.logout, {}, options),
};

export default authService;
