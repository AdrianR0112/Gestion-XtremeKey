import type { Product } from "@/types/product";

export type CartProductPayload = Pick<Product, "id" | "slug" | "name" | "price">;
