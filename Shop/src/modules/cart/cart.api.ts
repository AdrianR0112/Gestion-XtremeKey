import { apiRequest } from "@/lib/api";
import { buildQuery, type ApiEnvelope, type ApiListEnvelope, type ListQuery } from "@/lib/api-types";
import type {
  Carrito,
  CarritoInput,
  CarritoUpdate,
  CarritoItem,
  CarritoItemInput,
  CarritoItemUpdate,
} from "@/modules/cart/cart.types";

const BASE = "/carrito";

export const cartApi = {
  list(query?: ListQuery) {
    return apiRequest<ApiListEnvelope<Carrito>>(`${BASE}${buildQuery(query)}`).then((r) => r.data);
  },
  getById(id: string) {
    return apiRequest<ApiEnvelope<Carrito>>(`${BASE}/${id}`).then((r) => r.data);
  },
  create(input: CarritoInput) {
    return apiRequest<ApiEnvelope<Carrito>>(BASE, { method: "POST", body: input }).then((r) => r.data);
  },
  update(id: string, input: CarritoUpdate) {
    return apiRequest<ApiEnvelope<Carrito>>(`${BASE}/${id}`, { method: "PUT", body: input }).then((r) => r.data);
  },
  remove(id: string) {
    return apiRequest<ApiEnvelope<{ id: string }>>(`${BASE}/${id}`, { method: "DELETE" }).then((r) => r.data);
  },

  listItems(carritoId: string) {
    return apiRequest<ApiListEnvelope<CarritoItem>>(`${BASE}/${carritoId}/items`).then((r) => r.data);
  },
  addItem(carritoId: string, input: CarritoItemInput) {
    return apiRequest<ApiEnvelope<CarritoItem>>(`${BASE}/${carritoId}/items`, {
      method: "POST",
      body: input,
    }).then((r) => r.data);
  },
  getItem(itemId: string) {
    return apiRequest<ApiEnvelope<CarritoItem>>(`${BASE}/items/${itemId}`).then((r) => r.data);
  },
  updateItem(itemId: string, input: CarritoItemUpdate) {
    return apiRequest<ApiEnvelope<CarritoItem>>(`${BASE}/items/${itemId}`, {
      method: "PUT",
      body: input,
    }).then((r) => r.data);
  },
  removeItem(itemId: string) {
    return apiRequest<ApiEnvelope<{ id: string }>>(`${BASE}/items/${itemId}`, {
      method: "DELETE",
    }).then((r) => r.data);
  },
};
