"use client";

import { useCallback } from "react";

import { useAsyncResource } from "@/hooks/useAsyncResource";
import { productosApi } from "@/modules/products/products.backend.api";
import type { ProductoInput, ProductoUpdate } from "@/modules/products/products.backend.types";
import type { ListQuery } from "@/lib/api-types";

export function useProductos(query?: ListQuery) {
  const resource = useAsyncResource(() => productosApi.list(query), [JSON.stringify(query)]);

  const create = useCallback(
    async (input: ProductoInput) => {
      const created = await productosApi.create(input);
      await resource.refresh();
      return created;
    },
    [resource],
  );

  const update = useCallback(
    async (id: string, input: ProductoUpdate) => {
      const updated = await productosApi.update(id, input);
      await resource.refresh();
      return updated;
    },
    [resource],
  );

  const remove = useCallback(
    async (id: string) => {
      await productosApi.remove(id);
      await resource.refresh();
    },
    [resource],
  );

  return {
    productos: resource.data ?? [],
    loading: resource.loading,
    error: resource.error,
    refresh: resource.refresh,
    create,
    update,
    remove,
  };
}
