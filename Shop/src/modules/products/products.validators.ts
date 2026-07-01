import { PRODUCT_CATEGORIES } from "@/lib/constants";

export function isValidCategorySlug(category?: string) {
  if (!category) {
    return true;
  }

  return PRODUCT_CATEGORIES.some((item) => item.slug === category);
}
