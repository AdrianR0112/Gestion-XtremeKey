import { apiRequest } from "@/lib/api";
import type { ApiListEnvelope } from "@/lib/api-types";
import type { Suscripcion } from "@/modules/subscriptions/subscriptions.types";

const BASE = "/suscripciones";

export const subscriptionsApi = {
  listMine() {
    return apiRequest<ApiListEnvelope<Suscripcion>>(`${BASE}/mis`).then((r) => r.data);
  },
};
