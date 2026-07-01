"use client";

import { productsApi } from "@/modules/products/products.api";

type UseProductsOptions = {
  category?: string;
  query?: string;
};

export function useProducts(options: UseProductsOptions = {}) {
  const products = productsApi.list(options.category, options.query);
  const categories = productsApi.listCategories();

  return { products, categories };
}
