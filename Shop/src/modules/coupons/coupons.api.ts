import { apiRequest } from "@/lib/api";
import { buildQuery, type ApiEnvelope, type ApiListEnvelope, type ListQuery } from "@/lib/api-types";
import type {
  Cupon,
  CuponInput,
  CuponUpdate,
  CuponUso,
  CuponUsoInput,
  CuponUsoUpdate,
  CuponProducto,
  CuponProductoInput,
} from "@/modules/coupons/coupons.types";

const BASE = "/cupones";

export const couponsApi = {
  list(query?: ListQuery) {
    return apiRequest<ApiListEnvelope<Cupon>>(`${BASE}${buildQuery(query)}`).then((r) => r.data);
  },
  getById(id: string) {
    return apiRequest<ApiEnvelope<Cupon>>(`${BASE}/${id}`).then((r) => r.data);
  },
  create(input: CuponInput) {
    return apiRequest<ApiEnvelope<Cupon>>(BASE, { method: "POST", body: input }).then((r) => r.data);
  },
  update(id: string, input: CuponUpdate) {
    return apiRequest<ApiEnvelope<Cupon>>(`${BASE}/${id}`, { method: "PUT", body: input }).then((r) => r.data);
  },
  remove(id: string) {
    return apiRequest<ApiEnvelope<{ id: string }>>(`${BASE}/${id}`, { method: "DELETE" }).then((r) => r.data);
  },

  listUsos(query?: ListQuery) {
    return apiRequest<ApiListEnvelope<CuponUso>>(`${BASE}/usos${buildQuery(query)}`).then((r) => r.data);
  },
  getUso(usoId: string) {
    return apiRequest<ApiEnvelope<CuponUso>>(`${BASE}/usos/${usoId}`).then((r) => r.data);
  },
  createUso(input: CuponUsoInput) {
    return apiRequest<ApiEnvelope<CuponUso>>(`${BASE}/usos`, { method: "POST", body: input }).then((r) => r.data);
  },
  updateUso(usoId: string, input: CuponUsoUpdate) {
    return apiRequest<ApiEnvelope<CuponUso>>(`${BASE}/usos/${usoId}`, { method: "PUT", body: input }).then(
      (r) => r.data,
    );
  },
  removeUso(usoId: string) {
    return apiRequest<ApiEnvelope<{ id: string }>>(`${BASE}/usos/${usoId}`, { method: "DELETE" }).then(
      (r) => r.data,
    );
  },

  listProductos(cuponId: string) {
    return apiRequest<ApiListEnvelope<CuponProducto>>(`${BASE}/${cuponId}/productos`).then((r) => r.data);
  },
  addProducto(cuponId: string, input: CuponProductoInput) {
    return apiRequest<ApiEnvelope<CuponProducto>>(`${BASE}/${cuponId}/productos`, {
      method: "POST",
      body: input,
    }).then((r) => r.data);
  },
  removeProducto(cuponId: string, productoId: string) {
    return apiRequest<ApiEnvelope<{ id: string }>>(`${BASE}/${cuponId}/productos/${productoId}`, {
      method: "DELETE",
    }).then((r) => r.data);
  },
};
