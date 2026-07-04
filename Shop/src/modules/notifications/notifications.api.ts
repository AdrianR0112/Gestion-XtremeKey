import { apiRequest } from "@/lib/api";
import { buildQuery, type ApiEnvelope, type ApiListEnvelope, type ListQuery } from "@/lib/api-types";
import type {
  Notificacion,
  NotificacionInput,
  NotificacionUpdate,
} from "@/modules/notifications/notifications.types";

const BASE = "/notificaciones";

export const notificationsApi = {
  list(query?: ListQuery) {
    return apiRequest<ApiListEnvelope<Notificacion>>(`${BASE}${buildQuery(query)}`).then((r) => r.data);
  },
  getById(id: string) {
    return apiRequest<ApiEnvelope<Notificacion>>(`${BASE}/${id}`).then((r) => r.data);
  },
  create(input: NotificacionInput) {
    return apiRequest<ApiEnvelope<Notificacion>>(BASE, { method: "POST", body: input }).then((r) => r.data);
  },
  update(id: string, input: NotificacionUpdate) {
    return apiRequest<ApiEnvelope<Notificacion>>(`${BASE}/${id}`, { method: "PUT", body: input }).then(
      (r) => r.data,
    );
  },
  remove(id: string) {
    return apiRequest<ApiEnvelope<{ id: string }>>(`${BASE}/${id}`, { method: "DELETE" }).then((r) => r.data);
  },
};
