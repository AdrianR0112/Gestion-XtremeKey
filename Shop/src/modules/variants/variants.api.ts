import { apiRequest } from "@/lib/api";
import { buildQuery, type ApiEnvelope, type ApiListEnvelope, type ListQuery } from "@/lib/api-types";
import type { Variante, VarianteInput, VarianteUpdate } from "@/modules/variants/variants.types";

const BASE = "/variantes";

export const variantesApi = {
  list(query?: ListQuery) {
    return apiRequest<ApiListEnvelope<Variante>>(`${BASE}${buildQuery(query)}`).then((r) => r.data);
  },
  listByProducto(productoId: string) {
    return apiRequest<ApiListEnvelope<Variante>>(`${BASE}${buildQuery({ Id_Prd: productoId })}`).then(
      (r) => r.data,
    );
  },
  getById(id: string) {
    return apiRequest<ApiEnvelope<Variante>>(`${BASE}/${id}`).then((r) => r.data);
  },
  create(input: VarianteInput) {
    return apiRequest<ApiEnvelope<Variante>>(BASE, { method: "POST", body: input }).then((r) => r.data);
  },
  update(id: string, input: VarianteUpdate) {
    return apiRequest<ApiEnvelope<Variante>>(`${BASE}/${id}`, { method: "PUT", body: input }).then((r) => r.data);
  },
  remove(id: string) {
    return apiRequest<ApiEnvelope<{ id: string }>>(`${BASE}/${id}`, { method: "DELETE" }).then((r) => r.data);
  },
};
