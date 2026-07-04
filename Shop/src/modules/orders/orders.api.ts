import { apiRequest } from "@/lib/api";
import { buildQuery, type ApiEnvelope, type ApiListEnvelope, type ListQuery } from "@/lib/api-types";
import type {
  Orden,
  OrdenInput,
  OrdenUpdate,
  OrdenItem,
  OrdenItemInput,
  OrdenItemUpdate,
} from "@/modules/orders/orders.types";

const BASE = "/ordenes";

export const ordersApi = {
  list(query?: ListQuery) {
    return apiRequest<ApiListEnvelope<Orden>>(`${BASE}${buildQuery(query)}`).then((r) => r.data);
  },
  listMine() {
    return apiRequest<ApiListEnvelope<Orden>>(`${BASE}/mis`).then((r) => r.data);
  },
  getMine(id: string) {
    return apiRequest<ApiEnvelope<Orden>>(`${BASE}/mis/${id}`).then((r) => r.data);
  },
  createMine(input: OrdenInput) {
    return apiRequest<ApiEnvelope<Orden>>(`${BASE}/mis`, { method: "POST", body: input }).then((r) => r.data);
  },
  getById(id: string) {
    return apiRequest<ApiEnvelope<Orden>>(`${BASE}/${id}`).then((r) => r.data);
  },
  create(input: OrdenInput) {
    return apiRequest<ApiEnvelope<Orden>>(BASE, { method: "POST", body: input }).then((r) => r.data);
  },
  update(id: string, input: OrdenUpdate) {
    return apiRequest<ApiEnvelope<Orden>>(`${BASE}/${id}`, { method: "PUT", body: input }).then((r) => r.data);
  },
  remove(id: string) {
    return apiRequest<ApiEnvelope<{ id: string }>>(`${BASE}/${id}`, { method: "DELETE" }).then((r) => r.data);
  },

  listItems(ordenId: string) {
    return apiRequest<ApiListEnvelope<OrdenItem>>(`${BASE}/${ordenId}/items`).then((r) => r.data);
  },
  addItem(ordenId: string, input: OrdenItemInput) {
    return apiRequest<ApiEnvelope<OrdenItem>>(`${BASE}/${ordenId}/items`, {
      method: "POST",
      body: input,
    }).then((r) => r.data);
  },
  getItem(itemId: string) {
    return apiRequest<ApiEnvelope<OrdenItem>>(`${BASE}/items/${itemId}`).then((r) => r.data);
  },
  updateItem(itemId: string, input: OrdenItemUpdate) {
    return apiRequest<ApiEnvelope<OrdenItem>>(`${BASE}/items/${itemId}`, {
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
