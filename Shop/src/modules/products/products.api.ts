import { PRODUCT_CATEGORIES, PRODUCTS } from "@/lib/constants";
import type { Product } from "@/types/product";

function filterProducts(category?: string, query?: string) {
  return PRODUCTS.filter((product) => {
    const categoryMatch = !category || product.categorySlug === category;
    const queryMatch =
      !query ||
      `${product.name} ${product.shortDescription}`
        .toLowerCase()
        .includes(query.toLowerCase());

    return categoryMatch && queryMatch;
  });
}

export const productsApi = {
  list(category?: string, query?: string) {
    return filterProducts(category, query);
  },
  listFeatured() {
    return PRODUCTS.filter((product) => product.featured);
  },
  listCategories() {
    return PRODUCT_CATEGORIES;
  },
  getBySlug(slug: string): Product | undefined {
    return PRODUCTS.find((product) => product.slug === slug);
  },
};
