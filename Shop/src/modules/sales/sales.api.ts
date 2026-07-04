import { apiRequest } from "@/lib/api";
import type { ApiListEnvelope } from "@/lib/api-types";
import type { Venta } from "@/modules/sales/sales.types";

const BASE = "/ventas";

export const salesApi = {
  listMine() {
    return apiRequest<ApiListEnvelope<Venta>>(`${BASE}/mis`).then((r) => r.data);
  },
};
