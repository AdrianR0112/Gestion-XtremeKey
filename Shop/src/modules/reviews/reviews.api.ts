import { apiRequest } from "@/lib/api";
import { buildQuery, type ApiEnvelope, type ApiListEnvelope, type ListQuery } from "@/lib/api-types";
import type { Resenia, ReseniaInput, ReseniaUpdate } from "@/modules/reviews/reviews.types";

const BASE = "/resenias";

export const reviewsApi = {
  list(query?: ListQuery) {
    return apiRequest<ApiListEnvelope<Resenia>>(`${BASE}${buildQuery(query)}`).then((r) => r.data);
  },
  getById(id: string) {
    return apiRequest<ApiEnvelope<Resenia>>(`${BASE}/${id}`).then((r) => r.data);
  },
  create(input: ReseniaInput) {
    return apiRequest<ApiEnvelope<Resenia>>(BASE, { method: "POST", body: input }).then((r) => r.data);
  },
  update(id: string, input: ReseniaUpdate) {
    return apiRequest<ApiEnvelope<Resenia>>(`${BASE}/${id}`, { method: "PUT", body: input }).then((r) => r.data);
  },
  remove(id: string) {
    return apiRequest<ApiEnvelope<{ id: string }>>(`${BASE}/${id}`, { method: "DELETE" }).then((r) => r.data);
  },
};
