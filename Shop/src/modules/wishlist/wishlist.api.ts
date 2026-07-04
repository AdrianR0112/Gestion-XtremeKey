import { apiRequest } from "@/lib/api";
import type { ApiEnvelope, ApiListEnvelope } from "@/lib/api-types";
import type { WishlistItem, WishlistInput } from "@/modules/wishlist/wishlist.types";

const BASE = "/lista-deseos";

export const wishlistApi = {
  listMine() {
    return apiRequest<ApiListEnvelope<WishlistItem>>(`${BASE}/mis`).then((r) => r.data);
  },
  addMine(input: WishlistInput) {
    return apiRequest<ApiEnvelope<WishlistItem>>(`${BASE}/mis`, { method: "POST", body: input }).then((r) => r.data);
  },
  removeMineByProducto(idPrd: number) {
    return apiRequest<ApiEnvelope<null>>(`${BASE}/mis/producto/${idPrd}`, { method: "DELETE" }).then((r) => r.data);
  },
  removeById(id: number) {
    return apiRequest<ApiEnvelope<null>>(`${BASE}/${id}`, { method: "DELETE" }).then((r) => r.data);
  },
};
