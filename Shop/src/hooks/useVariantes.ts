"use client";

import { useCallback } from "react";

import { useAsyncResource } from "@/hooks/useAsyncResource";
import { variantesApi } from "@/modules/variants/variants.api";
import type { VarianteInput, VarianteUpdate } from "@/modules/variants/variants.types";

export function useVariantes(productoId?: string) {
  const resource = useAsyncResource(
    () => (productoId ? variantesApi.listByProducto(productoId) : variantesApi.list()),
    [productoId],
  );

  const create = useCallback(
    async (input: VarianteInput) => {
      const created = await variantesApi.create(input);
      await resource.refresh();
      return created;
    },
    [resource],
  );

  const update = useCallback(
    async (id: string, input: VarianteUpdate) => {
      const updated = await variantesApi.update(id, input);
      await resource.refresh();
      return updated;
    },
    [resource],
  );

  const remove = useCallback(
    async (id: string) => {
      await variantesApi.remove(id);
      await resource.refresh();
    },
    [resource],
  );

  return {
    variantes: resource.data ?? [],
    loading: resource.loading,
    error: resource.error,
    refresh: resource.refresh,
    create,
    update,
    remove,
  };
}
