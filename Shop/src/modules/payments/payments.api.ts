import { apiRequest } from "@/lib/api";
import { buildQuery, type ApiEnvelope, type ApiListEnvelope, type ListQuery } from "@/lib/api-types";
import type { Pago, PagoInput, PagoUpdate } from "@/modules/payments/payments.types";

const BASE = "/pagos";

export const paymentsApi = {
  list(query?: ListQuery) {
    return apiRequest<ApiListEnvelope<Pago>>(`${BASE}${buildQuery(query)}`).then((r) => r.data);
  },
  listMine() {
    return apiRequest<ApiListEnvelope<Pago>>(`${BASE}/mis`).then((r) => r.data);
  },
  createMine(input: PagoInput) {
    return apiRequest<ApiEnvelope<Pago>>(`${BASE}/mis`, { method: "POST", body: input }).then((r) => r.data);
  },
  getById(id: string) {
    return apiRequest<ApiEnvelope<Pago>>(`${BASE}/${id}`).then((r) => r.data);
  },
  create(input: PagoInput) {
    return apiRequest<ApiEnvelope<Pago>>(BASE, { method: "POST", body: input }).then((r) => r.data);
  },
  update(id: string, input: PagoUpdate) {
    return apiRequest<ApiEnvelope<Pago>>(`${BASE}/${id}`, { method: "PUT", body: input }).then((r) => r.data);
  },
  remove(id: string) {
    return apiRequest<ApiEnvelope<{ id: string }>>(`${BASE}/${id}`, { method: "DELETE" }).then((r) => r.data);
  },
};
