import { apiRequest } from "@/lib/api";
import { buildQuery, type ApiEnvelope, type ApiListEnvelope, type ListQuery } from "@/lib/api-types";
import type { Producto, ProductoInput, ProductoUpdate } from "@/modules/products/products.backend.types";

const BASE = "/productos";

export const productosApi = {
  list(query?: ListQuery) {
    return apiRequest<ApiListEnvelope<Producto>>(`${BASE}${buildQuery(query)}`).then((r) => r.data);
  },
  getById(id: string) {
    return apiRequest<ApiEnvelope<Producto>>(`${BASE}/${id}`).then((r) => r.data);
  },
  create(input: ProductoInput) {
    return apiRequest<ApiEnvelope<Producto>>(BASE, { method: "POST", body: input }).then((r) => r.data);
  },
  update(id: string, input: ProductoUpdate) {
    return apiRequest<ApiEnvelope<Producto>>(`${BASE}/${id}`, { method: "PUT", body: input }).then((r) => r.data);
  },
  remove(id: string) {
    return apiRequest<ApiEnvelope<{ id: string }>>(`${BASE}/${id}`, { method: "DELETE" }).then((r) => r.data);
  },
};
